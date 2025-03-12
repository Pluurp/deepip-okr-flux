
import { useEffect, useState } from "react";
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

const Timeline = () => {
  const { cycle, objectives, getCurrentDate } = useOKR();
  const [selectedKeyResults, setSelectedKeyResults] = useState<KeyResult[]>([]);
  const [view, setView] = useState<"day" | "week" | "month" | "quarter">("week");
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    document.title = "Timeline | DeepIP";
  }, []);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
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
          <div className="col-span-3">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Key Results Library</CardTitle>
              </CardHeader>
              <CardContent>
                <KeyResultLibrary 
                  onKeyResultSelect={(kr) => setSelectedKeyResults(prev => [...prev, kr])} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Timeline View */}
          <div className="col-span-9">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Timeline View</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-200 mx-2" />
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
              <CardContent>
                <TimelineView 
                  view={view}
                  zoomLevel={zoomLevel}
                  selectedKeyResults={selectedKeyResults}
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
