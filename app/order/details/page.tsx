import React from "react";
import OrderDetailsButtons from "../components/OrderDetailsButtons";
import OrderSummary from "../components/OrderSummary";

const OrderDetailsPage = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 w-full">
      <h2 className="text-2xl font-bold">Order Summary</h2>
      <OrderSummary />
      <div className="flex justify-end">
        <OrderDetailsButtons />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
