import React from "react";

interface IconCardProps {
  color?: string;
  size?: number;
}

const IconCard: React.FC<IconCardProps> = ({
  color = "#1F1F1F",
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
        d="M4.875 5.25C3.83947 5.25 3 6.08947 3 7.125V7.59375H21V7.125C21 6.08947 20.1605 5.25 19.125 5.25H4.875ZM3 16.875V10.4062H21V16.875C21 17.9105 20.1605 18.75 19.125 18.75H4.875C3.83947 18.75 3 17.9105 3 16.875ZM1.5 7.125C1.5 5.26104 3.01104 3.75 4.875 3.75H19.125C20.989 3.75 22.5 5.26104 22.5 7.125V16.875C22.5 18.739 20.989 20.25 19.125 20.25H4.875C3.01104 20.25 1.5 18.739 1.5 16.875V7.125ZM6 12.6562C5.22335 12.6562 4.59375 13.2858 4.59375 14.0625V15C4.59375 15.7767 5.22335 16.4062 6 16.4062H8.25C9.02665 16.4062 9.65625 15.7767 9.65625 15V14.0625C9.65625 13.2858 9.02665 12.6562 8.25 12.6562H6Z"
        fill={color}
      />
    </svg>
  );
};

export default IconCard;
