import React from "react";
import CreateListingNavigation from "../components/CreateListingNavigation";
import CreateListingStepThree from "../components/CreateListingStepThree";

/**
 * `PlaceTypePage` is a React functional component that renders the third step
 * of the create listing process for a host. It includes the `CreateListingStepThree`
 * component and the `CreateListingNavigation` component for navigation between steps.
 *
 * @component
 * @example
 * return (
 *   <PlaceTypePage />
 * )
 *
 * @returns {JSX.Element} A JSX element containing the third step of the create listing process.
 */
const PlaceTypePage = (): JSX.Element => {
  return (
    <div className="w-[792px]">
      <CreateListingStepThree />

      <CreateListingNavigation
        backTo="/host/create-listing/property-type"
        nextTo="/host/create-listing/guest-number"
      />
    </div>
  );
};

export default PlaceTypePage;
