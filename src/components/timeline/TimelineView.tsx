
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
  const { getCurrentDate, globalStartDate, globalEndDate, cycle } = useOKR();
  const [timelineData, setTimelineData] = useState<TimelineData>({ items: [] });
  const [draggedItem, setDraggedItem] = useState<KeyResult | null>(null);
  const [resizingItem, setResizingItem] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<"start" | "end" | null>(null);
  const [resizeOrigin, setResizeOrigin] = useState<{ x: number, date: Date } | null>(null);
  const [viewStartDate, setViewStartDate] = useState<Date>(getCurrentDate());
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dropDate, setDropDate] = useState<Date | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Load saved timeline data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('timeline_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Convert string dates back to Date objects
        const items = parsed.items.map((item: any) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate)
        }));
        setTimelineData({ items });
      } catch (e) {
        console.error('Failed to parse timeline data:', e);
        setTimelineData({ items: [] });
      }
    }
  }, []);

  // Save timeline data whenever it changes
  useEffect(() => {
    localStorage.setItem('timeline_data', JSON.stringify(timelineData));
  }, [timelineData]);

  // Function to navigate timeline view backward
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

  // Function to navigate timeline view forward
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

  // Generate dates for the current view
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

  // Format date for display based on view
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
        // For quarter view, show only every 7th day
        return date.getDate() % 7 === 1 || date.getDate() === 1 
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
          : '';
    }
  };

  // Get the day width based on zoom level and view
  const getDayWidth = () => {
    const baseWidth = {
      day: 200,
      week: 120,
      month: 40,
      quarter: 15,
    };
    
    return baseWidth[view] * zoomLevel;
  };

  // Handle drag start event for key results
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, keyResult: KeyResult) => {
    setDraggedItem(keyResult);
    // Set some data for the drag operation
    e.dataTransfer.setData("text/plain", keyResult.id);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over event for the timeline
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
    
    if (timelineRef.current && draggedItem) {
      // Calculate which date the item is being dragged over
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

  // Handle drag leave event
  const handleDragLeave = () => {
    setIsDraggingOver(false);
    setDropDate(null);
  };

  // Handle drop event to place key result on timeline
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!draggedItem || !dropDate) return;
    
    // Check if key result is already on the timeline
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
    
    // Add the item to the timeline
    const endDate = new Date(dropDate);
    
    // Set default duration based on view (1 day, 1 week, 2 weeks for month/quarter)
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
    
    // Add the new item
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
      description: `"${draggedItem.title}" has been added to the timeline.`,
    });
    
    setDraggedItem(null);
    setDropDate(null);
  };

  // Handle mouse down on resize handle
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
    
    // Add event listeners for resize operation
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle mouse move during resize
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingItem || !resizeOrigin || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const deltaX = e.clientX - resizeOrigin.x;
    const dayWidth = getDayWidth();
    const daysDelta = Math.round(deltaX / dayWidth);
    
    // Update the item's date based on resize direction
    setTimelineData(prev => {
      const items = prev.items.map(item => {
        if (item.keyResultId !== resizingItem) return item;
        
        const newItem = { ...item };
        
        if (resizeDirection === "start") {
          // Calculate new start date
          const newDate = new Date(resizeOrigin.date);
          newDate.setDate(newDate.getDate() + daysDelta);
          
          // Ensure start date is not after end date
          if (newDate < item.endDate) {
            newItem.startDate = newDate;
          }
        } else {
          // Calculate new end date
          const newDate = new Date(resizeOrigin.date);
          newDate.setDate(newDate.getDate() + daysDelta);
          
          // Ensure end date is not before start date
          if (newDate > item.startDate) {
            newItem.endDate = newDate;
          }
        }
        
        return newItem;
      });
      
      return { items };
    });
  };

  // Handle mouse up to end resize operation
  const handleResizeEnd = () => {
    setResizingItem(null);
    setResizeDirection(null);
    setResizeOrigin(null);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    toast({
      title: "Timeline updated",
      description: "The key result has been rescheduled.",
    });
  };

  // Handle drag for moving timeline items
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
      
      // Set drag image (optional)
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

  // Handle dropping an existing timeline item in a new position
  const handleTimelineItemDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!dropDate) return;
    
    const timelineItemId = e.dataTransfer.getData("timelineItem");
    if (!timelineItemId) {
      // Handle normal drop (from key result library)
      handleDrop(e);
      return;
    }
    
    // Handle moving an existing timeline item
    setTimelineData(prev => {
      const items = prev.items.map(item => {
        if (item.keyResultId !== timelineItemId) return item;
        
        // Calculate the duration of the original item
        const durationMs = item.endDate.getTime() - item.startDate.getTime();
        
        // Create new start date from drop date
        const newStartDate = new Date(dropDate);
        
        // Create new end date based on the original duration
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

  // Remove a key result from the timeline
  const handleRemoveFromTimeline = (itemId: string) => {
    setTimelineData(prev => ({
      items: prev.items.filter(item => item.keyResultId !== itemId)
    }));
    
    // Also remove from selected key results if needed
    onRemoveKeyResult(itemId);
    
    toast({
      title: "Removed from timeline",
      description: "The key result has been removed from the timeline.",
    });
  };

  // Get department color for a key result
  const getDepartmentColor = (objectiveId: string): string => {
    // Find the key result's objective to get department
    const relevantKeyResult = selectedKeyResults.find(kr => kr.id === objectiveId || kr.objectiveId === objectiveId);
    if (!relevantKeyResult) return "#9b87f5"; // Default color
    
    // Find objective's department by looking at the key result's objective
    const objective = selectedKeyResults
      .find(kr => kr.id === relevantKeyResult.objectiveId || kr.id === objectiveId);
    
    if (!objective) return "#9b87f5"; // Default color
    
    // Find department color
    const department = departments
      .find(dept => selectedKeyResults
        .some(kr => kr.objectiveId === objective.objectiveId && kr.id === objective.id));
    
    return department?.color || "#9b87f5"; // Default to purple if not found
  };

  // Get key result by ID
  const getKeyResultById = (id: string): KeyResult | undefined => {
    return selectedKeyResults.find(kr => kr.id === id);
  };

  // Get the left position for a timeline item based on its start date
  const getItemLeftPosition = (startDate: Date): string => {
    const dates = getDatesForView();
    // Find the closest date in our view
    const dayIndex = dates.findIndex(date => 
      date.getDate() === startDate.getDate() && 
      date.getMonth() === startDate.getMonth() && 
      date.getFullYear() === startDate.getFullYear()
    );
    
    if (dayIndex === -1) {
      // If the date is before our view, position at start
      if (startDate < dates[0]) return "0px";
      // If after our view, position outside
      return "100%";
    }
    
    return `${dayIndex * getDayWidth()}px`;
  };

  // Calculate width for a timeline item based on its duration
  const getItemWidth = (startDate: Date, endDate: Date): string => {
    const dates = getDatesForView();
    if (dates.length === 0) return "0px";
    
    // Find the day index for the start date
    let startIndex = dates.findIndex(date => 
      date.getDate() === startDate.getDate() && 
      date.getMonth() === startDate.getMonth() && 
      date.getFullYear() === startDate.getFullYear()
    );
    
    if (startIndex === -1) {
      // If start date is before view, set to beginning
      if (startDate < dates[0]) {
        startIndex = 0;
      } else {
        // If start date is after view, set width to 0
        return "0px";
      }
    }
    
    // Find the day index for the end date
    let endIndex = dates.findIndex(date => 
      date.getDate() === endDate.getDate() && 
      date.getMonth() === endDate.getMonth() && 
      date.getFullYear() === endDate.getFullYear()
    );
    
    if (endIndex === -1) {
      // If end date is after view, set to end of view
      if (endDate > dates[dates.length - 1]) {
        endIndex = dates.length - 1;
      } else if (endDate < dates[0]) {
        // If end date is before view, set width to 0
        return "0px";
      }
    }
    
    // Calculate width based on day indices
    const daysVisible = endIndex - startIndex + 1;
    return `${daysVisible * getDayWidth()}px`;
  };

  // Check if an item is visible in the current view
  const isItemVisible = (startDate: Date, endDate: Date): boolean => {
    const dates = getDatesForView();
    if (dates.length === 0) return false;
    
    const viewStart = dates[0];
    const viewEnd = dates[dates.length - 1];
    
    // Item is visible if:
    // - Start date is before view end AND
    // - End date is after view start
    return startDate <= viewEnd && endDate >= viewStart;
  };

  // Get the dates for our current view
  const dates = getDatesForView();
  const dayWidth = getDayWidth();

  return (
    <div className="flex flex-col h-full">
      {/* Timeline navigation controls */}
      <div className="flex items-center justify-between mb-4">
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
      
      {/* Date headers */}
      <div className="flex border-b border-gray-200 pb-2">
        {dates.map((date, index) => (
          <div
            key={date.toISOString()}
            className={cn(
              "flex-shrink-0 text-xs text-center font-medium",
              date.getDay() === 0 || date.getDay() === 6 ? "text-gray-400" : "text-gray-600"
            )}
            style={{ width: `${dayWidth}px` }}
          >
            {formatDate(date)}
          </div>
        ))}
      </div>
      
      {/* Timeline grid with drop zone */}
      <ScrollArea className="h-full overflow-auto">
        <div 
          ref={timelineRef}
          className={cn(
            "relative min-h-[200px] border-b border-gray-200",
            isDraggingOver && "bg-accent/30"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleTimelineItemDrop}
          style={{ width: `${dates.length * dayWidth}px` }}
        >
          {/* Grid lines */}
          {dates.map((date, index) => (
            <div
              key={date.toISOString()}
              className={cn(
                "absolute top-0 bottom-0 border-r border-gray-100",
                date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-50" : ""
              )}
              style={{ 
                left: `${index * dayWidth}px`,
                width: `${dayWidth}px`
              }}
            />
          ))}
          
          {/* Drop indicator */}
          {isDraggingOver && dropDate && (
            <div 
              className="absolute top-0 bottom-0 bg-primary/20 border-l-2 border-r-2 border-primary"
              style={{ 
                left: getItemLeftPosition(dropDate),
                width: `${dayWidth}px`
              }}
            />
          )}
          
          {/* Timeline items */}
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
                  top: `${Math.random() * 60 + 10}px`,  // Random position to avoid overlapping
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
                
                {/* Resize handles */}
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
