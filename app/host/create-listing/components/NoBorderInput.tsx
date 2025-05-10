import { cn } from "@/lib/utils";
import React from "react";

interface NoBorderInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const NoBorderInput: React.FC<NoBorderInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  ...props
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "border-none outline-none text-6xl font-normal text-center bg-transparent w-full",
        value && "underline underline-offset-[7px]",
        className
      )}
      {...props}
    />
  );
};

export default NoBorderInput;
