import React from "react";
import CreateListingNavigation from "../components/CreateListingNavigation";
import CreateListingStepFour from "../components/CreateListingStepFour";

/**
 * GuestNumberPage component
 *
 * This component represents the guest number selection page in the listing creation process.
 * It renders a container with a fixed width of 792px that includes the CreateListingStepFour component
 * and the CreateListingNavigation component for navigation.
 *
 * @component
 * @example
 * return (
 *   <GuestNumberPage />
 * )
 *
 * @returns {JSX.Element} The rendered guest number selection page.
 */
const GuestNumberPage = (): JSX.Element => {
  return (
    <div className="w-[792px]">
      <CreateListingStepFour />

      <CreateListingNavigation
        backTo="/host/create-listing/place-type"
        nextTo="/host/create-listing/amenities"
      />
    </div>
  );
};

export default GuestNumberPage;
