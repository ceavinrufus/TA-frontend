import React from "react";

interface IconArrowForwardProps {
  color?: string;
  size?: number;
}

const IconArrowForward: React.FC<IconArrowForwardProps> = ({
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
        d="M11.767 5.29282C12.2063 4.85348 12.5607 4.93209 13 5.37143L19 11.8714C19.4393 12.3108 19.4393 12.3652 19 12.8046L12.7825 19.247C12.3432 19.6864 12.2063 19.5235 11.767 19.0842C11.3277 18.6448 11.3277 18.3108 11.767 17.8714L16.5965 13.0419H4.6875C4.06618 13.0419 4 12.9927 4 12.3714C4 11.7501 4.06618 11.4498 4.6875 11.4498H16.5965L11.767 6.37145C11.3277 5.93211 11.3277 5.73216 11.767 5.29282Z"
        fill={color}
      />
    </svg>
  );
};

export default IconArrowForward;
