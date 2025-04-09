import React from "react";
import CreateListingStepSix from "../components/CreateListingStepSix";
import CreateListingNavigation from "../components/CreateListingNavigation";

/**
 * PhotosPage component renders the sixth step of the create listing process.
 * It includes the CreateListingStepSix component and navigation to the previous step.
 *
 * @returns {JSX.Element} The rendered PhotosPage component.
 */
const PhotosPage = (): JSX.Element => {
  return (
    <div className="w-[792px]">
      <CreateListingStepSix />

      <CreateListingNavigation
        backTo="/host/create-listing/amenities"
        nextTo="/host/create-listing/property-description"
      />
    </div>
  );
};

export default PhotosPage;
