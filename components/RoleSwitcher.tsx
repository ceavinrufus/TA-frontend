"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const RoleSwitcher = () => {
  const pathname = usePathname();
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/host")) {
      setIsHost(true);
    } else {
      setIsHost(false);
    }
  }, [pathname]);

  return (
    <Link href={isHost ? "/" : "/host"}>
      {isHost ? "Switch to Traveling" : "Switch to Hosting"}
    </Link>
  );
};

export default RoleSwitcher;
