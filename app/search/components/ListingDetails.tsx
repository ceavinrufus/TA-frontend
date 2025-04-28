"use client";

import { getListingBySlug } from "@/lib/api/listing";
import { SearchListing } from "@/types/listing";
import { useEffect, useState } from "react";
import Image from "next/image";
import { inRoom, nearbyThePlace } from "@/data/amenities";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import { Separator } from "@/components/ui/separator";
import { placeTypes } from "@/data/placeTypes";
import { propertyTypes } from "@/data/propertyTypes";
import PriceCard from "./PriceCard";

const ListingDetails = ({ slug }: { slug: string }) => {
  const [listing, setListing] = useState<SearchListing>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      setIsLoading(true);
      try {
        const response = (await getListingBySlug(slug)) as SearchListing;
        setListing(response);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No listings found
      </div>
    );
  }

  const placeType = placeTypes.find((type) => type.type === listing.place_type);
  const propertyType = propertyTypes.find(
    (type) => type.type === listing.property_type
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{listing.name}</h1>
        <p className="text-gray-600">{listing.address}</p>
        <p>
          {listing.guest_number}{" "}
          {listing.guest_number === 1 ? "guest" : "guests"} · {listing.bedrooms}{" "}
          {listing.bedrooms === 1 ? "bedroom" : "bedrooms"} ·{" "}
          {listing.bathrooms}{" "}
          {listing.bathrooms === 1 ? "bathroom" : "bathrooms"} · {listing.beds}{" "}
          {listing.beds === 1 ? "bed" : "beds"}
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-4 gap-4">
        {listing.pictures.slice(0, 5).map((pic, index) => (
          <div
            key={index}
            className={`relative ${
              index === 0 ? "col-span-2 row-span-2" : ""
            } rounded-lg overflow-hidden`}
            style={{ height: index === 0 ? "400px" : "200px" }}
          >
            <Image
              src={pic}
              alt={`Listing image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="flex flex-col gap-8 col-span-2">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Property Details</h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <ResponsiveIcon
                  icon={propertyType?.icon as IconType}
                  sizeDesktop={40}
                  color="#31456A"
                />{" "}
                <div className="">
                  <p className="font-semibold">{listing.property_type}</p>
                  <p className="text-sm">{propertyType?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ResponsiveIcon
                  icon={placeType?.icon as IconType}
                  sizeDesktop={40}
                  color="#31456A"
                />
                <div className="">
                  <p className="font-semibold">{listing.place_type}</p>
                  <p className="text-sm">{placeType?.description}</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Amenities Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "In Room",
                  amenities: inRoom.filter((amenity) =>
                    listing.amenities?.includes(amenity.type)
                  ),
                },
                {
                  title: "Nearby the Place",
                  amenities: nearbyThePlace.filter((amenity) =>
                    listing.amenities?.includes(amenity.type)
                  ),
                },
              ].map((section, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  <div className="grid grid-cols-2 gap-1">
                    {section.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ResponsiveIcon
                          icon={amenity.icon as IconType}
                          sizeDesktop={24}
                          color="#31456A"
                        />
                        <span>{amenity.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Location */}
        <div className="col-span-1">
          <PriceCard
            hotelId={slug}
            maxGuests={listing.guest_number}
            hotelPrice={{
              dailyPrice: listing.daily_price,
              totalPrice: listing.total_price,
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
