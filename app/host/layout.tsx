import React from "react";
import { CreateListingProvider } from "./providers/CreateListingProvider";

const HostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CreateListingProvider>
      <main className="flex flex-col items-center md:pt-8 pt-4 px-[16px] md:px-0 pb-[122px] md:pb-[80px]">
        {children}
      </main>
    </CreateListingProvider>
  );
};

export default HostLayout;
