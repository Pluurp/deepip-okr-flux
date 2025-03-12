
import React, { useEffect, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { departments, getDepartmentColor } from "@/data/departments";
import DepartmentCard from "@/components/DepartmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertTriangle, XCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useOKR } from "@/context/OKRContext";
import ReadOnlyCompanyObjectiveList from "@/components/ReadOnlyCompanyObjectiveList";
import { loadCompanyObjectives } from "@/utils/companyOkrUtils";
import ProgressBar from "@/components/ProgressBar";

const Index = () => {
  const { 
    departmentStats, 
    getObjectivesForDepartment,
    refreshStats,
    getCurrentDate,
    globalStartDate,
    globalEndDate,
    cycle
  } = useOKR();

  useEffect(() => {
    document.title = "Dashboard | DeepIP OKRs";
    
    // Force a stats refresh when the dashboard loads
    refreshStats();
  }, [refreshStats]);

  // Simulate loading user data instead of pulling from context
  const objectivesLookup = {
    leadership: getObjectivesForDepartment('leadership'),
    product: getObjectivesForDepartment('product'),
    ai: getObjectivesForDepartment('ai'),
    sales: getObjectivesForDepartment('sales'),
    growth: getObjectivesForDepartment('growth')
  };

  // Load company objectives
  const companyObjectives = loadCompanyObjectives();

  // Calculate company-wide statistics
  const allObjectives = useMemo(() => {
    return Object.values(objectivesLookup).flat();
  }, [objectivesLookup]);

  const companyStats = useMemo(() => {
    // Calculate days remaining and total days
    const currentDate = getCurrentDate();
    const end = new Date(globalEndDate);
    const start = new Date(globalStartDate);
    
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
    const daysRemaining = Math.max(Math.ceil((end.getTime() - currentDate.getTime()) / msPerDay), 0);
    
    // Calculate time progress
    const timeProgress = parseFloat((((totalDays - daysRemaining) / totalDays) * 100).toFixed(1));
    
    // Calculate overall progress
    const overallProgress = Math.round(
      allObjectives.reduce((sum, obj) => sum + obj.progress, 0) / (allObjectives.length || 1)
    );
    
    return {
      daysRemaining,
      totalDays,
      timeProgress: isNaN(timeProgress) ? 0 : timeProgress,
      overallProgress
    };
  }, [allObjectives, getCurrentDate, globalEndDate, globalStartDate]);
  
  // Calculate statistics for status breakdown
  const statusStats = useMemo(() => {
    const totalCount = allObjectives.length;
    const onTrackCount = allObjectives.filter(obj => obj.progress >= 70).length;
    const atRiskCount = allObjectives.filter(obj => obj.progress >= 40 && obj.progress < 70).length;
    const offTrackCount = allObjectives.filter(obj => obj.progress < 40).length;
    
    return {
      totalCount,
      onTrackPercent: totalCount ? Math.round((onTrackCount / totalCount) * 100) : 0,
      atRiskPercent: totalCount ? Math.round((atRiskCount / totalCount) * 100) : 0,
      offTrackPercent: totalCount ? Math.round((offTrackCount / totalCount) * 100) : 0
    };
  }, [allObjectives]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Current OKR Cycle: <span className="font-medium text-deepip-primary">{cycle}</span>
            </p>
          </div>
        </div>

        {/* Company Overview Card */}
        <Card className="mb-8 border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Company Overview</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Overall progress across all departments</p>
              </div>
              <div className="flex space-x-6 text-right">
                <div>
                  <div className="text-sm text-gray-500">Days Remaining</div>
                  <div className="text-xl font-semibold">{companyStats.daysRemaining}/{companyStats.totalDays}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Time Progress</div>
                  <div className="text-xl font-semibold">{companyStats.timeProgress}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Progress</div>
                  <div className="text-xl font-semibold">{companyStats.overallProgress}%</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Department Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Department Progress</h3>
                <div className="space-y-4">
                  {departments.map((department) => {
                    const stats = departmentStats[department.id];
                    const color = getDepartmentColor(department.id);
                    
                    return (
                      <div key={department.id} className="flex items-center">
                        <div className="w-48 text-sm" style={{ color }}>
                          {department.name}
                        </div>
                        <div className="flex-1 mr-4">
                          <ProgressBar 
                            value={stats.overallProgress} 
                            size="md"
                            color={color}
                          />
                        </div>
                        <div className="text-right w-12 font-medium">
                          {stats.overallProgress}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Key Statistics Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-50 border border-gray-100 shadow-none">
                    <CardContent className="p-4">
                      <div className="text-gray-600 mb-1">Total Objectives</div>
                      <div className="text-3xl font-bold">{statusStats.totalCount}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border border-green-100 shadow-none">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1 text-green-700">
                          <CheckCircle size={16} />
                          <span>On Track</span>
                        </div>
                        <div className="text-3xl font-bold text-green-700">{statusStats.onTrackPercent}%</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border border-yellow-100 shadow-none">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1 text-yellow-700">
                          <AlertTriangle size={16} />
                          <span>At Risk</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-700">{statusStats.atRiskPercent}%</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border border-red-100 shadow-none">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1 text-red-700">
                          <XCircle size={16} />
                          <span>Off Track</span>
                        </div>
                        <div className="text-3xl font-bold text-red-700">{statusStats.offTrackPercent}%</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
                
            {/* Company Objectives Section (Read-Only) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-deepip-primary">Company Objectives & Key Results</h3>
                <Link to="/company">
                  <Button variant="outline" className="flex items-center gap-1 hover:bg-deepip-primary hover:text-white">
                    Manage Company OKRs
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
              
              <ReadOnlyCompanyObjectiveList objectives={companyObjectives} />
            </div>
            
            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {departments.map((department) => {
                const objectives = objectivesLookup[department.id] || [];
                
                const objectivesForCard = objectives.map(obj => ({
                  title: obj.title,
                  progress: obj.progress
                }));
                
                return (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    stats={departmentStats[department.id]}
                    objectives={objectivesForCard}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
