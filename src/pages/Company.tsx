import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyObjective } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CompanyObjectiveList from "@/components/CompanyObjectiveList";
import { createNewCompanyObjective, loadCompanyObjectives, saveCompanyObjectives } from "@/utils/companyOkrUtils";
import { toast } from "sonner";
import { useOKR } from "@/context/OKRContext";

const Company = () => {
  const [companyObjectives, setCompanyObjectives] = useState<CompanyObjective[]>([]);
  const { globalStartDate, globalEndDate, cycle } = useOKR();

  // Load company objectives when component mounts
  useEffect(() => {
    document.title = "Company OKRs | DeepIP";
    setCompanyObjectives(loadCompanyObjectives());
    
    // Listen for storage events to keep the UI in sync across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'company_objectives') {
        try {
          if (event.newValue) {
            setCompanyObjectives(JSON.parse(event.newValue));
          }
        } catch (e) {
          console.error('Failed to parse company objectives from storage event', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save company objectives when they change
  useEffect(() => {
    if (companyObjectives.length > 0) {
      saveCompanyObjectives(companyObjectives);
    }
  }, [companyObjectives]);

  const handleAddObjective = () => {
    const newObjective = createNewCompanyObjective();
    setCompanyObjectives([...companyObjectives, newObjective]);
    saveCompanyObjectives([...companyObjectives, newObjective]);
    toast.success("New company objective added");
  };

  const handleUpdateObjectives = (updatedObjectives: CompanyObjective[]) => {
    setCompanyObjectives(updatedObjectives);
    saveCompanyObjectives(updatedObjectives);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Company OKRs</h1>
            <p className="text-gray-500 mt-1">Manage company-wide objectives and key results</p>
          </div>
          
          <Card className="p-2 px-4 bg-white shadow-sm border">
            <span className="text-sm font-medium text-deepip-primary">{cycle} 2025</span>
          </Card>
        </div>

        <Card className="mb-8 overflow-hidden border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cycle</p>
                <p className="font-medium">{cycle} 2025</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{formatDate(globalStartDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{formatDate(globalEndDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Company Objectives & Key Results</h2>
          <Button 
            onClick={handleAddObjective}
            className="bg-deepip-primary text-white hover:bg-deepip-primary/90 flex items-center gap-1"
          >
            <Plus size={16} />
            Add Company Objective
          </Button>
        </div>

        {companyObjectives.length > 0 ? (
          <CompanyObjectiveList 
            objectives={companyObjectives} 
            onUpdate={handleUpdateObjectives}
          />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No company objectives defined yet</p>
            <Button 
              onClick={handleAddObjective}
              className="bg-deepip-primary text-white hover:bg-deepip-primary/90 flex items-center gap-1"
            >
              <Plus size={16} />
              Add Your First Company Objective
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Company;
