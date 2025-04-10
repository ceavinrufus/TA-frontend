"use client";

import { useOrderStore } from "../store/orderStore";
import { SERVICE_FEE_RATE, TAX_RATE } from "@/constants";

const PriceBreakdown = () => {
  const { reservationDetails, listingDetails } = useOrderStore();

  if (!reservationDetails || !listingDetails) {
    return null;
  }

  const formatPrice = (price: number) => {
    return `${price} ETH`;
  };

  const priceTimesNight =
    listingDetails.default_price! * reservationDetails.night_staying!;

  // Calculate service fee (assuming 10% of base price)
  const taxFee = priceTimesNight * TAX_RATE;
  const serviceFee = priceTimesNight * SERVICE_FEE_RATE;

  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Price Details</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>
            {reservationDetails.night_staying}{" "}
            {reservationDetails.night_staying === 1 ? "night" : "nights"}
          </span>
          <span>{formatPrice(priceTimesNight)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatPrice(taxFee)}</span>
        </div>

        <div className="flex justify-between">
          <span>Service fee</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(reservationDetails.total_price!)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
