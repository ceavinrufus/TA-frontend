import React from "react";
import CreateListingStepNine from "../components/CreateListingStepNine";
import CreateListingNavigation from "../components/CreateListingNavigation";

const AgreementPage = (): JSX.Element => {
  return (
    <div className="w-[792px]">
      <CreateListingStepNine />

      <CreateListingNavigation
        backTo="/host/create-listing/price"
        nextTo="/host/create-listing/verification"
      />
    </div>
  );
};

export default AgreementPage;
