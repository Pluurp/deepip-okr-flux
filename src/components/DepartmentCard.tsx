
import { Department, DepartmentStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "./ProgressBar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type DepartmentCardProps = {
  department: Department;
  stats: DepartmentStats;
  objectives: {
    title: string;
    progress: number;
  }[];
  className?: string;
};

const DepartmentCard = ({
  department,
  stats,
  objectives,
  className,
}: DepartmentCardProps) => {
  return (
    <Link to={`/departments/${department.id}`}>
      <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1", className)}>
        <CardHeader className="pb-2" style={{ borderBottom: `2px solid ${department.color}` }}>
          <CardTitle className="text-lg font-medium" style={{ color: department.color }}>
            {department.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500">Days remaining</p>
              <p className="font-medium">
                {stats.daysRemaining}/{stats.totalDays}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-right">&nbsp;</p>
              <p className="font-medium">&nbsp;</p>
            </div>
            <div>
              <p className="text-gray-500">Time progress</p>
              <p className="font-medium"></p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-right">&nbsp;</p>
              <p className="font-medium">{stats.timeProgress.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-500">Overall progress</p>
              <p className="font-medium"></p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-right">&nbsp;</p>
              <p className="font-medium">{stats.overallProgress}%</p>
            </div>
          </div>
          
          <div className="relative mb-2">
            <ProgressBar 
              value={stats.overallProgress} 
              variant="primary"
              className="mb-6"
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Objectives Progress</h4>
            <div className="space-y-3">
              {objectives.map((objective, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate mr-4 max-w-[70%]">
                    {objective.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-16 h-6 rounded flex items-center justify-center text-xs"
                      style={{ 
                        backgroundColor: objective.progress < 30 
                          ? '#FFEDD5' 
                          : objective.progress < 70 
                            ? '#FEF3C7' 
                            : '#ECFCCB',
                        color: objective.progress < 30 
                          ? '#9A3412' 
                          : objective.progress < 70 
                            ? '#92400E' 
                            : '#3F6212'
                      }}
                    >
                      {objective.progress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DepartmentCard;
