// By Qi
import React from "react";

interface IconCheckProps {
  color?: string;
  size?: number;
}

const IconCheck: React.FC<IconCheckProps> = ({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.9939 5.43536C20.3056 5.70813 20.3372 6.18195 20.0644 6.49368L9.56443 18.4937C9.42774 18.6499 9.23242 18.7425 9.02496 18.7494C8.8175 18.7563 8.61645 18.6769 8.46967 18.5301L3.96967 14.0301C3.67678 13.7372 3.67678 13.2624 3.96967 12.9695C4.26256 12.6766 4.73744 12.6766 5.03033 12.9695L8.96347 16.9026L18.9356 5.50592C19.2083 5.19419 19.6822 5.1626 19.9939 5.43536Z"
        fill={color}
      />
    </svg>
  );
};

export default IconCheck;
