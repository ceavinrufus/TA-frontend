import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const reservationCancellableUntil = (
  check_in_date: Date | string,
  cancellation_policy: string,
  created_at: Date | string
): Date | null => {
  let cancellableUntil: Date | null;
  const checkInDate = new Date(check_in_date);

  if (cancellation_policy === "Flexible") {
    const oneDayBefore = new Date(checkInDate);
    oneDayBefore.setDate(checkInDate.getDate() - 1);
    cancellableUntil = oneDayBefore;
  } else if (cancellation_policy === "Moderate") {
    const fiveDaysBefore = new Date(checkInDate);
    fiveDaysBefore.setDate(checkInDate.getDate() - 5);
    cancellableUntil = fiveDaysBefore;
  } else if (cancellation_policy === "Firm") {
    const thirtyDaysBefore = new Date(checkInDate);
    thirtyDaysBefore.setDate(checkInDate.getDate() - 30);
    cancellableUntil = thirtyDaysBefore;
  } else if (cancellation_policy === "Strict") {
    const fortyEightHoursAfterBooking = new Date(created_at);
    fortyEightHoursAfterBooking.setHours(
      fortyEightHoursAfterBooking.getHours() + 48
    );

    const fourteenDaysBefore = new Date(checkInDate);
    fourteenDaysBefore.setDate(checkInDate.getDate() - 14);

    // Use the earlier of the two dates
    cancellableUntil = new Date(
      Math.min(
        fortyEightHoursAfterBooking.getTime(),
        fourteenDaysBefore.getTime()
      )
    );
  } else {
    // Default to a date far in the future if no valid policy is found
    cancellableUntil = null;
  }

  return cancellableUntil;
};

interface BookingAdditionalInfoProps {
  reservation: Reservation | null;
}

const BookingAdditionalInfo: React.FC<BookingAdditionalInfoProps> = ({
  reservation,
}) => {
  if (!reservation)
    return (
      <Card className="border border-neutral-200 rounded-lg p-6 bg-white h-fit animate-pulse">
        <Skeleton className="h-6 rounded w-3/4 mb-4"></Skeleton>
        <Skeleton className="h-4 rounded w-1/2"></Skeleton>
      </Card>
    );

  const cancellableDate = reservationCancellableUntil(
    reservation.check_in_date,
    reservation.listing.cancellation_policy,
    reservation.created_at
  );

  const getCancellationInfo = () => {
    if (reservation.listing.is_no_free_cancellation) {
      return <span>This booking is non-refundable</span>;
    }

    if (!cancellableDate) {
      return <span>Cancellation policy not specified</span>;
    }

    if (new Date() > cancellableDate) {
      return <span>This booking is no longer cancellable</span>;
    }

    return (
      <span className="text-sm">
        Cancellable until{" "}
        <span className="font-semibold">
          {format(cancellableDate.toISOString().split("T")[0], "PPP")}
        </span>
      </span>
    );
  };

  return (
    <Card className="border border-neutral-200 rounded-lg p-6 bg-white h-fit">
      <CardTitle className="text-xl font-semibold mb-4 flex items-center gap-2">
        Cancellation Policy{" "}
        <Badge className="px-3 py-1 rounded-full text-sm">
          {reservation.listing.is_no_free_cancellation
            ? "Non-refundable"
            : reservation.listing.cancellation_policy}
        </Badge>
      </CardTitle>
      <CardContent className="flex flex-col justify-between gap-2 p-0">
        <p className="text-sm text-secondary-foreground">
          {getCancellationInfo()}
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingAdditionalInfo;
