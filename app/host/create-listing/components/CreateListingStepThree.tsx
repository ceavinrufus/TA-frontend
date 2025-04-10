"use client";

import React from "react";
import ClickableCard from "../../../../components/ClickableCard";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import { useCreateListing } from "../../providers/CreateListingProvider";
import { placeTypes } from "@/data/placeTypes";

/**
 * Component for the third step of the create listing process.
 * Allows hosts to select the type of place they are listing.
 *
 * @component
 * @returns {JSX.Element} A form section containing:
 * - A title asking what type of place guests will get
 * - A list of clickable cards showing different place types
 * - Each card displays:
 *   - The place type name
 *   - A description
 *   - An icon
 *
 * @example
 * ```tsx
 * <CreateListingStepThree />
 * ```
 *
 * @remarks
 * Uses the useCreateListing hook to manage listing state
 * Selection is mutually exclusive - only one place type can be selected at a time
 * Clicking an already selected place type will deselect it
 */
const CreateListingStepThree = () => {
  const { listing, updateListing } = useCreateListing();

  const handleSelect = (place_type: string) => {
    updateListing({
      place_type: listing.place_type === place_type ? "" : place_type,
    });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="create-listing-page-title">
        What type of place will guest get?
      </h1>
      <div className="flex flex-col w-full gap-12">
        {placeTypes.map((place, index) => (
          <ClickableCard
            key={index}
            className="w-full h-[144px] rounded-[32px] px-12 py-6 items-start gap-12 flex-row"
            isClicked={listing.place_type === place.type}
            onClick={() => handleSelect(place.type)}
          >
            <div className="flex flex-col gap-2 h-full justify-center">
              <p className="host-page-h2-primary-blue">{place.type}</p>
              <p className="create-listing-place-type-description">
                {place.description}
              </p>
            </div>
            <div className="flex items-center h-full">
              <ResponsiveIcon
                icon={place.icon as IconType}
                sizeDesktop={80}
                color="#31456A"
              />
            </div>
          </ClickableCard>
        ))}
      </div>
    </div>
  );
};

export default CreateListingStepThree;
