
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOKR } from "@/context/OKRContext";
import { CompanyObjective, CompanyKeyResult } from "@/types";
import { Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import EditableText from "@/components/EditableText";
import { Link } from "react-router-dom";

const Company = () => {
  const { 
    companyObjectives, 
    updateCompanyObjectives,
    cycle,
    globalStartDate,
    globalEndDate
  } = useOKR();

  const [expandedObjectives, setExpandedObjectives] = useState<Record<string, boolean>>({});

  // Initialize expanded state for all objectives
  useEffect(() => {
    const expanded: Record<string, boolean> = {};
    companyObjectives.forEach(obj => {
      expanded[obj.id] = true; // Default to expanded
    });
    setExpandedObjectives(expanded);
  }, [companyObjectives]);

  // Toggle the expanded state for an objective
  const toggleObjectiveExpanded = (objectiveId: string) => {
    setExpandedObjectives(prev => ({
      ...prev,
      [objectiveId]: !prev[objectiveId]
    }));
  };

  // Add a new company objective
  const handleAddObjective = () => {
    const newObjective: CompanyObjective = {
      id: `comp-obj-${Date.now()}`,
      title: "New Company Objective",
      keyResults: [],
      cycle: cycle,
      startDate: globalStartDate,
      endDate: globalEndDate,
      ownerId: "user1" // Default owner
    };

    const updatedObjectives = [...companyObjectives, newObjective];
    updateCompanyObjectives(updatedObjectives);
    
    // Expand the new objective
    setExpandedObjectives(prev => ({
      ...prev,
      [newObjective.id]: true
    }));
    
    toast.success("New company objective added");
  };

  // Delete a company objective
  const handleDeleteObjective = (objectiveId: string) => {
    const updatedObjectives = companyObjectives.filter(obj => obj.id !== objectiveId);
    updateCompanyObjectives(updatedObjectives);
    toast.success("Company objective deleted");
  };

  // Update objective title
  const handleUpdateObjectiveTitle = (objectiveId: string, newTitle: string) => {
    const updatedObjectives = companyObjectives.map(obj => 
      obj.id === objectiveId ? { ...obj, title: newTitle } : obj
    );
    updateCompanyObjectives(updatedObjectives);
  };

  // Add a new key result to an objective
  const handleAddKeyResult = (objectiveId: string) => {
    const newKeyResult: CompanyKeyResult = {
      id: `comp-kr-${Date.now()}`,
      title: "New Key Result",
      objectiveId
    };

    const updatedObjectives = companyObjectives.map(obj => 
      obj.id === objectiveId 
        ? { ...obj, keyResults: [...obj.keyResults, newKeyResult] } 
        : obj
    );
    
    updateCompanyObjectives(updatedObjectives);
    toast.success("New key result added");
  };

  // Delete a key result
  const handleDeleteKeyResult = (objectiveId: string, keyResultId: string) => {
    const updatedObjectives = companyObjectives.map(obj => 
      obj.id === objectiveId 
        ? { 
            ...obj, 
            keyResults: obj.keyResults.filter(kr => kr.id !== keyResultId) 
          } 
        : obj
    );
    
    updateCompanyObjectives(updatedObjectives);
    toast.success("Key result deleted");
  };

  // Update key result title
  const handleUpdateKeyResultTitle = (objectiveId: string, keyResultId: string, newTitle: string) => {
    const updatedObjectives = companyObjectives.map(obj => 
      obj.id === objectiveId 
        ? { 
            ...obj, 
            keyResults: obj.keyResults.map(kr => 
              kr.id === keyResultId ? { ...kr, title: newTitle } : kr
            ) 
          } 
        : obj
    );
    
    updateCompanyObjectives(updatedObjectives);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Company OKRs</h1>
            <p className="text-gray-500 mt-1">Manage company-wide objectives and key results</p>
          </div>
          
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              Back to Dashboard
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>

        <Card className="mb-6 border-0 overflow-hidden shadow-sm">
          <div className="h-1.5 bg-deepip-primary"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Company Objectives</h2>
              <Button 
                onClick={handleAddObjective}
                size="sm"
                className="bg-deepip-primary text-white hover:bg-deepip-primary/90 flex items-center gap-1"
              >
                <Plus size={16} />
                Add Company Objective
              </Button>
            </div>

            {companyObjectives.length > 0 ? (
              <div className="space-y-6">
                {companyObjectives.map((objective) => (
                  <Card key={objective.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <button 
                              onClick={() => toggleObjectiveExpanded(objective.id)}
                              className="p-1 rounded-full hover:bg-gray-100 mr-2"
                            >
                              {expandedObjectives[objective.id] ? (
                                <ChevronDown size={18} />
                              ) : (
                                <ChevronRight size={18} />
                              )}
                            </button>
                            <EditableText 
                              value={objective.title}
                              onChange={(value) => handleUpdateObjectiveTitle(objective.id, value)}
                              className="text-lg font-semibold flex-1"
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {objective.keyResults.length} Key Results • {cycle} 2025
                          </p>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteObjective(objective.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {expandedObjectives[objective.id] && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium">Key Results</h3>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleAddKeyResult(objective.id)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add Key Result
                            </Button>
                          </div>
                          
                          {objective.keyResults.length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {objective.keyResults.map((keyResult) => (
                                <div 
                                  key={keyResult.id} 
                                  className="flex items-center justify-between p-2 rounded-md border bg-gray-50"
                                >
                                  <EditableText 
                                    value={keyResult.title}
                                    onChange={(value) => 
                                      handleUpdateKeyResultTitle(objective.id, keyResult.id, value)
                                    }
                                    className="flex-1 text-sm"
                                  />
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteKeyResult(objective.id, keyResult.id)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 border border-dashed rounded-md">
                              <p className="text-sm text-gray-500 mb-2">No key results defined</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddKeyResult(objective.id)}
                              >
                                <Plus size={14} className="mr-1" />
                                Add Key Result
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border border-dashed rounded-md">
                <p className="text-gray-500 mb-2">No company objectives defined</p>
                <Button 
                  variant="outline" 
                  onClick={handleAddObjective}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Company Objective
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Company;
