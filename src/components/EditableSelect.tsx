
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface EditableSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  valueClassName?: string;
}

const EditableSelect = ({ 
  value, 
  options, 
  onChange, 
  className,
  valueClassName 
}: EditableSelectProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  const currentOption = options.find(option => option.value === value);
  
  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    setIsEditing(false);
  };

  return isEditing ? (
    <select
      ref={selectRef}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn(
        "px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-deepip-primary transition-colors duration-200",
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : (
    <div 
      className={cn("px-2 py-1 cursor-pointer hover:bg-deepip-light-gray/50 rounded-md transition-colors", className)}
      onClick={handleClick}
    >
      <span className={valueClassName}>
        {currentOption?.label || value}
      </span>
    </div>
  );
};

export default EditableSelect;
