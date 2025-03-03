
import { Trophy, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Status } from "@/types";

type StatusIconProps = {
  status: Status;
  size?: number;
  className?: string;
};

const StatusIcon = ({ status, size = 16, className }: StatusIconProps) => {
  switch (status) {
    case "Completed":
      return <Trophy size={size} className={`text-blue-600 ${className}`} />;
    case "On track":
      return <CheckCircle size={size} className={`text-green-600 ${className}`} />;
    case "At Risk":
      return <AlertTriangle size={size} className={`text-yellow-600 ${className}`} />;
    case "Off Track":
      return <XCircle size={size} className={`text-red-600 ${className}`} />;
    default:
      return <CheckCircle size={size} className={`text-gray-400 ${className}`} />;
  }
};

export default StatusIcon;
