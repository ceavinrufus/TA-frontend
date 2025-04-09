"use client";

import React from "react";
import MapDisplayComponentEditListing from "./MapDisplayComponentEditListing";
import { PlaceAutoCompleteInput } from "./PlaceAutocompleteInput";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * EditLocation Component
 *
 * A form component for editing location details of a listing. Manages and updates location-related
 * information including address, coordinates, building details, and region information.
 *
 * @component
 * @uses useEditListing - Custom hook for managing listing state and updates
 *
 * @remarks
 * The component handles:
 * - Map display with coordinates
 * - Address autocomplete
 * - Unit/Floor information
 * - Building details
 * - District/Town/Village information
 * - City/Region selection
 * - Additional location details
 *
 * @example
 * ```tsx
 * <EditLocation />
 * ```
 *
 * @returns A form interface for editing location details of a listing
 */
const EditLocation = () => {
  const { listing, updateListing } = useEditListing();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    updateListing({
      location_details: {
        unit: listing.location_details?.unit || "",
        building: listing.location_details?.building || "",
        district: listing.location_details?.district || "",
        city: listing.location_details?.city || "",
        details: listing.location_details?.details || "",
        ...listing.location_details,
        [name]: value,
      },
    });
  };

  return (
    <form className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="edit-listing-page-title">Location</h1>

      {/* Map View */}
      <MapDisplayComponentEditListing
        center={
          listing.latitude && listing.longitude
            ? [listing.longitude, listing.latitude]
            : null
        }
        isInteractive={false}
      />

      {/* Forms */}
      <div className="flex flex-col w-full gap-4">
        {/* Place AutoComplete Input */}
        <div className="flex flex-col w-full gap-2">
          <label className="edit-listing-form-input-label" htmlFor="address">
            Address
          </label>
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
        {/* Unit / Floor */}
        <div className="flex flex-col w-full gap-2">
          <label className="edit-listing-form-input-label" htmlFor="unit">
            Unit / Floor
          </label>
          <Input
            name="unit"
            className="md:p-4 md:h-[56px] md:rounded-2xl"
            placeholder="Unit / Floor (if applicable)"
            value={listing.location_details?.unit || ""}
            onChange={handleChange}
          />
        </div>

        {/* Building */}
        <div className="flex flex-col w-full gap-2">
          <label className="edit-listing-form-input-label" htmlFor="building">
            Building
          </label>
          <Input
            name="building"
            className="md:p-4 md:h-[56px] md:rounded-2xl"
            placeholder="Building name (if applicable)"
            value={listing.location_details?.building || ""}
            onChange={handleChange}
          />
        </div>
        {/* District/Town/Village */}
        <div className="flex flex-col w-full gap-2">
          <label className="edit-listing-form-input-label" htmlFor="district">
            District/Town/Village
          </label>
          <Input
            name="district"
            className="md:p-4 md:h-[56px] md:rounded-2xl"
            placeholder="District/Town/Village"
            value={listing.location_details?.district || ""}
            onChange={handleChange}
          />
        </div>
        {/* City / Region */}
        <div className="flex flex-col w-full gap-2">
          <label className="edit-listing-form-input-label" htmlFor="city">
            City/Region
          </label>
          <Input
            name="city"
            className="md:p-4 md:h-[56px] md:rounded-2xl"
            placeholder="City/Region"
            value={listing.location_details?.city || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Provide More Details */}
      <div className="flex flex-col w-full gap-2">
        <label className="edit-listing-form-input-label" htmlFor="more-details">
          Provide More Details
        </label>
        <Textarea
          name="details"
          className="md:p-4 w-full rounded-2xl flex !items-start"
          placeholder="You may choose to describe the neighborhood and public transport in more detail. Provide your guests with comprehensive information."
          value={listing.location_details?.details || ""}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default EditLocation;
