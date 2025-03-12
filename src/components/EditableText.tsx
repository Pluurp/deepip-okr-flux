
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
        "px-1 py-0.5 w-full border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-deepip-primary",
        className
      )}
    />
  ) : (
    <div 
      className={cn("px-1 py-0.5 cursor-pointer hover:bg-gray-100 rounded", className)}
      onDoubleClick={handleDoubleClick}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  );
};

export default EditableText;
