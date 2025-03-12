import { useEffect, useState, useRef } from "react";
import { KeyResult } from "@/types";
import { useOKR } from "@/context/OKRContext";
import { departments } from "@/data/departments";
import { ArrowLeft, ArrowRight, Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface TimelineViewProps {
  view: "day" | "week" | "month" | "quarter";
  zoomLevel: number;
  selectedKeyResults: KeyResult[];
  onRemoveKeyResult: (keyResultId: string) => void;
}

interface TimelineItem {
  keyResultId: string;
  startDate: Date;
  endDate: Date;
}

interface TimelineData {
  items: TimelineItem[];
}

const DAYS_IN_VIEW = {
  day: 1,
  week: 7,
  month: 31,
  quarter: 91,
};

const TimelineView = ({ 
  view, 
  zoomLevel, 
  selectedKeyResults,
  onRemoveKeyResult 
}: TimelineViewProps) => {
  const { getCurrentDate, globalStartDate, globalEndDate, cycle, objectives } = useOKR();
  const [timelineData, setTimelineData] = useState<TimelineData>({ items: [] });
  const [draggedItem, setDraggedItem] = useState<KeyResult | null>(null);
  const [resizingItem, setResizingItem] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<"start" | "end" | null>(null);
  const [resizeOrigin, setResizeOrigin] = useState<{ x: number, date: Date } | null>(null);
  const [viewStartDate, setViewStartDate] = useState<Date>(getCurrentDate());
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dropDate, setDropDate] = useState<Date | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('timeline_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const items = parsed.items.map((item: any) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate)
        }));
        setTimelineData({ items });
        
        items.forEach((item: TimelineItem) => {
          const keyResult = selectedKeyResults.find(kr => kr.id === item.keyResultId);
          if (!keyResult) {
            const allDepartments = ['leadership', 'product', 'ai', 'sales', 'growth'];
            let foundKeyResult: KeyResult | undefined;
            
            for (const deptId of allDepartments) {
              for (const objective of objectives[deptId] || []) {
                const kr = objective.keyResults.find(kr => kr.id === item.keyResultId);
                if (kr) {
                  foundKeyResult = kr;
                  break;
                }
              }
              if (foundKeyResult) break;
            }
            
            if (foundKeyResult) {
              onRemoveKeyResult(item.keyResultId);
              selectedKeyResults.push(foundKeyResult);
            }
          }
        });
      } catch (e) {
        console.error('Failed to parse timeline data:', e);
        setTimelineData({ items: [] });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timeline_data', JSON.stringify(timelineData));
  }, [timelineData]);

  const navigateBackward = () => {
    const newDate = new Date(viewStartDate);
    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "quarter":
        newDate.setMonth(newDate.getMonth() - 3);
        break;
    }
    setViewStartDate(newDate);
  };

  const navigateForward = () => {
    const newDate = new Date(viewStartDate);
    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "quarter":
        newDate.setMonth(newDate.getMonth() + 3);
        break;
    }
    setViewStartDate(newDate);
  };

  const getDatesForView = () => {
    const dates: Date[] = [];
    const start = new Date(viewStartDate);
    const daysToShow = DAYS_IN_VIEW[view];
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const formatDate = (date: Date) => {
    switch (view) {
      case "day":
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        });
      case "week":
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          day: 'numeric' 
        });
      case "month":
        return date.toLocaleDateString('en-US', { 
          day: 'numeric' 
        });
      case "quarter":
        return date.getDate() % 7 === 1 || date.getDate() === 1 
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
          : '';
    }
  };

  const getDayWidth = () => {
    const baseWidth = {
      day: 200,
      week: 120,
      month: 40,
      quarter: 15,
    };
    
    return baseWidth[view] * zoomLevel;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, keyResult: KeyResult) => {
    setDraggedItem(keyResult);
    e.dataTransfer.setData("text/plain", keyResult.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
    
    if (timelineRef.current && draggedItem) {
      const rect = timelineRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const dayWidth = getDayWidth();
      const dayIndex = Math.floor(relativeX / dayWidth);
      
      const dates = getDatesForView();
      if (dayIndex >= 0 && dayIndex < dates.length) {
        setDropDate(dates[dayIndex]);
      }
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
    setDropDate(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!draggedItem || !dropDate) return;
    
    const alreadyExists = timelineData.items.some(item => item.keyResultId === draggedItem.id);
    
    if (alreadyExists) {
      toast({
        title: "Already scheduled",
        description: "This key result is already on the timeline. You can move or resize it.",
        variant: "destructive",
      });
      setDraggedItem(null);
      setDropDate(null);
      return;
    }
    
    const endDate = new Date(dropDate);
    
    switch (view) {
      case "day":
        endDate.setDate(endDate.getDate() + 1);
        break;
      case "week":
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "month":
      case "quarter":
        endDate.setDate(endDate.getDate() + 14);
        break;
    }
    
    setTimelineData(prev => ({
      items: [
        ...prev.items,
        {
          keyResultId: draggedItem.id,
          startDate: new Date(dropDate),
          endDate: endDate
        }
      ]
    }));
    
    toast({
      title: "Added to timeline",
      description: `"${draggedItem.title}" has been added to the timeline.",
    });
    
    setDraggedItem(null);
    setDropDate(null);
  };

  const handleResizeStart = (
    e: React.MouseEvent, 
    itemId: string, 
    direction: "start" | "end"
  ) => {
    e.stopPropagation();
    setResizingItem(itemId);
    setResizeDirection(direction);
    
    const item = timelineData.items.find(item => item.keyResultId === itemId);
    if (!item || !timelineRef.current) return;
    
    setResizeOrigin({
      x: e.clientX,
      date: direction === "start" ? new Date(item.startDate) : new Date(item.endDate)
    });
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingItem || !resizeOrigin || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const deltaX = e.clientX - resizeOrigin.x;
    const dayWidth = getDayWidth();
    const daysDelta = Math.round(deltaX / dayWidth);
    
    setTimelineData(prev => {
      const items = prev.items.map(item => {
        if (item.keyResultId !== resizingItem) return item;
        
        const newItem = { ...item };
        
        if (resizeDirection === "start") {
          const newDate = new Date(resizeOrigin.date);
          newDate.setDate(newDate.getDate() + daysDelta);
          
          if (newDate < item.endDate) {
            newItem.startDate = newDate;
          }
        } else {
          const newDate = new Date(resizeOrigin.date);
          newDate.setDate(newDate.getDate() + daysDelta);
          
          if (newDate > item.startDate) {
            newItem.endDate = newDate;
          }
        }
        
        return newItem;
      });
      
      return { items };
    });
  };

  const handleResizeEnd = () => {
    setResizingItem(null);
    setResizeDirection(null);
    setResizeOrigin(null);
    
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    toast({
      title: "Timeline updated",
      description: "The key result has been rescheduled.",
    });
  };

  const handleTimelineItemDragStart = (
    e: React.DragEvent<HTMLDivElement>, 
    itemId: string
  ) => {
    e.stopPropagation();
    
    const item = timelineData.items.find(item => item.keyResultId === itemId);
    if (!item) return;
    
    const keyResult = selectedKeyResults.find(kr => kr.id === itemId);
    if (keyResult) {
      setDraggedItem(keyResult);
      e.dataTransfer.setData("timelineItem", itemId);
      
      const dragImg = document.createElement('div');
      dragImg.textContent = keyResult.title;
      dragImg.style.backgroundColor = getDepartmentColor(keyResult.objectiveId);
      dragImg.style.padding = '10px';
      dragImg.style.borderRadius = '4px';
      dragImg.style.opacity = '0.8';
      document.body.appendChild(dragImg);
      e.dataTransfer.setDragImage(dragImg, 10, 10);
      setTimeout(() => document.body.removeChild(dragImg), 0);
    }
  };

  const handleTimelineItemDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!dropDate) return;
    
    const timelineItemId = e.dataTransfer.getData("timelineItem");
    if (!timelineItemId) {
      handleDrop(e);
      return;
    }
    
    setTimelineData(prev => {
      const items = prev.items.map(item => {
        if (item.keyResultId !== timelineItemId) return item;
        
        const durationMs = item.endDate.getTime() - item.startDate.getTime();
        
        const newStartDate = new Date(dropDate);
        
        const newEndDate = new Date(newStartDate.getTime() + durationMs);
        
        return {
          ...item,
          startDate: newStartDate,
          endDate: newEndDate
        };
      });
      
      return { items };
    });
    
    toast({
      title: "Item moved",
      description: "The key result has been moved to a new date.",
    });
    
    setDraggedItem(null);
    setDropDate(null);
  };

  const handleRemoveFromTimeline = (itemId: string) => {
    setTimelineData(prev => ({
      items: prev.items.filter(item => item.keyResultId !== itemId)
    }));
    
    onRemoveKeyResult(itemId);
    
    toast({
      title: "Removed from timeline",
      description: "The key result has been removed from the timeline.",
    });
  };

  const getDepartmentColor = (objectiveId: string): string => {
    const relevantKeyResult = selectedKeyResults.find(kr => kr.id === objectiveId || kr.objectiveId === objectiveId);
    if (!relevantKeyResult) return "#9b87f5";
    
    const objective = selectedKeyResults
      .find(kr => kr.id === relevantKeyResult.objectiveId || kr.id === objectiveId);
    
    if (!objective) return "#9b87f5";
    
    const department = departments
      .find(dept => objectives[dept.id]?.some(obj => obj.id === (objective.objectiveId || objective.id)));
    
    return department?.color || "#9b87f5";
  };

  const getKeyResultById = (id: string): KeyResult | undefined => {
    return selectedKeyResults.find(kr => kr.id === id);
  };

  const getItemLeftPosition = (startDate: Date): string => {
    const dates = getDatesForView();
    const dayIndex = dates.findIndex(date => 
      date.getDate() === startDate.getDate() && 
      date.getMonth() === startDate.getMonth() && 
      date.getFullYear() === startDate.getFullYear()
    );
    
    if (dayIndex === -1) {
      if (startDate < dates[0]) return "0px";
      return "100%";
    }
    
    return dayIndex * getDayWidth() + "px";
  };

  const getItemWidth = (startDate: Date, endDate: Date): string => {
    const dates = getDatesForView();
    if (dates.length === 0) return "0px";
    
    let startIndex = dates.findIndex(date => 
      date.getDate() === startDate.getDate() && 
      date.getMonth() === startDate.getMonth() && 
      date.getFullYear() === startDate.getFullYear()
    );
    
    if (startIndex === -1) {
      if (startDate < dates[0]) {
        startIndex = 0;
      } else {
        return "0px";
      }
    }
    
    let endIndex = dates.findIndex(date => 
      date.getDate() === endDate.getDate() && 
      date.getMonth() === endDate.getMonth() && 
      date.getFullYear() === endDate.getFullYear()
    );
    
    if (endIndex === -1) {
      if (endDate > dates[dates.length - 1]) {
        endIndex = dates.length - 1;
      } else if (endDate < dates[0]) {
        return "0px";
      }
    }
    
    const daysVisible = endIndex - startIndex + 1;
    return daysVisible * getDayWidth() + "px";
  };

  const isItemVisible = (startDate: Date, endDate: Date): boolean => {
    const dates = getDatesForView();
    if (dates.length === 0) return false;
    
    const viewStart = dates[0];
    const viewEnd = dates[dates.length - 1];
    
    return startDate <= viewEnd && endDate >= viewStart;
  };

  const dates = getDatesForView();
  const dayWidth = getDayWidth();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={navigateBackward}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous {view}
        </Button>
        <div className="text-sm text-gray-500">
          {viewStartDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {view === 'quarter' && ` - ${cycle}`}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={navigateForward}
        >
          Next {view}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="flex border-b border-gray-200 pb-2 pl-4">
        {dates.map((date, index) => (
          <div
            key={date.toISOString()}
            className={cn(
              "flex-shrink-0 text-xs text-center font-medium",
              date.getDay() === 0 || date.getDay() === 6 ? "text-gray-400" : "text-gray-600"
            )}
            style={{ width: dayWidth + "px" }}
          >
            {formatDate(date)}
          </div>
        ))}
      </div>
      
      <ScrollArea className="h-[400px]">
        <div 
          ref={timelineRef}
          className={cn(
            "relative min-h-[200px] border-b border-gray-200",
            isDraggingOver && "bg-accent/30"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleTimelineItemDrop}
          style={{ width: dates.length * dayWidth + "px" }}
        >
          {dates.map((date, index) => (
            <div
              key={date.toISOString()}
              className={cn(
                "absolute top-0 bottom-0 border-r border-gray-100",
                date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-50" : ""
              )}
              style={{ 
                left: index * dayWidth + "px",
                width: dayWidth + "px"
              }}
            />
          ))}
          
          {isDraggingOver && dropDate && (
            <div 
              className="absolute top-0 bottom-0 bg-primary/20 border-l-2 border-r-2 border-primary"
              style={{ 
                left: getItemLeftPosition(dropDate),
                width: dayWidth + "px"
              }}
            />
          )}
          
          {timelineData.items.map(item => {
            const keyResult = getKeyResultById(item.keyResultId);
            if (!keyResult || !isItemVisible(item.startDate, item.endDate)) return null;
            
            return (
              <div
                key={item.keyResultId}
                className={cn(
                  "absolute rounded-md px-2 py-1 cursor-move text-white text-xs",
                  "shadow-sm hover:shadow-md transition-shadow select-none",
                  resizingItem === item.keyResultId && "shadow-lg"
                )}
                style={{ 
                  left: getItemLeftPosition(item.startDate),
                  width: getItemWidth(item.startDate, item.endDate),
                  top: Math.random() * 60 + 10 + "px",
                  backgroundColor: getDepartmentColor(keyResult.objectiveId),
                  opacity: resizingItem === item.keyResultId ? 0.8 : 0.9
                }}
                draggable
                onDragStart={(e) => handleTimelineItemDragStart(e, item.keyResultId)}
              >
                <div className="flex items-center justify-between">
                  <Grip className="h-3 w-3 mr-1 cursor-move" />
                  <div className="flex-1 truncate">{keyResult.title}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-white hover:bg-white/20 ml-1"
                    onClick={() => handleRemoveFromTimeline(item.keyResultId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div 
                  className="absolute top-0 bottom-0 left-0 w-2 cursor-w-resize"
                  onMouseDown={(e) => handleResizeStart(e, item.keyResultId, "start")}
                />
                <div 
                  className="absolute top-0 bottom-0 right-0 w-2 cursor-e-resize"
                  onMouseDown={(e) => handleResizeStart(e, item.keyResultId, "end")}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineView;
