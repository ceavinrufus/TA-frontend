// By Qi
import React from "react";

interface IconCheckCircleProps {
  color?: string;
  size?: number;
}

const IconCheckCircle: React.FC<IconCheckCircleProps> = ({
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
        d="M2.25 12C2.25 6.61704 6.61704 2.25 12 2.25C17.383 2.25 21.75 6.61704 21.75 12C21.75 17.383 17.383 21.75 12 21.75C6.61704 21.75 2.25 17.383 2.25 12ZM12 3.75C7.44546 3.75 3.75 7.44546 3.75 12C3.75 16.5545 7.44546 20.25 12 20.25C16.5545 20.25 20.25 16.5545 20.25 12C20.25 7.44546 16.5545 3.75 12 3.75Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.9824 7.67572C17.2996 7.94214 17.3407 8.41523 17.0743 8.73239L10.7743 16.2324C10.6347 16.3986 10.4299 16.4962 10.2128 16.4999C9.99576 16.5036 9.78775 16.4131 9.64253 16.2517L6.94253 13.2517C6.66543 12.9438 6.69039 12.4696 6.99828 12.1925C7.30616 11.9154 7.78038 11.9404 8.05747 12.2483L10.1805 14.6072L15.9257 7.76761C16.1921 7.45044 16.6652 7.4093 16.9824 7.67572Z"
        fill={color}
      />
    </svg>
  );
};

export default IconCheckCircle;
