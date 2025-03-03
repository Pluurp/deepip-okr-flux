
import { CompanyKeyResult, CompanyObjective } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const createNewCompanyObjective = (): CompanyObjective => {
  return {
    id: uuidv4(),
    title: "New Company Objective",
    keyResults: [createNewCompanyKeyResult(uuidv4())]
  };
};

export const createNewCompanyKeyResult = (objectiveId: string): CompanyKeyResult => {
  return {
    id: uuidv4(),
    title: "New Key Result",
    objectiveId
  };
};

// Load company objectives from localStorage
export const loadCompanyObjectives = (): CompanyObjective[] => {
  const savedObjectives = localStorage.getItem('company_objectives');
  if (savedObjectives) {
    try {
      return JSON.parse(savedObjectives);
    } catch (e) {
      console.error('Failed to parse saved company objectives', e);
    }
  }
  return [];
};

// Save company objectives to localStorage
export const saveCompanyObjectives = (objectives: CompanyObjective[]): void => {
  localStorage.setItem('company_objectives', JSON.stringify(objectives));
};
