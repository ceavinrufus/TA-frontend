"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchListing } from "@/types/listing";
import { searchListings } from "@/lib/api/listing";

const ListingResults = () => {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const name = searchParams.get("name");
        const guests = searchParams.get("guests");
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");

        const searchListingsParams = {
          pagination: {
            page: 1,
            limit: 10,
          },
          filters: {
            listing_name: name || undefined,
          },
          params: {
            check_in: checkIn || undefined,
            check_out: checkOut || undefined,
            guests: guests
              ? {
                  adults: guests,
                }
              : undefined,
          },
        };

        const response = (await searchListings(searchListingsParams)) as {
          data: SearchListing[];
        };

        const data = await response.data;
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (listings.length === 0) {
    return <div>No listings found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {listings.map((listing) => (
        <div key={listing.id} className="border rounded-lg p-4 shadow">
          {listing.pictures && listing.pictures[0] && (
            <img
              src={listing.pictures[0]}
              alt={listing.name}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
          )}
          <h2 className="text-lg font-semibold">{listing.name}</h2>
          <p className="text-gray-600">{listing.address}</p>
          <p className="text-gray-800 mt-2">
            ${listing.daily_price?.[0] || "Price not available"} / night
          </p>
          <div className="mt-2 text-sm text-gray-600">
            {listing.guest_number} guests · {listing.bedrooms} bedrooms ·{" "}
            {listing.bathrooms} baths
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingResults;
