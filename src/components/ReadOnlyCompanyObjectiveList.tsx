
import React from "react";
import { CompanyObjective } from "@/types";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

type ReadOnlyCompanyObjectiveListProps = {
  objectives: CompanyObjective[];
  className?: string;
};

const ReadOnlyCompanyObjectiveList = ({ objectives, className }: ReadOnlyCompanyObjectiveListProps) => {
  if (objectives.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-gray-500 mb-2">No company objectives defined</p>
        <Link to="/company">
          <Button variant="outline">Manage Company Objectives</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {objectives.map((objective) => (
          <Card key={objective.id} className="overflow-hidden border shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-lg font-medium mb-3">{objective.title}</h3>
              
              {objective.keyResults.length > 0 ? (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Key Results:</h4>
                  <ul className="list-disc list-inside pl-3 text-gray-700 space-y-1">
                    {objective.keyResults.map((kr) => (
                      <li key={kr.id}>{kr.title}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No key results defined</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Remove the duplicate "Manage Company OKRs" button that appears at the bottom */}
    </div>
  );
};

export default ReadOnlyCompanyObjectiveList;
