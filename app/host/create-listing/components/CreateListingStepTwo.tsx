"use client";

import React from "react";
import ClickableCard from "../../../../components/ClickableCard";
import { useCreateListing } from "../../providers/CreateListingProvider";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import { propertyTypes } from "@/data/propertyTypes";

/**
 * A component that represents the second step in the create listing process.
 * Allows users to select a property type from predefined options.
 *
 * @component
 * A form section containing property type selection cards
 *
 * @example
 * ```tsx
 * <CreateListingStepTwo />
 * ```
 *
 * @remarks
 * This component:
 * - Uses the CreateListing context to manage property type selection
 * - Displays a grid of clickable cards with property type options
 * - Allows only one property type to be selected at a time
 * - Updates the listing context when a property type is selected
 *
 * @see {@link ClickableCard}
 * @see {@link ResponsiveIcon}
 */
const CreateListingStepTwo = () => {
  const { listing, updateListing } = useCreateListing();

  const handleSelect = (property_type: string) => {
    // Toggle the selected type in the context (only one type at a time)
    updateListing({
      property_type:
        listing.property_type === property_type ? "" : property_type,
    });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="text-3xl">Which of these best describes your property?</h1>
      <div className="grid grid-cols-4 gap-6">
        {propertyTypes.map((property, index) => (
          <ClickableCard
            key={index}
            className="w-[177px] h-[88px] gap-2"
            isClicked={listing.property_type === property.type}
            onClick={() => handleSelect(property.type)}
          >
            <ResponsiveIcon
              icon={property.icon as IconType}
              sizeDesktop={24}
              color="#31456A"
            />
            <p>{property.type}</p>
          </ClickableCard>
        ))}
      </div>
    </div>
  );
};

export default CreateListingStepTwo;
