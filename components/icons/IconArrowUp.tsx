import React from "react";

interface IconArrowUpProps {
  color?: string;
  size?: number;
}

const IconArrowUp: React.FC<IconArrowUpProps> = ({
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
        d="M10.534 8.3295C10.9733 7.89017 11.6857 7.89017 12.125 8.3295L18.875 14.5C19.3143 14.9393 19.3143 15.0607 18.875 15.5C18.4357 15.9393 18.2688 16.1098 17.8295 15.6705L11.3295 9.71599L5.3295 15.5C4.89017 15.9393 4.76884 15.9393 4.3295 15.5C3.89017 15.0607 3.89017 14.9393 4.3295 14.5L10.534 8.3295Z"
        fill={color}
      />
    </svg>
  );
};

export default IconArrowUp;
