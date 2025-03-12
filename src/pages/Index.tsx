
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout";
import DepartmentCard from "@/components/DepartmentCard";
import CompanyObjectiveList from "@/components/CompanyObjectiveList";
import { departments } from "@/data/departments";
import { Link } from "react-router-dom";
import { BarChart3, Calendar, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOKR } from "@/context/OKRContext";

const Index = () => {
  const { objectives: allObjectives } = useOKR();

  const companyObjectives = {
    id: "company",
    title: "Company Objectives",
    keyResults: []
  };

  // Calculate department stats based on actual objectives
  const getDepartmentStats = (departmentId: string) => ({
    daysRemaining: 90,
    totalDays: 90,
    timeProgress: 0,
    overallProgress: allObjectives[departmentId]?.reduce((acc, obj) => acc + obj.progress, 0) / (allObjectives[departmentId]?.length || 1) || 0
  });

  // Get objectives for a department
  const getDepartmentObjectives = (departmentId: string) => 
    allObjectives[departmentId]?.map(obj => ({
      title: obj.title,
      progress: obj.progress
    })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Objectives
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Key Results
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                Tracking in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Working on objectives
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Timeline
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Q1 2025</div>
              <div className="mt-1">
                <Link to="/timeline">
                  <Button variant="outline" size="sm" className="w-full">
                    View Timeline
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CompanyObjectiveList 
              objectives={[companyObjectives]}
              className=""
            />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((department) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    stats={getDepartmentStats(department.id)}
                    objectives={getDepartmentObjectives(department.id)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
