
import { KeyResult, Objective } from "@/types";

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
export const createNewObjective = (departmentId: string, ownerId: string): Objective => {
  const objectiveId = `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  return {
    id: objectiveId,
    title: "New Objective",
    departmentId,
    progress: 0,
    keyResults: [
      createNewKeyResult(objectiveId, ownerId)
    ],
    cycle: "Q1",
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    ownerId
  };
};
