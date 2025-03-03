
import { Objective, KeyResult, User } from "@/types";
import ProgressBar from "./ProgressBar";
import { cn } from "@/lib/utils";

type ObjectiveListProps = {
  objectives: Objective[];
  users: User[];
  className?: string;
};

const ObjectiveList = ({ objectives, users, className }: ObjectiveListProps) => {
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

  return (
    <div className={cn("space-y-8", className)}>
      {objectives.map((objective) => (
        <div key={objective.id} className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{objective.title}</h3>
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
                    <td className="px-4 py-3">{kr.title}</td>
                    <td className="px-4 py-3">{kr.metric}</td>
                    <td className="px-4 py-3">{kr.startValue}{kr.metric === 'Percentage' ? '%' : ''}</td>
                    <td className="px-4 py-3">{kr.targetValue}{kr.metric === 'Percentage' ? '%' : ''}</td>
                    <td className="px-4 py-3">{kr.currentValue}{kr.metric === 'Percentage' ? '%' : ''}</td>
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
                    <td className="px-4 py-3">{getOwnerName(kr.ownerId)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(kr.status))}>
                        {kr.status}
                      </span>
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
