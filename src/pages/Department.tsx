
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getDepartmentById } from "@/data/departments";
import { useOKRStore } from "@/data/okrData";
import ObjectiveList from "@/components/ObjectiveList";
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { DepartmentId } from "@/types";
import { toast } from "sonner";
import { users } from "@/data/okrData";

const Department = () => {
  const { id } = useParams<{ id: string }>();
  const department = getDepartmentById(id || "");
  const { objectives, addObjective, getDepartmentStats } = useOKRStore();
  
  useEffect(() => {
    if (department) {
      document.title = `${department.name} | DeepIP OKRs`;
    }
  }, [department]);

  if (!department || !id) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Department not found</h2>
          <Link to="/" className="mt-4 inline-block text-deepip-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Cast id to DepartmentId to fix TypeScript error
  const departmentId = id as DepartmentId;
  const stats = getDepartmentStats(departmentId);
  const departmentObjectives = objectives.filter(obj => obj.departmentId === departmentId);

  const handleAddObjective = () => {
    addObjective(departmentId);
    toast.success("New objective added");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-deepip-primary mb-4">
          <ChevronLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        
        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
          <div className="h-1.5" style={{ backgroundColor: department.color }}></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <h1 className="text-2xl font-bold" style={{ color: department.color }}>
                {department.name}
              </h1>
              <Button 
                size="sm" 
                className="bg-deepip-primary text-white hover:bg-deepip-primary/90"
                onClick={handleAddObjective}
              >
                <PlusCircle size={16} className="mr-2" />
                Add Objective
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cycle</p>
                <p className="font-medium">Q1</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">January 1, 2025</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">March 31, 2025</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-x-12 gap-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500">Days remaining</p>
                  <p className="text-sm font-medium">{stats.daysRemaining}/{stats.totalDays}</p>
                </div>
                <ProgressBar 
                  value={Math.round(100 - (stats.daysRemaining / stats.totalDays * 100))} 
                  variant="primary"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500">Time progress</p>
                  <p className="text-sm font-medium">{stats.timeProgress.toFixed(1)}%</p>
                </div>
                <ProgressBar 
                  value={stats.timeProgress} 
                  variant="primary"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500">Overall progress</p>
                  <p className="text-sm font-medium">{stats.overallProgress}%</p>
                </div>
                <ProgressBar 
                  value={stats.overallProgress} 
                  variant="primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 animate-slide-in">
          <ObjectiveList objectives={departmentObjectives} users={users} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Department;
