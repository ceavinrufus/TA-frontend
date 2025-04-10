import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";

interface GuestCountModifierProps {
  className?: string;
  labelClassName?: string;
  label: string;
  count: number;
  onDecrease: () => void;
  onIncrease: () => void;
  minCount?: number;
  maxCount?: number;
}

/**
 * GuestCountModifier component allows users to increase or decrease the count of guests within a specified range.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.className - The class name to apply to the component.
 * @param {string} props.labelClassName - The class name to apply to the label.
 * @param {string} props.label - The label to display for the guest count modifier.
 * @param {number} props.count - The current count of guests.
 * @param {function} props.onDecrease - The function to call when the decrease button is clicked.
 * @param {function} props.onIncrease - The function to call when the increase button is clicked.
 * @param {number} [props.minCount=0] - The minimum count of guests allowed. Default is 0.
 * @param {number} [props.maxCount=10] - The maximum count of guests allowed. Default is 10.
 * @returns {JSX.Element} The rendered GuestCountModifier component.
 */
const GuestCountModifier: React.FC<GuestCountModifierProps> = ({
  className,
  labelClassName,
  label,
  count,
  onDecrease,
  onIncrease,
  minCount = 0,
  maxCount = 10,
}) => (
  <div
    className={cn(
      "flex justify-between w-full h-[104px] rounded-[32px] px-12 py-4 items-center flex-row shadow-button-up",
      className
    )}
  >
    <div className="flex flex-col gap-2 h-full justify-center">
      <h2 className={cn(labelClassName)}>{label}</h2>
    </div>
    <div className="flex items-center h-full gap-[14px]">
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          onDecrease();
        }}
        disabled={count <= minCount}
        className="h-[32px] w-[32px] rounded-full"
      >
        <ResponsiveIcon
          icon="icon-minus"
          sizeDesktop={16}
          color="#000"
          sizeMobile={16}
        />
      </Button>
      <p className="hotel-search-occupancy-popover-count">{count}</p>
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          onIncrease();
        }}
        disabled={count >= maxCount}
        className="h-[32px] w-[32px] rounded-full"
      >
        <ResponsiveIcon
          icon="icon-add"
          sizeDesktop={16}
          color="#000"
          sizeMobile={16}
        />
      </Button>
    </div>
  </div>
);

export default GuestCountModifier;
