import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 * Formats a timestamp (in seconds since epoch) to a readable date/time string.
 * @param secondsSinceEpoch - Timestamp in seconds
 * @param showTime - Whether to include time in the output
 * @returns Formatted date/time string
 */
export function formatTimeForDisplay(
  secondsSinceEpoch: number | string,
  showTime = true,
) {
  const secondsToUse =
    typeof secondsSinceEpoch === "number"
      ? secondsSinceEpoch
      : Number.parseInt(secondsSinceEpoch);
  const date = dayjs(secondsToUse * 1000);
  if (showTime) {
    return date.format("HH:mm, DD/MM/YYYY");
  }
  return date.format("DD/MM/YYYY");
}

/**
 * Formats an ISO date string to a readable date/time string.
 * @param isoString - ISO date string
 * @param showTime - Whether to include time in the output
 * @returns Formatted date/time string
 */
export function formatDateTime(isoString: string, showTime: boolean): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  if (!showTime) {
    return `${day}/${month}/${year}`;
  }
  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

export enum DateTimeDisplayMode {
  FULL_DATE_FORMAT = "fullDateFormat",
  SHORT_DATE_TIME_FORMAT = "shortDateTimeFormat",
  SHORT_MONTH_DATE_FORMAT = "shortMonthDateFormat",
}

/**
 * Formats a Date object to a string with weekday, year, month, and day.
 * @param date - Date object
 * @returns Formatted date string
 */
function formatDate(date: Date, locale: string | null | undefined): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Formats a date string based on the specified mode and options.
 * @param dateString - Date string to format
 * @param includeMeridiem - Whether to include AM/PM
 * @param mode - Format mode (full or short)
 * @returns Formatted date string
 */
export function formatDateStringForDisplay(
  dateString: string,
  locale: string | undefined | null,
  includeMeridiem = false,
  mode?: DateTimeDisplayMode,
): string {
  if (mode === DateTimeDisplayMode.FULL_DATE_FORMAT) {
    return formatDate(new Date(dateString), locale);
  }

  if (mode === DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }
  const formatString = includeMeridiem
    ? `hh:mm A, DD/MM/YYYY`
    : `HH:mm, DD/MM/YYYY`;
  return dayjs(dateString).format(formatString);
}

/**
 * Extracts the time (HH:MM) from an ISO date string.
 * @param isoString - ISO date string
 * @returns Time string in HH:MM format
 */
export function getTimeFromISOString(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Calculates and returns a relative time label (e.g., "2 hours ago").
 * @param dateString - Date string to compare against current time
 * @returns Relative time label
 */
export const getRelativeTimeLabel = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diff / 1000 / 60);
  const diffHours = Math.floor(diff / 1000 / 60 / 60);
  const diffDays = Math.floor(diff / 1000 / 60 / 60 / 24);
  const diffWeeks = Math.floor(diff / 1000 / 60 / 60 / 24 / 7);

  if (diffSeconds < 60) return "now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
};

/**
 * Calculates the duration between two times in milliseconds.
 * @param start - Start time string
 * @param finish - End time string
 * @returns Duration in milliseconds
 */
export const calculateDurationBetweenTimesInMilliseconds = ({
  start,
  finish,
}: {
  start: string;
  finish: string;
}) => {
  const departureTime = dayjs(start);
  const arrivalTime = dayjs(finish);
  return arrivalTime.diff(departureTime);
};

/**
 * Converts a Date object to a local ISO string (YYYY-MM-DD).
 * @param date - Date object
 * @returns Local ISO date string or null if date is undefined
 */
export const toLocalISOString = (date: Date | undefined) => {
  if (!date) return null;
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 10);
  return localISOTime;
};

/**
 * Calculates the number of nights between two dates.
 * @param from - Start date string
 * @param to - End date string
 * @returns Number of nights
 */
export function calculateDaysOrNightsBetweenDates({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const checkIn = new Date(from).getTime();
  const checkOut = new Date(to).getTime();
  const difference = checkOut - checkIn;
  const nights = difference / (1000 * 60 * 60 * 24);
  return nights;
}

type TimeUnit = "seconds" | "minutes" | "hours" | "days";

const timeUnitToMs: Record<TimeUnit, number> = {
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
};

export const toMilliseconds = (value: number, unit: TimeUnit): number => {
  return value * timeUnitToMs[unit];
};

export function isDateInPast(date: Date | string | number): boolean {
  let givenDate: dayjs.Dayjs;

  if (typeof date === "number") {
    // Check if the timestamp is in seconds (10 digits) or milliseconds (13 digits)
    givenDate = dayjs(date.toString().length <= 10 ? date * 1000 : date);
  } else {
    givenDate = dayjs(date);
  }

  // Check if the date is valid
  if (!givenDate.isValid()) {
    return false;
  }

  const now = dayjs();

  // Compare the given date with the current date
  return givenDate.isBefore(now);
}
