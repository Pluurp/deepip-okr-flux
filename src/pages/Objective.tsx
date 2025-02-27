
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { objectives, getUserById, users } from "@/data/okrData";
import { getDepartmentById } from "@/data/departments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "@/components/ProgressBar";
import { ChevronLeft } from "lucide-react";

const Objective = () => {
  const { id } = useParams<{ id: string }>();
  const objective = objectives.find(obj => obj.id === id);
  
  useEffect(() => {
    if (objective) {
      document.title = `${objective.title} | DeepIP OKRs`;
    }
  }, [objective]);

  if (!objective) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Objective not found</h2>
          <Link to="/" className="mt-4 inline-block text-deepip-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const department = getDepartmentById(objective.departmentId);
  const owner = getUserById(objective.ownerId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Off Track":
        return "bg-red-100 text-red-800";
      case "At Risk":
        return "bg-yellow-100 text-yellow-800";
      case "On track":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <Link to={`/departments/${objective.departmentId}`} className="inline-flex items-center text-gray-600 hover:text-deepip-primary mb-4">
          <ChevronLeft size={16} />
          <span>Back to {department?.name}</span>
        </Link>
        
        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
          <div 
            className="h-1.5" 
            style={{ backgroundColor: department?.color || "#4B48FF" }}
          ></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {objective.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{department?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium">{owner?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cycle</p>
                <p className="font-medium">{objective.cycle}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Progress</p>
                <div className="flex items-center gap-2">
                  <ProgressBar value={objective.progress} size="sm" className="w-24" />
                  <span>{objective.progress}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{new Date(objective.startDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{new Date(objective.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 animate-slide-in">
          <h2 className="text-xl font-bold mb-4">Key Results</h2>
          
          <div className="space-y-4">
            {objective.keyResults.map((kr) => {
              const krOwner = getUserById(kr.ownerId);
              
              return (
                <Card key={kr.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">{kr.title}</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Metric</p>
                            <p className="font-medium">{kr.metric}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Owner</p>
                            <p className="font-medium">{krOwner?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span 
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kr.status)}`}
                            >
                              {kr.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Confidence</p>
                            <p className="font-medium">{kr.confidenceLevel}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Start Value</p>
                            <p className="font-medium">{kr.startValue}{kr.metric === 'Percentage' ? '%' : ''}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Current Value</p>
                            <p className="font-medium">{kr.currentValue}{kr.metric === 'Percentage' ? '%' : ''}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Target Value</p>
                            <p className="font-medium">{kr.targetValue}{kr.metric === 'Percentage' ? '%' : ''}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full lg:w-48 flex flex-col justify-center">
                        <div className="text-center mb-2">
                          <span className="text-3xl font-bold">{kr.progress}%</span>
                        </div>
                        <ProgressBar value={kr.progress} size="lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Objective;
