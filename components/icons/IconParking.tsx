import React from "react";

interface IconMailProps {
  color?: string;
  size?: number;
}

const IconParking: React.FC<IconMailProps> = ({
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
        d="M6 3H13C14.5913 3 16.1174 3.63214 17.2426 4.75736C18.3679 5.88258 19 7.4087 19 9C19 10.5913 18.3679 12.1174 17.2426 13.2426C16.1174 14.3679 14.5913 15 13 15H8V21H6V3ZM8 4.75736V13.2426H13C14.0609 13.2426 15.3209 12.5786 16.0711 11.8284C16.8212 11.0783 17.2426 10.0609 17.2426 9C17.2426 7.93913 16.8212 6.92172 16.0711 6.17157C15.3209 5.42143 14.0609 4.75736 13 4.75736H8Z"
        fill={color}
      />
    </svg>
  );
};

export default IconParking;
