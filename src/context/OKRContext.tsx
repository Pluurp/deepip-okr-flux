
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

  // Load from localStorage on mount
  useEffect(() => {
    const savedObjectives = localStorage.getItem('okr_objectives');
    if (savedObjectives) {
      try {
        setObjectives(JSON.parse(savedObjectives));
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
  }, [globalStartDate, globalEndDate]);
  
  // Automatically refresh stats once per day
  useEffect(() => {
    // Recalculate all department stats on initial load
    const departmentIds: DepartmentId[] = ['leadership', 'product', 'ai', 'sales', 'growth'];
    departmentIds.forEach(id => recalculateDepartmentStats(id));
    
    // Set up daily refresh
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

    // Recalculate department stats when objectives change
    recalculateDepartmentStats(departmentId);
  };

  const getObjectivesForDepartment = (departmentId: DepartmentId): Objective[] => {
    return objectives[departmentId] || [];
  };
  
  const updateGlobalDates = (startDate: string, endDate: string) => {
    setGlobalStartDate(startDate);
    setGlobalEndDate(endDate);
    
    // Update all objectives with new dates
    const updatedObjectives: Record<DepartmentId, Objective[]> = {};
    
    Object.entries(objectives).forEach(([deptId, deptObjectives]) => {
      const departmentId = deptId as DepartmentId;
      updatedObjectives[departmentId] = deptObjectives.map(obj => ({
        ...obj,
        startDate,
        endDate
      }));
    });
    
    setObjectives(updatedObjectives);
    
    // Recalculate stats for all departments
    refreshStats();
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

    // Calculate time progress
    const timeProgress = calculateTimeProgress(startDate, endDate);
    
    // Calculate days remaining
    const daysRemaining = calculateDaysRemaining(endDate);
    
    // Calculate total days
    const totalDays = calculateTotalDays(startDate, endDate);

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
        refreshStats
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
