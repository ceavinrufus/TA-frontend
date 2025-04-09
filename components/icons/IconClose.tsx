import React from "react";

interface IconCloseProps {
  color?: string;
  size?: number;
}

const IconClose: React.FC<IconCloseProps> = ({
  color = "#1A1A1A",
  size = 24,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7.27734 6.21668C6.98445 5.92379 6.50958 5.92378 6.21668 6.21668C5.92379 6.50957 5.92378 6.98444 6.21668 7.27734L10.9393 12L6.21668 16.7226C5.92379 17.0155 5.92378 17.4903 6.21668 17.7832C6.50957 18.0761 6.98444 18.0761 7.27734 17.7832L12 13.0607L16.7225 17.7833C17.0154 18.0762 17.4903 18.0762 17.7832 17.7833C18.0761 17.4904 18.0761 17.0155 17.7832 16.7226L13.0606 12L17.7833 7.27739C18.0762 6.9845 18.0762 6.50962 17.7833 6.21673C17.4904 5.92384 17.0155 5.92383 16.7226 6.21673L12 10.9393L7.27734 6.21668Z"
        fill={color}
      />
    </svg>
  );
};

export default IconClose;
