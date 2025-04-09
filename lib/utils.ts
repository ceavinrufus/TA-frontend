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
