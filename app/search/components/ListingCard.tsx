import ClickableCard from "@/components/ClickableCard";
import { GUEST_DEPOSIT_RATE, SERVICE_FEE_RATE } from "@/constants";
import { SearchListing } from "@/types/listing";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
      {listing.pictures && listing.pictures.length > 0 && (
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full mb-2 rounded-lg overflow-hidden"
        >
          <CarouselContent>
            {listing.pictures.map((picture, index) => (
              <CarouselItem key={index} className="relative w-full h-48">
                <Image
                  src={picture}
                  alt={`${listing.name} - Image ${index + 1}`}
                  className="absolute object-cover"
                  fill
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
      <h2 className="text-lg font-semibold">{listing.name}</h2>
      <p className="text-gray-600">{listing.address}</p>
      <p className="text-gray-800 mt-2">
        {Number(
          (
            listing.daily_price?.[0] *
            (1 - SERVICE_FEE_RATE - GUEST_DEPOSIT_RATE)
          ).toFixed(8)
        ) || "Price not available"}{" "}
        ETH <span className="text-gray-500 text-xs">/night</span>
      </p>
      <div className="mt-2 text-sm text-gray-600">
        {listing.guest_number} {listing.guest_number === 1 ? "guest" : "guests"}{" "}
        · {listing.bedrooms} {listing.bedrooms === 1 ? "bedroom" : "bedrooms"} ·{" "}
        {listing.bathrooms} {listing.bathrooms === 1 ? "bath" : "baths"}
      </div>
    </ClickableCard>
  );
};

export default ListingCard;
