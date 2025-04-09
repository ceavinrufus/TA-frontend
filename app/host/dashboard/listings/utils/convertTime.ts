/* eslint-disable prefer-const */
export const convertTimeFormat = (
  time: string,
  to24HourFormat: boolean = true
) => {
  if (!time) {
    return null;
  }

  if (to24HourFormat) {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  } else {
    let [hours, minutes] = time.split(":");
    const modifier = parseInt(hours, 10) >= 12 ? "PM" : "AM";

    hours = (parseInt(hours, 10) % 12).toString();
    if (hours === "0") {
      hours = "12";
    }

    return `${hours}:${minutes} ${modifier}`;
  }
};
