"use client";

import React, { useEffect, useState } from "react";
import { SearchListing } from "@/types/listing";
import { searchListings } from "@/lib/api/listing";
import ListingCard from "./ListingCard";

const ListingResults = ({
  searchParams,
}: {
  searchParams: {
    name: string | null;
    guests: number | null;
    checkIn: Date | null;
    checkOut: Date | null;
  };
}) => {
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const name = searchParams.name;
  const guests = searchParams.guests;
  const checkIn = searchParams.checkIn;
  const checkOut = searchParams.checkOut;

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingResults;
