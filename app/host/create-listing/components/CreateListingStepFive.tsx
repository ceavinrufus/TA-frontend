"use client";

import React from "react";
import ClickableCard from "../../../../components/ClickableCard";
import { useCreateListing } from "../../providers/CreateListingProvider";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import { inRoom, nearbyThePlace } from "@/data/amenities";

/**
 * A component for the fifth step of the listing creation process.
 * Allows hosts to select amenities available at their property.
 *
 * @component
 * @returns {JSX.Element} A form section for selecting property amenities
 *
 * Features:
 * - Displays amenities grouped by location (in-room and nearby)
 * - Allows toggling of amenity selection
 * - Updates listing state through context
 *
 * @example
 * ```tsx
 * <CreateListingStepFive />
 * ```
 *
 * @uses {useCreateListing} Custom hook for managing listing state
 * @uses {ClickableCard} Component for selectable amenity cards
 * @uses {ResponsiveIcon} Component for rendering amenity icons
 */
const CreateListingStepFive = () => {
  const { listing, updateListing } = useCreateListing();

  const handleSelect = (type: string) => {
    updateListing({
      amenities: listing.amenities?.includes(type)
        ? listing.amenities.filter((t: string) => t !== type)
        : [...(listing.amenities || []), type],
    });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="create-listing-page-title">
        What kind of amenities your place provide?
      </h1>
      {[
        { title: "In Room", amenities: inRoom, category: "inRoom" },
        {
          title: "Nearby the Place",
          amenities: nearbyThePlace,
          category: "nearbyThePlace",
        },
      ].map((section, index) => (
        <div key={index} className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-blue-950">
            {section.title}
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {section.amenities.map((amenity, idx) => (
              <ClickableCard
                key={idx}
                className="w-[177px] h-[88px] gap-2"
                isClicked={listing.amenities?.includes(amenity.type)}
                onClick={() => handleSelect(amenity.type)}
              >
                <ResponsiveIcon
                  icon={amenity.icon as IconType}
                  sizeDesktop={24}
                  color="#31456A"
                />
                <p>{amenity.type}</p>
              </ClickableCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreateListingStepFive;
