
import { Objective, OKRCycle, User, DepartmentStats, DepartmentId, KeyResult, Status, ConfidenceLevel } from "@/types";
import { create } from "zustand";

// Initial data - users
export const users: User[] = [
  {
    id: "user1",
    name: "Emma Chen",
    role: "Co-founder & CEO",
    departmentId: "leadership",
    email: "emma@deepip.ai",
    avatar: "/placeholder.svg",
  },
  {
    id: "user2",
    name: "Alex Roberts",
    role: "Co-founder & CTO",
    departmentId: "leadership",
    email: "alex@deepip.ai",
    avatar: "/placeholder.svg",
  },
  {
    id: "user3",
    name: "Maya Patel",
    role: "Chief of Staff",
    departmentId: "leadership",
    email: "maya@deepip.ai",
    avatar: "/placeholder.svg",
  },
  {
    id: "user4",
    name: "Julian Kim",
    role: "Senior Tech Lead",
    departmentId: "product",
    email: "julian@deepip.ai",
    avatar: "/placeholder.svg",
  },
  {
    id: "user5",
    name: "Sophia Morgan",
    role: "Machine Learning Engineer",
    departmentId: "ai",
    email: "sophia@deepip.ai",
    avatar: "/placeholder.svg",
  },
  {
    id: "user6",
    name: "Liam Johnson",
    role: "Account Executive",
    departmentId: "sales",
    email: "liam@deepip.ai",
    avatar: "/placeholder.svg",
  },
  {
    id: "user7",
    name: "Olivia Davis",
    role: "Head of Growth",
    departmentId: "growth",
    email: "olivia@deepip.ai",
    avatar: "/placeholder.svg",
  },
];

// Initial data - cycles
export const cycles: OKRCycle[] = [
  {
    id: "cycle1",
    name: "Q1 2025",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    active: true,
  },
  {
    id: "cycle2",
    name: "Q2 2025",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    active: false,
  },
];

// Initial data - objectives
const initialObjectives: Objective[] = [
  // Leadership & Strategy Objectives
  {
    id: "obj1",
    title: "Company Objective 1",
    departmentId: "leadership",
    progress: 60,
    cycle: "Q1",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    ownerId: "user1",
    keyResults: [
      {
        id: "kr1",
        title: "Key Result 1",
        objectiveId: "obj1",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 20,
        progress: 20,
        ownerId: "user1",
        status: "Off Track",
        confidenceLevel: "Medium",
      },
      {
        id: "kr2",
        title: "Key Result 2",
        objectiveId: "obj1",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 40,
        progress: 40,
        ownerId: "user2",
        status: "At Risk",
        confidenceLevel: "Medium",
      },
      {
        id: "kr3",
        title: "Key Result 3",
        objectiveId: "obj1",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 60,
        progress: 60,
        ownerId: "user3",
        status: "On track",
        confidenceLevel: "High",
      },
      {
        id: "kr4",
        title: "Key Result 4",
        objectiveId: "obj1",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 80,
        progress: 80,
        ownerId: "user1",
        status: "On track",
        confidenceLevel: "High",
      },
      {
        id: "kr5",
        title: "Key Result 5",
        objectiveId: "obj1",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 100,
        progress: 100,
        ownerId: "user2",
        status: "Completed",
        confidenceLevel: "High",
      },
    ],
  },
  {
    id: "obj2",
    title: "Company Objective 2",
    departmentId: "leadership",
    progress: 60,
    cycle: "Q1",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    ownerId: "user2",
    keyResults: [
      {
        id: "kr6",
        title: "Key Result 1",
        objectiveId: "obj2",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 20,
        progress: 20,
        ownerId: "user2",
        status: "Off Track",
        confidenceLevel: "Medium",
      },
      {
        id: "kr7",
        title: "Key Result 2",
        objectiveId: "obj2",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 40,
        progress: 40,
        ownerId: "user3",
        status: "At Risk",
        confidenceLevel: "Medium",
      },
      {
        id: "kr8",
        title: "Key Result 3",
        objectiveId: "obj2",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 60,
        progress: 60,
        ownerId: "user1",
        status: "On track",
        confidenceLevel: "High",
      },
      {
        id: "kr9",
        title: "Key Result 4",
        objectiveId: "obj2",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 80,
        progress: 80,
        ownerId: "user2",
        status: "On track",
        confidenceLevel: "High",
      },
      {
        id: "kr10",
        title: "Key Result 5",
        objectiveId: "obj2",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 100,
        progress: 100,
        ownerId: "user3",
        status: "Completed",
        confidenceLevel: "High",
      },
    ],
  },
  // Product & Technology Objectives
  {
    id: "obj3",
    title: "Product & Technology Objective 1",
    departmentId: "product",
    progress: 73,
    cycle: "Q2",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    ownerId: "user4",
    keyResults: [
      {
        id: "kr11",
        title: "Test 1",
        objectiveId: "obj3",
        metric: "Percentage",
        startValue: 20,
        targetValue: 80,
        currentValue: 29,
        progress: 15,
        ownerId: "user4",
        status: "Off Track",
        confidenceLevel: "Low",
      },
      {
        id: "kr12",
        title: "Test 2",
        objectiveId: "obj3",
        metric: "Numerical",
        startValue: 0,
        targetValue: 100,
        currentValue: 70,
        progress: 70,
        ownerId: "user4",
        status: "On track",
        confidenceLevel: "Medium",
      },
    ],
  },
  // AI & Machine Learning Objectives
  {
    id: "obj4",
    title: "AI & Machine Learning Objective 1",
    departmentId: "ai",
    progress: 60,
    cycle: "Q1",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    ownerId: "user5",
    keyResults: [
      {
        id: "kr13",
        title: "Key Result 1",
        objectiveId: "obj4",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 60,
        progress: 60,
        ownerId: "user5",
        status: "On track",
        confidenceLevel: "High",
      },
    ],
  },
  // Sales & Customer Success Objectives
  {
    id: "obj5",
    title: "Sales & Customer Success Objective 1",
    departmentId: "sales",
    progress: 60,
    cycle: "Q1",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    ownerId: "user6",
    keyResults: [
      {
        id: "kr14",
        title: "Key Result 1",
        objectiveId: "obj5",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 60,
        progress: 60,
        ownerId: "user6",
        status: "On track",
        confidenceLevel: "Medium",
      },
    ],
  },
  // Growth & Marketing Objectives
  {
    id: "obj6",
    title: "Growth & Marketing Objective 1",
    departmentId: "growth",
    progress: 60,
    cycle: "Q1",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    ownerId: "user7",
    keyResults: [
      {
        id: "kr15",
        title: "Key Result 1",
        objectiveId: "obj6",
        metric: "Percentage",
        startValue: 0,
        targetValue: 100,
        currentValue: 60,
        progress: 60,
        ownerId: "user7",
        status: "On track",
        confidenceLevel: "High",
      },
    ],
  },
];

