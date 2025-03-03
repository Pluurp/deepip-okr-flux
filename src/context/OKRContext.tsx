
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Objective, DepartmentId } from '@/types';
import { getObjectivesByDepartment, departmentStats as initialDepartmentStats } from '@/data/okrData';
import { calculateObjectiveProgress, calculateTimeProgress, calculateDaysRemaining } from '@/utils/okrUtils';

type OKRContextType = {
  objectives: Record<DepartmentId, Objective[]>;
  departmentStats: typeof initialDepartmentStats;
  updateObjectives: (departmentId: DepartmentId, updatedObjectives: Objective[]) => void;
  getObjectivesForDepartment: (departmentId: DepartmentId) => Objective[];
  recalculateDepartmentStats: (departmentId: DepartmentId) => void;
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
  }, []);

  // Save to localStorage whenever objectives change
  useEffect(() => {
    localStorage.setItem('okr_objectives', JSON.stringify(objectives));
  }, [objectives]);

  // Save to localStorage whenever departmentStats change
  useEffect(() => {
    localStorage.setItem('okr_department_stats', JSON.stringify(departmentStats));
  }, [departmentStats]);

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

  const recalculateDepartmentStats = (departmentId: DepartmentId) => {
    const departmentObjectives = objectives[departmentId] || [];
    
    // Skip if no objectives
    if (departmentObjectives.length === 0) return;

    // Calculate overall progress from all objectives
    const overallProgress = Math.round(
      departmentObjectives.reduce((sum, obj) => sum + obj.progress, 0) / departmentObjectives.length
    );

    // Get dates from the first objective (or use defaults)
    const firstObjective = departmentObjectives[0];
    const startDate = firstObjective?.startDate || new Date().toISOString();
    const endDate = firstObjective?.endDate || new Date().toISOString();

    // Calculate time progress
    const timeProgress = calculateTimeProgress(startDate, endDate);
    
    // Calculate days remaining
    const daysRemaining = calculateDaysRemaining(endDate);
    
    // Calculate total days (approximate)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

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
        recalculateDepartmentStats
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
