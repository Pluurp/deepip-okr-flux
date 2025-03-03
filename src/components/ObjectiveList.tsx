
import { Objective, KeyResult, User, Status, ConfidenceLevel } from "@/types";
import ProgressBar from "./ProgressBar";
import { cn } from "@/lib/utils";
import { useOKRStore } from "@/data/okrData";
import EditableText from "./EditableText";
import EditableNumber from "./EditableNumber";
import EditableSelect from "./EditableSelect";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type ObjectiveListProps = {
  objectives: Objective[];
  users: User[];
  className?: string;
};

const ObjectiveList = ({ objectives, users, className }: ObjectiveListProps) => {
  const { updateObjective, updateKeyResult, addKeyResult, deleteKeyResult, deleteObjective } = useOKRStore();

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

  const metricOptions = ["Percentage", "Numerical", "Yes/No"] as const;
  const statusOptions = ["Off Track", "At Risk", "On track", "Completed"] as const;
  const confidenceLevelOptions = ["Low", "Medium", "High"] as const;

  const handleDeleteObjective = (objectiveId: string) => {
    deleteObjective(objectiveId);
    toast.success("Objective deleted successfully");
  };

  const handleDeleteKeyResult = (objectiveId: string, keyResultId: string) => {
    deleteKeyResult(objectiveId, keyResultId);
    toast.success("Key Result deleted successfully");
  };

  const handleAddKeyResult = (objectiveId: string) => {
    addKeyResult(objectiveId);
    toast.success("New Key Result added");
  };

  const validateNumber = (value: number, min: number = 0): number => {
    return Math.max(min, value);
  };

  return (
    <div className={cn("space-y-8", className)}>
      {objectives.map((objective) => (
        <div key={objective.id} className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <Link to={`/objectives/${objective.id}`} className="hover:underline">
                <h3 className="text-lg font-medium">
                  <EditableText
                    value={objective.title}
                    onChange={(value) => updateObjective(objective.id, { title: value })}
                  />
                </h3>
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Progress:</span>
                  <span className="font-medium">{objective.progress}%</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteObjective(objective.id)}
                >
                  <Trash2 size={16} />
                </Button>
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
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {objective.keyResults.map((kr) => (
                  <tr key={kr.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <EditableText
                        value={kr.title}
                        onChange={(value) => updateKeyResult(objective.id, kr.id, { title: value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableSelect<"Percentage" | "Numerical" | "Yes/No">
                        value={kr.metric}
                        options={metricOptions}
                        onChange={(value) => updateKeyResult(objective.id, kr.id, { metric: value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber
                        value={kr.startValue}
                        onChange={(value) => updateKeyResult(objective.id, kr.id, { startValue: validateNumber(value, 0) })}
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                        min={0}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber
                        value={kr.targetValue}
                        onChange={(value) => updateKeyResult(objective.id, kr.id, { targetValue: validateNumber(value, kr.startValue) })}
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                        min={kr.startValue}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableNumber
                        value={kr.currentValue}
                        onChange={(value) => updateKeyResult(objective.id, kr.id, { currentValue: validateNumber(value, 0) })}
                        suffix={kr.metric === 'Percentage' ? '%' : ''}
                        min={0}
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
                      <EditableSelect<string>
                        value={kr.ownerId}
                        options={users.map(user => user.id)}
                        onChange={(value) => updateKeyResult(objective.id, kr.id, { ownerId: value })}
                        getOptionClass={() => ""}
                      />
                      <span className="text-xs text-gray-500 block">{getOwnerName(kr.ownerId)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <EditableSelect<Status>
                        value={kr.status}
                        options={statusOptions}
                        onChange={(value) => updateKeyResult(objective.id, kr.id, { status: value })}
                        getOptionClass={(option) => getStatusColor(option)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteKeyResult(objective.id, kr.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={9} className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-deepip-primary"
                      onClick={() => handleAddKeyResult(objective.id)}
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Add Key Result
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObjectiveList;
