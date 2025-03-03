
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useOKRStore, getUserById, users } from "@/data/okrData";
import { getDepartmentById } from "@/data/departments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "@/components/ProgressBar";
import { ChevronLeft, PlusCircle, Trash2, CalendarIcon } from "lucide-react";
import EditableText from "@/components/EditableText";
import EditableNumber from "@/components/EditableNumber";
import EditableSelect from "@/components/EditableSelect";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyResult, Status, ConfidenceLevel } from "@/types";

const Objective = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { objectives, updateObjective, updateKeyResult, addKeyResult, deleteKeyResult, deleteObjective } = useOKRStore();
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

  const validateNumber = (value: number, min: number = 0): number => {
    return Math.max(min, value);
  };

  const cycleOptions = ["Q1", "Q2", "Q3", "Q4"] as const;
  const statusOptions = ["Off Track", "At Risk", "On track", "Completed"] as const;
  const confidenceLevelOptions = ["Low", "Medium", "High"] as const;

  const handleAddKeyResult = () => {
    addKeyResult(objective.id);
    toast.success("New Key Result added");
  };

  const handleDeleteKeyResult = (keyResultId: string) => {
    deleteKeyResult(objective.id, keyResultId);
    toast.success("Key Result deleted");
  };

  const handleDeleteObjective = () => {
    deleteObjective(objective.id);
    toast.success("Objective deleted");
    navigate(`/departments/${objective.departmentId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            <CardTitle className="text-2xl font-bold flex justify-between">
              <EditableText
                value={objective.title}
                onChange={(value) => updateObjective(objective.id, { title: value })}
                as="h1"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleDeleteObjective}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Objective
              </Button>
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
                <EditableSelect<string>
                  value={objective.ownerId}
                  options={users.map(u => u.id)}
                  onChange={(value) => updateObjective(objective.id, { ownerId: value })}
                  getOptionClass={() => "font-medium"}
                />
                <span className="text-sm text-gray-500">{owner?.name}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cycle</p>
                <EditableSelect<string>
                  value={objective.cycle}
                  options={cycleOptions}
                  onChange={(value) => updateObjective(objective.id, { cycle: value })}
                  className="font-medium"
                />
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
                <p className="font-medium flex items-center gap-2">
                  <CalendarIcon size={14} />
                  {formatDate(objective.startDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium flex items-center gap-2">
                  <CalendarIcon size={14} />
                  {formatDate(objective.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Key Results</h2>
            <Button 
              size="sm" 
              className="bg-deepip-primary text-white hover:bg-deepip-primary/90"
              onClick={handleAddKeyResult}
            >
              <PlusCircle size={16} className="mr-2" />
              Add Key Result
            </Button>
          </div>
          
          <div className="space-y-4">
            {objective.keyResults.map((kr) => {
              const krOwner = getUserById(kr.ownerId);
              
              return (
                <Card key={kr.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="text-lg font-medium">
                            <EditableText
                              value={kr.title}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { title: value })}
                            />
                          </h3>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteKeyResult(kr.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Metric</p>
                            <EditableSelect<"Percentage" | "Numerical" | "Yes/No">
                              value={kr.metric}
                              options={["Percentage", "Numerical", "Yes/No"]}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { metric: value })}
                              className="font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Owner</p>
                            <EditableSelect<string>
                              value={kr.ownerId}
                              options={users.map(u => u.id)}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { ownerId: value })}
                              className="font-medium"
                            />
                            <p className="text-xs text-gray-500">{krOwner?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <EditableSelect<Status>
                              value={kr.status}
                              options={statusOptions}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { status: value })}
                              getOptionClass={(option) => getStatusColor(option)}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Confidence</p>
                            <EditableSelect<ConfidenceLevel>
                              value={kr.confidenceLevel}
                              options={confidenceLevelOptions}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { confidenceLevel: value })}
                              className="font-medium"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Start Value</p>
                            <EditableNumber
                              value={kr.startValue}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { startValue: validateNumber(value, 0) })}
                              suffix={kr.metric === 'Percentage' ? '%' : ''}
                              className="font-medium"
                              min={0}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Current Value</p>
                            <EditableNumber
                              value={kr.currentValue}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { currentValue: validateNumber(value, 0) })}
                              suffix={kr.metric === 'Percentage' ? '%' : ''}
                              className="font-medium"
                              min={0}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Target Value</p>
                            <EditableNumber
                              value={kr.targetValue}
                              onChange={(value) => updateKeyResult(objective.id, kr.id, { targetValue: validateNumber(value, kr.startValue) })}
                              suffix={kr.metric === 'Percentage' ? '%' : ''}
                              className="font-medium"
                              min={kr.startValue}
                            />
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
