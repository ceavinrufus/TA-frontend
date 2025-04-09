import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (addr: string | undefined) => {
  if (!addr || addr.length < 10) {
    throw new Error("Invalid wallet address");
  }
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const toTitleCase = ({ source }: { source: string }) => {
  return source
    .toLowerCase() // Convert the whole string to lowercase first
    .replace(/[\W_]+/g, " ") // Replace all non-word characters with a single space
    .split(" ") // Split the string into an array of words
    .filter((word) => word.length > 0) // Remove any empty words caused by multiple spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first character of each word
    .join(" "); // Join the words back into a string
};

export const generateTimeIntervals = (
  is24HourFormat: boolean = true
): string[] => {
  const interval = 30; // Interval in minutes
  const times = [];

  for (let i = 0; i < 24 * 60; i += interval) {
    const hh = Math.floor(i / 60); // Hours (0-23)
    const mm = i % 60; // Minutes (0-59)

    let formattedTime;
    if (is24HourFormat) {
      // Format the time as 'HH:mm'
      formattedTime = `${("0" + hh).slice(-2)}:${("0" + mm).slice(-2)}`;
    } else {
      const period = hh < 12 ? "AM" : "PM"; // AM or PM
      // Format the time as 'hh:mm AM/PM'
      formattedTime = `${("0" + (hh % 12 || 12)).slice(-2)}:${("0" + mm).slice(
        -2
      )} ${period}`;
    }

    times.push(formattedTime);
  }

  return times;
};