// Helper function to calculate KR progress
const calculateKeyResultProgress = (kr: KeyResult): number => {
  if (kr.metric === "Yes/No") {
    return kr.currentValue > 0 ? 100 : 0;
  }
  
  const range = kr.targetValue - kr.startValue;
  if (range === 0) return 100;
  
  const current = kr.currentValue - kr.startValue;
  const progress = Math.round((current / range) * 100);
  
  return Math.max(0, Math.min(100, progress));
};

// Helper function to calculate objective progress
const calculateObjectiveProgress = (keyResults: KeyResult[]): number => {
  if (keyResults.length === 0) return 0;
  
  const sum = keyResults.reduce((acc, kr) => acc + kr.progress, 0);
  return Math.round(sum / keyResults.length);
};

// Calculate days remaining based on end date
const calculateDaysRemaining = (endDate: string): number => {
  const today = new Date();
  const end = new Date(endDate);
  
  // If end date is in the past, return 0
  if (end < today) return 0;
  
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Calculate total days in a cycle
const calculateTotalDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Calculate time progress
const calculateTimeProgress = (startDate: string, endDate: string): number => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (today < start) return 0;
  if (today > end) return 100;
  
  const totalTime = end.getTime() - start.getTime();
  const elapsedTime = today.getTime() - start.getTime();
  
  return parseFloat(((elapsedTime / totalTime) * 100).toFixed(1));
};

// Create store for OKR data
type OKRStore = {
  objectives: Objective[];
  setObjectives: (objectives: Objective[]) => void;
  updateObjective: (id: string, updates: Partial<Objective>) => void;
  addObjective: (departmentId: DepartmentId) => void;
  deleteObjective: (id: string) => void;
  updateKeyResult: (objId: string, krId: string, updates: Partial<KeyResult>) => void;
  addKeyResult: (objectiveId: string) => void;
  deleteKeyResult: (objectiveId: string, keyResultId: string) => void;
  getDepartmentStats: (departmentId: DepartmentId) => DepartmentStats;
};

