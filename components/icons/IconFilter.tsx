import React from "react";

interface IconFilterProps {
  color?: string;
  size?: number;
}

const IconFilter: React.FC<IconFilterProps> = ({
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
        d="M0.75 6.75C0.75 6.33579 1.08579 6 1.5 6H22.5C22.9142 6 23.25 6.33579 23.25 6.75C23.25 7.16421 22.9142 7.5 22.5 7.5H1.5C1.08579 7.5 0.75 7.16421 0.75 6.75ZM4.5 12C4.5 11.5858 4.83579 11.25 5.25 11.25H18.75C19.1642 11.25 19.5 11.5858 19.5 12C19.5 12.4142 19.1642 12.75 18.75 12.75H5.25C4.83579 12.75 4.5 12.4142 4.5 12ZM9 17.25C9 16.8358 9.33579 16.5 9.75 16.5H14.25C14.6642 16.5 15 16.8358 15 17.25C15 17.6642 14.6642 18 14.25 18H9.75C9.33579 18 9 17.6642 9 17.25Z"
        fill={color}
      />
    </svg>
  );
};

export default IconFilter;
