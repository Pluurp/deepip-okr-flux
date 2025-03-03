
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { objectives as allObjectives, getUserById, users } from "@/data/okrData";
import { getDepartmentById } from "@/data/departments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircle, Trash2 } from "lucide-react";
import { KeyResult, Objective as ObjectiveType, Status } from "@/types";
import EditableText from "@/components/EditableText";
import EditableNumber from "@/components/EditableNumber";
import EditableSelect from "@/components/EditableSelect";
import { calculateProgress, createNewKeyResult } from "@/utils/okrUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Objective = () => {
  const { id } = useParams<{ id: string }>();
  const [objective, setObjective] = useState<ObjectiveType | undefined>(
    allObjectives.find(obj => obj.id === id)
  );
  
  useEffect(() => {
    if (objective) {
      document.title = `${objective.title} | DeepIP OKRs`;
    }
  }, [objective]);

  useEffect(() => {
    setObjective(allObjectives.find(obj => obj.id === id));
  }, [id]);

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

  const handleTitleChange = (newTitle: string) => {
    setObjective(prev => prev ? { ...prev, title: newTitle } : prev);
    toast.success("Objective title updated");
  };

  const handleKeyResultTitleChange = (keyResult: KeyResult, newTitle: string) => {
    if (!objective) return;
    
    const updatedKeyResults = objective.keyResults.map(kr => 
      kr.id === keyResult.id ? { ...kr, title: newTitle } : kr
    );
    
    setObjective({ ...objective, keyResults: updatedKeyResults });
    toast.success("Key result title updated");
  };

  const handleKeyResultValueChange = (keyResult: KeyResult, field: 'startValue' | 'targetValue' | 'currentValue', value: number) => {
    if (!objective) return;
    
    const updatedKeyResults = objective.keyResults.map(kr => {
      if (kr.id === keyResult.id) {
        const updatedKr = { ...kr, [field]: value };
        
        // Recalculate progress
        updatedKr.progress = calculateProgress(
          updatedKr.startValue, 
          updatedKr.targetValue, 
          updatedKr.currentValue
        );
        
        return updatedKr;
      }
      return kr;
    });
    
    // Recalculate objective progress
    const objProgress = Math.round(
      updatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / updatedKeyResults.length
    );
    
    setObjective({ 
      ...objective, 
      keyResults: updatedKeyResults,
      progress: objProgress
    });
    
    toast.success(`Key result ${field.replace('Value', '')} updated`);
  };

  const handleKeyResultOwnerChange = (keyResult: KeyResult, ownerId: string) => {
    if (!objective) return;
    
    const updatedKeyResults = objective.keyResults.map(kr => 
      kr.id === keyResult.id ? { ...kr, ownerId } : kr
    );
    
    setObjective({ ...objective, keyResults: updatedKeyResults });
    toast.success("Key result owner updated");
  };

  const handleKeyResultStatusChange = (keyResult: KeyResult, status: string) => {
    if (!objective) return;
    
    const updatedKeyResults = objective.keyResults.map(kr => 
      kr.id === keyResult.id ? { ...kr, status: status as Status } : kr
    );
    
    setObjective({ ...objective, keyResults: updatedKeyResults });
    toast.success("Key result status updated");
  };

  const handleAddKeyResult = () => {
    if (!objective) return;
    
    const newKeyResult = createNewKeyResult(objective.id, objective.ownerId);
    
    setObjective({
      ...objective,
      keyResults: [...objective.keyResults, newKeyResult]
    });
    
    toast.success("New key result added");
  };

  const handleDeleteKeyResult = (keyResult: KeyResult) => {
    if (!objective) return;
    
    // Don't delete if it's the only key result
    if (objective.keyResults.length <= 1) {
      toast.error("Cannot delete the only key result");
      return;
    }
    
    const updatedKeyResults = objective.keyResults.filter(kr => kr.id !== keyResult.id);
    
    // Recalculate objective progress
    const objProgress = Math.round(
      updatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / updatedKeyResults.length
    );
    
    setObjective({ 
      ...objective, 
      keyResults: updatedKeyResults,
      progress: objProgress
    });
    
    toast.success("Key result deleted");
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
              <EditableText
                value={objective.title}
                onChange={handleTitleChange}
                className="text-2xl font-bold"
              />
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Key Results</h2>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleAddKeyResult}
            >
              <PlusCircle size={16} />
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
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium">
                            <EditableText
                              value={kr.title}
                              onChange={(newTitle) => handleKeyResultTitleChange(kr, newTitle)}
                              className="text-lg font-medium"
                            />
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteKeyResult(kr)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Metric</p>
                            <EditableSelect
                              value={kr.metric}
                              options={[
                                { value: "Percentage", label: "Percentage" },
                                { value: "Numerical", label: "Numerical" },
                                { value: "Yes/No", label: "Yes/No" },
                              ]}
                              onChange={(value) => {
                                /* Metric changes will be handled in a future update */
                                toast.info("Changing metric type will be available in a future update");
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Owner</p>
                            <EditableSelect
                              value={kr.ownerId}
                              options={users.map(user => ({ value: user.id, label: user.name }))}
                              onChange={(value) => handleKeyResultOwnerChange(kr, value)}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <EditableSelect
                              value={kr.status}
                              options={[
                                { value: "Off Track", label: "Off Track" },
                                { value: "At Risk", label: "At Risk" },
                                { value: "On track", label: "On track" },
                                { value: "Completed", label: "Completed" },
                              ]}
                              onChange={(value) => handleKeyResultStatusChange(kr, value)}
                              valueClassName={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(kr.status))}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Confidence</p>
                            <p className="font-medium">{kr.confidenceLevel}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Start Value</p>
                            <EditableNumber
                              value={kr.startValue}
                              onChange={(value) => handleKeyResultValueChange(kr, 'startValue', value)}
                              suffix={kr.metric === 'Percentage' ? '%' : ''}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Current Value</p>
                            <EditableNumber
                              value={kr.currentValue}
                              onChange={(value) => handleKeyResultValueChange(kr, 'currentValue', value)}
                              suffix={kr.metric === 'Percentage' ? '%' : ''}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Target Value</p>
                            <EditableNumber
                              value={kr.targetValue}
                              onChange={(value) => handleKeyResultValueChange(kr, 'targetValue', value)}
                              suffix={kr.metric === 'Percentage' ? '%' : ''}
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
