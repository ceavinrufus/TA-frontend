"use client";

import React, { useEffect } from "react";
import { useOrderStore } from "../store/orderStore"; // adjust the import path
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { Separator } from "@/components/ui/separator";

const ListingOrderedCard = () => {
  const { listingDetails, reservationDetails, isLoading, fetchOrderDetails } =
    useOrderStore();

  const searchParams = useSearchParams();
  const hash = searchParams.get("hash"); // Get the hash from the URL

  useEffect(() => {
    if (!hash) {
      console.error("Hash not found in URL");
      return;
    }
    fetchOrderDetails(hash); // Fetch order details using the hash
  }, [hash]);

  const reservationCancellableUntil = (
    check_in_date: Date | string,
    cancellation_policy: string,
    created_at: Date | string
  ): Date | null => {
    let cancellableUntil: Date | null;
    const checkInDate = new Date(check_in_date);

    if (cancellation_policy === "Flexible") {
      const oneDayBefore = new Date(checkInDate);
      oneDayBefore.setDate(checkInDate.getDate() - 1);
      cancellableUntil = oneDayBefore;
    } else if (cancellation_policy === "Moderate") {
      const fiveDaysBefore = new Date(checkInDate);
      fiveDaysBefore.setDate(checkInDate.getDate() - 5);
      cancellableUntil = fiveDaysBefore;
    } else if (cancellation_policy === "Firm") {
      const thirtyDaysBefore = new Date(checkInDate);
      thirtyDaysBefore.setDate(checkInDate.getDate() - 30);
      cancellableUntil = thirtyDaysBefore;
    } else if (cancellation_policy === "Strict") {
      const fortyEightHoursAfterBooking = new Date(created_at);
      fortyEightHoursAfterBooking.setHours(
        fortyEightHoursAfterBooking.getHours() + 48
      );

      const fourteenDaysBefore = new Date(checkInDate);
      fourteenDaysBefore.setDate(checkInDate.getDate() - 14);

      // Use the earlier of the two dates
      cancellableUntil = new Date(
        Math.min(
          fortyEightHoursAfterBooking.getTime(),
          fourteenDaysBefore.getTime()
        )
      );
    } else {
      // Default to the check-in date if no valid cancellation policy is provided
      cancellableUntil = null;
    }

    return cancellableUntil;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!listingDetails || !reservationDetails) {
    return <div>No listing details available</div>;
  }

  let freeCancellationUntil = null;
  const freeCancellation = !listingDetails.is_no_free_cancellation;
  if (freeCancellation) {
    freeCancellationUntil = reservationCancellableUntil(
      reservationDetails.check_in_date!,
      listingDetails.cancellation_policy!,
      reservationDetails.created_at!
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 bg-white">
      <div className="flex gap-4">
        {/* Listing Image */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
          {listingDetails.pictures?.[0] && (
            <Image
              src={listingDetails.pictures[0]}
              alt={listingDetails.name || "Listing"}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Listing Details */}
        <div className="flex flex-col flex-grow">
          <h3 className="font-semibold text-lg">{listingDetails.name}</h3>
          <p className="text-sm text-gray-600">{listingDetails.address}</p>

          {/* Check-in/Check-out Times */}
          <div className="mt-2 text-sm flex bg-gray-100 w-fit py-3 px-1 rounded-md">
            <div className="px-4">
              <p className="text-xs">Check-in</p>
              <p>
                {formatDateStringForDisplay(
                  reservationDetails.check_in_date!,
                  "en-US",
                  false,
                  DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
                )}
              </p>
            </div>
            <Separator orientation="vertical" color="#B0B0B0" />
            <div className="px-4">
              <p className="text-xs">Check-out:</p>
              <p>
                {formatDateStringForDisplay(
                  reservationDetails.check_out_date!,
                  "en-US",
                  false,
                  DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="flex flex-col items-end">
          <p className="text-lg font-semibold">
            {listingDetails.default_price} ETH{" "}
            <span className="text-gray-500 text-xs">/night</span>
          </p>
          <div className="flex flex-row justify-start items-center gap-[4px]">
            <ResponsiveIcon
              icon={freeCancellation ? "icon-repeat" : "icon-no-repeat"}
              sizeDesktop={14}
              sizeMobile={12}
              color="#31456A"
            />
            <p className="text-xs">
              {freeCancellation
                ? `Free cancellation until ${
                    freeCancellationUntil?.toISOString().split("T")[0]
                  }`
                : "No free cancellation"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingOrderedCard;
