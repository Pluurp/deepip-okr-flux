import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
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

// Create a stable version of initial department stats
const stableInitialDepartmentStats = {
  leadership: { daysRemaining: 0, totalDays: 0, timeProgress: 0, overallProgress: 0 },
  product: { daysRemaining: 0, totalDays: 0, timeProgress: 0, overallProgress: 0 },
  ai: { daysRemaining: 0, totalDays: 0, timeProgress: 0, overallProgress: 0 },
  sales: { daysRemaining: 0, totalDays: 0, timeProgress: 0, overallProgress: 0 },
  growth: { daysRemaining: 0, totalDays: 0, timeProgress: 0, overallProgress: 0 },
};

export const OKRProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with data from okrData.ts
  const [objectives, setObjectives] = useState<Record<DepartmentId, Objective[]>>({
    leadership: getObjectivesByDepartment('leadership'),
    product: getObjectivesByDepartment('product'),
    ai: getObjectivesByDepartment('ai'),
    sales: getObjectivesByDepartment('sales'),
    growth: getObjectivesByDepartment('growth'),
  });

  const [departmentStats, setDepartmentStats] = useState({ ...stableInitialDepartmentStats });
  
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

  // Memoize getCurrentDate to prevent unnecessary rerenders
  const getCurrentDate = useCallback((): Date => {
    if (manualCurrentDate) {
      return new Date(manualCurrentDate);
    }
    return new Date();
  }, [manualCurrentDate]);

  // Force update counter to trigger rerenders when needed
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  
  // Force a rerender
  const forceUpdate = useCallback(() => {
    setForceUpdateCounter(prev => prev + 1);
  }, []);

  // Memoize recalculateDepartmentStats for performance and consistency
  const recalculateDepartmentStats = useCallback((departmentId: DepartmentId) => {
    const departmentObjectives = objectives[departmentId] || [];
    
    // If no objectives, set progress to 0
    let overallProgress = 0;
    
    if (departmentObjectives.length > 0) {
      // Calculate overall progress from all objectives
      overallProgress = Math.round(
        departmentObjectives.reduce((sum, obj) => sum + obj.progress, 0) / departmentObjectives.length
      );
    }

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

    // Use functional update to ensure we're working with latest state
    setDepartmentStats(prev => {
      return {
        ...prev,
        [departmentId]: {
          daysRemaining,
          totalDays,
          timeProgress: parseFloat(timeProgress.toFixed(1)),
          overallProgress
        }
      };
    });
  }, [objectives, globalStartDate, globalEndDate, getCurrentDate]);

  // Create a memoized refreshStats function
  const refreshStats = useCallback(() => {
    const departmentIds: DepartmentId[] = ['leadership', 'product', 'ai', 'sales', 'growth'];
    
    // Update each department's stats synchronously
    departmentIds.forEach(id => recalculateDepartmentStats(id));
    
    // Force a UI update to ensure changes are displayed
    forceUpdate();
  }, [recalculateDepartmentStats, forceUpdate]);

  // Update manual current date and force refresh
  const updateManualCurrentDate = useCallback((date: string | null) => {
    setManualCurrentDate(date);
    // Force an immediate refresh
    setForceUpdateCounter(prev => prev + 1);
  }, []);

  // Memoize the updateGlobalDates function
  const updateGlobalDates = useCallback((startDate: string, endDate: string) => {
    // Update global dates
    setGlobalStartDate(startDate);
    setGlobalEndDate(endDate);
    
    // Update all objectives with new dates
    setObjectives(prevObjectives => {
      const updatedObjectives: Record<DepartmentId, Objective[]> = {
        leadership: prevObjectives.leadership.map(obj => ({ ...obj, startDate, endDate })),
        product: prevObjectives.product.map(obj => ({ ...obj, startDate, endDate })),
        ai: prevObjectives.ai.map(obj => ({ ...obj, startDate, endDate })),
        sales: prevObjectives.sales.map(obj => ({ ...obj, startDate, endDate })),
        growth: prevObjectives.growth.map(obj => ({ ...obj, startDate, endDate })),
      };
      return updatedObjectives;
    });
    
    // Force an immediate refresh
    setForceUpdateCounter(prev => prev + 1);
  }, []);

  // Memoize updateCycle to prevent recreating it unnecessarily
  const updateCycle = useCallback((newCycle: string) => {
    setCycle(newCycle);
    
    // Update all objectives with new cycle
    setObjectives(prevObjectives => {
      const updatedObjectives: Record<DepartmentId, Objective[]> = {
        leadership: prevObjectives.leadership.map(obj => ({ ...obj, cycle: newCycle })),
        product: prevObjectives.product.map(obj => ({ ...obj, cycle: newCycle })),
        ai: prevObjectives.ai.map(obj => ({ ...obj, cycle: newCycle })),
        sales: prevObjectives.sales.map(obj => ({ ...obj, cycle: newCycle })),
        growth: prevObjectives.growth.map(obj => ({ ...obj, cycle: newCycle })),
      };
      return updatedObjectives;
    });
    
    // Force an immediate refresh
    setForceUpdateCounter(prev => prev + 1);
  }, []);
  
  // Memoize getObjectivesForDepartment to prevent unnecessary rerenders
  const getObjectivesForDepartment = useCallback((departmentId: DepartmentId): Objective[] => {
    return objectives[departmentId] || [];
  }, [objectives]);
  
  // Memoize updateObjectives to prevent unnecessary recreation
  const updateObjectives = useCallback((departmentId: DepartmentId, updatedObjectives: Objective[]) => {
    setObjectives(prev => {
      const newObjectives = {
        ...prev,
        [departmentId]: updatedObjectives
      };
      return newObjectives;
    });

    // Force an immediate refresh of department stats to immediately reflect changes
    // especially when objectives are deleted
    setTimeout(() => {
      recalculateDepartmentStats(departmentId);
      setForceUpdateCounter(prev => prev + 1);
    }, 0);
  }, [recalculateDepartmentStats]);

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
    
    // Force an initial stats refresh after loading
    setForceUpdateCounter(prev => prev + 1);
  }, []);
  
  // Make sure initial refresh happens in the component lifecycle
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Save to localStorage whenever objectives change
  useEffect(() => {
    localStorage.setItem('okr_objectives', JSON.stringify(objectives));
  }, [objectives]);

  // Save to localStorage whenever departmentStats change
  useEffect(() => {
    localStorage.setItem('okr_department_stats', JSON.stringify(departmentStats));
  }, [departmentStats]);
  
  // Save global dates to localStorage and refresh stats
  useEffect(() => {
    localStorage.setItem('okr_global_start_date', globalStartDate);
    localStorage.setItem('okr_global_end_date', globalEndDate);
    
    // Force a refresh of stats whenever global dates change
    refreshStats();
  }, [globalStartDate, globalEndDate, refreshStats]);
  
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
  }, [manualCurrentDate, refreshStats]);
  
  // Update department stats when force update counter changes
  useEffect(() => {
    if (forceUpdateCounter > 0) {
      const departmentIds: DepartmentId[] = ['leadership', 'product', 'ai', 'sales', 'growth'];
      departmentIds.forEach(id => recalculateDepartmentStats(id));
    }
  }, [forceUpdateCounter, recalculateDepartmentStats]);
  
  // Set up daily refresh
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshStats();
    }, 1000 * 60 * 60 * 24); // Once every 24 hours
    
    return () => clearInterval(refreshInterval);
  }, [refreshStats]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <OKRContext.Provider value={contextValue}>
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
