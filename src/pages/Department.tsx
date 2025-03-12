
import { useEffect, useState, useCallback } from "react";
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

const Department = () => {
  const { id } = useParams<{ id: string }>();
  const department = getDepartmentById(id || "");
  
  // Use our OKR context for persistent state
  const { 
    getObjectivesForDepartment, 
    updateObjectives, 
    departmentStats,
    globalStartDate,
    globalEndDate,
    cycle
  } = useOKR();
  
  // Use useState with a key to force objectives to be updated only once
  const [objectives, setObjectives] = useState<Objective[]>([]);
  
  useEffect(() => {
    if (department) {
      document.title = `${department.name} | DeepIP OKRs`;
    }
  }, [department]);

  // Use a specific useEffect with proper dependencies to avoid infinite loops
  useEffect(() => {
    if (id) {
      // Get objectives from our context only when id changes
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

  // Use a memoized stats value to prevent unnecessary re-renders
  const stats = departmentStats[id as DepartmentId];

  const handleObjectivesUpdate = useCallback((updatedObjectives: Objective[]) => {
    setObjectives(updatedObjectives);
    // Update our persistent context
    updateObjectives(id as DepartmentId, updatedObjectives);
  }, [id, updateObjectives]);

  const handleAddObjective = useCallback(() => {
    // Find a default owner from the department
    const departmentUser = users.find(user => user.departmentId === id as DepartmentId);
    const defaultOwnerId = departmentUser ? departmentUser.id : users[0].id;
    
    // Create new objective with global dates and cycle
    const newObjective = createNewObjective(id as DepartmentId, defaultOwnerId);
    
    // Override with global dates and cycle
    newObjective.startDate = globalStartDate;
    newObjective.endDate = globalEndDate;
    newObjective.cycle = cycle;
    
    const updatedObjectives = [...objectives, newObjective];
    
    setObjectives(updatedObjectives);
    updateObjectives(id as DepartmentId, updatedObjectives);
    
    toast.success("New objective added");
  }, [id, objectives, globalStartDate, globalEndDate, cycle, updateObjectives]);

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
                className="flex items-center gap-1" 
                style={{ backgroundColor: department.color, color: "white" }}
                onClick={handleAddObjective}
              >
                <PlusCircle size={16} />
                Add Objective
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cycle</p>
                <p className="font-medium">{cycle} 2025</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Settings</p>
                <Link to="/settings">
                  <Button variant="outline" size="sm">Manage Settings</Button>
                </Link>
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
                  color={department.color}
                  animate={false}
                  key={`days-${stats.daysRemaining}-${stats.totalDays}`}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500">Time progress</p>
                  <p className="text-sm font-medium">{stats.timeProgress.toFixed(1)}%</p>
                </div>
                <ProgressBar 
                  value={stats.timeProgress} 
                  color={department.color}
                  animate={false}
                  key={`time-${stats.timeProgress}`}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500">Overall progress</p>
                  <p className="text-sm font-medium">{stats.overallProgress}%</p>
                </div>
                <ProgressBar 
                  value={stats.overallProgress} 
                  color={department.color}
                  animate={false}
                  key={`overall-${stats.overallProgress}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 animate-slide-in">
          {objectives.length > 0 ? (
            <ObjectiveList 
              objectives={objectives} 
              users={users} 
              onUpdate={handleObjectivesUpdate}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-md">
              <p className="text-gray-500 mb-4">No objectives defined for this department</p>
              <Button 
                className="flex items-center gap-1"
                style={{ backgroundColor: department.color, color: "white" }}
                onClick={handleAddObjective}
              >
                <PlusCircle size={16} />
                Add First Objective
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Department;
