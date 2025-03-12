
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const EditableText = ({ value, onChange, className, placeholder = 'Click to edit' }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(value);
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
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(text);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(value);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "font-inter px-2 py-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-deepip-primary transition-colors duration-200",
        className
      )}
    />
  ) : (
    <div 
      className={cn("font-inter px-2 py-1 cursor-pointer hover:bg-deepip-light-gray/50 rounded-md transition-colors", className)}
      onDoubleClick={handleDoubleClick}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  );
};

export default EditableText;
