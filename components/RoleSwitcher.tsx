import Link from "next/link";
import React from "react";

const RoleSwitcher = ({ isInHost }: { isInHost: boolean }) => {
  return (
    <Link href={isInHost ? "/" : "/host"}>
      {isInHost ? "Switch to Guest" : "Switch to Host"}
    </Link>
  );
};

export default RoleSwitcher;
