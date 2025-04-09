import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { X, Filter as FilterIcon, ChevronDown } from "lucide-react";

interface Props {
  filters: { label: string; value: string }[];
  selectedFilters: Set<string>;
  onFilterChange: (newSelection: Set<string>) => void;
  accessMode?: "mobile" | "desktop";
}

/**
 * A component that renders a filter dropdown with both desktop and mobile views.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array<{value: string, label: string}>} props.filters - Array of filter options with value and label
 * @param {Set<string>} props.selectedFilters - Set of currently selected filter values
 * @param {(filters: Set<string>) => void} props.onFilterChange - Callback function when filters change
 * @param {'mobile' | 'desktop'} [props.accessMode='mobile'] - Display mode for the filter component
 *
 * @returns {JSX.Element} A filter component with dropdown functionality
 *
 * @example
 * ```tsx
 * const filters = [
 *   { value: 'all', label: 'All' },
 *   { value: 'active', label: 'Active' }
 * ];
 * const selectedFilters = new Set(['all']);
 *
 * <FilterComponent
 *   filters={filters}
 *   selectedFilters={selectedFilters}
 *   onFilterChange={(newFilters) => handleFilters(newFilters)}
 *   accessMode="desktop"
 * />
 * ```
 */
const FilterComponent = ({
  filters,
  selectedFilters,
  onFilterChange,
  accessMode = "mobile",
}: Props) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabels = useMemo(() => {
    const threshold = 16;
    const labels = filters
      .filter((filter) => selectedFilters.has(filter.value))
      .map((filter) => filter.label)
      .join(", ");

    return labels
      ? labels.length > threshold
        ? `${labels.slice(0, threshold)}...`
        : labels
      : "All";
  }, [selectedFilters, filters]);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleSelectFilter = (filterValue: string) => {
    const newSelection = new Set(selectedFilters);

    if (filterValue === "all") {
      newSelection.clear();
      newSelection.add("all");
    } else {
      if (newSelection.has("all")) newSelection.delete("all");
      if (newSelection.has(filterValue)) {
        newSelection.delete(filterValue);
      } else {
        newSelection.add(filterValue);
      }
      if (newSelection.size === 0) {
        newSelection.add("all");
      }
    }

    onFilterChange(newSelection);
  };

  return (
    <div ref={dropdownRef} className="relative z-50 w-fit">
      <Button
        variant="outline"
        className="h-[48px] px-4 flex items-center gap-2"
        onClick={toggleDropdown}
      >
        <FilterIcon size={16} />
        <span className="text-sm">{selectedLabels}</span>
        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </Button>

      {accessMode === "desktop" && (
        <div
          className={`absolute top-full mt-2 bg-white rounded-xl shadow-lg p-4 min-w-[200px] ${
            isDropdownOpen ? "block" : "hidden"
          }`}
        >
          {filters.map((filter) => (
            <div
              key={filter.value}
              className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectFilter(filter.value)}
            >
              <Checkbox checked={selectedFilters.has(filter.value)} />
              <span className="text-sm">{filter.label}</span>
            </div>
          ))}
        </div>
      )}

      {accessMode === "mobile" && (
        <Dialog open={isDropdownOpen} onOpenChange={setDropdownOpen}>
          <DialogContent className="sm:max-w-md pb-6">
            <DialogHeader className="flex items-center justify-between mb-2">
              <DialogTitle className="text-lg font-medium">
                Select Filter
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDropdownOpen(false)}
              >
                <X size={16} />
              </Button>
            </DialogHeader>

            <div className="space-y-3">
              <RadioGroup value={Array.from(selectedFilters)[0]}>
                {filters.map((filter) => (
                  <div
                    key={filter.value}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleSelectFilter(filter.value)}
                  >
                    <RadioGroupItem value={filter.value} />
                    <span>{filter.label}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button
              className="w-full mt-4"
              onClick={() => setDropdownOpen(false)}
            >
              Save
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FilterComponent;
