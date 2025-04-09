"use client";

import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const BackToDashboardButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      className="h-[48px] md:h-[56px]"
      onClick={() => router.push("/host/dashboard")}
    >
      <div className="flex flex-row items-center gap-2">
        <ResponsiveIcon icon="icon-arrow-back" sizeDesktop={24} />
        <p className="">Back to Dashboard</p>
      </div>
    </Button>
  );
};

export default BackToDashboardButton;
