import React from "react";
import CreateListingStepSeven from "../components/CreateListingStepSeven";
import CreateListingNavigation from "../components/CreateListingNavigation";

/**
 * PropertyDescriptionPage component renders the seventh step of the create listing process.
 * It includes the CreateListingStepSeven component and navigation to the previous step.
 *
 * The JSX element for the property description page.
 */
const PropertyDescriptionPage = () => {
  return (
    <div className="w-[792px]">
      <CreateListingStepSeven />

      <CreateListingNavigation
        backTo="/host/create-listing/photos"
        nextTo="/host/create-listing/price"
      />
    </div>
  );
};

export default PropertyDescriptionPage;
