"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReservationById } from "@/lib/api/reservation";
import { useUserStore } from "@/store/user-store";
import BookingCard from "../components/BookingCard";
import PriceBreakdown from "../components/PriceBreakdown";
import BookingAdditionalInfo from "../components/BookingAdditionalInfo";
import { Separator } from "@/components/ui/separator";
import DisputeModal from "../../../components/DisputeModal";
import CancellationModal from "../../../components/CancellationModal";
import ReservationProofModal from "../components/ReservationProofModal";

export default function BookingDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;

    async function fetchReservation() {
      try {
        const currentUserId = user?.id;

        const response = await getReservationById(id);
        const currentReservation = response as Reservation;

        if (currentReservation.guest_id !== currentUserId) {
          router.replace("/bookings");
          return;
        }

        setReservation(currentReservation);
        setLoading(false);
      } catch (error) {
        router.replace("/bookings");
        console.error("Error fetching reservation data:", error);
      }
    }

    fetchReservation();
  }, [id, user]);

  const updateReservation = async (updatedReservation: Reservation) => {
    setReservation(updatedReservation);
  };

  return (
    <div className="flex flex-col gap-12">
      <BookingCard reservation={reservation} />
      <div className="flex justify-between gap-12">
        <div className="w-2/3">
          <PriceBreakdown reservation={reservation!} loading={loading} />
        </div>
        <div className="w-1/3 flex flex-col gap-2 justify-between">
          <BookingAdditionalInfo reservation={reservation} />
          <Separator orientation="horizontal" />
          <div className="space-y-1">
            <DisputeModal
              reservation={reservation}
              onSubmit={updateReservation}
            />
            <ReservationProofModal
              reservation={reservation}
              setReservation={setReservation}
            />
            <CancellationModal
              reservation={reservation}
              onSubmit={updateReservation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
