import React from "react";

interface IconArrowBackProps {
  color?: string;
  size?: number;
}

const IconArrowBack: React.FC<IconArrowBackProps> = ({
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
        d="M12.407 5.23789C12.8463 5.67723 12.6723 6.06065 12.233 6.49999L7.40349 11.3295H19.3125C19.9338 11.3295 20 11.6787 20 12.3C20 12.9213 19.9338 13.125 19.3125 13.125H7.40349L12.233 17.9545C12.6723 18.3938 12.6723 18.5607 12.233 19C11.7937 19.4393 11.4393 19.4393 11 19L5 13C4.56066 12.5607 4.56066 11.9393 5 11.5L11.2311 5.23789C11.6705 4.79855 11.9676 4.79855 12.407 5.23789Z"
        fill={color}
      />
    </svg>
  );
};

export default IconArrowBack;
