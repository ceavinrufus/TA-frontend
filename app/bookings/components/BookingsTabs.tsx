"use client";

import { getReservationsByGuest } from "@/lib/api/reservation";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BookingCard from "./BookingCard";

enum Category {
  UPCOMING = "upcoming",
  PAST = "past",
  CANCELLED = "cancelled",
  NOT_PAID = "not-paid",
}

const BookingsTabs = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<Category>(Category.UPCOMING);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = (await getReservationsByGuest(category)) as {
          data: Reservation[];
        };
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, [category]);

  return (
    <Tabs
      defaultValue="upcoming"
      className="w-full"
      onValueChange={(value) => setCategory(value as Category)}
    >
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value={Category.UPCOMING}>Upcoming</TabsTrigger>
        <TabsTrigger value={Category.PAST}>Past</TabsTrigger>
        <TabsTrigger value={Category.CANCELLED}>Cancelled</TabsTrigger>
        <TabsTrigger value={Category.NOT_PAID}>Unpaid</TabsTrigger>
      </TabsList>

      {["upcoming", "past", "cancelled", "not-paid"].map((tab) => (
        <TabsContent key={tab} value={tab} className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading reservations...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">No {tab} reservations found.</div>
          ) : (
            reservations.map((reservation) => (
              <BookingCard reservation={reservation} key={reservation.id} />
            ))
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BookingsTabs;
