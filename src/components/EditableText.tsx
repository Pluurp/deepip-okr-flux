
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const EditableText = ({ value, onChange, className }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(value);
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
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(text);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setText(value);
    }
  };

  return (
    <div className={cn("min-w-0", className)}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="px-1 py-0.5 cursor-pointer hover:bg-gray-50 rounded text-sm truncate"
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default EditableText;
