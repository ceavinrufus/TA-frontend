"use client";

import React from "react";
import { useOrderStore } from "../store/orderStore";
import Image from "next/image";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { Separator } from "@/components/ui/separator";
import { GUEST_DEPOSIT_RATE, SERVICE_FEE_RATE } from "@/constants";
import { reservationCancellableUntil } from "@/app/bookings/components/BookingAdditionalInfo";

const ListingOrderedCard = () => {
  const { listingDetails, reservationDetails, isLoading } = useOrderStore();

  if (isLoading) return <div>Loading...</div>;

  if (!listingDetails || !reservationDetails)
    return <div>No listing details available</div>;

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
      <div className="flex flex-col md:flex-row gap-4">
        {/* Listing Image */}
        <div className="relative h-48 w-full md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-lg">
          {listingDetails.pictures?.[0] && (
            <Image
              src={listingDetails.pictures[0]}
              alt={listingDetails.name || "Listing"}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Listing Details & Dates */}
        <div className="flex flex-col flex-grow justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg">{listingDetails.name}</h3>
            <p className="text-sm text-gray-600">{listingDetails.address}</p>
          </div>

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

        {/* Price & Cancellation Info */}
        <div className="flex flex-col items-start md:items-end justify-between md:justify-start">
          <p className="text-lg font-semibold">
            {Number(
              (
                listingDetails.default_price! *
                (1 - GUEST_DEPOSIT_RATE - SERVICE_FEE_RATE)
              ).toFixed(8)
            )}{" "}
            ETH <span className="text-gray-500 text-xs">/night</span>
          </p>
          <div className="flex flex-row justify-start items-center gap-1">
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