export const useOKRStore = create<OKRStore>((set, get) => ({
  objectives: initialObjectives,
  
  setObjectives: (objectives) => set({ objectives }),
  
  updateObjective: (id, updates) => {
    set((state) => {
      const updatedObjectives = state.objectives.map((obj) => {
        if (obj.id === id) {
          const updatedObj = { ...obj, ...updates };
          // Recalculate progress if not explicitly provided
          if (!updates.progress) {
            updatedObj.progress = calculateObjectiveProgress(updatedObj.keyResults);
          }
          return updatedObj;
        }
        return obj;
      });
      return { objectives: updatedObjectives };
    });
  },
  
  addObjective: (departmentId) => {
    set((state) => {
      const newId = `obj${state.objectives.length + 1}`;
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      
      const newObjective: Objective = {
        id: newId,
        title: "New Objective",
        departmentId,
        progress: 0,
        cycle: "Q1",
        startDate: now.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        ownerId: users[0].id,
        keyResults: [],
      };
      
      return { objectives: [...state.objectives, newObjective] };
    });
  },
  
  deleteObjective: (id) => {
    set((state) => ({
      objectives: state.objectives.filter((obj) => obj.id !== id),
    }));
  },
  
  updateKeyResult: (objId, krId, updates) => {
    set((state) => {
      const updatedObjectives = state.objectives.map((obj) => {
        if (obj.id === objId) {
          const updatedKeyResults = obj.keyResults.map((kr) => {
            if (kr.id === krId) {
              const updatedKr = { ...kr, ...updates };
              
              // Recalculate progress based on current value
              if (updates.currentValue !== undefined || updates.targetValue !== undefined || updates.startValue !== undefined) {
                updatedKr.progress = calculateKeyResultProgress(updatedKr);
              }
              
              return updatedKr;
            }
            return kr;
          });
          
          // Recalculate objective progress
          const progress = calculateObjectiveProgress(updatedKeyResults);
          
          return { ...obj, keyResults: updatedKeyResults, progress };
        }
        return obj;
      });
      
      return { objectives: updatedObjectives };
    });
  },
  
  addKeyResult: (objectiveId) => {
    set((state) => {
      const updatedObjectives = state.objectives.map((obj) => {
        if (obj.id === objectiveId) {
          const newKrId = `kr${Date.now()}`;
          const newKeyResult: KeyResult = {
            id: newKrId,
            title: "New Key Result",
            objectiveId,
            metric: "Percentage",
            startValue: 0,
            targetValue: 100,
            currentValue: 0,
            progress: 0,
            ownerId: obj.ownerId,
            status: "On track",
            confidenceLevel: "Medium",
          };
          
          const updatedKeyResults = [...obj.keyResults, newKeyResult];
          const progress = calculateObjectiveProgress(updatedKeyResults);
          
          return { ...obj, keyResults: updatedKeyResults, progress };
        }
        return obj;
      });
      
      return { objectives: updatedObjectives };
    });
  },
  
  deleteKeyResult: (objectiveId, keyResultId) => {
    set((state) => {
      const updatedObjectives = state.objectives.map((obj) => {
        if (obj.id === objectiveId) {
          const updatedKeyResults = obj.keyResults.filter((kr) => kr.id !== keyResultId);
          const progress = calculateObjectiveProgress(updatedKeyResults);
          
          return { ...obj, keyResults: updatedKeyResults, progress };
        }
        return obj;
      });
      
      return { objectives: updatedObjectives };
    });
  },
  
  getDepartmentStats: (departmentId) => {
    const objectives = get().objectives.filter((obj) => obj.departmentId === departmentId);
    
    if (objectives.length === 0) {
      return {
        daysRemaining: 0,
        totalDays: 0,
        timeProgress: 0,
        overallProgress: 0,
      };
    }
    
    // Use the first objective's dates as reference
    // In a real application, you might want to get the active cycle's dates
    const { startDate, endDate } = objectives[0];
    
    const daysRemaining = calculateDaysRemaining(endDate);
    const totalDays = calculateTotalDays(startDate, endDate);
    const timeProgress = calculateTimeProgress(startDate, endDate);
    
    // Calculate average progress across all objectives
    const overallProgress = objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length;
    
    return {
      daysRemaining,
      totalDays,
      timeProgress,
      overallProgress: Math.round(overallProgress),
    };
  },
}));

// Export methods to maintain API compatibility with previous code
export const objectives = useOKRStore.getState().objectives;

export const getObjectivesByDepartment = (departmentId: DepartmentId): Objective[] => {
  return useOKRStore.getState().objectives.filter(obj => obj.departmentId === departmentId);
};

export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.id === userId);
};

export const getActiveCycle = (): OKRCycle | undefined => {
  return cycles.find(cycle => cycle.active);
};

// Export departmentStats
export const departmentStats: Record<DepartmentId, DepartmentStats> = {
  leadership: useOKRStore.getState().getDepartmentStats("leadership"),
  product: useOKRStore.getState().getDepartmentStats("product"),
  ai: useOKRStore.getState().getDepartmentStats("ai"),
  sales: useOKRStore.getState().getDepartmentStats("sales"),
  growth: useOKRStore.getState().getDepartmentStats("growth"),
};
