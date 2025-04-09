export const formatAddress = (value: string) => {
  if (!value) return "";
  // Remove '0x' prefix if exists
  let cleaned = value.replace(/^0x/, "");
  // Remove any non-hexadecimal characters
  cleaned = cleaned.replace(/[^0-9a-fA-F]/g, "");
  return cleaned;
};
