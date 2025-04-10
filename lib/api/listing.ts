import { apiClient } from "./api-client";
import {
  Listing,
  ListingAggregateResDto,
  SearchListing,
} from "@/types/listing";

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
 * Server Action: Search listings with filters and pagination.
 * @param searchParams - The search parameters including filters, pagination, and other params.
 * @returns The search results.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function searchListings(searchParams: any) {
  return await apiClient.post("/listings/search", searchParams);
}

/**
 * Server Action: Retrieve a listing by slug.
 * @param slug - The slug of the listing to retrieve.
 * @returns The retrieved listing data.
 */
export async function getListingBySlug(slug: string) {
  try {
    const response = (await apiClient.post(`/listings/search`, {
      pagination: {
        limit: 1,
        page: 1,
      },
      params: {
        slug,
      },
      use_cache: false,
    })) as { data: SearchListing[] };

    return response.data[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Server Action: Check listing availability and get price details.
 * @param slug - The slug of the listing to check.
 * @param startDate - The check-in date.
 * @param endDate - The check-out date.
 * @returns The availability and price details.
 */
export async function checkListingAvailability(
  slug: string,
  startDate: Date,
  endDate: Date,
  guests: { adults?: number; children?: number[] }
): Promise<SearchListing> {
  return await apiClient.post(`/listings/${slug}/check-availability`, {
    startDate,
    endDate,
    guests,
  });
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
