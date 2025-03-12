
import { useOKR } from "@/context/OKRContext";
import { departments } from "@/data/departments";
import { KeyResult } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface KeyResultLibraryProps {
  onKeyResultSelect: (keyResult: KeyResult) => void;
}

const KeyResultLibrary = ({ onKeyResultSelect }: KeyResultLibraryProps) => {
  const { objectives } = useOKR();

  // Check if there are any objectives with key results
  const hasKeyResults = Object.values(objectives).some(
    (deptObjectives) => deptObjectives.some((obj) => obj.keyResults.length > 0)
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, keyResult: KeyResult) => {
    e.dataTransfer.setData("text/plain", keyResult.id);
    e.dataTransfer.effectAllowed = "move";
  };

  if (!hasKeyResults) {
    return (
      <Alert className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No key results available</AlertTitle>
        <AlertDescription>
          Please create objectives and key results in your department pages first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="space-y-6 pr-4">
        {departments.map((dept) => {
          // Skip departments with no objectives or key results
          if (!objectives[dept.id] || !objectives[dept.id].some(obj => obj.keyResults.length > 0)) {
            return null;
          }
          
          return (
            <div key={dept.id}>
              <h3 className="font-medium mb-3" style={{ color: dept.color }}>
                {dept.name}
              </h3>
              <div className="space-y-2">
                {objectives[dept.id]?.map((objective) => {
                  // Skip objectives with no key results
                  if (objective.keyResults.length === 0) {
                    return null;
                  }
                  
                  return (
                    <div key={objective.id} className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">{objective.title}</p>
                      {objective.keyResults.map((kr) => (
                        <div
                          key={kr.id}
                          className="p-2 rounded-md border cursor-move hover:bg-accent transition-colors"
                          onClick={() => onKeyResultSelect(kr)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, kr)}
                          data-kr-id={kr.id}
                        >
                          <p className="text-sm">{kr.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: dept.color }}
                            />
                            <span className="text-xs text-gray-500">
                              {kr.progress}% complete
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default KeyResultLibrary;
