// By Qi
import React from "react";

interface IconMenuProps {
  color?: string;
  size?: number;
}

const IconMenu: React.FC<IconMenuProps> = ({
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
        d="M3 7.5C3 7.08579 3.33579 6.75 3.75 6.75H20.25C20.6642 6.75 21 7.08579 21 7.5C21 7.91421 20.6642 8.25 20.25 8.25H3.75C3.33579 8.25 3 7.91421 3 7.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 12C3 11.5858 3.33579 11.25 3.75 11.25H20.25C20.6642 11.25 21 11.5858 21 12C21 12.4142 20.6642 12.75 20.25 12.75H3.75C3.33579 12.75 3 12.4142 3 12Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 16.5C3 16.0858 3.33579 15.75 3.75 15.75H20.25C20.6642 15.75 21 16.0858 21 16.5C21 16.9142 20.6642 17.25 20.25 17.25H3.75C3.33579 17.25 3 16.9142 3 16.5Z"
        fill={color}
      />
    </svg>
  );
};

export default IconMenu;
