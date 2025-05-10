"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const CreateListingPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/host/create-listing/location");
  }, [router]);

  return <div className="w-full flex flex-col gap-20"></div>;
};

export default CreateListingPage;
