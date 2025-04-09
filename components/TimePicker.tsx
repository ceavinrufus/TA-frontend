import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
export function TimePicker({
  onChange,
  value,
  timeIntervals,
  mode = "light",
}: {
  onChange: (value: string) => void;
  value: string;
  timeIntervals: string[];
  mode?: string;
}) {
  const baseClass = `neumorphic-input-${mode} !flex p-4`;
  const valueStyles = `hotel-search-bar-input-value-${mode}`;

  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger
        className={cn("w-full h-14 rounded-2xl", valueStyles, baseClass)}
      >
        <SelectValue placeholder={timeIntervals[0]} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {timeIntervals.map((time) => (
            <SelectItem
              key={time}
              className={cn("uppercase", valueStyles)}
              value={time}
            >
              {time}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
