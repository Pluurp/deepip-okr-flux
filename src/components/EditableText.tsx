
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type EditableTextProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  maxLength?: number;
};

const EditableText = ({
  value,
  onChange,
  className,
  placeholder = "Enter text",
  as = "p",
  maxLength,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // Update internal state when external value changes
    if (!isEditing) {
      setText(value);
    }
  }, [value, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const validateAndSetValue = (inputValue: string) => {
    // Trim whitespace
    let finalValue = inputValue.trim();
    
    // Enforce max length if specified
    if (maxLength !== undefined && finalValue.length > maxLength) {
      finalValue = finalValue.substring(0, maxLength);
    }
    
    // Return empty placeholder text if empty and not required
    return finalValue || placeholder;
  };

  const handleBlur = () => {
    setIsEditing(false);
    
    // Don't update with empty string, use the placeholder instead
    const finalValue = text.trim() ? text : value;
    onChange(finalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(text.trim() || value);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setText(value);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        className={cn(
          "bg-transparent border-b border-deepip-primary outline-none px-1 w-full",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  const Component = as;
  return (
    <Component
      onDoubleClick={handleDoubleClick}
      className={cn("cursor-pointer hover:bg-gray-50 px-1 rounded", className)}
      title="Double-click to edit"
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </Component>
  );
};

export default EditableText;
