
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type EditableTextProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
};

const EditableText = ({
  value,
  onChange,
  className,
  placeholder = "Enter text",
  as = "p",
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

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
    onChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(text);
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
