import React from "react";

interface IconArrowLeftProps {
  color?: string;
  size?: number;
}

const IconArrowLeft: React.FC<IconArrowLeftProps> = ({
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
        d="M16.2 4.79999C16.6393 5.23933 16.6098 5.60616 16.1705 6.0455L10.216 12L16.1705 17.9545C16.6098 18.3938 16.6393 18.7607 16.2 19.2C15.7607 19.6393 15.4393 19.6393 15 19.2L8.4 12.7955C7.96066 12.3562 7.96066 11.6438 8.4 11.2045L15 4.80001C15.4393 4.36067 15.7607 4.36065 16.2 4.79999Z"
        fill={color}
      />
    </svg>
  );
};

export default IconArrowLeft;
