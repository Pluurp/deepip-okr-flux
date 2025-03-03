
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Save } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useOKR } from "@/context/OKRContext";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const { 
    globalStartDate, 
    globalEndDate, 
    updateGlobalDates,
    cycle,
    updateCycle
  } = useOKR();
  
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(globalStartDate));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(globalEndDate));
  const [selectedCycle, setSelectedCycle] = useState(cycle);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    document.title = "Settings | DeepIP OKRs";
  }, []);
  
  useEffect(() => {
    setStartDate(new Date(globalStartDate));
    setEndDate(new Date(globalEndDate));
    setSelectedCycle(cycle);
    setHasChanges(false);
  }, [globalStartDate, globalEndDate, cycle]);
  
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Ensure start date isn't after end date
    if (endDate && date > endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }
    
    setStartDate(date);
    setHasChanges(true);
  };
  
  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Ensure end date isn't before start date
    if (startDate && date < startDate) {
      toast.error("End date cannot be before start date");
      return;
    }
    
    setEndDate(date);
    setHasChanges(true);
  };
  
  const handleCycleChange = (value: string) => {
    setSelectedCycle(value);
    setHasChanges(true);
  };
  
  const handleSaveChanges = () => {
    if (!startDate || !endDate) {
      toast.error("Start and end dates are required");
      return;
    }
    
    updateGlobalDates(startDate.toISOString(), endDate.toISOString());
    updateCycle(selectedCycle);
    
    toast.success("Settings updated successfully");
    setHasChanges(false);
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date";
    return format(date, "MMMM d, yyyy");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-gray-500 mt-1">Manage OKR cycle and dates</p>
          </div>
          
          {hasChanges && (
            <Button 
              className="bg-deepip-primary text-white hover:bg-deepip-primary/90 flex items-center gap-1" 
              onClick={handleSaveChanges}
            >
              <Save size={16} />
              Save Changes
            </Button>
          )}
        </div>

        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              <span>OKR Timeline Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Current Cycle</p>
                <Select value={selectedCycle} onValueChange={handleCycleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1">Q1</SelectItem>
                    <SelectItem value="Q2">Q2</SelectItem>
                    <SelectItem value="Q3">Q3</SelectItem>
                    <SelectItem value="Q4">Q4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Start Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(startDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">End Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(endDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-md font-medium mb-4">Current Settings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border shadow-sm">
                  <p className="text-sm text-gray-500">Current Cycle</p>
                  <p className="text-xl font-medium">{cycle}</p>
                </Card>
                <Card className="p-4 border shadow-sm">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-xl font-medium">{format(new Date(globalStartDate), "MMM d, yyyy")}</p>
                </Card>
                <Card className="p-4 border shadow-sm">
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-xl font-medium">{format(new Date(globalEndDate), "MMM d, yyyy")}</p>
                </Card>
                <Card className="p-4 border shadow-sm">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-xl font-medium text-green-600 flex items-center">
                    <Check size={18} className="mr-1" />
                    Active
                  </p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
