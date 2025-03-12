
import React from "react";
import { CompanyObjective, CompanyKeyResult } from "@/types";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import EditableText from "./EditableText";
import { Button } from "./ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createNewCompanyKeyResult } from "@/utils/companyOkrUtils";

type CompanyObjectiveListProps = {
  objectives: CompanyObjective[];
  className?: string;
  onUpdate?: (objectives: CompanyObjective[]) => void;
};

const CompanyObjectiveList = ({ 
  objectives, 
  className, 
  onUpdate 
}: CompanyObjectiveListProps) => {
  const handleObjectiveTitleChange = (objective: CompanyObjective, newTitle: string) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => 
      obj.id === objective.id ? { ...obj, title: newTitle } : obj
    );
    
    onUpdate(updatedObjectives);
    toast.success("Objective title updated");
  };

  const handleKeyResultTitleChange = (keyResult: CompanyKeyResult, newTitle: string) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === keyResult.objectiveId) {
        const updatedKeyResults = obj.keyResults.map(kr => 
          kr.id === keyResult.id ? { ...kr, title: newTitle } : kr
        );
        return { ...obj, keyResults: updatedKeyResults };
      }
      return obj;
    });
    
    onUpdate(updatedObjectives);
    toast.success("Key result title updated");
  };

  const handleAddKeyResult = (objective: CompanyObjective) => {
    if (!onUpdate) return;
    
    const newKeyResult = createNewCompanyKeyResult(objective.id);
    
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === objective.id) {
        return {
          ...obj,
          keyResults: [...obj.keyResults, newKeyResult]
        };
      }
      return obj;
    });
    
    onUpdate(updatedObjectives);
    toast.success("New key result added");
  };

  const handleDeleteKeyResult = (keyResult: CompanyKeyResult) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === keyResult.objectiveId) {
        // Don't delete if it's the only key result
        if (obj.keyResults.length <= 1) {
          toast.error("Cannot delete the only key result");
          return obj;
        }
        
        const updatedKeyResults = obj.keyResults.filter(kr => kr.id !== keyResult.id);
        
        return { 
          ...obj, 
          keyResults: updatedKeyResults
        };
      }
      return obj;
    });
    
    onUpdate(updatedObjectives);
    toast.success("Key result deleted");
  };

  const handleDeleteObjective = (objective: CompanyObjective) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.filter(obj => obj.id !== objective.id);
    onUpdate(updatedObjectives);
    toast.success("Objective deleted");
  };

  return (
    <div className={cn("space-y-6", className)}>
      {objectives.map((objective) => (
        <Card key={objective.id} className="overflow-hidden shadow-plane bg-white border border-gray-200 animate-scale-in">
          <div className="p-4 border-b bg-deepip-light-gray/30">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                <EditableText
                  value={objective.title}
                  onChange={(newTitle) => handleObjectiveTitleChange(objective, newTitle)}
                  className="font-medium text-lg"
                />
              </h3>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 shadow-sm hover:shadow-none transition-shadow"
                  onClick={() => handleAddKeyResult(objective)}
                >
                  <PlusCircle size={16} />
                  Add Key Result
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 shadow-sm hover:shadow-none transition-shadow"
                  onClick={() => handleDeleteObjective(objective)}
                >
                  <Trash2 size={16} />
                  Delete Objective
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-deepip-gray">Key Results</h4>
              {objective.keyResults.map((kr) => (
                <div key={kr.id} className="flex items-center justify-between border-b pb-3 hover:bg-deepip-light-gray/20 p-2 rounded-md transition-colors">
                  <EditableText
                    value={kr.title}
                    onChange={(newTitle) => handleKeyResultTitleChange(kr, newTitle)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                    onClick={() => handleDeleteKeyResult(kr)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanyObjectiveList;
