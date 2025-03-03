
import { Objective, KeyResult, Status, ConfidenceLevel } from "@/types";

export const calculateObjectiveProgress = (keyResults: KeyResult[]): number => {
  if (keyResults.length === 0) return 0;
  
  const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
  return Math.round(totalProgress / keyResults.length);
};

export const calculateKeyResultProgress = (
  startValue: number,
  currentValue: number,
  targetValue: number
): number => {
  // Handle edge cases
  if (startValue === targetValue) return currentValue >= targetValue ? 100 : 0;
  
  // Calculate progress percentage
  const progress = ((currentValue - startValue) / (targetValue - startValue)) * 100;
  
  // Ensure progress is between 0 and 100
  return Math.min(Math.max(Math.round(progress), 0), 100);
};

export const statusOptions = [
  { value: "Off Track", label: "Off Track" },
  { value: "At Risk", label: "At Risk" },
  { value: "On track", label: "On track" },
  { value: "Completed", label: "Completed" }
];

export const confidenceLevelOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" }
];

export const metricOptions = [
  { value: "Percentage", label: "Percentage" },
  { value: "Numerical", label: "Numerical" },
  { value: "Yes/No", label: "Yes/No" }
];
