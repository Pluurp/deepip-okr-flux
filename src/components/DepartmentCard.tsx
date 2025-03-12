
import { Department, DepartmentStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "./ProgressBar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle, XCircle, Trophy, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";

type DepartmentCardProps = {
  department: Department;
  stats: DepartmentStats;
  objectives: {
    title: string;
    progress: number;
  }[];
  className?: string;
  onAddObjective?: () => void;
};

const DepartmentCard = ({
  department,
  stats,
  objectives,
  className,
  onAddObjective
}: DepartmentCardProps) => {
  // Function to get status icon based on progress
  const getStatusIcon = (progress: number) => {
    if (progress === 100) return <Trophy className="h-4 w-4 text-blue-600" />;
    if (progress >= 70) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (progress >= 30) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Link to={`/departments/${department.id}`}>
      <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1", className)}>
        <div className="h-1.5" style={{ backgroundColor: department.color }}></div>
        <CardHeader className="pb-2">
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
              animate={false}
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Objectives Progress</h4>
            {objectives.length > 0 ? (
              <div className="space-y-3">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                    <span className="text-sm text-gray-700 truncate mr-4 max-w-[70%]">
                      {objective.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(objective.progress)}
                      <div 
                        className="w-16 h-6 rounded flex items-center justify-center text-xs font-medium"
                        style={{ 
                          backgroundColor: objective.progress < 30 
                            ? '#FFEDD5' 
                            : objective.progress < 70 
                              ? '#FEF3C7' 
                              : objective.progress === 100
                                ? '#DBEAFE'
                                : '#ECFCCB',
                          color: objective.progress < 30 
                            ? '#9A3412' 
                            : objective.progress < 70 
                              ? '#92400E' 
                              : objective.progress === 100
                                ? '#1E40AF'
                                : '#3F6212'
                        }}
                      >
                        {objective.progress}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 space-y-2 border border-dashed rounded-md">
                <p className="text-sm text-gray-500">No objectives defined</p>
                {onAddObjective && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-1 flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      onAddObjective();
                    }}
                  >
                    <PlusCircle size={14} />
                    Add Objective
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DepartmentCard;
