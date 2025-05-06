import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import IconArrowDown from "@/components/icons/IconArrowDown";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface CustomDropdownProps<T extends DropdownOption> {
  id: string;
  open: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onChange: (value: T["value"] | null) => void;
  selectedValue: T["value"] | null;
  options: T[];
  placeholder: string;
  className?: string;
  mode?: string;
  queryFilter?: (query: string, option: T) => boolean;
}

export default function CustomDropdown<T extends DropdownOption>({
  id,
  open,
  disabled = false,
  onToggle,
  onChange,
  selectedValue,
  options,
  placeholder,
  className = "",
  mode = "light",
  queryFilter = (query, option) =>
    option.label.toLowerCase().startsWith(query.toLowerCase()),
}: CustomDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const valueStyles = `hotel-search-bar-input-value-${mode}`;

  useEffect(() => {
    const mutableRef = ref as MutableRefObject<HTMLDivElement | null>;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mutableRef.current &&
        !mutableRef.current.contains(event.target as Node) &&
        open
      ) {
        onToggle();
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, open, onToggle]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selectedValue) {
      onChange(null);
    }
    if (!open) {
      onToggle();
    }
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <div ref={ref}>
      <div className="mt-0 relative">
        <div
          className={`
          ${disabled ? "bg-neutral-100" : "bg-off-white"}
          ${className}
          shadow-neumorphic-input-light 
          w-full 
          flex items-center
          h-[40px] md:h-[56px]
          rounded-[16px]
          border
          ${selectedValue ? "border-primary-brand border-[2px]" : "border-none"}
        `}
        >
          {/* Input wrapper with padding */}
          <div className="flex-grow px-4 md:px-4">
            <input
              ref={inputRef}
              type="text"
              className={`
                w-full
                neumorphic-input-light-text 
                bg-transparent 
                outline-none
                ${
                  !selectedValue
                    ? "text-secondary-placeholder"
                    : "text-primary-black"
                }
              `}
              placeholder={placeholder}
              value={selectedOption ? selectedOption.label : query}
              onChange={handleInputChange}
              onClick={() => !open && onToggle()}
              disabled={disabled}
              autoComplete="nope"
            />
          </div>

          {/* Icon container without additional padding */}
          {!disabled && (
            <div className="pr-4 md:pr-4 flex items-center">
              <motion.div
                className="hidden md:inline-block cursor-pointer"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && onToggle();
                }}
              >
                <IconArrowDown size={24} />
              </motion.div>
              <motion.div
                className="inline-block md:hidden cursor-pointer"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && onToggle();
                }}
              >
                <IconArrowDown size={16} />
              </motion.div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute z-10 mt-1 w-full bg-off-white shadow-neumorphic-card-up max-h-80 text-base ring-opacity-5 focus:outline-none sm:text-sm rounded-[16px]"
              tabIndex={-1}
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-option-3"
            >
              <div
                className="max-h-64 overflow-y-scroll scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-600 scrollbar-thumb-rounded scrollbar-thin"
                role="listbox"
                aria-label="Dropdown options"
              >
                {options
                  .filter((option) => queryFilter(query, option))
                  .map((option, index) => (
                    <li
                      key={`${id}-${index}`}
                      className={`
                        text-gray-900 
                        cursor-pointer 
                        select-none 
                        relative 
                        px-4 md:px-6 
                        py-2 md:py-4 
                        flex items-center 
                        first:rounded-t-[16px]
                        last:rounded-b-[16px]
                        hover:bg-gray-50 
                        transition 
                        ${
                          selectedValue === option.value
                            ? "bg-green-success"
                            : ""
                        }
                      `}
                      role="option"
                      onClick={() => {
                        onChange(option.value);
                        setQuery("");
                        onToggle();
                      }}
                    >
                      <span className={valueStyles}>{option.label}</span>
                      {selectedValue === option.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 md:pr-6">
                          <ResponsiveIcon
                            icon="icon-check"
                            sizeDesktop={24}
                            sizeMobile={16}
                          />
                        </span>
                      )}
                    </li>
                  ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
