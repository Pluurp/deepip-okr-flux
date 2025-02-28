
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type EditableSelectProps<T extends string> = {
  value: T;
  options: readonly T[] | T[]; // Support both readonly and mutable arrays
  onChange: (value: T) => void;
  className?: string;
  placeholder?: string;
  getOptionColor?: (option: T) => string;
  getOptionClass?: (option: T) => string;
};

const EditableSelect = <T extends string>({
  value,
  options,
  onChange,
  className,
  placeholder = "Select an option",
  getOptionColor,
  getOptionClass,
}: EditableSelectProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <select
        ref={selectRef}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "bg-transparent border-b border-deepip-primary outline-none px-1 py-0.5 text-sm",
          className
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  const optionClass = getOptionClass?.(value);
  const optionColor = getOptionColor?.(value);
  const style = optionColor ? { color: optionColor } : undefined;

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={cn("cursor-pointer hover:bg-gray-50 px-1 rounded", optionClass, className)}
      style={style}
      title="Double-click to edit"
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </span>
  );
};

export default EditableSelect;
