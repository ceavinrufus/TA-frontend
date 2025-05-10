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
import { issueCredential } from "@/lib/api/issuer";
import PriceBreakdown from "@/app/bookings/components/PriceBreakdown";
import { Separator } from "@/components/ui/separator";
import DisputeModal from "@/components/DisputeModal";
import CancellationModal from "@/components/CancellationModal";
import { useUserStore } from "@/store/user-store";
import {
  copyToClipboard,
  formatCryptoAddressForDisplay,
} from "@/lib/ui/ui-utils";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { toast } from "@/hooks/use-toast";

export default function ReservationDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
      return;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    async function fetchReservation() {
      try {
        const currentUserId = user?.id;

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
  }, [id, user]);

  const statusLabel = getStatusLabel(reservation!);

  const acceptReservation = async () => {
    if (!reservation) return;
    try {
      const body = {
        credentialSubject: JSON.stringify({
          id: reservation.guest_did,
          reservationId: reservation.id,
        }),
        type: "Reservation",
        credentialSchema:
          "https://raw.githubusercontent.com/ceavinrufus/claim-schema-vocab/refs/heads/main/schemas/json/ReservationCredential.json",
        expiration: Math.floor(
          new Date(reservation.check_out_date!).getTime() / 1000
        ),
      };
      const response = await issueCredential(body);
      const { credential_id: credentialId } = response.data;

      const updatedData = {
        status: ReservationStatus.ORDER_COMPLETED,
        booking_credential_id: credentialId,
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

  const updateReservationState = async (updatedReservation: Reservation) => {
    setReservation(updatedReservation);
  };

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="">
        <BackToDashboardButton />
      </div>
      <h2 className="text-xl font-semibold">Reservation Detail</h2>
      <div className="flex justify-between gap-12 w-full">
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
              {reservation?.guest_wallet_address ? (
                <div className="flex items-center gap-2">
                  {formatCryptoAddressForDisplay(
                    reservation.guest_wallet_address
                  )}
                  <Button
                    variant="ghost"
                    className="p-0 h-fit"
                    onClick={async () => {
                      await copyToClipboard({
                        text: reservation.guest_wallet_address,
                      });
                      toast({
                        title: "Copied to clipboard!",
                        description: "Address copied to clipboard",
                      });
                    }}
                  >
                    <ResponsiveIcon
                      icon="icon-copy"
                      sizeDesktop={16}
                      sizeMobile={14}
                    />
                  </Button>
                </div>
              ) : (
                <p>-</p>
              )}
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
        <div className="flex flex-col gap-3 w-2/5">
          <PriceBreakdown reservation={reservation!} loading={loading} />
          <Separator orientation="horizontal" />
          <div className="space-y-1">
            <DisputeModal
              reservation={reservation}
              onSubmit={updateReservationState}
            />
            <CancellationModal
              reservation={reservation}
              onSubmit={updateReservationState}
            />
          </div>
        </div>
        {/* <div className="relative size-[320px] rounded-md overflow-hidden shadow-neumorphic-card-up">
          <Image
            src={reservation?.listing.pictures[0] || "/api/placeholder/300/200"}
            alt={reservation?.listing_name ?? ""}
            className="h-full w-full object-cover"
            fill
          />
        </div> */}
      </div>
    </div>
  );
}
