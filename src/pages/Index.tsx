
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { departments } from "@/data/departments";
import DepartmentCard from "@/components/DepartmentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import { useOKR } from "@/context/OKRContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ObjectiveList from "@/components/ObjectiveList";
import { Objective } from "@/types";
import { createNewObjective } from "@/utils/okrUtils";
import { toast } from "sonner";
import StatusIcon from "@/components/StatusIcon";

const Index = () => {
  const { 
    globalStartDate, 
    globalEndDate, 
    departmentStats: contextStats,
    cycle,
    objectives: allDepartmentObjectives,
    refreshStats,
    updateObjectives,
    users // Using users from context
  } = useOKR();
  
  // Add state for company objectives
  const [companyObjectives, setCompanyObjectives] = useState<Objective[]>([]);
  
  // Force a refresh when the component mounts to ensure latest data
  useEffect(() => {
    document.title = "OKR Dashboard | DeepIP";
    // Ensure we have the latest stats on initial render
    refreshStats();
    
    // Initialize company objectives
    const savedCompanyOKRs = localStorage.getItem('company_okrs');
    if (savedCompanyOKRs) {
      try {
        setCompanyObjectives(JSON.parse(savedCompanyOKRs));
      } catch (e) {
        console.error('Failed to parse saved company objectives', e);
      }
    }
  }, [refreshStats]);
  
  // Save company objectives to localStorage when they change
  useEffect(() => {
    localStorage.setItem('company_okrs', JSON.stringify(companyObjectives));
  }, [companyObjectives]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };
  
  // Handle company objective updates
  const handleCompanyObjectivesUpdate = (updatedObjectives: Objective[]) => {
    setCompanyObjectives(updatedObjectives);
  };
  
  // Add new company objective
  const handleAddCompanyObjective = () => {
    // Create a new objective with a special departmentId for company level
    const newObjective = createNewObjective('leadership' as DepartmentId, users[0].id);
    
    // Override with global dates and cycle
    newObjective.startDate = globalStartDate;
    newObjective.endDate = globalEndDate;
    newObjective.cycle = cycle;
    newObjective.departmentId = 'leadership' as DepartmentId; // Mark as company-level
    
    setCompanyObjectives([...companyObjectives, newObjective]);
    
    toast.success("New company objective added");
  };
  
  // Use useMemo to calculate derived stats to prevent recalculation on every render
  const { 
    objectives,
    overallProgress,
    avgTimeProgress,
    firstDeptStats,
    statusCounts,
    totalObjectives
  } = useMemo(() => {
    // Get all objectives from all departments using context instead of static data
    const departmentObjectives = {
      leadership: allDepartmentObjectives.leadership || [],
      product: allDepartmentObjectives.product || [],
      ai: allDepartmentObjectives.ai || [],
      sales: allDepartmentObjectives.sales || [],
      growth: allDepartmentObjectives.growth || [],
    };
    
    // Flatten all objectives for calculations
    const allObjectives = Object.values(departmentObjectives).flat();
    
    // Calculate overall company progress from all objectives
    const calculatedOverallProgress = allObjectives.length > 0
      ? Math.round(allObjectives.reduce((sum, obj) => sum + obj.progress, 0) / allObjectives.length)
      : 0;
    
    // Calculate average time progress across departments
    const calculatedAvgTimeProgress = Object.values(contextStats).reduce((sum, stat) => sum + stat.timeProgress, 0) / 
      Object.values(contextStats).length;
    
    // Use the first department's days remaining (they should all be the same with global dates)
    const calculatedFirstDeptStats = Object.values(contextStats)[0] || { daysRemaining: 0, totalDays: 0 };

    // Calculate status counts for all key results
    let onTrackCount = 0;
    let atRiskCount = 0;
    let offTrackCount = 0;
    let totalCount = 0;

    // Process all key results to count statuses
    allObjectives.forEach(obj => {
      obj.keyResults.forEach(kr => {
        totalCount++;
        if (kr.status === "On track" || kr.status === "Completed") {
          onTrackCount++;
        } else if (kr.status === "At Risk") {
          atRiskCount++;
        } else if (kr.status === "Off Track") {
          offTrackCount++;
        }
      });
    });

    // Calculate percentages, avoid division by zero
    const onTrackPercentage = totalCount > 0 ? Math.round((onTrackCount / totalCount) * 100) : 0;
    const atRiskPercentage = totalCount > 0 ? Math.round((atRiskCount / totalCount) * 100) : 0;
    const offTrackPercentage = totalCount > 0 ? Math.round((offTrackCount / totalCount) * 100) : 0;
    
    return {
      objectives: departmentObjectives,
      overallProgress: calculatedOverallProgress,
      avgTimeProgress: calculatedAvgTimeProgress,
      firstDeptStats: calculatedFirstDeptStats,
      statusCounts: {
        onTrack: onTrackPercentage,
        atRisk: atRiskPercentage,
        offTrack: offTrackPercentage
      },
      totalObjectives: allObjectives.length
    };
  }, [allDepartmentObjectives, contextStats]);

  // Handler for department objectives
  const handleAddDepartmentObjective = (departmentId: DepartmentId) => {
    // Find a default owner from the department
    const departmentUser = users.find(user => user.departmentId === departmentId);
    const defaultOwnerId = departmentUser ? departmentUser.id : users[0].id;
    
    // Create new objective with global dates and cycle
    const newObjective = createNewObjective(departmentId, defaultOwnerId);
    
    // Override with global dates and cycle
    newObjective.startDate = globalStartDate;
    newObjective.endDate = globalEndDate;
    newObjective.cycle = cycle;
    
    // Get current objectives for this department
    const currentObjectives = allDepartmentObjectives[departmentId] || [];
    const updatedObjectives = [...currentObjectives, newObjective];
    
    // Update objectives in context
    updateObjectives(departmentId, updatedObjectives);
    
    toast.success(`New objective added to ${departmentId}`);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">OKR Dashboard</h1>
            <p className="text-gray-500 mt-1">Track objectives and key results across departments</p>
          </div>
          
          <Card className="p-2 px-4 bg-white shadow-sm border">
            <span className="text-sm font-medium text-deepip-primary">{cycle} 2025</span>
          </Card>
        </div>

        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cycle</p>
                <p className="font-medium">{cycle} 2025</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Start Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">{formatDate(globalStartDate)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">End Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">{formatDate(globalEndDate)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  Manage Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Company OKRs Section */}
        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
          <div className="h-1.5 bg-deepip-primary"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-deepip-primary">Company Objectives & Key Results</h2>
              <Button 
                size="sm" 
                className="bg-deepip-primary text-white hover:bg-deepip-primary/90 flex items-center gap-1"
                onClick={handleAddCompanyObjective}
              >
                <Plus size={16} />
                Add Company Objective
              </Button>
            </div>
            
            {companyObjectives.length > 0 ? (
              <ObjectiveList 
                objectives={companyObjectives} 
                users={users}
                onUpdate={handleCompanyObjectivesUpdate}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border border-dashed rounded-md">
                <p className="text-gray-500 mb-2">No company objectives defined</p>
                <Button 
                  variant="outline" 
                  onClick={handleAddCompanyObjective}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Company Objective
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {departments.map((department) => {
            const deptObjectives = objectives[department.id] || [];
            const objectivesSummary = deptObjectives.map((obj) => ({
              title: obj.title,
              progress: obj.progress,
            }));

            return (
              <DepartmentCard
                key={department.id}
                department={department}
                stats={contextStats[department.id]}
                objectives={objectivesSummary}
                onAddObjective={() => handleAddDepartmentObjective(department.id)}
              />
            );
          })}
        </div>

        <Card className="mt-10 animate-slide-in">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Company Overview</h2>
                <p className="text-gray-500">Overall progress across all departments</p>
              </div>
              
              <div className="flex gap-6 mt-4 lg:mt-0">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Days Remaining</p>
                  <p className="text-xl font-medium">{firstDeptStats.daysRemaining}/{firstDeptStats.totalDays}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Time Progress</p>
                  <p className="text-xl font-medium">{avgTimeProgress.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="text-xl font-medium">{overallProgress}%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-4">Department Progress</h3>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center">
                      <div className="w-32 font-medium truncate" style={{ color: dept.color }}>
                        {dept.name}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-none"
                            style={{ 
                              width: `${contextStats[dept.id].overallProgress}%`,
                              backgroundColor: dept.color
                            }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 w-12 text-right font-medium">
                        {contextStats[dept.id].overallProgress}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">Total Objectives</p>
                    <p className="text-2xl font-medium">{totalObjectives}</p>
                  </Card>
                  <Card className="p-4 border shadow-sm flex items-center">
                    <div className="mr-2">
                      <StatusIcon status="On track" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">On Track</p>
                      <p className="text-2xl font-medium text-green-600">{statusCounts.onTrack}%</p>
                    </div>
                  </Card>
                  <Card className="p-4 border shadow-sm flex items-center">
                    <div className="mr-2">
                      <StatusIcon status="At Risk" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">At Risk</p>
                      <p className="text-2xl font-medium text-yellow-600">{statusCounts.atRisk}%</p>
                    </div>
                  </Card>
                  <Card className="p-4 border shadow-sm flex items-center">
                    <div className="mr-2">
                      <StatusIcon status="Off Track" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Off Track</p>
                      <p className="text-2xl font-medium text-red-600">{statusCounts.offTrack}%</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
