import React from "react";
import CreateListingStepEight from "../components/CreateListingStepEight";
import CreateListingNavigation from "../components/CreateListingNavigation";

/**
 * PricePage component renders the eighth step of the create listing process.
 * It includes the CreateListingStepEight component and navigation buttons
 * to move back to the property description step or forward to the agreement step.
 *
 * The rendered PricePage component.
 */
const PricePage = () => {
  return (
    <div className="w-[792px]">
      <CreateListingStepEight />

      <CreateListingNavigation
        backTo="/host/create-listing/property-description"
        nextTo="/host/create-listing/agreement"
      />
    </div>
  );
};

export default PricePage;
