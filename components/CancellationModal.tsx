"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateReservation } from "@/lib/api/reservation";
import { useToast } from "@/hooks/use-toast";
import { ReservationStatus } from "@/app/host/dashboard/reservations/utils/statusLabel";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user-store";
import { reservationCancellableUntil } from "@/app/bookings/components/BookingAdditionalInfo";
import { ethers } from "ethers";
import RentalPayments from "@/abi/RentalPayments.json";
import { useWalletClient } from "wagmi";

export enum HostCancellationOption {
  PROPERTY_MAINTENANCE = "PROPERTY_MAINTENANCE",
  OVERBOOKING = "OVERBOOKING",
  EMERGENCY_SITUATION = "EMERGENCY_SITUATION",
  GUEST_POLICY_VIOLATION = "GUEST_POLICY_VIOLATION",
  OTHERS = "OTHERS",
}

// Rename existing enum to distinguish it
export enum GuestCancellationOption {
  NEED_TO_MODIFY_DATE = "NEED_TO_MODIFY_DATE",
  FOUND_BETTER_PRICE_ON_OTHER_SITE = "FOUND_BETTER_PRICE_ON_OTHER_SITE",
  BOOKED_THE_WRONG_HOTEL = "BOOKED_WRONG_HOTEL",
  TRAVEL_PLAN_CANCELLED = "TRAVEL_PLAN_CANCELLED",
  OTHERS = "OTHERS",
}

const guestCancellationReasons = [
  {
    value: GuestCancellationOption.NEED_TO_MODIFY_DATE,
    description: "Need to change booking dates",
  },
  {
    value: GuestCancellationOption.FOUND_BETTER_PRICE_ON_OTHER_SITE,
    description: "Found better price on another website",
  },
  {
    value: GuestCancellationOption.BOOKED_THE_WRONG_HOTEL,
    description: "Booked the wrong hotel",
  },
  {
    value: GuestCancellationOption.TRAVEL_PLAN_CANCELLED,
    description: "Travel plans have been canceled",
  },
  {
    value: GuestCancellationOption.OTHERS,
    description: "Other reason",
  },
];

const hostCancellationReasons = [
  {
    value: HostCancellationOption.PROPERTY_MAINTENANCE,
    description: "Property needs urgent maintenance",
  },
  {
    value: HostCancellationOption.OVERBOOKING,
    description: "Booking system error/overbooking",
  },
  {
    value: HostCancellationOption.EMERGENCY_SITUATION,
    description: "Emergency situation",
  },
  {
    value: HostCancellationOption.GUEST_POLICY_VIOLATION,
    description: "Guest policy violation",
  },
  {
    value: HostCancellationOption.OTHERS,
    description: "Other reason",
  },
];

const CancellationModal = ({
  reservation,
  onSubmit,
}: {
  reservation: Reservation | null;
  onSubmit: (reservation: Reservation) => void;
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUserStore();

  const { data: walletClient } = useWalletClient();

  const handleSubmit = async () => {
    if (!selectedReason || !reservation || !user) return;

    try {
      if (!walletClient) {
        toast({
          title: "Please connect your wallet",
          description: "You need to connect your wallet to proceed.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const provider = new ethers.BrowserProvider(walletClient?.transport);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractABI = RentalPayments.abi;
      const contractAddress =
        process.env.NEXT_PUBLIC_RENTAL_PAYMENTS_CONTRACT_ADDRESS!;

      const rentalPaymentsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Get on chain reservation details using the transaction hash
      const bookingReceipt = await provider.getTransactionReceipt(
        reservation.payments![0].transaction_hash!
      );
      const log = bookingReceipt!.logs[0];
      const parsedLog = rentalPaymentsContract.interface.parseLog({
        topics: log.topics,
        data: log.data,
      });

      if (parsedLog && parsedLog.name === "PaymentInitiated") {
        const bookingId = parsedLog.args.bookingId; // Extract bookingId from the log
        const transaction = await rentalPaymentsContract.cancelBooking(
          bookingId
        );
        const receipt = await transaction.wait();
        const txHash = receipt.hash;

        const cancelReason =
          selectedReason === "OTHERS" ? otherReason : selectedReason;

        const payload = {
          status: ReservationStatus.ORDER_CANCELED,
          cancel_reason: cancelReason,
          cancelled_by_id: user.id,
          cancellation_transaction_hash: txHash,
        };

        try {
          await updateReservation(reservation.id, payload);
          onSubmit({
            ...reservation,
            ...payload,
          });
          toast({
            title: "Reservation cancelled",
            description: "Your reservation has been cancelled successfully.",
          });
        } catch (error) {
          console.error("Error cancelling reservation:", error);
          toast({
            title: "Error",
            description: "Failed to cancel reservation. Please try again.",
            variant: "destructive",
          });
        }
      }
      setIsOpen(false);
      setSelectedReason(null);
      setOtherReason("");
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast({
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (!reservation) return <Skeleton className="w-full h-9 px-4 py-2" />;

  const isCancelledStatus =
    reservation.status === ReservationStatus.ORDER_CANCELED;

  const isHost = user?.id === reservation?.host_id;
  const cancellationReasons = isHost
    ? hostCancellationReasons
    : guestCancellationReasons;

  let isButtonEnabled = !isCancelledStatus; // Default value
  if (!isHost) {
    const cancellableDate = reservationCancellableUntil(
      reservation.check_in_date,
      reservation.listing.cancellation_policy,
      reservation.created_at
    );
    isButtonEnabled =
      !isCancelledStatus &&
      !reservation.listing.is_no_free_cancellation &&
      cancellableDate !== null &&
      new Date() <= cancellableDate;
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full"
          disabled={!isButtonEnabled || isLoading}
        >
          {isLoading ? "Cancelling..." : "Cancel Reservation"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Reservation</DialogTitle>
          <DialogDescription>
            Please select a reason for cancellation.
            {isHost &&
              " As a host, your cancellation may affect your property's rating."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {cancellationReasons.map((reason) => (
              <div key={reason.value} className="flex items-center space-x-2">
                <Checkbox
                  id={reason.value}
                  checked={selectedReason === reason.value}
                  onCheckedChange={() => setSelectedReason(reason.value)}
                />
                <Label htmlFor={reason.value}>{reason.description}</Label>
              </div>
            ))}
          </div>

          {selectedReason === "OTHERS" && (
            <div className="space-y-2">
              <Label>Please specify your reason</Label>
              <Textarea
                placeholder="Enter your cancellation reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              !selectedReason ||
              (selectedReason === "OTHERS" && !otherReason.trim()) ||
              isLoading
            }
          >
            {isLoading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationModal;
