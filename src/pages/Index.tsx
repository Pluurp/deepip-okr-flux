
import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { departments } from "@/data/departments";
import { departmentStats, getObjectivesByDepartment, objectives } from "@/data/okrData";
import DepartmentCard from "@/components/DepartmentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useOKR } from "@/context/OKRContext";
import { toast } from "sonner";

const Index = () => {
  const { globalStartDate, globalEndDate, updateGlobalDates, departmentStats: contextStats } = useOKR();
  const [dateType, setDateType] = useState<"start" | "end">("start");
  
  useEffect(() => {
    document.title = "OKR Dashboard | DeepIP";
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (dateType === "start") {
      const endDate = new Date(globalEndDate);
      
      // Ensure start date isn't after end date
      if (date > endDate) {
        toast.error("Start date cannot be after end date");
        return;
      }
      
      updateGlobalDates(date.toISOString(), globalEndDate);
      toast.success("Start date updated for all departments");
    } else {
      const startDate = new Date(globalStartDate);
      
      // Ensure end date isn't before start date
      if (date < startDate) {
        toast.error("End date cannot be before start date");
        return;
      }
      
      updateGlobalDates(globalStartDate, date.toISOString());
      toast.success("End date updated for all departments");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };
  
  // Calculate overall company progress
  const allObjectives = Object.values(objectives).flat();
  const overallProgress = allObjectives.length > 0
    ? Math.round(allObjectives.reduce((sum, obj) => sum + obj.progress, 0) / allObjectives.length)
    : 0;
  
  // Calculate average time progress across departments
  const avgTimeProgress = Object.values(contextStats).reduce((sum, stat) => sum + stat.timeProgress, 0) / 
    Object.values(contextStats).length;
  
  // Use the first department's days remaining (they should all be the same with global dates)
  const firstDeptStats = Object.values(contextStats)[0] || { daysRemaining: 0, totalDays: 0 };

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

        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Global Start Date</p>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 flex items-center gap-2"
                        onClick={() => setDateType("start")}
                      >
                        {formatDate(globalStartDate)}
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={new Date(globalStartDate)}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Global End Date</p>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 flex items-center gap-2"
                        onClick={() => setDateType("end")}
                      >
                        {formatDate(globalEndDate)}
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={new Date(globalEndDate)}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {departments.map((department) => {
            const deptObjectives = getObjectivesByDepartment(department.id);
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
                            className="h-full rounded-full transition-all duration-1000 ease-out"
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
                    <p className="text-2xl font-medium">{objectives.length}</p>
                  </Card>
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">On Track</p>
                    <p className="text-2xl font-medium text-green-600">68%</p>
                  </Card>
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">At Risk</p>
                    <p className="text-2xl font-medium text-yellow-600">22%</p>
                  </Card>
                  <Card className="p-4 border shadow-sm">
                    <p className="text-sm text-gray-500">Off Track</p>
                    <p className="text-2xl font-medium text-red-600">10%</p>
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
