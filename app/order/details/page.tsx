import React from "react";
import ListingOrderedCard from "../components/ListingOrderedCard";
import PriceBreakdown from "../components/PriceBreakdown";
import OrderDetailsButtons from "../components/OrderDetailsButtons";

const OrderDetailsPage = () => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <ListingOrderedCard />
      <PriceBreakdown />
      <div className="flex justify-end">
        <OrderDetailsButtons />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
