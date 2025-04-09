import React from "react";

interface IconBanProps {
  color?: string;
  size?: number;
}

const IconBan: React.FC<IconBanProps> = ({ color = "#1F1F1F", size = 24 }) => {
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
        d="M6.18842 5.12767C7.75642 3.80035 9.78475 3 12 3C16.9706 3 21 7.02944 21 12C21 14.2153 20.1996 16.2436 18.8723 17.8116L6.18842 5.12767ZM5.12775 6.18832C3.80038 7.75634 3 9.7847 3 12C3 16.9706 7.02944 21 12 21C14.2153 21 16.2437 20.1996 17.8117 18.8722L5.12775 6.18832ZM12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5Z"
        fill={color}
      />
    </svg>
  );
};

export default IconBan;
