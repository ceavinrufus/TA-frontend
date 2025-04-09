import React from "react";

interface IconBathRobeProps {
  color?: string;
  size?: number;
}

const IconBathRobe: React.FC<IconBathRobeProps> = ({ color = "#1F1F1F", size = 24 }) => {
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
      <path d="M8 4C8 4 10 3 12 3C14 3 16 4 16 4" />
      <path d="M8 4L7 7L9 9L12 7L15 9L17 7L16 4" />

      <path d="M7 7L6 20H18L17 7" />

      <path d="M6 12H18" />
      <path d="M11 12C11 14 13 14 13 12" />

      <path d="M7 7C5 9 4 11 4 13" />
      <path d="M17 7C19 9 20 11 20 13" />
    </svg>
  );
};

export default IconBathRobe;
