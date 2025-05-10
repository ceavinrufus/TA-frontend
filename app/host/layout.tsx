import React from "react";
import { CreateListingProvider } from "./providers/CreateListingProvider";
import { EditListingProvider } from "./providers/EditListingProvider";

const HostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CreateListingProvider>
      <EditListingProvider>{children}</EditListingProvider>
    </CreateListingProvider>
  );
};

export default HostLayout;
