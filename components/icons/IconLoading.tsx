import React from "react";

interface IconLoadingProps {
  color?: string;
  size?: number;
}

const IconLoading: React.FC<IconLoadingProps> = ({
  color = "#1A1A1A",
  size = 24,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1C11.8625 1 15 4.1375 15 8H14C14 4.6875 11.3125 2 8 2V1ZM8 14C4.6875 14 2 11.3125 2 8H1C1 11.8625 4.1375 15 8 15V14Z"
        fill={color}
      />
    </svg>
  );
};

export default IconLoading;
