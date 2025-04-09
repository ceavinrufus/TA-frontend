"use client";

import React, { useState } from "react";
import {
  EditListing,
  useEditListing,
} from "@/app/host/providers/EditListingProvider";
import GuestCountModifier from "@/app/host/components/GuestCountModifier";
import CustomDropdown from "./CustomDropdown";
import { propertyTypes } from "@/data/propertyTypes";
import { placeTypes } from "@/data/placeTypes";

/**
 * EditPropertyType component allows hosts to edit property details including property type, place type, and room settings.
 *
 * @component
 * @uses useEditListing - Custom hook that provides listing data and update functionality
 *
 * @remarks
 * The component handles:
 * - Property type selection from predefined property types
 * - Place type selection from predefined place types
 * - Room settings configuration including:
 *   - Number of bedrooms (0-10)
 *   - Number of beds (0-10)
 *   - Number of bathrooms (0-10)
 *
 * @returns A form with dropdown selectors for property/place types and room setting controls
 *
 * @example
 * ```tsx
 * <EditPropertyType />
 * ```
 */
const EditPropertyType = () => {
  const { listing, updateListing } = useEditListing();
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [placeTypeOpen, setPlaceTypeOpen] = useState(false);

  const propertyTypesOptions = propertyTypes.map((item) => ({
    label: item.type,
    value: item.type,
  }));

  const placeTypesOptions = placeTypes.map((item) => ({
    label: item.type,
    value: item.type,
  }));

  const types = [
    {
      id: "bedrooms" as keyof EditListing,
      label: "Bedrooms",
      minCount: 0,
      maxCount: 10,
    },
    {
      id: "beds" as keyof EditListing,
      label: "Beds",
      minCount: 0,
      maxCount: 10,
    },
    {
      id: "bathrooms" as keyof EditListing,
      label: "Bathrooms",
      minCount: 0,
      maxCount: 10,
    },
  ];

  const handleDecrease = (type: keyof EditListing) => {
    updateListing({
      [type]: Math.max(Number(listing[type] ?? 0) - 1, 0),
    });
  };

  const handleIncrease = (type: keyof EditListing) => {
    updateListing({
      [type]: Number(listing[type] ?? 0) + 1,
    });
  };

  return (
    <form className="flex flex-col items-start justify-start gap-12">
      <h1 className="edit-listing-page-title">Property Type</h1>

      <div className="flex flex-col w-full gap-4">
        {/* Property type */}
        <div className="flex flex-col w-full gap-2">
          <label
            className="edit-listing-form-input-label"
            htmlFor="propertyType"
          >
            Which of these best describes your property?
          </label>
          <CustomDropdown
            id="propertyType"
            open={propertyTypeOpen}
            onToggle={() => setPropertyTypeOpen(!propertyTypeOpen)}
            selectedValue={listing.property_type || null}
            onChange={(value) => updateListing({ property_type: value })}
            disabled={false}
            options={propertyTypesOptions}
            placeholder="Select a property type"
            className="md:p-4 md:h-[56px] md:rounded-2xl"
          />
        </div>

        {/* Place type */}
        <div className="flex flex-col w-full gap-2">
          <label className="edit-listing-form-input-label" htmlFor="placeType">
            Which type of place will guest get?
          </label>
          <CustomDropdown
            id="placeType"
            open={placeTypeOpen}
            onToggle={() => setPlaceTypeOpen(!placeTypeOpen)}
            selectedValue={listing.place_type || null}
            onChange={(value) => updateListing({ place_type: value })}
            disabled={false}
            options={placeTypesOptions}
            placeholder="Select a place type"
            className="md:p-4 md:h-[56px] md:rounded-2xl"
          />
        </div>
      </div>

      <div className="flex flex-col w-full gap-6">
        <h1 className="edit-listing-form-input-label">Room setting</h1>
        {types.map((type) => (
          <GuestCountModifier
            className="py-6 h-fit gap-12"
            labelClassName="host-page-h3-primary-blue"
            key={type.id}
            label={type.label}
            count={Number(
              listing[type.id as keyof EditListing] ?? type.minCount
            )}
            onDecrease={() => handleDecrease(type.id)}
            onIncrease={() => handleIncrease(type.id)}
            minCount={type.minCount}
            maxCount={type.maxCount}
          />
        ))}
      </div>
    </form>
  );
};

export default EditPropertyType;
