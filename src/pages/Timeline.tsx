
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useOKR } from "@/context/OKRContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyResult } from "@/types";
import KeyResultLibrary from "@/components/timeline/KeyResultLibrary";
import TimelineView from "@/components/timeline/TimelineView";
import { 
  ZoomIn, 
  ZoomOut,
  Calendar,
  ArrowLeft,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Timeline = () => {
  const { cycle, objectives } = useOKR();
  const [selectedKeyResults, setSelectedKeyResults] = useState<KeyResult[]>([]);
  const [view, setView] = useState<"day" | "week" | "month" | "quarter">("week");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load any existing key results on mount
  useEffect(() => {
    // First set visible to true to ensure the timeline container is rendered
    setIsTimelineVisible(true);
    
    const savedData = localStorage.getItem('timeline_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Find and add key results that are on the timeline
        if (parsed.items && parsed.items.length > 0) {
          const allDepartments = ['leadership', 'product', 'ai', 'sales', 'growth'];
          const keyResultsToAdd: KeyResult[] = [];
          
          parsed.items.forEach((item: any) => {
            let found = false;
            
            // Check all departments for the key result
            for (const deptId of allDepartments) {
              if (found) break;
              
              for (const objective of objectives[deptId] || []) {
                const kr = objective.keyResults.find(kr => kr.id === item.keyResultId);
                if (kr) {
                  keyResultsToAdd.push(kr);
                  found = true;
                  break;
                }
              }
            }
          });
          
          if (keyResultsToAdd.length > 0) {
            setSelectedKeyResults(keyResultsToAdd);
          }
        }
      } catch (e) {
        console.error('Failed to parse timeline data:', e);
      }
    }
    
    // Set loading to false after a small delay to ensure rendering is complete
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [objectives]);

  const handleKeyResultSelect = (keyResult: KeyResult) => {
    // Check if key result is already selected
    if (selectedKeyResults.some(kr => kr.id === keyResult.id)) {
      toast({
        title: "Already selected",
        description: "This key result is already in your selection.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedKeyResults(prev => [...prev, keyResult]);
  };

  const handleRemoveKeyResult = (keyResultId: string) => {
    setSelectedKeyResults(prev => prev.filter(kr => kr.id !== keyResultId));
  };

  // Check if there are any objectives with key results
  const hasKeyResults = Object.values(objectives).some(
    (deptObjectives) => deptObjectives.some((obj) => obj.keyResults.length > 0)
  );

  return (
    <DashboardLayout>
      <div className="p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">OKR Timeline</h1>
            <p className="text-gray-500 mt-1">Schedule and manage key results across time</p>
          </div>
          
          <Card className="p-2 px-4 bg-white shadow-sm border">
            <span className="text-sm font-medium text-deepip-primary">{cycle} 2025</span>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Key Results Library */}
          <div className="col-span-12 md:col-span-3">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Key Results Library</CardTitle>
              </CardHeader>
              <CardContent>
                <KeyResultLibrary 
                  onKeyResultSelect={handleKeyResultSelect} 
                />
                {selectedKeyResults.length === 0 && (
                  <div className="text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-md">
                    <p>No key results selected yet.</p>
                    <p className="mt-2">Click on a key result from the list above to add it to your timeline.</p>
                  </div>
                )}
                {selectedKeyResults.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected Key Results:</h3>
                    <ul className="space-y-2">
                      {selectedKeyResults.map(kr => (
                        <li key={kr.id} className="text-xs bg-gray-50 p-2 rounded-md flex justify-between items-center">
                          <span className="truncate pr-2">{kr.title}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveKeyResult(kr.id)}
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline View */}
          <div className="col-span-12 md:col-span-9">
            <Card className="border shadow-sm h-full">
              <CardHeader className="border-b pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Timeline View</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                      title="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
                      title="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />
                    <Button
                      variant="outline"
                      size="sm"
                      className={view === "day" ? "bg-accent" : ""}
                      onClick={() => setView("day")}
                    >
                      Day
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={view === "week" ? "bg-accent" : ""}
                      onClick={() => setView("week")}
                    >
                      Week
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={view === "month" ? "bg-accent" : ""}
                      onClick={() => setView("month")}
                    >
                      Month
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={view === "quarter" ? "bg-accent" : ""}
                      onClick={() => setView("quarter")}
                    >
                      Quarter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-gray-500">Loading timeline...</p>
                  </div>
                ) : !hasKeyResults ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                    <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No key results available</h3>
                    <p className="text-gray-500 max-w-md">
                      You need to create key results in your department pages first.
                    </p>
                  </div>
                ) : !isTimelineVisible ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-gray-500">Initializing timeline view...</p>
                  </div>
                ) : selectedKeyResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                    <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No key results on timeline</h3>
                    <p className="text-gray-500 max-w-md">
                      Select key results from the library on the left, then drag and drop them onto the timeline to schedule them.
                    </p>
                  </div>
                ) : (
                  <TimelineView 
                    view={view}
                    zoomLevel={zoomLevel}
                    selectedKeyResults={selectedKeyResults}
                    onRemoveKeyResult={handleRemoveKeyResult}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timeline;
