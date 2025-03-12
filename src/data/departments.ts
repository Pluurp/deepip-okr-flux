
import { Department } from "@/types";

export const departments: Department[] = [
  {
    id: "leadership",
    name: "Leadership & Strategy",
    color: "#9b87f5", // Violet 🔮
  },
  {
    id: "product",
    name: "Product & Technology",
    color: "#4B48FF", // Keep Blue 🔵
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    color: "#ea384c", // Red 🔴
  },
  {
    id: "sales",
    name: "Sales & Customer Success",
    color: "#FEF7CD", // Yellow 🟡
  },
  {
    id: "growth",
    name: "Growth & Marketing",
    color: "#F2FCE2", // Green 🟢
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
