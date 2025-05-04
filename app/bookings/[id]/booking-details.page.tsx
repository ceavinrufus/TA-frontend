"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReservationById } from "@/lib/api/reservation";
import { useUserStore } from "@/store/user-store";
import BookingCard from "../components/BookingCard";
import PriceBreakdown from "../components/PriceBreakdown";
import BookingAdditionalInfo from "../components/BookingAdditionalInfo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="flex flex-col gap-12">
      <BookingCard reservation={reservation} />
      <div className="flex justify-between gap-12">
        <PriceBreakdown reservation={reservation!} loading={loading} />
        <div className="w-1/3 flex flex-col gap-2 justify-between">
          <BookingAdditionalInfo reservation={reservation} />
          <Separator orientation="horizontal" />
          <div className="space-y-1">
            <Button
              variant="default"
              className="w-full"
              onClick={() => router.push("/bookings")}
            >
              Dispute
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={() => router.push("/bookings")}
            >
              Show Reservation Proof
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={() => router.push("/bookings")}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
