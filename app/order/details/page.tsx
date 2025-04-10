import React from "react";
import ListingOrderedCard from "../components/ListingOrderedCard";
import PriceBreakdown from "../components/PriceBreakdown";

const OrderDetailsPage = () => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <ListingOrderedCard />
      <PriceBreakdown />
    </div>
  );
};

export default OrderDetailsPage;
