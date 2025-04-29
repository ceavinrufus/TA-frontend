"use client";

import { useOrderStore } from "../store/orderStore";
import { GUEST_DEPOSIT_RATE, SERVICE_FEE_RATE } from "@/constants";

const PriceBreakdown = () => {
  const { reservationDetails, listingDetails } = useOrderStore();

  if (!reservationDetails || !listingDetails) {
    return null;
  }

  const formatPrice = (price: number) => {
    return `${Number(price.toFixed(8))} ETH`;
  };

  const priceTimesNight =
    listingDetails.default_price! * reservationDetails.night_staying!;

  const serviceFee = priceTimesNight * SERVICE_FEE_RATE;
  const guestDeposit = priceTimesNight * GUEST_DEPOSIT_RATE;

  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Price Details</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>
            {reservationDetails.night_staying}{" "}
            {reservationDetails.night_staying === 1 ? "night" : "nights"}
          </span>
          <span>
            {formatPrice(
              priceTimesNight * (1 - SERVICE_FEE_RATE - GUEST_DEPOSIT_RATE)
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Service fee</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>

        <div className="flex justify-between">
          <span>Guest deposit</span>
          <span>{formatPrice(guestDeposit)}</span>
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
