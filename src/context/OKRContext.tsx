
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Objective, DepartmentId } from '@/types';
import { getObjectivesByDepartment, departmentStats as initialDepartmentStats } from '@/data/okrData';
import { calculateObjectiveProgress, calculateTimeProgress, calculateDaysRemaining, calculateTotalDays } from '@/utils/okrUtils';

type OKRContextType = {
  objectives: Record<DepartmentId, Objective[]>;
  departmentStats: typeof initialDepartmentStats;
  updateObjectives: (departmentId: DepartmentId, updatedObjectives: Objective[]) => void;
  getObjectivesForDepartment: (departmentId: DepartmentId) => Objective[];
  recalculateDepartmentStats: (departmentId: DepartmentId) => void;
  globalStartDate: string;
  globalEndDate: string;
  updateGlobalDates: (startDate: string, endDate: string) => void;
  refreshStats: () => void;
  cycle: string;
  updateCycle: (newCycle: string) => void;
  manualCurrentDate: string | null;
  updateManualCurrentDate: (date: string | null) => void;
  getCurrentDate: () => Date;
};

const OKRContext = createContext<OKRContextType | undefined>(undefined);

export const OKRProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with data from okrData.ts
  const [objectives, setObjectives] = useState<Record<DepartmentId, Objective[]>>({
    leadership: getObjectivesByDepartment('leadership'),
    product: getObjectivesByDepartment('product'),
    ai: getObjectivesByDepartment('ai'),
    sales: getObjectivesByDepartment('sales'),
    growth: getObjectivesByDepartment('growth'),
  });

  const [departmentStats, setDepartmentStats] = useState(initialDepartmentStats);
  
  // Set up global cycle (for all departments)
  const [cycle, setCycle] = useState<string>("Q1");
  
  // Set up global dates (for all departments)
  const [globalStartDate, setGlobalStartDate] = useState<string>(() => {
    // Default to current date if no objectives exist
    const allObjectives = Object.values(objectives).flat();
    return allObjectives.length > 0 
      ? allObjectives[0].startDate 
      : new Date().toISOString();
  });
  
  const [globalEndDate, setGlobalEndDate] = useState<string>(() => {
    // Default to 3 months from now if no objectives exist
    const allObjectives = Object.values(objectives).flat();
    if (allObjectives.length > 0) {
      return allObjectives[0].endDate;
    } else {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      return endDate.toISOString();
    }
  });

  // Add manual current date state
  const [manualCurrentDate, setManualCurrentDate] = useState<string | null>(null);

  // Function to get the current date (manual or system)
  const getCurrentDate = (): Date => {
    if (manualCurrentDate) {
      return new Date(manualCurrentDate);
    }
    return new Date();
  };

  // Update manual current date and force refresh
  const updateManualCurrentDate = (date: string | null) => {
    setManualCurrentDate(date);
    // Force an immediate refresh after setting the date
    setTimeout(() => refreshStats(), 0);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedObjectives = localStorage.getItem('okr_objectives');
    if (savedObjectives) {
      try {
        const parsedObjectives = JSON.parse(savedObjectives);
        
        // Ensure all required department IDs exist
        const initializedObjectives: Record<DepartmentId, Objective[]> = {
          leadership: parsedObjectives.leadership || [],
          product: parsedObjectives.product || [],
          ai: parsedObjectives.ai || [],
          sales: parsedObjectives.sales || [],
          growth: parsedObjectives.growth || [],
        };
        
        setObjectives(initializedObjectives);
      } catch (e) {
        console.error('Failed to parse saved objectives', e);
      }
    }

    const savedStats = localStorage.getItem('okr_department_stats');
    if (savedStats) {
      try {
        setDepartmentStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse saved department stats', e);
      }
    }
    
    const savedGlobalStartDate = localStorage.getItem('okr_global_start_date');
    if (savedGlobalStartDate) {
      setGlobalStartDate(savedGlobalStartDate);
    }
    
    const savedGlobalEndDate = localStorage.getItem('okr_global_end_date');
    if (savedGlobalEndDate) {
      setGlobalEndDate(savedGlobalEndDate);
    }
    
    const savedCycle = localStorage.getItem('okr_cycle');
    if (savedCycle) {
      setCycle(savedCycle);
    }
    
    const savedManualCurrentDate = localStorage.getItem('okr_manual_current_date');
    if (savedManualCurrentDate) {
      setManualCurrentDate(savedManualCurrentDate);
    }
  }, []);

  // Save to localStorage whenever objectives change
  useEffect(() => {
    localStorage.setItem('okr_objectives', JSON.stringify(objectives));
  }, [objectives]);

  // Save to localStorage whenever departmentStats change
  useEffect(() => {
    localStorage.setItem('okr_department_stats', JSON.stringify(departmentStats));
  }, [departmentStats]);
  
  // Save global dates to localStorage
  useEffect(() => {
    localStorage.setItem('okr_global_start_date', globalStartDate);
    localStorage.setItem('okr_global_end_date', globalEndDate);
    
    // Force a refresh of stats whenever global dates change
    refreshStats();
  }, [globalStartDate, globalEndDate]);
  
  // Save cycle to localStorage
  useEffect(() => {
    localStorage.setItem('okr_cycle', cycle);
  }, [cycle]);
  
  // Save manual current date to localStorage
  useEffect(() => {
    if (manualCurrentDate) {
      localStorage.setItem('okr_manual_current_date', manualCurrentDate);
    } else {
      localStorage.removeItem('okr_manual_current_date');
    }
    
    // Trigger a refresh when manual date changes
    refreshStats();
  }, [manualCurrentDate]);
  
  // Set up daily refresh
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshStats();
    }, 1000 * 60 * 60 * 24); // Once every 24 hours
    
    return () => clearInterval(refreshInterval);
  }, []);

  const updateObjectives = (departmentId: DepartmentId, updatedObjectives: Objective[]) => {
    setObjectives(prev => ({
      ...prev,
      [departmentId]: updatedObjectives
    }));

    // Recalculate department stats immediately
    recalculateDepartmentStats(departmentId);
  };

  const getObjectivesForDepartment = (departmentId: DepartmentId): Objective[] => {
    return objectives[departmentId] || [];
  };
  
  const updateGlobalDates = (startDate: string, endDate: string) => {
    setGlobalStartDate(startDate);
    setGlobalEndDate(endDate);
    
    // Update all objectives with new dates
    const updatedObjectives: Record<DepartmentId, Objective[]> = {
      leadership: objectives.leadership.map(obj => ({ ...obj, startDate, endDate })),
      product: objectives.product.map(obj => ({ ...obj, startDate, endDate })),
      ai: objectives.ai.map(obj => ({ ...obj, startDate, endDate })),
      sales: objectives.sales.map(obj => ({ ...obj, startDate, endDate })),
      growth: objectives.growth.map(obj => ({ ...obj, startDate, endDate })),
    };
    
    setObjectives(updatedObjectives);
    
    // Recalculate stats for all departments (will be triggered by the above useEffect)
  };
  
  const updateCycle = (newCycle: string) => {
    setCycle(newCycle);
    
    // Update all objectives with new cycle
    const updatedObjectives: Record<DepartmentId, Objective[]> = {
      leadership: objectives.leadership.map(obj => ({ ...obj, cycle: newCycle })),
      product: objectives.product.map(obj => ({ ...obj, cycle: newCycle })),
      ai: objectives.ai.map(obj => ({ ...obj, cycle: newCycle })),
      sales: objectives.sales.map(obj => ({ ...obj, cycle: newCycle })),
      growth: objectives.growth.map(obj => ({ ...obj, cycle: newCycle })),
    };
    
    setObjectives(updatedObjectives);
  };
  
  const refreshStats = () => {
    const departmentIds: DepartmentId[] = ['leadership', 'product', 'ai', 'sales', 'growth'];
    departmentIds.forEach(id => recalculateDepartmentStats(id));
  };

  const recalculateDepartmentStats = (departmentId: DepartmentId) => {
    const departmentObjectives = objectives[departmentId] || [];
    
    // Skip if no objectives
    if (departmentObjectives.length === 0) return;

    // Calculate overall progress from all objectives
    const overallProgress = Math.round(
      departmentObjectives.reduce((sum, obj) => sum + obj.progress, 0) / departmentObjectives.length
    );

    // Use the global dates for all time-based calculations
    const startDate = globalStartDate;
    const endDate = globalEndDate;

    // Get the current date (manual or system)
    const currentDate = getCurrentDate();

    // Calculate time progress using the current date and fixed function
    const timeProgress = calculateTimeProgress(startDate, endDate, currentDate);
    
    // Calculate days remaining using fixed function
    const daysRemaining = calculateDaysRemaining(endDate, currentDate);
    
    // Calculate total days including both start and end dates
    const totalDays = calculateTotalDays(startDate, endDate);

    // Update state directly with the latest calculated values
    setDepartmentStats(prev => ({
      ...prev,
      [departmentId]: {
        daysRemaining,
        totalDays,
        timeProgress: parseFloat(timeProgress.toFixed(1)),
        overallProgress
      }
    }));
  };

  return (
    <OKRContext.Provider 
      value={{ 
        objectives,
        departmentStats,
        updateObjectives,
        getObjectivesForDepartment,
        recalculateDepartmentStats,
        globalStartDate,
        globalEndDate,
        updateGlobalDates,
        refreshStats,
        cycle,
        updateCycle,
        manualCurrentDate,
        updateManualCurrentDate,
        getCurrentDate
      }}
    >
      {children}
    </OKRContext.Provider>
  );
};

export const useOKR = () => {
  const context = useContext(OKRContext);
  if (context === undefined) {
    throw new Error('useOKR must be used within an OKRProvider');
  }
  return context;
};
