"use client";

import React from "react";
import ListingResults from "./components/ListingResults";
import SearchComponent from "@/components/SearchComponent";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const guests = parseInt(searchParams.get("guests") || "0");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  let validatedGuests = guests;
  if (guests < 1) validatedGuests = 1;
  if (guests > 6) validatedGuests = 6;

  let fromDate = checkIn ? new Date(checkIn) : tomorrow;
  fromDate.setHours(0, 0, 0, 0);
  let toDate = checkOut ? new Date(checkOut) : dayAfterTomorrow;
  toDate.setHours(0, 0, 0, 0);

  if (fromDate < tomorrow) fromDate = tomorrow;
  if (toDate <= fromDate) toDate = new Date(fromDate.getTime() + 86400000); // Add 1 day

  const initialData = {
    destination: name,
    guests: validatedGuests,
    date: {
      from: fromDate,
      to: toDate,
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <SearchComponent initialData={initialData} />
      <Separator className="my-4" />
      <ListingResults
        searchParams={{
          name: name,
          guests: validatedGuests,
          checkIn: fromDate,
          checkOut: toDate,
        }}
      />
    </div>
  );
};

export default SearchPage;
