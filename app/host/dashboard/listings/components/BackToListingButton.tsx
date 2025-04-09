"use client";

import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const BackToListingButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      className="h-[48px] md:h-[56px]"
      onClick={() => router.push("/host/dashboard/listings")}
    >
      <div className="flex flex-row items-center gap-2">
        <ResponsiveIcon icon="icon-arrow-back" sizeDesktop={24} />
        <p className="">Back to my listing</p>
      </div>
    </Button>
  );
};

export default BackToListingButton;
