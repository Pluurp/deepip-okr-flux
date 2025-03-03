
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type EditableNumberProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  suffix?: string;
};

const EditableNumber = ({
  value,
  onChange,
  className,
  placeholder = "Enter number",
  min,
  max,
  suffix,
}: EditableNumberProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [numberValue, setNumberValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // Update internal state when external value changes
    if (!isEditing) {
      setNumberValue(value.toString());
    }
  }, [value, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const validateAndSetValue = (inputValue: string) => {
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      let finalValue = newValue;
      if (min !== undefined) finalValue = Math.max(min, finalValue);
      if (max !== undefined) finalValue = Math.min(max, finalValue);
      return finalValue;
    }
    return value; // Return original value if input is invalid
  };

  const handleBlur = () => {
    setIsEditing(false);
    const finalValue = validateAndSetValue(numberValue);
    onChange(finalValue);
    setNumberValue(finalValue.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setNumberValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={numberValue}
        onChange={(e) => setNumberValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        className={cn(
          "bg-transparent border-b border-deepip-primary outline-none px-1 w-full",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={cn("cursor-pointer hover:bg-gray-50 px-1 rounded", className)}
      title="Double-click to edit"
    >
      {value}
      {suffix}
    </span>
  );
};

export default EditableNumber;
