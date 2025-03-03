
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface EditableSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  getStatusColor?: (status: string) => string;
}

const EditableSelect = ({ 
  value, 
  options, 
  onChange, 
  className,
  getStatusColor 
}: EditableSelectProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (selectedValue !== value) {
      onChange(selectedValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(selectedValue);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setSelectedValue(value);
    }
  };

  const getSelectedLabel = () => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className={cn("min-w-0", className)}>
      {isEditing ? (
        <select
          ref={selectRef}
          value={selectedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="cursor-pointer hover:bg-gray-50 rounded"
        >
          {getStatusColor ? (
            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(value))}>
              {getSelectedLabel()}
            </span>
          ) : (
            <div className="px-1 py-0.5 text-sm truncate">
              {getSelectedLabel()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableSelect;
