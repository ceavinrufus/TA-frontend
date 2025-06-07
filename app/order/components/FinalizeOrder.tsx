"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrderStore } from "../store/orderStore";
import ListingOrderedCard from "./ListingOrderedCard";
import PriceBreakdown from "./PriceBreakdown";
import CheckoutInfo from "./CheckoutInfo";
import BookingAdditionalInfo from "@/app/bookings/components/BookingAdditionalInfo";

const FinalizeOrder: React.FC = () => {
  const {
    listingDetails,
    reservationDetails,
    isLoading,
    fetchOrderDetailsById,
    error,
  } = useOrderStore();

  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const router = useRouter();

  useEffect(() => {
    if (!reservationId) {
      console.error("Id not found in URL");
      router.back();
      return;
    }
    fetchOrderDetailsById(reservationId);
    if (error) {
      console.error("Error fetching order details:", error);
      router.back();
    }
  }, [reservationId, error]);

  if (isLoading) return <div>Loading...</div>;

  if (!listingDetails || !reservationDetails) {
    return <div>No listing details available</div>;
  }

  return (
    <>
      <ListingOrderedCard />
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 lg:gap-10">
        <div className="md:w-2/3">
          <PriceBreakdown />
        </div>
        <div className="md:w-1/3 flex flex-col gap-6 md:gap-2 justify-between">
          <CheckoutInfo />
        </div>
      </div>
    </>
  );
};

export default FinalizeOrder;
