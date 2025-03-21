
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableNumberProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  suffix?: string;
}

const EditableNumber = ({ 
  value, 
  onChange, 
  className, 
  min, 
  max, 
  suffix = ''
}: EditableNumberProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [number, setNumber] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNumber(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (number !== value) {
      onChange(number);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(number);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNumber(value);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type="number"
      value={number}
      onChange={(e) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          setNumber(newValue);
        }
      }}
      min={min}
      max={max}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "px-2 py-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-deepip-primary transition-colors duration-200",
        className
      )}
    />
  ) : (
    <div 
      className={cn("px-2 py-1 cursor-pointer hover:bg-deepip-light-gray/50 rounded-md transition-colors", className)}
      onDoubleClick={handleDoubleClick}
    >
      {value}{suffix}
    </div>
  );
};

export default EditableNumber;
