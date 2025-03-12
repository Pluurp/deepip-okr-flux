
import { useOKR } from "@/context/OKRContext";
import { departments } from "@/data/departments";
import { KeyResult } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KeyResultLibraryProps {
  onKeyResultSelect: (keyResult: KeyResult) => void;
}

const KeyResultLibrary = ({ onKeyResultSelect }: KeyResultLibraryProps) => {
  const { objectives } = useOKR();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, keyResult: KeyResult) => {
    e.dataTransfer.setData("text/plain", keyResult.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="space-y-6 pr-4">
        {departments.map((dept) => (
          <div key={dept.id}>
            <h3 className="font-medium mb-3" style={{ color: dept.color }}>
              {dept.name}
            </h3>
            <div className="space-y-2">
              {objectives[dept.id]?.map((objective) => (
                <div key={objective.id} className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{objective.title}</p>
                  {objective.keyResults.map((kr) => (
                    <div
                      key={kr.id}
                      className="p-2 rounded-md border cursor-move hover:bg-accent transition-colors"
                      onClick={() => onKeyResultSelect(kr)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, kr)}
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default KeyResultLibrary;
