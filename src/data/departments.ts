
import { Department } from "@/types";

export const departments: Department[] = [
  {
    id: "leadership",
    name: "Leadership & Strategy",
    color: "#4B48FF", // DeepIP primary blue
  },
  {
    id: "product",
    name: "Product & Technology",
    color: "#9b87f5", // Purple
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    color: "#7E69AB", // Secondary Purple
  },
  {
    id: "sales",
    name: "Sales & Customer Success",
    color: "#6E59A5", // Tertiary Purple
  },
  {
    id: "growth",
    name: "Growth & Marketing",
    color: "#D6BCFA", // Light Purple
  },
];

export const roles = [
  // Leadership & Strategy
  "Co-founder & CEO",
  "Co-founder & CTO",
  "Chief of Staff",
  "People Manager",
  "Founder Associate",
  // Product & Technology
  "Senior Tech Lead",
  "Senior Full Stack Engineer",
  "Full Stack Engineer",
  "Squad Leader",
  "Product Manager",
  // AI & Machine Learning
  "Machine Learning Engineer",
  "AI Engineer",
  // Sales & Customer Success
  "Sales Development Representative",
  "Sales Consultant", 
  "Account Executive",
  "1st Enterprise Account Executive",
  "IP Strategist",
  // Growth & Marketing
  "Head of Growth"
] as const;

export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

export const getDepartmentColor = (id: string): string => {
  const department = getDepartmentById(id);
  return department?.color || "#4B48FF"; // Default to primary blue
};
