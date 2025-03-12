
import React, { useState } from "react";
import { Objective, KeyResult, User, Status } from "@/types";
import ProgressBar from "./ProgressBar";
import { cn } from "@/lib/utils";
import EditableText from "./EditableText";
import EditableNumber from "./EditableNumber";
import EditableSelect from "./EditableSelect";
import { Button } from "./ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { calculateProgress, createNewKeyResult, getStatusFromProgress } from "@/utils/okrUtils";
import { toast } from "sonner";
import StatusIcon from "./StatusIcon";

type ObjectiveListProps = {
  objectives: Objective[];
  users: User[];
  className?: string;
  onUpdate?: (objectives: Objective[]) => void;
};

const ObjectiveList = ({ objectives, users, className, onUpdate }: ObjectiveListProps) => {
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);

  const getOwnerName = (ownerId: string) => {
    const owner = users.find(user => user.id === ownerId);
    return owner ? owner.name : "Unassigned";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Off Track":
        return "bg-red-100 text-red-800";
      case "At Risk":
        return "bg-yellow-100 text-yellow-800";
      case "On track":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleObjectiveTitleChange = (objective: Objective, newTitle: string) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => 
      obj.id === objective.id ? { ...obj, title: newTitle } : obj
    );
    
    onUpdate(updatedObjectives);
    toast.success("Objective title updated");
  };

  const handleKeyResultTitleChange = (keyResult: KeyResult, newTitle: string) => {
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

  const handleKeyResultValueChange = (keyResult: KeyResult, field: 'startValue' | 'targetValue' | 'currentValue', value: number) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === keyResult.objectiveId) {
        const updatedKeyResults = obj.keyResults.map(kr => {
          if (kr.id === keyResult.id) {
            const updatedKr = { ...kr, [field]: value };
            
            // Recalculate progress
            updatedKr.progress = calculateProgress(
              updatedKr.startValue, 
              updatedKr.targetValue, 
              updatedKr.currentValue
            );
            
            // Automatically update status based on progress
            updatedKr.status = getStatusFromProgress(updatedKr.progress);
            
            return updatedKr;
          }
          return kr;
        });
        
        // Recalculate objective progress
        const objProgress = Math.round(
          updatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / updatedKeyResults.length
        );
        
        return { 
          ...obj, 
          keyResults: updatedKeyResults,
          progress: objProgress
        };
      }
      return obj;
    });
    
    onUpdate(updatedObjectives);
    toast.success(`Key result ${field.replace('Value', '')} updated`);
  };

  const handleKeyResultOwnerChange = (keyResult: KeyResult, ownerId: string) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === keyResult.objectiveId) {
        const updatedKeyResults = obj.keyResults.map(kr => 
          kr.id === keyResult.id ? { ...kr, ownerId } : kr
        );
        return { ...obj, keyResults: updatedKeyResults };
      }
      return obj;
    });
    
    onUpdate(updatedObjectives);
    toast.success("Key result owner updated");
  };

  const handleKeyResultStatusChange = (keyResult: KeyResult, status: string) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === keyResult.objectiveId) {
        const updatedKeyResults = obj.keyResults.map(kr => 
          kr.id === keyResult.id ? { ...kr, status: status as Status } : kr
        );
        return { ...obj, keyResults: updatedKeyResults };
      }
      return obj;
    });
    
    onUpdate(updatedObjectives);
    toast.success("Key result status updated");
  };

  const handleAddKeyResult = (objective: Objective) => {
    if (!onUpdate) return;
    
    const newKeyResult = createNewKeyResult(objective.id, objective.ownerId);
    
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

  const handleDeleteKeyResult = (keyResult: KeyResult) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === keyResult.objectiveId) {
        // Don't delete if it's the only key result
        if (obj.keyResults.length <= 1) {
          toast.error("Cannot delete the only key result");
          return obj;
        }
        
        const updatedKeyResults = obj.keyResults.filter(kr => kr.id !== keyResult.id);
        
        // Recalculate objective progress
        const objProgress = Math.round(
          updatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / updatedKeyResults.length
        );
        
        return { 
          ...obj, 
          keyResults: updatedKeyResults,
          progress: objProgress
        };
      }
      return obj;
    });
    
    onUpdate(updatedObjectives);
    toast.success("Key result deleted");
  };

  const handleDeleteObjective = (objective: Objective) => {
    if (!onUpdate) return;
    
    const updatedObjectives = objectives.filter(obj => obj.id !== objective.id);
    onUpdate(updatedObjectives);
    toast.success("Objective deleted");
  };

  return (
    <div className={cn("space-y-8", className)}>
      {objectives.map((objective) => (
        <div key={objective.id} className="border rounded-lg overflow-hidden bg-white shadow-plane animate-scale-in">
          <div className="p-4 border-b bg-deepip-light-gray/30">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                <EditableText
                  value={objective.title}
                  onChange={(newTitle) => handleObjectiveTitleChange(objective, newTitle)}
                  className="font-medium text-lg"
                />
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-deepip-gray">Progress:</span>
                <span className="font-medium">{objective.progress}%</span>
              </div>
            </div>
            <ProgressBar value={objective.progress} className="mt-2" />
            
            <div className="flex justify-between items-center mt-4">
              <div>
                {/* Date fields have been removed */}
              </div>
              
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
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-deepip-light-gray/30 border-b">
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Key Result</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Metric</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Start</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Target</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Current</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Progress</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Owner</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-deepip-gray">Actions</th>
                </tr>
              </thead>
              <tbody>
                {objective.keyResults.map((kr) => (
                  <tr key={kr.id} className="border-b hover:bg-deepip-light-gray/20 transition-colors">
                    <td className="px-4 py-3">
                      <EditableText
                        value={kr.title}
                        onChange={(newTitle) => handleKeyResultTitleChange(kr, newTitle)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableSelect
                        value={kr.metric}
                        options={[
                          { value: "Percentage", label: "Percentage" },
                          { value: "Numerical", label: "Numerical" },
                          { value: "Yes/No", label: "Yes/No" },
                        ]}
                        onChange={(value) => {
                          /* Metric changes will be handled in a future update */
                          toast.info("Changing metric type will be available in a future update");
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber
                        value={kr.startValue}
                        onChange={(value) => handleKeyResultValueChange(kr, 'startValue', value)}
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber
                        value={kr.targetValue}
                        onChange={(value) => handleKeyResultValueChange(kr, 'targetValue', value)}
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber
                        value={kr.currentValue}
                        onChange={(value) => handleKeyResultValueChange(kr, 'currentValue', value)}
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar 
                          value={kr.progress} 
                          size="sm" 
                          className="w-16"
                        />
                        <span>{kr.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <EditableSelect
                        value={kr.ownerId}
                        options={users.map(user => ({ value: user.id, label: user.name }))}
                        onChange={(value) => handleKeyResultOwnerChange(kr, value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <StatusIcon status={kr.status} size={14} />
                        <EditableSelect
                          value={kr.status}
                          options={[
                            { value: "Off Track", label: "Off Track" },
                            { value: "At Risk", label: "At Risk" },
                            { value: "On track", label: "On track" },
                            { value: "Completed", label: "Completed" },
                          ]}
                          onChange={(value) => handleKeyResultStatusChange(kr, value)}
                          valueClassName={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(kr.status))}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                        onClick={() => handleDeleteKeyResult(kr)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObjectiveList;
