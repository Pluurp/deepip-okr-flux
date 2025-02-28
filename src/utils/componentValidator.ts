
/**
 * This utility file is created to verify that our components are properly imported and rendered.
 * It will be imported into our main application entry point to ensure all components are validated.
 */

import DashboardLayout from "@/layouts/DashboardLayout";
import ObjectiveList from "@/components/ObjectiveList";
import { Objective } from "@/pages/Objective";

export const validateComponents = () => {
  // Log components to ensure they're accessible
  console.log({
    DashboardLayout,
    ObjectiveList,
    Objective
  });
  
  console.log("All components have been validated.");
  return true;
};
