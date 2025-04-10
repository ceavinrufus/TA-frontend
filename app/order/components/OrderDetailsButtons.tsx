"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createReservation } from "@/lib/api/reservation";
import { useOrderStore } from "../store/orderStore";
import { getGuestInfo } from "@/lib/api/guest";
import { ReservationStatus } from "@/app/host/dashboard/reservations/utils/statusLabel";
import { SERVICE_FEE_RATE, TAX_RATE } from "@/constants";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";

const OrderDetailsButtons: React.FC = () => {
  const { reservationDetails, listingDetails } = useOrderStore();
  const { isConnected } = useAccount();

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!reservationDetails || !listingDetails) {
      return;
    }
    const checkIn = reservationDetails.check_in_date
      ? new Date(reservationDetails.check_in_date)
      : null;
    const checkOut = reservationDetails.check_out_date
      ? new Date(reservationDetails.check_out_date)
      : null;

    const user = await getGuestInfo();

    if (!user || !isConnected) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    const priceTimesNight =
      listingDetails.default_price! * reservationDetails.night_staying!;

    // Calculate service fee (assuming 10% of base price)
    const taxFee = priceTimesNight * TAX_RATE;
    const serviceFee = priceTimesNight * SERVICE_FEE_RATE;

    const payload = {
      listing_id: listingDetails.id,
      guest_id: user.id,
      base_price:
        listingDetails.default_price! * reservationDetails.night_staying!,
      check_in_date: checkIn.toString(),
      check_out_date: checkOut.toString(),
      guest_number: reservationDetails.guest_number,
      night_staying: reservationDetails.night_staying,
      total_price: reservationDetails.total_price,
      tax: taxFee,
      service_fee: serviceFee,
      guest_info: [],
      guest_wallet_address: user.wallet_address,
      status: ReservationStatus.ORDER_WAITING_PAYMENT,
      book_hash: reservationDetails.book_hash,
    };

    const reservation = (await createReservation(payload)) as Reservation;

    router.push(`/order/checkout?reservationId=${reservation.id}`);
  };

  return (
    <div className="flex gap-4">
      <Button
        variant={"ghost"}
        onClick={handleBack}
        className="px-4 py-2 rounded-md"
      >
        Back
      </Button>
      <Button
        variant={"default"}
        onClick={handleCheckout}
        className="px-4 py-2 text-white rounded-md"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default OrderDetailsButtons;
