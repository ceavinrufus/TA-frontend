import React from "react";
import CreateListingNavigation from "../components/CreateListingNavigation";
import CreateListingStepOne from "../components/CreateListingStepOne";

/**
 * LocationPage component
 *
 * This component represents the location selection page in the listing creation process.
 * It renders a container with a fixed width of 792px that includes the CreateListingStepOne component
 * and the CreateListingNavigation component for navigation.
 *
 * @component
 * @example
 * return (
 *   <LocationPage />
 * )
 *
 * @returns {JSX.Element} The rendered location selection page.
 */
const LocationPage = (): JSX.Element => {
  return (
    <div className="w-[792px]">
      <CreateListingStepOne />

      <CreateListingNavigation
        backTo="/host"
        nextTo="/host/create-listing/property-type"
      />
    </div>
  );
};

export default LocationPage;
