import Link from "next/link";
import React from "react";

const RoleSwitcher = ({ isHost }: { isHost: boolean }) => {
  return (
    <Link href={isHost ? "/" : "/host"}>
      {isHost ? "Switch to Traveling" : "Switch to Hosting"}
    </Link>
  );
};

export default RoleSwitcher;
