"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createReservation } from "@/lib/api/reservation";
import { useOrderStore } from "../store/orderStore";
import { ReservationStatus } from "@/app/host/dashboard/reservations/utils/statusLabel";
import { GUEST_DEPOSIT_RATE, SERVICE_FEE_RATE } from "@/constants";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/user-store";
import { useWalletAuth } from "@/hooks/useWalletAuth";

const OrderDetailsButtons: React.FC = () => {
  const { reservationDetails, listingDetails } = useOrderStore();
  const { user } = useUserStore();
  const { connect } = useWalletAuth();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleCheckout = async () => {
    if (!reservationDetails || !listingDetails) return;

    const checkIn = reservationDetails.check_in_date
      ? new Date(reservationDetails.check_in_date)
      : null;
    const checkOut = reservationDetails.check_out_date
      ? new Date(reservationDetails.check_out_date)
      : null;

    if (!user || !isConnected) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to proceed.",
        variant: "destructive",
      });
      connect();
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

    if (!user.did) {
      toast({
        title: "DID not found",
        description: "Please verify yourself first.",
        variant: "destructive",
      });
      router.push("/verification");
      return;
    }

    const priceTimesNight =
      listingDetails.default_price! * reservationDetails.night_staying!;

    const serviceFee = priceTimesNight * SERVICE_FEE_RATE;
    const guestDeposit = priceTimesNight * GUEST_DEPOSIT_RATE;

    const payload = {
      listing_id: listingDetails.id,
      guest_id: user.id,
      base_price: priceTimesNight * (1 - SERVICE_FEE_RATE - GUEST_DEPOSIT_RATE),
      check_in_date: checkIn.toString(),
      check_out_date: checkOut.toString(),
      guest_number: reservationDetails.guest_number,
      night_staying: reservationDetails.night_staying,
      total_price: reservationDetails.total_price,
      service_fee: serviceFee,
      guest_deposit: guestDeposit,
      guest_info: [],
      guest_wallet_address: user.wallet_address,
      status: ReservationStatus.ORDER_WAITING_PAYMENT,
      book_hash: reservationDetails.book_hash,
      guest_did: user.did,
    };

    try {
      const reservation = (await createReservation(payload)) as Reservation;
      router.push(`/order/checkout?reservationId=${reservation.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create reservation";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
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
