
export type DepartmentId = 
  | "leadership"
  | "product"
  | "ai"
  | "sales"
  | "growth";

export type Department = {
  id: DepartmentId;
  name: string;
  color: string;
};

export type Role = 
  | "Co-founder & CEO"
  | "Co-founder & CTO"
  | "Chief of Staff"
  | "People Manager"
  | "Founder Associate"
  | "Senior Tech Lead"
  | "Senior Full Stack Engineer"
  | "Full Stack Engineer"
  | "Squad Leader"
  | "Product Manager"
  | "Machine Learning Engineer"
  | "AI Engineer"
  | "Sales Development Representative"
  | "Sales Consultant"
  | "Account Executive"
  | "1st Enterprise Account Executive"
  | "IP Strategist"
  | "Head of Growth";

export type User = {
  id: string;
  name: string;
  role: Role;
  departmentId: DepartmentId;
  email: string;
  avatar?: string;
};

export type Status = 
  | "Off Track"
  | "At Risk"
  | "On track"
  | "Completed";

export type ConfidenceLevel = 
  | "Low"
  | "Medium"
  | "High";

export type KeyResult = {
  id: string;
  title: string;
  objectiveId: string;
  metric: "Percentage" | "Numerical" | "Yes/No";
  startValue: number;
  targetValue: number;
  currentValue: number;
  progress: number;
  ownerId: string;
  status: Status;
  confidenceLevel: ConfidenceLevel;
  deadline?: string; // ISO date string
  alignedProjects?: string[];
  comments?: string;
};

export type Objective = {
  id: string;
  title: string;
  departmentId: DepartmentId;
  progress: number;
  keyResults: KeyResult[];
  cycle: string; // e.g., "Q1", "Q2"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  ownerId: string;
};

// New types for Company OKRs
export type CompanyKeyResult = {
  id: string;
  title: string;
  objectiveId: string;
};

export type CompanyObjective = {
  id: string;
  title: string;
  keyResults: CompanyKeyResult[];
  cycle: string; // e.g., "Q1", "Q2"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  ownerId: string;
};

export type DepartmentStats = {
  daysRemaining: number;
  totalDays: number;
  timeProgress: number;
  overallProgress: number;
};

export type OKRCycle = {
  id: string;
  name: string; // e.g., "Q1 2025"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  active: boolean;
};
