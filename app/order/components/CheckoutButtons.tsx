"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "../store/orderStore";
import { updateReservation } from "@/lib/api/reservation";
import { getGuestInfo } from "@/lib/api/guest";
import { ReservationStatus } from "@/app/host/dashboard/reservations/utils/statusLabel";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import RentalPayments from "@/abi/RentalPayments.json";
import { createPayment } from "@/lib/api/payment";

const CheckoutButtons: React.FC = () => {
  const { listingDetails, reservationDetails, isLoading } = useOrderStore();
  const { isConnected } = useAccount();
  const router = useRouter();
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handleBack = () => router.back();

  const handleCheckout = async () => {
    if (!reservationDetails || !listingDetails) return;

    if (!window.ethereum) {
      toast({
        title: "No wallet detected",
        description: "Please install a wallet extension to proceed.",
        variant: "destructive",
      });
    }

    const user = await getGuestInfo();

    if (!user || !isConnected) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }
    const bookingStatus = reservationDetails?.status;

    if (
      !bookingStatus ||
      (bookingStatus !== ReservationStatus.ORDER_WAITING_PAYMENT &&
        bookingStatus !== ReservationStatus.ORDER_PAID_PARTIAL)
    ) {
      toast({
        title: "Booking expired!",
        description: "Please make a new booking.",
        variant: "destructive",
      });
      return;
    }

    // Smart contract payment
    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    const totalPrice = reservationDetails.total_price;
    const contractABI = RentalPayments.abi;
    const contractAddress =
      process.env.NEXT_PUBLIC_RENTAL_PAYMENTS_CONTRACT_ADDRESS!;

    const rentalPaymentsContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    const amount = ethers.parseEther(totalPrice!.toFixed(18).toString());

    const checkinTimestamp = Math.floor(
      new Date(reservationDetails.check_in_date!).getTime() / 1000
    );
    const checkoutTimestamp = Math.floor(
      new Date(reservationDetails.check_out_date!).getTime() / 1000
    );

    try {
      setIsPaying(true);

      const transaction = await rentalPaymentsContract.initiatePayment(
        listingDetails.host?.wallet_address, // Recipient's wallet
        checkinTimestamp,
        checkoutTimestamp,
        { value: amount }
      );
      const receipt = await transaction.wait();

      const txHash = receipt.hash;

      await createPayment({
        amount: totalPrice,
        is_successful: true,
        reservation_id: reservationDetails.id!,
        transaction_hash: txHash,
      });

      const isInstantBooking =
        reservationDetails.listing.is_instant_booking ?? false;

      await updateReservation(reservationDetails.id!, {
        status: isInstantBooking
          ? ReservationStatus.ORDER_COMPLETED
          : ReservationStatus.ORDER_PROCESSING,
      });

      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
        variant: "default",
      });

      setIsPaymentSuccessful(true);
      router.push(`/order/success?reservationId=${reservationDetails.id}`);
    } catch (error) {
      await createPayment({
        amount: 0,
        is_successful: false,
        reservation_id: reservationDetails.id!,
      });
      console.error("Payment failed:", error);
      toast({
        title: "Payment failed",
        description: "Your payment could not be processed.",
        variant: "destructive",
      });

      setIsPaymentSuccessful(false);
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!listingDetails || !reservationDetails) {
    return <div>No listing details available</div>;
  }

  return (
    <div className="flex gap-4">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="px-4 py-2 rounded-md"
      >
        Back
      </Button>
      <Button
        variant="default"
        disabled={
          isPaying ||
          isPaymentSuccessful ||
          reservationDetails.status === ReservationStatus.ORDER_COMPLETED ||
          reservationDetails.status === ReservationStatus.ORDER_PROCESSING
        }
        onClick={handleCheckout}
        className="px-4 py-2 text-white rounded-md"
      >
        {isPaying ? (
          <span className="animate-spin">Paying...</span>
        ) : (
          "Confirm & Pay"
        )}
      </Button>
    </div>
  );
};

export default CheckoutButtons;
