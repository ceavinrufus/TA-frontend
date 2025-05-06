import React from "react";
import CreateListingStepTwo from "../components/CreateListingStepTwo";
import CreateListingNavigation from "../components/CreateListingNavigation";

/**
 * PropertyTypePage component renders the second step of the create listing process.
 * It includes the `CreateListingStepTwo` component and navigation to the next step.
 *
 * @component
 * @example
 * return (
 *   <PropertyTypePage />
 * )
 *
 * The rendered component.
 */
const PropertyTypePage = () => {
  return (
    <div className="w-[792px]">
      <CreateListingStepTwo />

      <CreateListingNavigation
        backTo="/host/create-listing/location"
        nextTo="/host/create-listing/place-type"
      />
    </div>
  );
};

export default PropertyTypePage;
