"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrderStore } from "../store/orderStore";
import ListingOrderedCard from "./ListingOrderedCard";
import PriceBreakdown from "./PriceBreakdown";

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
      <PriceBreakdown />
    </>
  );
};

export default FinalizeOrder;
