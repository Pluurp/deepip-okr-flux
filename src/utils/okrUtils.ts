import { KeyResult, Objective, DepartmentId, Status } from "@/types";

/**
 * Calculate progress percentage based on start, target and current values
 */
export const calculateProgress = (start: number, target: number, current: number): number => {
  // Avoid division by zero
  if (target === start) return current >= target ? 100 : 0;
  
  // Calculate progress percentage
  const totalChange = target - start;
  const currentChange = current - start;
  const progressPercentage = (currentChange / totalChange) * 100;
  
  // Clamp between 0 and 100
  return Math.min(Math.max(Math.round(progressPercentage), 0), 100);
};

/**
 * Calculate objective progress based on its key results
 */
export const calculateObjectiveProgress = (keyResults: KeyResult[]): number => {
  if (keyResults.length === 0) return 0;
  
  const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
  return Math.round(totalProgress / keyResults.length);
};

/**
 * Determine status based on progress percentage
 */
export const getStatusFromProgress = (progress: number): Status => {
  if (progress >= 100) return "Completed";
  if (progress >= 80) return "On track";
  if (progress >= 50) return "At Risk";
  return "Off Track";
};

/**
 * Calculate time progress based on start and end dates
 * FIXED: Now properly includes both start and end dates in the range
 */
export const calculateTimeProgress = (startDate: string, endDate: string, currentDate: Date = new Date()): number => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const now = new Date(currentDate);
  now.setHours(12, 0, 0, 0);
  
  // Calculate total milliseconds (inclusive of both start and end dates)
  const totalMs = end.getTime() - start.getTime() + 1;
  const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
  
  // Days passed (if today is start date, this should be 0)
  if (now.getTime() <= start.getTime()) {
    return 0;
  }
  
  // If we're past the end date, return 100%
  if (now.getTime() >= end.getTime()) {
    return 100;
  }
  
  // Calculate milliseconds passed since start date
  const elapsedMs = now.getTime() - start.getTime();
  const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  
  // Calculate percentage of time passed (daysPassed / totalDays)
  const progress = (daysPassed / totalDays) * 100;
  
  // Return with 1 decimal place, clamped between 0 and 100
  return Math.min(Math.max(parseFloat(progress.toFixed(1)), 0), 100);
};

/**
 * Calculate days remaining until end date
 * FIXED: Now includes the end date in the calculation
 */
export const calculateDaysRemaining = (endDate: string, currentDate: Date = new Date()): number => {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const now = new Date(currentDate);
  now.setHours(0, 0, 0, 0);
  
  // Calculate days remaining including the end date itself
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / msPerDay);
  
  // Return at least 1 if we're on the end date, 0 if we're past it
  return Math.max(daysRemaining, 0);
};

/**
 * Calculate total days between start and end date (inclusive)
 * FIXED: Now correctly includes both the start and end dates
 */
export const calculateTotalDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  // Calculate total days including both start and end dates
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((end.getTime() - start.getTime()) / msPerDay) + 1;
};

/**
 * Format display value based on metric type
 */
export const formatMetricValue = (value: number, metric: string): string => {
  switch (metric) {
    case "Percentage":
      return `${value}%`;
    case "Numerical":
      return `${value}`;
    case "Yes/No":
      return value >= 100 ? "Yes" : "No";
    default:
      return `${value}`;
  }
};

/**
 * Get metric display for a key result based on its progress
 */
export const getMetricDisplay = (keyResult: KeyResult): string => {
  const { metric, progress, currentValue } = keyResult;
  
  switch (metric) {
    case "Percentage":
      return `${progress}%`;
    case "Numerical":
      return `${currentValue}`;
    case "Yes/No":
      return progress >= 100 ? "Yes" : "No";
    default:
      return `${progress}%`;
  }
};

/**
 * Creates a new key result with default values
 */
export const createNewKeyResult = (objectiveId: string, ownerId: string): KeyResult => {
  return {
    id: `kr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: "New Key Result",
    objectiveId,
    metric: "Percentage",
    startValue: 0,
    targetValue: 100,
    currentValue: 0,
    progress: 0,
    ownerId,
    status: "On track",
    confidenceLevel: "Medium"
  };
};

/**
 * Creates a new objective with default values
 */
export const createNewObjective = (departmentId: DepartmentId, ownerId: string): Objective => {
  const objectiveId = `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Calculate default dates (current quarter)
  const now = new Date();
  const startDate = now.toISOString();
  
  // End date is 3 months from now
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 3);
  
  return {
    id: objectiveId,
    title: "New Objective",
    departmentId,
    progress: 0,
    keyResults: [
      createNewKeyResult(objectiveId, ownerId)
    ],
    cycle: "Q1",
    startDate: startDate,
    endDate: endDate.toISOString(),
    ownerId
  };
};
