import ClickableCard from "@/components/ClickableCard";
import { SearchListing } from "@/types/listing";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const ListingCard = ({ listing }: { listing: SearchListing }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const guests = searchParams.get("guests");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  return (
    <ClickableCard
      onClick={() => {
        router.push(
          `/search/${listing.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
        );
      }}
      className="border items-start rounded-lg p-4 shadow hover:shadow-neumorphic-card-up transition-shadow duration-200 ease-in-out"
    >
      {listing.pictures && listing.pictures[0] && (
        <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
          <Image
            src={listing.pictures[0]}
            alt={listing.name}
            className="absolute object-cover"
            fill
          />
        </div>
      )}
      <h2 className="text-lg font-semibold">{listing.name}</h2>
      <p className="text-gray-600">{listing.address}</p>
      <p className="text-gray-800 mt-2">
        {listing.daily_price?.[0] || "Price not available"} ETH{" "}
        <span className="text-gray-500 text-xs">/night</span>
      </p>
      <div className="mt-2 text-sm text-gray-600">
        {listing.guest_number} guests · {listing.bedrooms} bedrooms ·{" "}
        {listing.bathrooms} baths
      </div>
    </ClickableCard>
  );
};

export default ListingCard;
