import React from "react";

interface IconExpandedProps {
  color?: string;
  size?: number;
}

const IconExpanded: React.FC<IconExpandedProps> = ({
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
        d="M6.96967 9.59467C7.26256 9.30178 7.73744 9.30178 8.03033 9.59467L12 13.5643L15.9697 9.59467C16.2626 9.30178 16.7374 9.30178 17.0303 9.59467C17.3232 9.88756 17.3232 10.3624 17.0303 10.6553L12.5303 15.1553C12.2374 15.4482 11.7626 15.4482 11.4697 15.1553L6.96967 10.6553C6.67678 10.3624 6.67678 9.88756 6.96967 9.59467Z"
        fill={color}
      />
    </svg>
  );
};

export default IconExpanded;
