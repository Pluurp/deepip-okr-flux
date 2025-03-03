
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

type ProgressBarProps = {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "default";
  showLabel?: boolean;
  animate?: boolean;
};

const ProgressBar = ({
  value,
  className,
  size = "md",
  variant = "default",
  showLabel = false,
  animate = false, // Default to no animation
}: ProgressBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  
  // Use useEffect to update the width directly, bypassing React's transition animations
  useEffect(() => {
    if (barRef.current) {
      // Apply width directly to the DOM without any transitions
      barRef.current.style.transition = "none";
      barRef.current.style.width = `${value}%`;
    }
  }, [value]);

  // Calculate color based on value
  const getColorClass = () => {
    if (variant === "primary") return "bg-deepip-primary";
    
    if (value < 30) return "bg-red-400";
    if (value < 70) return "bg-yellow-400";
    return "bg-green-400";
  };

  // Calculate height based on size
  const getHeightClass = () => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "md":
        return "h-2";
      case "lg":
        return "h-3";
      default:
        return "h-2";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <div className="flex justify-between w-full text-xs text-gray-600">
            <span>Progress</span>
            <span className="font-medium">{value}%</span>
          </div>
        )}
      </div>
      <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", getHeightClass())}>
        <div
          ref={barRef}
          className={cn(
            getColorClass(),
            getHeightClass(),
            "transition-none", // Always disable transitions
            "rounded-full"
          )}
          style={{
            width: `${value}%`,
            transition: "none" // Force no transitions at the style level
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
