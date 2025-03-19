
import { useEffect, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { departments } from "@/data/departments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepartmentCard from "@/components/DepartmentCard";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import CompanyObjectiveList from "@/components/CompanyObjectiveList";
import ReadOnlyCompanyObjectiveList from "@/components/ReadOnlyCompanyObjectiveList";
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Users,
  Smile,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useOKR } from "@/context/OKRContext";

const Index = () => {
  const {
    companyObjectives,
    companyKeyResults,
    companyStats,
    departmentStats,
    refreshStats,
  } = useOKR();
  
  useEffect(() => {
    document.title = "OKR Dashboard | Prior Labs";
    refreshStats();
  }, [refreshStats]);
  
  const totalProgress = useMemo(() => {
    return companyStats.averageProgress || 0;
  }, [companyStats]);

  const statusData = useMemo(() => {
    return [
      { name: "On Track", value: companyStats.onTrackCount || 0, color: "#10B981" },
      { name: "At Risk", value: companyStats.atRiskCount || 0, color: "#F59E0B" },
      { name: "Off Track", value: companyStats.offTrackCount || 0, color: "#EF4444" },
    ];
  }, [companyStats]);

  const departmentData = useMemo(() => {
    return Object.entries(departmentStats).map(([id, stats]) => {
      const dept = departments.find((d) => d.id === id);
      return {
        name: dept?.name || id,
        progress: stats.averageProgress || 0,
        color: dept?.color || "#6366F1",
      };
    });
  }, [departmentStats]);

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(0)}%`;
  };

  const currentQuarter = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Company OKR overview for {currentQuarter}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(), "MMMM d, yyyy")}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock size={14} />
              {format(new Date(), "h:mm a")}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Company Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProgress.toFixed(0)}%</div>
              <Progress value={totalProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Overall progress across all objectives
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectives</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyObjectives.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Total company objectives being tracked
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Key Results
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyKeyResults.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Total key results across all objectives
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Active departments with OKRs
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Department Progress</CardTitle>
              <CardDescription>
                Progress breakdown by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={formatTooltipValue} />
                    <Bar dataKey="progress" radius={[4, 4, 4, 4]}>
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
              <CardDescription>
                Objective status distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Objectives"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">
                    On Track ({companyStats.onTrackCount || 0})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">
                    At Risk ({companyStats.atRiskCount || 0})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">
                    Off Track ({companyStats.offTrackCount || 0})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Objective Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  stats={departmentStats[department.id] || {}}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Company Objectives</CardTitle>
                <CardDescription>
                  All company-level objectives and their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReadOnlyCompanyObjectiveList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Index;
