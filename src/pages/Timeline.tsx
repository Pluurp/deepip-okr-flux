
import { useState } from "react";
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
  const { cycle } = useOKR();
  const [selectedKeyResults, setSelectedKeyResults] = useState<KeyResult[]>([]);
  const [view, setView] = useState<"day" | "week" | "month" | "quarter">("week");
  const [zoomLevel, setZoomLevel] = useState(1);

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
              <CardContent className="p-0">
                <TimelineView 
                  view={view}
                  zoomLevel={zoomLevel}
                  selectedKeyResults={selectedKeyResults}
                  onRemoveKeyResult={handleRemoveKeyResult}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timeline;
