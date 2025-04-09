import React from "react";

interface IconMirrorProps {
  color?: string;
  size?: number;
}

const IconMirror: React.FC<IconMirrorProps> = ({
  color = "#1F1F1F",
  size = 24,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3L18 4.5V20L12 21.5L6 20V4.5L12 3Z" />

      <path d="M8 6.5H16V18H8V6.5Z" />

      <line x1="10" y1="8" x2="10" y2="16" stroke-opacity="0.2" />
      <line x1="14" y1="8" x2="14" y2="16" stroke-opacity="0.2" />

      <path d="M10 2.5C10 2 11 2 12 2C13 2 14 2 14 2.5" />
    </svg>
  );
};

export default IconMirror;
