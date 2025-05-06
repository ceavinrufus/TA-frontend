"use client";

import React from "react";
import GuestCountModifier from "../../../../components/GuestCountModifier";
import {
  CreateListing,
  useCreateListing,
} from "../../providers/CreateListingProvider";

/**
 * Component for the fourth step of creating a listing, handling guest capacity and room details.
 *
 * @component
 * A form section for specifying guest numbers, bedrooms, beds, and bathrooms
 *
 * @example
 * ```tsx
 * <CreateListingStepFour />
 * ```
 *
 * @remarks
 * This component:
 * - Uses the `useCreateListing` hook to manage listing state
 * - Allows users to specify:
 *   - Number of guests (1-10)
 *   - Number of bedrooms (0-10)
 *   - Number of beds (0-10)
 *   - Number of bathrooms (0-10)
 * - Implements increment/decrement functionality with min/max limits
 * - Renders each option using the `GuestCountModifier` component
 */
const CreateListingStepFour = () => {
  const { listing, updateListing } = useCreateListing();

  const types = [
    {
      id: "guest_number" as keyof CreateListing,
      label: "Guest",
      minCount: 1,
      maxCount: 10,
    },
    {
      id: "bedrooms" as keyof CreateListing,
      label: "Bedrooms",
      minCount: 0,
      maxCount: 10,
    },
    {
      id: "beds" as keyof CreateListing,
      label: "Beds",
      minCount: 0,
      maxCount: 10,
    },
    {
      id: "bathrooms" as keyof CreateListing,
      label: "Bathrooms",
      minCount: 0,
      maxCount: 10,
    },
  ];

  const handleDecrease = (type: keyof CreateListing) => {
    updateListing({
      [type]: Math.max(Number(listing[type] ?? 0) - 1, 0),
    });
  };

  const handleIncrease = (type: keyof CreateListing) => {
    updateListing({
      [type]: Number(listing[type] ?? 0) + 1,
    });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="text-3xl">
        How many guests can fit comfortably in your space?
      </h1>
      <div className="flex flex-col w-full gap-12">
        {types.map((type) => (
          <GuestCountModifier
            labelClassName="text-xl font-semibold text-blue-950"
            key={type.id}
            label={type.label}
            count={Number(listing[type.id] ?? type.minCount)}
            onDecrease={() => handleDecrease(type.id)}
            onIncrease={() => handleIncrease(type.id)}
            minCount={type.minCount}
            maxCount={type.maxCount}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateListingStepFour;
