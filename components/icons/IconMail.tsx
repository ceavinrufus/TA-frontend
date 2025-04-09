import React from "react";

interface IconMailProps {
  color?: string;
  size?: number;
}

const IconMail: React.FC<IconMailProps> = ({
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
        d="M4.125 5.25C3.50368 5.25 3 5.75368 3 6.375V17.625C3 18.2463 3.50368 18.75 4.125 18.75H19.875C20.4963 18.75 21 18.2463 21 17.625V6.375C21 5.75368 20.4963 5.25 19.875 5.25H4.125ZM1.5 6.375C1.5 4.92525 2.67525 3.75 4.125 3.75H19.875C21.3247 3.75 22.5 4.92525 22.5 6.375V17.625C22.5 19.0747 21.3247 20.25 19.875 20.25H4.125C2.67525 20.25 1.5 19.0747 1.5 17.625V6.375Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.65799 7.03954C4.91229 6.71258 5.3835 6.65368 5.71046 6.90799L12 11.7999L18.2895 6.90799C18.6165 6.65368 19.0877 6.71258 19.342 7.03954C19.5963 7.36651 19.5374 7.83771 19.2105 8.09201L12.4605 13.342C12.1896 13.5527 11.8104 13.5527 11.5395 13.342L4.78954 8.09201C4.46258 7.83771 4.40368 7.36651 4.65799 7.03954Z"
        fill={color}
      />
    </svg>
  );
};

export default IconMail;
