import React from "react";
import FinalizeOrder from "../components/FinalizeOrder";
import CheckoutButtons from "../components/CheckoutButtons";

const OrderCheckoutPage = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 w-full">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <FinalizeOrder />
      <div className="flex justify-end">
        <CheckoutButtons />
      </div>
    </div>
  );
};

export default OrderCheckoutPage;
