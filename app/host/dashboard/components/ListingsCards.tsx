"use client";

import React, { useEffect, useState } from "react";
import ClickableCard from "../../../../components/ClickableCard";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import ListingsCard from "./ListingCard";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import { getListingByHost } from "@/lib/api/listing";

/**
 * A component that displays a grid of listing cards for a host's properties.
 *
 * This component fetches listings data for the current host and displays them in a responsive grid layout.
 * It also includes a card to add new listings.
 *
 * @returns A grid layout containing listing cards and an "Add new listing" button
 *
 * @example
 * ```tsx
 * <ListingsCards />
 * ```
 *
 * The grid adapts to different screen sizes:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 */
const ListingsCards = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = (await getListingByHost()) as { data: Listing[] };

        setListings(response.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Listings */}
      {listings.map((listing, index) => (
        <ListingsCard key={index} listing={listing} />
      ))}
      {/* Add new listing */}
      <ClickableCard
        className="w-[378px] h-[420px] p-20 gap-4"
        onClick={() => {
          router.push("/host/create-listing");
        }}
        isClicked={false}
      >
        <ResponsiveIcon icon="icon-add" sizeDesktop={24} />

        <p className="text-xs sm:text-sm md:text-base hover:underline hover:underline-offset-4">
          Add new listing
        </p>
      </ClickableCard>
    </div>
  );
};

export default ListingsCards;
