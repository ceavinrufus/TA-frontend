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

export enum HotelCancellationOption {
  NEED_TO_MODIFY_DATE = "NEED_TO_MODIFY_DATE",
  FOUND_BETTER_PRICE_ON_OTHER_SITE = "FOUND_BETTER_PRICE_ON_OTHER_SITE",
  BOOKED_THE_WRONG_HOTEL = "BOOKED_WRONG_HOTEL",
  TRAVEL_PLAN_CANCELLED = "TRAVEL_PLAN_CANCELLED",
  OTHERS = "OTHERS",
}

const cancellationReasons = [
  {
    value: HotelCancellationOption.NEED_TO_MODIFY_DATE,
    description: "Need to change booking dates",
  },
  {
    value: HotelCancellationOption.FOUND_BETTER_PRICE_ON_OTHER_SITE,
    description: "Found better price on another website",
  },
  {
    value: HotelCancellationOption.BOOKED_THE_WRONG_HOTEL,
    description: "Booked the wrong hotel",
  },
  {
    value: HotelCancellationOption.TRAVEL_PLAN_CANCELLED,
    description: "Travel plans have been canceled",
  },
  {
    value: HotelCancellationOption.OTHERS,
    description: "Other reason",
  },
];

const CancellationModal = ({
  reservation,
  onSubmit,
}: {
  reservation: Reservation;
  onSubmit: (reservation: Reservation) => void;
}) => {
  const [selectedReason, setSelectedReason] =
    useState<HotelCancellationOption | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedReason) return;

    try {
      const cancelReason =
        selectedReason === HotelCancellationOption.OTHERS
          ? otherReason
          : selectedReason;

      await updateReservation(reservation.id, {
        status: "ORDER_CANCELED",
        cancel_reason: cancelReason,
      });
      onSubmit({
        ...reservation,
        status: ReservationStatus.ORDER_CANCELED,
        cancel_reason: cancelReason,
      });

      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled successfully.",
      });
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
    }
  };
  if (!reservation) return <Skeleton className="w-full h-9 px-4 py-2" />;
  const checkOutDate = new Date(reservation.check_out_date);
  const today = new Date();

  const isCancelledStatus =
    reservation.status === ReservationStatus.ORDER_CANCELED;
  const isButtonEnabled = !isCancelledStatus && checkOutDate > today;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full"
          disabled={!isButtonEnabled}
        >
          Cancel Reservation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Reservation</DialogTitle>
          <DialogDescription>
            Please select a reason for cancellation.
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

          {selectedReason === HotelCancellationOption.OTHERS && (
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
              (selectedReason === HotelCancellationOption.OTHERS &&
                !otherReason.trim())
            }
          >
            Confirm Cancellation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationModal;
