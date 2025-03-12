
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
    <div className={cn("space-y-4", className)}>
      {objectives.map((objective) => (
        <Card key={objective.id} className="overflow-hidden border shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-lg font-medium mb-3">{objective.title}</h3>
            
            {objective.keyResults && objective.keyResults.length > 0 ? (
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
      
      <div className="flex justify-end mt-4">
        <Link to="/company">
          <Button variant="outline" className="flex items-center gap-1">
            Manage Company OKRs
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ReadOnlyCompanyObjectiveList;
