
import { useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { departments } from "@/data/departments";
import { useOKRStore } from "@/data/okrData";
import DepartmentCard from "@/components/DepartmentCard";
import { Card, CardContent } from "@/components/ui/card";
import { DepartmentId } from "@/types";

const Index = () => {
  const { objectives, getDepartmentStats } = useOKRStore();

  useEffect(() => {
    document.title = "OKR Dashboard | DeepIP";
  }, []);

  // Calculate company-wide statistics
  const getTotalDaysRemaining = () => {
    // Use leadership department as reference
    return getDepartmentStats("leadership").daysRemaining;
  };

  const getTotalDays = () => {
    // Use leadership department as reference
    return getDepartmentStats("leadership").totalDays;
  };

  const getOverallProgress = () => {
    if (objectives.length === 0) return 0;
    const sum = objectives.reduce((acc, obj) => acc + obj.progress, 0);
    return Math.round(sum / objectives.length);
  };

  const getTimeProgress = () => {
    // Use leadership department as reference
    return getDepartmentStats("leadership").timeProgress;
  };

  // Calculate status percentages
  const getStatusPercentages = () => {
    let onTrack = 0;
    let atRisk = 0;
    let offTrack = 0;
    let total = 0;

    objectives.forEach(obj => {
      obj.keyResults.forEach(kr => {
        total++;
        if (kr.status === "On track" || kr.status === "Completed") {
          onTrack++;
        } else if (kr.status === "At Risk") {
          atRisk++;
        } else if (kr.status === "Off Track") {
          offTrack++;
        }
      });
    });

    return {
      onTrack: total ? Math.round((onTrack / total) * 100) : 0,
      atRisk: total ? Math.round((atRisk / total) * 100) : 0,
      offTrack: total ? Math.round((offTrack / total) * 100) : 0
    };
  };

  const statusPercentages = getStatusPercentages();

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">OKR Dashboard</h1>
            <p className="text-gray-500 mt-1">Track objectives and key results across departments</p>
          </div>
          
          <Card className="p-2 px-4 bg-white shadow-sm border">
            <span className="text-sm font-medium text-deepip-primary">Q1 2025</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {departments.map((department) => {
            const deptObjectives = objectives.filter(obj => obj.departmentId === department.id);
            const objectivesSummary = deptObjectives.map((obj) => ({
              title: obj.title,
              progress: obj.progress,
            }));

            return (
              <DepartmentCard
                key={department.id}
                department={department}
                stats={getDepartmentStats(department.id as DepartmentId)}
                objectives={objectivesSummary}
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
                  <p className="text-xl font-medium">{getTotalDaysRemaining()}/{getTotalDays()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Time Progress</p>
                  <p className="text-xl font-medium">{getTimeProgress().toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="text-xl font-medium">{getOverallProgress()}%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-4">Department Progress</h3>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const departmentId = dept.id as DepartmentId;
                    const stats = getDepartmentStats(departmentId);
                    
                    return (
                      <div key={dept.id} className="flex items-center">
                        <div className="w-32 font-medium truncate" style={{ color: dept.color }}>
                          {dept.name}
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${stats.overallProgress}%`,
                                backgroundColor: dept.color
                              }}
                            />
                          </div>
                        </div>
                        <div className="ml-4 w-12 text-right font-medium">
                          {stats.overallProgress}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">Total Objectives</p>
                    <p className="text-2xl font-medium">{objectives.length}</p>
                  </Card>
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">On Track</p>
                    <p className="text-2xl font-medium text-green-600">{statusPercentages.onTrack}%</p>
                  </Card>
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">At Risk</p>
                    <p className="text-2xl font-medium text-yellow-600">{statusPercentages.atRisk}%</p>
                  </Card>
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">Off Track</p>
                    <p className="text-2xl font-medium text-red-600">{statusPercentages.offTrack}%</p>
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
