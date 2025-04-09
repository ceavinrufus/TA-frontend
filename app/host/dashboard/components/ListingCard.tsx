"use client";

import React from "react";
import ClickableCard from "../../components/ClickableCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";

/**
 * A card component for displaying listing information in the host dashboard.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Listing} props.listing - The listing object containing all the property details
 *
 * @remarks
 * The card displays:
 * - Property image
 * - Property name
 * - Property address
 * - Current status badge with dynamic coloring based on availability/reservation state
 *
 * Status badges can show:
 * - "Available today" (green) - If property is available for booking today
 * - "Unlisted" (gray) - If property is complete but not available
 * - "Draft" (gray) - If listing is in draft state
 * - "Rejected" (red) - If listing was rejected
 * - "Reserved today" (blue) - If property is reserved for today
 * - "In-review" (yellow) - If listing is under review
 *
 * Clicking the card navigates to the listing's detail page with location step.
 *
 * @returns {JSX.Element} A clickable card displaying listing information
 */
const ListingsCard = ({ listing }: { listing: Listing }) => {
  // const { setListing } = useEditListing();
  const router = useRouter();

  const statusColors = {
    "Available today": "bg-green-success text-secondary-success",
    Unlisted: "bg-[#EBEBEB] text-[#888888]",
    Draft: "bg-[#EBEBEB] text-[#888888]",
    Rejected: "bg-secondary-red-error-bg text-secondary-error",
    "Reserved today": "bg-[#E3E8F2] text-primary-blue",
    "In-review": "bg-[#F2EAD5] text-[#D7AA22]",
  };

  const today = new Date();
  const is_reserved_today = listing.reservations?.some(
    (reservation) =>
      new Date(reservation.check_in_date) <= today &&
      new Date(reservation.check_out_date) >= today &&
      reservation.status !== ReservationStatus.ORDER_CANCELED &&
      reservation.status !== ReservationStatus.ORDER_FAIL
  );

  const is_available_today =
    listing.availabilities?.some(
      (availability) =>
        new Date(availability.start_date) <= today &&
        new Date(availability.end_date) >= today &&
        availability.availability_override
    ) || listing.default_availability;

  const statusLabel = (() => {
    if (listing.status === "LISTING_COMPLETED") {
      if (is_reserved_today) {
        return "Reserved today";
      } else if (is_available_today) {
        return "Available today";
      } else {
        return "Unlisted";
      }
    }
    if (listing.status === "LISTING_DRAFT") {
      return "Draft";
    } else if (listing.status === "LISTING_IN_REVIEW") {
      return "In-review";
    } else if (listing.status === "LISTING_REJECTED") {
      return "Rejected";
    }
    return listing.status
      ?.replace("LISTING_", "")
      .replace(/_/g, "-")
      .toLowerCase();
  })();

  const handleClick = () => {
    router.push(`/host/dashboard/listings/${listing.id}?step=location`);
  };

  return (
    <ClickableCard
      className="w-[378px] px-4 py-6 justify-between gap-4"
      onClick={handleClick}
      isClicked={false}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full h-[220px] rounded-[4px] overflow-hidden">
          <Image
            src={listing.pictures?.[0] ?? "/referral-invite.png"}
            alt={listing.name ?? "Listing Card Image"}
            className="object-cover"
            fill
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="host-listing-card-title">{listing.name}</p>
          <p className="host-listing-card-address">{listing.address}</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-1">
          {/* Overall rating */}
          {/* <div className="rounded-[4px] gap-[10px] p-1 bg-primary-blue">
                <p className="host-listing-card-rating-number"></p>
              </div> */}
          <div className="flex flex-col gap-1">
            {/* Review overall label (Example: Very good) */}
            <p className="host-listing-card-rating-label"></p>
            {/* Review counts */}
            <p className="host-listing-card-review-text"></p>
          </div>
        </div>
        <Badge
          className={cn(
            "p-1 justify-center items-center flex gap-1 rounded-[4px] host-listing-status-text capitalize",
            statusColors[statusLabel as keyof typeof statusColors] ??
              "bg-[#EBEBEB] text-[#888888]"
          )}
        >
          {statusLabel}
        </Badge>
      </div>
    </ClickableCard>
  );
};

export default ListingsCard;
