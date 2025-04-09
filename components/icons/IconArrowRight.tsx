import React from "react";

interface IconArrowRightProps {
  color?: string;
  size?: number;
}

const IconArrowRight: React.FC<IconArrowRightProps> = ({
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
        d="M8.34463 4.32953C8.78397 3.89019 9.07578 3.8902 9.51512 4.32954C9.51512 4.32954 15.6758 10.4902 16.1151 10.9295C16.5545 11.3689 16.5545 12.0812 16.1151 12.5205L9.51512 19.3295C9.07578 19.7689 8.78397 19.8599 8.34463 19.4205C7.90529 18.9812 7.90529 18.5689 8.34463 18.1295L14.3151 11.6205L8.31512 5.52955C7.87578 5.09021 7.90529 4.76887 8.34463 4.32953Z"
        fill={color}
      />
    </svg>
  );
};

export default IconArrowRight;
