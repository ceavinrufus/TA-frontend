"use client";

import React, { useEffect } from "react";
import { useOrderStore } from "../store/orderStore";
import { useRouter, useSearchParams } from "next/navigation";
import ListingOrderedCard from "./ListingOrderedCard";
import PriceBreakdown from "./PriceBreakdown";

const OrderSummary = () => {
  const { fetchOrderDetailsByHash, error } = useOrderStore();

  const searchParams = useSearchParams();
  const hash = searchParams.get("hash");

  const router = useRouter();

  useEffect(() => {
    if (!hash) {
      console.error("Hash not found in URL");
      router.back();
      return;
    }
    fetchOrderDetailsByHash(hash);
    if (error) {
      console.error("Error fetching order details:", error);
      router.back();
    }
  }, [hash, error]);

  return (
    <>
      <ListingOrderedCard />
      <PriceBreakdown />
    </>
  );
};

export default OrderSummary;
