import { apiClient } from "./api-client";
import { Listing, ListingAggregateResDto } from "@/types/listing";

/**
 * Server Action: Create a new listing.
 * @param listingData - The data for the new listing.
 * @returns The created listing data.
 */
export async function createListing(listingData: Partial<Listing>) {
  return await apiClient.post("/listings", listingData);
}

/**
 * Server Action: Update an existing listing.
 * @param listingId - The ID of the listing to update.
 * @param listingData - The updated listing data.
 * @returns The updated listing data.
 */
export async function updateListing(
  listingId: string,
  listingData: Partial<Listing>
) {
  return await apiClient.patch(`/listings/${listingId}`, listingData);
}

/**
 * Server Action: Retrieve a listing by ID.
 * @param listingId - The ID of the listing to retrieve.
 * @returns The retrieved listing data.
 */
export async function getListingById(listingId: string) {
  return await apiClient.get(`/listings/${listingId}`);
}

/**
 * Server Action: Fetches listings by host ID.
 * @returns A promise that resolves to the listings data.
 */
export async function getListingByHost() {
  return await apiClient.get("/listings/host");
}

/**
 * Fetches the summary of host listings.
 *
 * This function makes a GET request to the `/listings/host/aggregates` endpoint
 * to retrieve aggregated data for host listings.
 *
 * @returns A promise that resolves to the summary of the host listings.
 */
export async function getHostListingSummary(): Promise<ListingAggregateResDto> {
  return await apiClient.get("/listings/host/aggregates");
}
