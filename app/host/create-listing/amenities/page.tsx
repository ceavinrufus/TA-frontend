import React from "react";
import CreateListingStepFive from "../components/CreateListingStepFive";
import CreateListingNavigation from "../components/CreateListingNavigation";

/**
 * AmenitiesPage component renders the fifth step of the create listing process.
 * It includes the CreateListingStepFive component and navigation to the previous step.
 *
 * @component
 * The rendered component.
 */
const AmenitiesPage = () => {
  return (
    <div className="w-[792px]">
      <CreateListingStepFive />

      <CreateListingNavigation
        backTo="/host/create-listing/guest-number"
        nextTo="/host/create-listing/photos"
      />
    </div>
  );
};

export default AmenitiesPage;
