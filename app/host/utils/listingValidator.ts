import { Listing } from "@/types/listing";

/**
 * Validates a property listing by checking required fields and displays error messages if validation fails.
 *
 * Checks the following requirements:
 * - Location details (region_id, address, latitude, longitude)
 * - Property type
 * - Place type
 * - Guest capacity
 * - Property pictures (minimum 5)
 * - Property name
 * - Default price
 * - Security agreements (minimum 4)
 *
 * @param listing - The property listing object to validate
 * @returns boolean - Returns true if the listing is valid, false otherwise
 *
 * @remarks
 * If validation fails, displays an error toast message indicating the first encountered issue
 */
export const isListingValidated = (listing: Listing) => {
  let isValidated = true;
  let toastMessage = "";

  if (
    !listing.region_id ||
    !listing.address ||
    !listing.latitude ||
    !listing.longitude
  ) {
    toastMessage = "Please complete location details";
    isValidated = false;
  }

  if (!listing.property_type) {
    toastMessage = "Please select a property type";
    isValidated = false;
  }

  if (!listing.place_type) {
    toastMessage = "Please select a place type";
    isValidated = false;
  }

  if (!listing.guest_number) {
    toastMessage = "Please complete all capacity details";
    isValidated = false;
  }

  // if (!listing.amenities || listing.amenities?.length === 0) {
  //   toastMessage = "Please select at least one amenity";
  //   isValidated = false;
  // }

  if (!listing.pictures || listing.pictures?.length < 5) {
    toastMessage = "Please add at least five photos";
    isValidated = false;
  }

  if (!listing.name) {
    toastMessage = "Please add a property name";
    isValidated = false;
  }

  if (!listing.default_price) {
    toastMessage = "Please set a price";
    isValidated = false;
  }

  if (!listing.security_agreement || listing.security_agreement?.length < 4) {
    toastMessage = "Please check all security agreements";
    isValidated = false;
  }

  return { isValidated, toastMessage };
};
