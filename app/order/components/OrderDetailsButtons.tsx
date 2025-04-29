"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createReservation } from "@/lib/api/reservation";
import { useOrderStore } from "../store/orderStore";
import { getGuestInfo } from "@/lib/api/guest";
import { ReservationStatus } from "@/app/host/dashboard/reservations/utils/statusLabel";
import { GUEST_DEPOSIT_RATE, SERVICE_FEE_RATE } from "@/constants";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import PrivadoAuthQR from "./PrivadoAuthQR";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import IconClose from "@/components/icons/IconClose";

const OrderDetailsButtons: React.FC = () => {
  const { reservationDetails, listingDetails } = useOrderStore();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const router = useRouter();

  const [showQRModal, setShowQRModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleCheckout = async (userDID: string) => {
    if (!reservationDetails || !listingDetails) return;

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
      guest_did: userDID,
    };

    const reservation = (await createReservation(payload)) as Reservation;

    router.push(`/order/checkout?reservationId=${reservation.id}`);
  };

  const handleProceedClick = () => {
    if (!isConnected) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    } else {
      setShowQRModal(true);
    }
  };

  const handleQRSuccess = (did: string) => {
    setShowQRModal(false);
    handleCheckout(did);
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
      <Dialog open={showQRModal}>
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            onClick={handleProceedClick}
            className="px-4 py-2 text-white rounded-md"
          >
            Proceed to Checkout
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-4 sm:p-6 rounded-xl z-[99999]">
          <DialogHeader className="flex flex-row items-center justify-between p-0 mb-4">
            <DialogTitle className="text-lg font-semibold">
              Scan to Continue
            </DialogTitle>
            <Button
              variant="outline"
              className="w-[32px] h-[32px] rounded-full"
              onClick={() => setShowQRModal(false)}
              aria-label="Close modal"
            >
              <IconClose size={16} />
            </Button>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <PrivadoAuthQR onScanSuccess={handleQRSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetailsButtons;
