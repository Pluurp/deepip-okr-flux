
import React, { useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { departments } from "@/data/departments";
import DepartmentCard from "@/components/DepartmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useOKR } from "@/context/OKRContext";
import ReadOnlyCompanyObjectiveList from "@/components/ReadOnlyCompanyObjectiveList";
import { loadCompanyObjectives } from "@/utils/companyOkrUtils";

const Index = () => {
  const { 
    departmentStats, 
    getObjectivesForDepartment,
    refreshStats
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

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Company Objectives Section (Read-Only) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Company Objectives & Key Results</h3>
                <Link to="/company">
                  <Button variant="outline" className="flex items-center gap-1">
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
                const objectives = objectivesLookup[department.id as keyof typeof objectivesLookup] || [];
                
                // Get objectives formatted for the card
                const objectivesForCard = objectives.map(obj => ({
                  title: obj.title,
                  progress: obj.progress
                }));
                
                return (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    stats={departmentStats[department.id as keyof typeof departmentStats]}
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
