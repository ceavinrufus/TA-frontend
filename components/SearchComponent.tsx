"use client";

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import GuestCountModifier from "./GuestCountModifier";
import ResponsiveIcon from "./icons/ResponsiveIconBuilder";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import {
  formatDateStringForDisplay,
  DateTimeDisplayMode,
} from "@/lib/time/time-utils"; // adjust path as needed
import { searchListings } from "@/lib/api/listing";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const SearchComponent = () => {
  const [searchListingsParams, setSearchListingsParams] = React.useState({
    destination: "",
    guests: 1,
    date: {
      from: undefined,
      to: undefined,
    } as DateRange,
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleGuestChange = (delta: number) => {
    setSearchListingsParams((prev) => {
      const newCount = Math.min(6, Math.max(1, prev.guests + delta));
      return { ...prev, guests: newCount };
    });
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchListingsParams((prev) => ({
      ...prev,
      destination: e.target.value,
    }));
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setSearchListingsParams((prev) => ({
      ...prev,
      date: range || { from: undefined, to: undefined },
    }));
  };

  const formatDateDisplay = () => {
    const { from, to } = searchListingsParams.date;
    if (from && to) {
      const formattedFrom = formatDateStringForDisplay(
        from.toISOString(),
        "en-US",
        false,
        DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
      );
      const formattedTo = formatDateStringForDisplay(
        to.toISOString(),
        "en-US",
        false,
        DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
      );
      return `${formattedFrom} - ${formattedTo}`;
    }
    return "Select dates";
  };

  const handleSearch = async () => {
    // Validate input before making the API call
    if (!searchListingsParams.destination) {
      toast({
        title: "Missing params",
        description: "Please enter a destination.",
        variant: "destructive",
      });
      return;
    }
    if (!searchListingsParams.date.from || !searchListingsParams.date.to) {
      toast({
        title: "Missing params",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    const searchData = {
      pagination: {
        page: 1,
        limit: 10,
      },
      filters: {
        listing_name: searchListingsParams.destination,
      },
      params: {
        check_in: searchListingsParams.date.from,
        check_out: searchListingsParams.date.to,
        guests: {
          adults: searchListingsParams.guests,
        },
      },
    };

    try {
      // Call the search API with the constructed search data
      await searchListings(searchData);
      router.push(
        `/search?name=${encodeURIComponent(
          searchListingsParams.destination
        )}&guests=${searchListingsParams.guests}&checkIn=${
          searchListingsParams.date.from?.toISOString().split("T")[0] || ""
        }&checkOut=${
          searchListingsParams.date.to?.toISOString().split("T")[0] || ""
        }`
      );
    } catch (error) {
      console.error("Error searching listings:", error);
    }
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1 bg-white shadow-button-up rounded-lg">
        <Input
          type="text"
          placeholder="Search hotels or destinations"
          value={searchListingsParams.destination}
          onChange={handleDestinationChange}
          className="h-12"
        />
      </div>
      <div className="w-72">
        <Popover>
          <PopoverTrigger asChild>
            <div className="bg-white shadow-button-up rounded-lg">
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left "
              >
                {formatDateDisplay()}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              disabled={(date) => date < new Date()}
              selected={searchListingsParams.date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="h-12 bg-white flex items-center justify-between px-4 gap-4 rounded-lg shadow-button-up border border-input">
        <ResponsiveIcon icon="icon-person" sizeDesktop={20} />
        <GuestCountModifier
          className="h-full shadow-none w-fit p-0"
          label=""
          count={searchListingsParams.guests}
          onDecrease={() => handleGuestChange(-1)}
          onIncrease={() => handleGuestChange(1)}
          minCount={1}
          maxCount={6}
        />
      </div>
      <Button
        disabled={
          !searchListingsParams.destination ||
          !searchListingsParams.date.from ||
          !searchListingsParams.date.to ||
          !searchListingsParams.guests
        }
        className="h-12 px-8"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchComponent;
