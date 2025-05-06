"use client";

import React from "react";
import { PlaceAutoCompleteInput } from "./PlaceAutocompleteInput";
import { useCreateListing } from "../../providers/CreateListingProvider";

/**
 * Component for the first step of creating a property listing.
 * Handles the location selection and address input for a property.
 *
 * @component
 * A form with city/region selection and address input fields
 *
 * @example
 * ```tsx
 * <CreateListingStepOne />
 * ```
 *
 * @remarks
 * This component uses two main handlers:
 * - handlePlaceChange: Updates the listing with address and coordinates
 * - handleCitySelect: Updates the listing with region/city information
 *
 * The component integrates with:
 * - PlaceAutoCompleteInput component for address input
 * - useCreateListing hook for managing listing state
 */
const CreateListingStepOne = () => {
  const { listing, updateListing } = useCreateListing();

  const handlePlaceChange = (place: {
    value: string;
    coordinates: number[] | null;
  }) => {
    updateListing({
      address: place.value,
      latitude: place.coordinates ? place.coordinates[1] : undefined,
      longitude: place.coordinates ? place.coordinates[0] : undefined,
    });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <div className="space-y-2">
        <h1 className="text-3xl">Where is your property located?</h1>
        <p className="create-listing-page-subtitle">
          Please be assured that in order to protect your privacy, we do not
          display your address details until the guest has made a booking.
        </p>
      </div>
      <div className="space-y-2 w-full">
        <PlaceAutoCompleteInput
          value={{
            value: listing.address || "",
            coordinates:
              listing.latitude && listing.longitude
                ? [listing.longitude, listing.latitude]
                : null,
          }}
          onChange={handlePlaceChange}
        />
      </div>
    </div>
  );
};

export default CreateListingStepOne;
