const avatarColors: string[] = [
  "#A3A948",
  "#EDB92E",
  "#F85931",
  "#CE1836",
  "#009989",
  "#2ECC71",
  "#7900FF",
  "#548CFF",
  "#93FFD8",
  "#C8A2C8",
  "#87CEEB",
  "#008080",
  "#673AB7",
  "#FFC107",
  "#3F51B5",
  "#FF9800",
  "#03A9F4",
  "#E91E63",
  "#4CAF50",
  "#E53935",
  "#2196F3",
  "#9C27B0",
  "#00BCD4",
  "#FFEB3B",
  "#CDDC39",
  "#7C4DFF",
  "#FF5722",
  "#8BC34A",
  "#607D8B",
  "#FF4081",
  "#00E676",
  "#795548",
  "#00ACC1",
  "#9E9E9E",
  "#00FF00", // Lime Green
  "#00FFFF", // Cyan
  "#FF69B4", // Hot Pink
  "#DAA520", // Goldenrod
  "#00FFFF", // Aqua
  "#FF6347", // Tomato
  "#00BFFF", // Deep Sky Blue
  "#DC143C", // Crimson
  "#00FF7F", // Spring Green
  "#1E90FF", // Dodger Blue
  "#FF00FF", // Magenta
  "#7FFF00", // Chartreuse
  "#FF4500", // Orange Red
  "#9370DB", // Medium Purple
  "#7CFC00", // Lawn Green
  "#4169E1", // Royal Blue
  "#E6E6FA", // Lavender
  "#40E0D0", // Turquoise
  "#FA8072", // Salmon
  "#FF1493", // Deep Pink
];

function formatCryptoAddressForDisplay(address: string | null | undefined) {
  return !address
    ? `\u{2014}`
    : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Triggers a haptic feedback vibration on the device for a specified duration using the Vibration API.
 * This function can be used to enhance user interaction by providing physical feedback for certain actions within a web application.
 * It checks for the availability of the `navigator.vibrate` method, which is part of the Vibration API,
 * and calls it with the specified duration if available.
 *
 * @param {number} milliseconds - The duration of the vibration in milliseconds. Defaults to 5 milliseconds if not specified.
 *
 * Usage:
 * - The function can be called with or without specifying the `milliseconds` parameter.
 * - If the device or browser does not support the Vibration API, the function will silently fail without throwing an error.
 * - Useful for giving users a tactile response to actions, enhancing the overall user experience.
 *
 * @example
 * // Trigger a short vibration of 5 milliseconds (default)
 * hapticFeedbackVibrate();
 *
 * @example
 * // Trigger a longer vibration of 200 milliseconds
 * hapticFeedbackVibrate(200);
 *
 * Note:
 * - The effectiveness and behavior of the vibration can vary between different devices and browsers.
 * - Some platforms may ignore the specified duration or have limitations on the vibration length.
 * - The Vibration API requires a secure context (HTTPS) and user interaction on some platforms, meaning that it may not work on all websites or if triggered without a user action.
 */
function hapticFeedbackVibrate(milliseconds: number = 5) {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(milliseconds);
    }
  } catch (error) {
    // Error handling can be implemented here if needed
    console.error("Vibration API not supported or permission denied", error);
    // For now, it fails silently to avoid interrupting the user experience
  }
}

/**
 * Asynchronously copies a specified text to the clipboard and logs a success message.
 * Utilizes the Clipboard API available in modern browsers to perform the copy operation.
 * This function is designed to enhance user experience by facilitating the copy of text strings
 * such as URLs, tokens, or any textual content that users might need to copy frequently.
 *
 * @param {Object} params - The parameters for the copy operation.
 * @param {string} params.text - The text string to be copied to the clipboard.
 * @param {string} params.successMessage - A message to be logged on successful copy operation.
 *
 * @returns {void} This function returns no value. It performs an asynchronous operation
 * to copy text to the clipboard and handles success or failure internally.
 *
 * Usage:
 * - The function is designed to be called with an object containing two properties:
 *   `text`, the string to be copied, and `successMessage`, the message to log upon success.
 * - The function uses `await` to wait for the `navigator.clipboard.writeText(text)` promise to resolve,
 *   indicating the text has been successfully copied to the clipboard.
 * - Upon successful copy, the function logs the `successMessage` to the console.
 * - In case of an error (e.g., the Clipboard API is not available or permission is denied),
 *   the function catches the exception and logs an error message to the console.
 *
 * Example:
 * copyToClipboard({ text: 'Example text to copy', successMessage: 'Text copied successfully!' })
 *   .then(() => console.log('Copy to clipboard initiated'))
 *   .catch((error) => console.error('Copy to clipboard failed', error));
 *
 * Note:
 * - The Clipboard API requires the webpage to be served over HTTPS and user activation (e.g., a button click).
 * - Some browsers might restrict access to the Clipboard API due to security or privacy reasons.
 * - It's advisable to include error handling and user feedback mechanisms to account for situations
 *   where the copy operation might not be permitted or fail for any reason.
 */
const copyToClipboard = async ({ text }: { text: string }): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

// Helper function to convert SVG to Base64
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export {
  avatarColors,
  hapticFeedbackVibrate,
  formatCryptoAddressForDisplay,
  copyToClipboard,
  toBase64,
};
