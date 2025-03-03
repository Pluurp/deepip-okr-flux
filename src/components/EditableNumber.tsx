
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableNumberProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  suffix?: string;
}

const EditableNumber = ({ value, onChange, className, min, max, suffix = "" }: EditableNumberProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [numberValue, setNumberValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNumberValue(value.toString());
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    validateAndUpdate();
  };

  const validateAndUpdate = () => {
    let newValue = parseFloat(numberValue);
    
    if (isNaN(newValue)) {
      setNumberValue(value.toString());
      return;
    }
    
    if (min !== undefined && newValue < min) {
      newValue = min;
    }
    
    if (max !== undefined && newValue > max) {
      newValue = max;
    }
    
    setNumberValue(newValue.toString());
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      validateAndUpdate();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setNumberValue(value.toString());
    }
  };

  return (
    <div className={cn("min-w-0", className)}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={numberValue}
          onChange={(e) => setNumberValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm"
          min={min}
          max={max}
          step="any"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="px-1 py-0.5 cursor-pointer hover:bg-gray-50 rounded text-sm truncate"
        >
          {value}{suffix}
        </div>
      )}
    </div>
  );
};

export default EditableNumber;
