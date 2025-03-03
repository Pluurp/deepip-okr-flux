
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getDepartmentById } from "@/data/departments";
import { users } from "@/data/okrData";
import ObjectiveList from "@/components/ObjectiveList";
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { Objective, DepartmentId } from "@/types";
import { createNewObjective } from "@/utils/okrUtils";
import { toast } from "sonner";
import { useOKR } from "@/context/OKRContext";
import { format } from "date-fns";

const Department = () => {
  const { id } = useParams<{ id: string }>();
  const department = getDepartmentById(id || "");
  
  // Use our OKR context for persistent state
  const { 
    getObjectivesForDepartment, 
    updateObjectives, 
    departmentStats 
  } = useOKR();
  
  const [objectives, setObjectives] = useState<Objective[]>([]);
  
  useEffect(() => {
    if (department) {
      document.title = `${department.name} | DeepIP OKRs`;
    }
  }, [department]);

  useEffect(() => {
    if (id) {
      // Get objectives from our context
      const departmentObjectives = getObjectivesForDepartment(id as DepartmentId);
      setObjectives(departmentObjectives);
    }
  }, [id, getObjectivesForDepartment]);

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

  const stats = departmentStats[id as DepartmentId];

  const handleObjectivesUpdate = (updatedObjectives: Objective[]) => {
    setObjectives(updatedObjectives);
    // Update our persistent context
    updateObjectives(id as DepartmentId, updatedObjectives);
    console.log("Objectives updated:", updatedObjectives);
  };

  const handleAddObjective = () => {
    // Find a default owner from the department
    const departmentUser = users.find(user => user.departmentId === id as DepartmentId);
    const defaultOwnerId = departmentUser ? departmentUser.id : users[0].id;
    
    const newObjective = createNewObjective(id as DepartmentId, defaultOwnerId);
    const updatedObjectives = [...objectives, newObjective];
    
    setObjectives(updatedObjectives);
    updateObjectives(id as DepartmentId, updatedObjectives);
    
    toast.success("New objective added");
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const startDate = objectives[0]?.startDate 
    ? formatDate(objectives[0].startDate)
    : "January 1, 2025";
    
  const endDate = objectives[0]?.endDate 
    ? formatDate(objectives[0].endDate)
    : "March 31, 2025";

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
              <span className="text-2xl font-bold" style={{ color: department.color }}>
                {department.name}
              </span>
              <Button 
                size="sm" 
                className="bg-deepip-primary text-white hover:bg-deepip-primary/90 flex items-center gap-1" 
                onClick={handleAddObjective}
              >
                <PlusCircle size={16} />
                Add Objective
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cycle</p>
                <p className="font-medium">{objectives[0]?.cycle || "Q1"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{startDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{endDate}</p>
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
          <ObjectiveList 
            objectives={objectives} 
            users={users} 
            onUpdate={handleObjectivesUpdate}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Department;
