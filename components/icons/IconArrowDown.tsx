import React from "react";

interface IconArrowDownProps {
  color?: string;
  size?: number;
}

const IconArrowDown: React.FC<IconArrowDownProps> = ({
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
        d="M4.32951 8.65903C4.76885 8.21969 4.93566 8.21969 5.375 8.65903L11.3295 14.6135L17.8295 8.3295C18.2688 7.89016 18.4357 7.89017 18.875 8.32951C19.3143 8.76885 19.3143 8.81068 18.875 9.25002L12.125 16C11.6857 16.4394 10.9734 16.4394 10.534 16L4.3295 9.82953C3.89017 9.39019 3.89017 9.09837 4.32951 8.65903Z"
        fill={color}
      />
    </svg>
  );
};

export default IconArrowDown;
