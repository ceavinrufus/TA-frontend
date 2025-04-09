import React from "react";

interface IconIronBoxProps {
  color?: string;
  size?: number;
}

const IconIronBox: React.FC<IconIronBoxProps> = ({
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
      <path d="M4 8h16v10H4z" />

      <path d="M7 8C7 6 8 5 10 5h4c2 0 3 1 3 3" />

      <circle cx="17" cy="13" r="1.5" />

      <path d="M7 11h2M7 13h2M7 15h2" />

      <path d="M20 14c1 0 2 0 2 2" />
    </svg>
  );
};

export default IconIronBox;
