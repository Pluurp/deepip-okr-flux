
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

type ProgressBarProps = {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "default";
  showLabel?: boolean;
  animate?: boolean;
  color?: string;
};

const ProgressBar = ({
  value,
  className,
  size = "md",
  variant = "default",
  showLabel = false,
  animate = false,
  color,
}: ProgressBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.transition = "none";
      barRef.current.style.width = `${value}%`;
    }
  }, [value]);

  // Calculate color based on value and variant/custom color
  const getColorStyle = () => {
    if (color) return { backgroundColor: color };
    
    if (variant === "primary") return { backgroundColor: '#4B48FF' };
    
    const defaultColors = {
      low: '#f87171',
      medium: '#facc15',
      high: '#4ade80'
    };

    if (value < 30) return { backgroundColor: defaultColors.low };
    if (value < 70) return { backgroundColor: defaultColors.medium };
    return { backgroundColor: defaultColors.high };
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
            getHeightClass(),
            "transition-none",
            "rounded-full"
          )}
          style={{
            width: `${value}%`,
            transition: "none",
            ...getColorStyle()
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
