
import { Department } from "@/types";

export const departments: Department[] = [
  {
    id: "leadership",
    name: "Leadership & Strategy",
    color: "#9b87f5", // Purple 🔮
  },
  {
    id: "product",
    name: "Product & Technology",
    color: "#4B48FF", // Blue 🔵
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    color: "#ea384c", // Red 🔴
  },
  {
    id: "sales",
    name: "Sales & Customer Success",
    color: "#FFB30F", // Darker yellow for better visibility 🟡
  },
  {
    id: "growth",
    name: "Growth & Marketing",
    color: "#45B36B", // Darker green for better visibility 🟢
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
