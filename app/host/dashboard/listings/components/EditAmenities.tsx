"use client";

import React from "react";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import ClickableCard from "@/components/ClickableCard";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import { Button } from "@/components/ui/button";
import { inRoom, nearbyThePlace } from "@/data/amenities";

/**
 * EditAmenities component for managing and editing amenities in a listing.
 *
 * @component
 * @description Allows hosts to add or remove amenities for their property listing.
 * The component displays amenities in two categories: "In Room" and "Nearby the Place".
 * Each amenity can be toggled on/off by clicking.
 *
 * @remarks
 * The component uses:
 * - useEditListing hook to manage listing state and updates
 * - NeumorphicIconButton for the add button
 * - ClickableCard for each amenity option
 * - ResponsiveIcon for amenity icons
 *
 * @returns A form containing:
 * - Header section with title and add button
 * - Two sections of amenities (In Room and Nearby the Place)
 * - Grid of clickable amenity cards
 *
 * @example
 * ```tsx
 * <EditAmenities />
 * ```
 */
const EditAmenities = () => {
  const { listing, updateListing } = useEditListing();

  const handleSelect = (type: string) => {
    const updatedCategory = listing.amenities || [];
    updateListing({
      ...listing,
      amenities: updatedCategory.includes(type)
        ? updatedCategory.filter((t: string) => t !== type)
        : [...updatedCategory, type],
    });
  };

  return (
    <form className="flex flex-col items-start justify-start gap-16">
      <div className="flex items-start justify-between w-full">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-blue-950">Amenities</h1>
          <p className="edit-listing-page-subtitle">
            Here you can manage amenities your place provided!
          </p>
        </div>
        <Button
          variant={"outline"}
          className="w-[48px] h-[48px]"
          onClick={() => {}}
        >
          <ResponsiveIcon icon="icon-add" sizeDesktop={28.8} />
        </Button>
      </div>

      {[
        { title: "In Room", amenities: inRoom, category: "inRoom" },
        {
          title: "Nearby the Place",
          amenities: nearbyThePlace,
          category: "nearbyThePlace",
        },
      ].map((section, index) => (
        <div key={index} className="flex flex-col gap-6 w-full">
          <h2 className="text-xl font-semibold text-blue-950">
            {section.title}
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {section.amenities.map((amenity, idx) => (
              <ClickableCard
                key={idx}
                className="w-full h-[88px] gap-2"
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
    </form>
  );
};

export default EditAmenities;
