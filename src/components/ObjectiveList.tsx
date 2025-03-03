
import { useState } from "react";
import { Objective, KeyResult, User } from "@/types";
import ProgressBar from "./ProgressBar";
import { cn } from "@/lib/utils";
import EditableText from "./EditableText";
import EditableNumber from "./EditableNumber";
import EditableSelect from "./EditableSelect";
import { 
  calculateKeyResultProgress, 
  calculateObjectiveProgress,
  statusOptions, 
  confidenceLevelOptions,
  metricOptions
} from "@/utils/okrUtils";
import { toast } from "sonner";

type ObjectiveListProps = {
  objectives: Objective[];
  users: User[];
  className?: string;
  onUpdate?: (updatedObjectives: Objective[]) => void;
};

const ObjectiveList = ({ objectives: initialObjectives, users, className, onUpdate }: ObjectiveListProps) => {
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);

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

  const updateObjectiveTitle = (objectiveId: string, newTitle: string) => {
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === objectiveId) {
        return { ...obj, title: newTitle };
      }
      return obj;
    });
    
    setObjectives(updatedObjectives);
    if (onUpdate) onUpdate(updatedObjectives);
    toast.success("Objective title updated");
  };

  const updateKeyResult = (objectiveId: string, keyResultId: string, updates: Partial<KeyResult>) => {
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === objectiveId) {
        const updatedKeyResults = obj.keyResults.map(kr => {
          if (kr.id === keyResultId) {
            const updatedKr = { ...kr, ...updates };
            
            // Recalculate progress if any of the values have changed
            if (
              updates.startValue !== undefined || 
              updates.currentValue !== undefined || 
              updates.targetValue !== undefined
            ) {
              updatedKr.progress = calculateKeyResultProgress(
                updatedKr.startValue,
                updatedKr.currentValue,
                updatedKr.targetValue
              );
            }
            
            return updatedKr;
          }
          return kr;
        });
        
        // Recalculate objective progress based on updated key results
        const updatedProgress = calculateObjectiveProgress(updatedKeyResults);
        
        return { 
          ...obj, 
          keyResults: updatedKeyResults,
          progress: updatedProgress
        };
      }
      return obj;
    });
    
    setObjectives(updatedObjectives);
    if (onUpdate) onUpdate(updatedObjectives);
    toast.success("Key result updated");
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name
  }));

  return (
    <div className={cn("space-y-8", className)}>
      {objectives.map((objective) => (
        <div key={objective.id} className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                <EditableText 
                  value={objective.title} 
                  onChange={(newTitle) => updateObjectiveTitle(objective.id, newTitle)}
                />
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Progress:</span>
                <span className="font-medium">{objective.progress}%</span>
              </div>
            </div>
            <ProgressBar value={objective.progress} className="mt-2" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Key Result</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Metric</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Start</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Target</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Current</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Progress</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Owner</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {objective.keyResults.map((kr) => (
                  <tr key={kr.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <EditableText 
                        value={kr.title} 
                        onChange={(newTitle) => 
                          updateKeyResult(objective.id, kr.id, { title: newTitle })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableSelect
                        value={kr.metric}
                        options={metricOptions}
                        onChange={(newMetric) => 
                          updateKeyResult(objective.id, kr.id, { metric: newMetric as "Percentage" | "Numerical" | "Yes/No" })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber 
                        value={kr.startValue}
                        onChange={(newValue) => 
                          updateKeyResult(objective.id, kr.id, { startValue: newValue })
                        }
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber 
                        value={kr.targetValue}
                        onChange={(newValue) => 
                          updateKeyResult(objective.id, kr.id, { targetValue: newValue })
                        }
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber 
                        value={kr.currentValue}
                        onChange={(newValue) => 
                          updateKeyResult(objective.id, kr.id, { currentValue: newValue })
                        }
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
                        options={userOptions}
                        onChange={(newOwnerId) => 
                          updateKeyResult(objective.id, kr.id, { ownerId: newOwnerId })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableSelect
                        value={kr.status}
                        options={statusOptions}
                        onChange={(newStatus) => 
                          updateKeyResult(objective.id, kr.id, { status: newStatus as "Off Track" | "At Risk" | "On track" | "Completed" })
                        }
                        getStatusColor={getStatusColor}
                      />
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
