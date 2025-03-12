
import { KeyResult } from "@/types";

interface TimelineViewProps {
  view: "day" | "week" | "month" | "quarter";
  zoomLevel: number;
  selectedKeyResults: KeyResult[];
}

const TimelineView = ({ view, zoomLevel, selectedKeyResults }: TimelineViewProps) => {
  return (
    <div className="h-[calc(100vh-250px)] overflow-auto">
      <div className="text-center text-gray-500 p-8">
        Timeline visualization will be implemented in the next iteration
      </div>
    </div>
  );
};

export default TimelineView;
