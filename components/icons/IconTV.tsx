import React from "react";

interface IconTVProps {
  color?: string;
  size?: number;
}

const IconTV: React.FC<IconTVProps> = ({ color = "#1A1A1A", size = 24 }) => {
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
        d="M3.00656 5.25C2.58872 5.25 2.25 5.58872 2.25 6.00656V15.7434C2.25 16.1613 2.58872 16.5 3.00656 16.5H20.9934C21.4113 16.5 21.75 16.1613 21.75 15.7434V6.00656C21.75 5.58872 21.4113 5.25 20.9934 5.25H3.00656ZM0.75 6.00656C0.75 4.7603 1.7603 3.75 3.00656 3.75H20.9934C22.2397 3.75 23.25 4.7603 23.25 6.00656V15.7434C23.25 16.9897 22.2397 18 20.9934 18H3.00656C1.7603 18 0.75 16.9897 0.75 15.7434V6.00656Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 19.5C5.25 19.0858 5.58579 18.75 6 18.75H18C18.4142 18.75 18.75 19.0858 18.75 19.5C18.75 19.9142 18.4142 20.25 18 20.25H6C5.58579 20.25 5.25 19.9142 5.25 19.5Z"
        fill={color}
      />
    </svg>
  );
};

export default IconTV;
