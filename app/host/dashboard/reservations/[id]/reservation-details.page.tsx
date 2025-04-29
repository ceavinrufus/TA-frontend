"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackToDashboardButton from "../../components/BackToDashboardButton";
import {
  getStatusLabel,
  ReservationStatus,
  statusColors,
} from "../utils/statusLabel";
import { Badge } from "@/components/ui/badge";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import { getReservationById, updateReservation } from "@/lib/api/reservation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHostStore } from "@/app/host/store/host-store";

export default function ReservationDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const { host } = useHostStore();

  useEffect(() => {
    async function fetchReservation() {
      try {
        const currentUserId = host?.id;

        const response = await getReservationById(id);
        const currentReservation = response as Reservation;

        if (currentReservation.host_id !== currentUserId) {
          router.replace("/host/dashboard/reservations");
          return;
        }

        setReservation(currentReservation);
        setLoading(false);
      } catch (error) {
        router.replace("/host/dashboard/reservations");
        console.error("Error fetching reservation data:", error);
      }
    }

    fetchReservation();
  }, [id]);

  const statusLabel = getStatusLabel(reservation!);

  const acceptReservation = async () => {
    try {
      const updatedData = {
        status: ReservationStatus.ORDER_COMPLETED,
      };
      await updateReservation(id, updatedData);
      setReservation((prev) => (prev ? { ...prev, ...updatedData } : null));
    } catch (error) {
      console.error("Error accepting reservation:", error);
    }
  };

  const declineReservation = async () => {
    try {
      const updatedData = {
        status: ReservationStatus.ORDER_CANCELED,
        cancel_reason: "HOST_DECLINED",
      };
      await updateReservation(id, updatedData);
      setReservation((prev) => (prev ? { ...prev, ...updatedData } : null));
    } catch (error) {
      console.error("Error declining reservation:", error);
    }
  };

  const ValueWrapper = ({
    children,
    loading,
  }: {
    children: React.ReactNode;
    loading?: boolean;
  }) => (
    <div className="flex gap-20 text-base">
      {loading ? (
        <Skeleton className="w-[200px] h-6 rounded"></Skeleton>
      ) : (
        children
      )}
    </div>
  );
  return (
    <div className="md:min-w-[1200px] flex flex-col gap-12">
      <div className="">
        <BackToDashboardButton />
      </div>
      <h2 className="text-xl font-semibold">Booking Detail</h2>
      <div className="flex justify-between gap-12">
        <div className="flex flex-col gap-8 rounded-md">
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">List Name:</div>
            <ValueWrapper loading={loading}>
              {reservation?.listing_name}
            </ValueWrapper>
          </div>
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">Guest:</div>
            <ValueWrapper loading={loading}>
              {reservation?.guest_wallet_address
                ? reservation.guest_wallet_address
                : reservation?.guest_info?.[0]?.email}
            </ValueWrapper>
          </div>
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">Order Number:</div>
            <ValueWrapper loading={loading}>
              {reservation?.booking_number}
            </ValueWrapper>
          </div>
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">Check-in Date:</div>
            <ValueWrapper loading={loading}>
              {reservation?.check_in_date
                ? formatDateStringForDisplay(
                    reservation?.check_in_date,
                    "en-US",
                    false,
                    DateTimeDisplayMode.FULL_DATE_FORMAT
                  )
                : "-"}
            </ValueWrapper>
          </div>
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">Check-out Date:</div>
            <ValueWrapper loading={loading}>
              {reservation?.check_out_date
                ? formatDateStringForDisplay(
                    reservation?.check_out_date,
                    "en-US",
                    false,
                    DateTimeDisplayMode.FULL_DATE_FORMAT
                  )
                : "-"}
            </ValueWrapper>
          </div>
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">Number of Guests:</div>
            <ValueWrapper loading={loading}>
              {reservation?.guest_number}
            </ValueWrapper>
          </div>
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">Total Amount:</div>
            <ValueWrapper loading={loading}>
              {reservation?.total_price
                ? `${Number(
                    (
                      reservation?.total_price -
                      (reservation?.guest_deposit ?? 0)
                    )?.toFixed(8)
                  )} ETH`
                : `-`}
            </ValueWrapper>
          </div>
          <div className="flex gap-20 text-base">
            <div className="font-bold w-[200px]">Trip Status:</div>
            <ValueWrapper loading={loading}>
              <Badge
                className={`text-[#474747] flex justify-center px-2 py-1 rounded-[4px] w-[85px] ${
                  statusColors[statusLabel as keyof typeof statusColors]
                }`}
              >
                {statusLabel}
              </Badge>
            </ValueWrapper>
          </div>
          {statusLabel === "Cancelled" && (
            <div className="flex gap-20 text-base capitalize">
              <div className="font-bold w-[200px]">Cancel Reason:</div>
              <ValueWrapper loading={loading}>
                {reservation?.cancel_reason?.replace(/_/g, " ").toLowerCase() ??
                  "-"}
              </ValueWrapper>
            </div>
          )}
          {statusLabel === "Pending" && (
            <div className="flex gap-20 text-base">
              <div className="w-[200px]"></div>
              <div className="flex gap-4">
                <Button
                  onClick={acceptReservation}
                  variant="outline"
                  className=""
                >
                  <p className="font-bold text-blue-950">
                    ✔ Accept Reservation
                  </p>
                </Button>
                <Button
                  onClick={declineReservation}
                  variant="outline"
                  className="bg-red-error"
                >
                  <p className="font-bold text-secondary-error">✖ Decline</p>
                </Button>
              </div>
            </div>
          )}
        </div>
        {/* <div className="">
          {!loading && (
            <SelfHostedHotelTotalCostAndMetadataUpdateComponent
              predefinedHotelRateMetadata={reservation}
            />
          )}
        </div> */}
      </div>
    </div>
  );
}
