import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";

import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import { checkListingAvailability } from "@/lib/api/listing";
import {
  createPreReservation,
  generateBookingHash,
} from "@/lib/api/reservation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import GuestCountModifier from "@/components/GuestCountModifier";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { useToast } from "@/hooks/use-toast";

import { GUEST_DEPOSIT_RATE } from "@/constants";

const PriceCard = ({
  hotelId,
  hotelPrice,
  maxGuests,
  isLoading,
}: {
  hotelId: string;
  maxGuests: number;
  hotelPrice: { dailyPrice: number[]; totalPrice: number | null };
  isLoading: boolean;
}) => {
  const searchParams = useSearchParams();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Add one day to today's date

  const guests = Number(searchParams.get("guests") || 1);
  const checkIn = new Date(searchParams.get("checkIn") || today);
  checkIn.setHours(0, 0, 0, 0); // By default, it's read not in local time, so need to set hours to 0
  const checkOut = new Date(searchParams.get("checkOut") || tomorrow);
  checkOut.setHours(0, 0, 0, 0);

  const [searchListingParams, setSearchListingParams] = useState({
    guests: guests,
    date: {
      from: checkIn,
      to: checkOut,
    } as DateRange,
  });

  const [updatedPrices, setUpdatedPrices] = useState<typeof hotelPrice | null>(
    null
  );
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const fetchUpdatedPrices = useCallback(async () => {
    const { from, to } = searchListingParams.date;
    if (!from || !to || !hotelId) return;

    try {
      setIsPriceLoading(true);

      const listing = await checkListingAvailability(
        hotelId,
        new Date(from),
        new Date(to),
        { adults: searchListingParams.guests }
      );

      if (listing) {
        setUpdatedPrices({
          dailyPrice: listing.daily_price,
          totalPrice: listing.total_price,
        });
      } else {
        toast({
          title: "Listing not available",
          description: "Listing not available for selected dates.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching updated prices:", error);
      toast({
        title: "Listing not available",
        description: "Listing not available for selected dates.",
        variant: "destructive",
      });
    } finally {
      setIsPriceLoading(false);
    }
  }, [searchListingParams, hotelId, toast]);

  useEffect(() => {
    if (searchListingParams.date.from && searchListingParams.date.to) {
      fetchUpdatedPrices();
    }
  }, [searchListingParams.date]);

  const handleSearch = useCallback(async () => {
    if (isLoading || isPriceLoading) return;

    const { from, to } = searchListingParams.date;
    if (!from || !to || !hotelId) return;

    try {
      const listing = await checkListingAvailability(
        hotelId,
        new Date(from),
        new Date(to),
        { adults: searchListingParams.guests }
      );

      if (!listing) {
        toast({
          title: "Listing not available",
          description: "Listing not available for selected dates.",
          variant: "destructive",
        });
        return;
      }

      const nightStaying = Math.ceil(
        (new Date(to).getTime() - new Date(from).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const total = updatedPrices?.totalPrice || listing.total_price;

      const reservationData = {
        listing_id: listing.id,
        host_id: listing.host_id,
        check_in_date: from.toISOString(),
        check_out_date: to.toISOString(),
        guest_number: searchListingParams.guests,
        night_staying: nightStaying,
        total_price: Number(total.toFixed(8)),
      };

      const response = await generateBookingHash(reservationData);
      await createPreReservation({
        ...reservationData,
        book_hash: response.book_hash,
      });

      router.push(`/order/details?hash=${response.book_hash}`);
    } catch (error) {
      console.error("Error during search and reservation:", error);
      toast({
        title: "Failed to create reservation.",
        variant: "destructive",
      });
    }
  }, [
    hotelId,
    isLoading,
    isPriceLoading,
    searchListingParams,
    updatedPrices,
    toast,
    router,
  ]);

  const formatDateDisplay = () => {
    const { from, to } = searchListingParams.date;
    if (!from || !to) return "Select dates";

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
  };

  const displayDailyPrice = Number(
    (
      (updatedPrices?.dailyPrice?.[0] ?? hotelPrice.dailyPrice?.[0]) *
      (1 - GUEST_DEPOSIT_RATE)
    ).toFixed(8)
  );
  const displayTotalPrice = updatedPrices?.totalPrice ?? hotelPrice.totalPrice;

  const handleGuestChange = (delta: number) => {
    setSearchListingParams((prev) => {
      const newGuests = Math.min(maxGuests, Math.max(1, prev.guests + delta));
      return { ...prev, guests: newGuests };
    });
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setSearchListingParams((prev) => ({
      ...prev,
      date: range || { from: undefined, to: undefined },
    }));
  };

  return (
    <div className="flex flex-col md:shadow-neumorphic-card-up h-fit justify-start items-center rounded-[24px] bg-off-white gap-6 md:py-12 md:px-6 w-full md:w-[424px]">
      {/* Heading */}
      {!isLoading && displayDailyPrice ? (
        <p className="text-2xl font-semibold">
          {displayDailyPrice} ETH{" "}
          <span className="text-gray-500 text-base">/night</span>
        </p>
      ) : (
        <Skeleton className="h-8 w-32 rounded" />
      )}

      <div className="w-full space-y-2">
        {/* Calendar and Guests */}
        <div className="w-full">
          {isLoading || isPriceLoading ? (
            <Skeleton className="w-full h-12 rounded-lg" />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-white shadow-button-up rounded-lg">
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left"
                  >
                    {formatDateDisplay()}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  disabled={(date) => date < new Date()}
                  selected={searchListingParams.date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="w-full">
          {isLoading || isPriceLoading ? (
            <Skeleton className="w-full h-12 rounded-lg" />
          ) : (
            <div className="w-full h-12 bg-white flex items-center justify-between px-4 gap-4 rounded-lg shadow-button-up border border-input">
              <div className="flex items-center gap-2">
                <ResponsiveIcon icon="icon-person" sizeDesktop={20} />
                <p>Guests</p>
              </div>
              <GuestCountModifier
                className="h-full shadow-none w-fit p-0"
                label=""
                count={searchListingParams.guests}
                onDecrease={() => handleGuestChange(-1)}
                onIncrease={() => handleGuestChange(1)}
                minCount={1}
                maxCount={maxGuests}
              />
            </div>
          )}
        </div>
      </div>

      {/* Search Button */}
      <Button
        disabled={
          !searchListingParams.date.from ||
          !searchListingParams.date.to ||
          !searchListingParams.guests ||
          isLoading
        }
        className="h-12 px-8 w-full"
        onClick={handleSearch}
      >
        Book
      </Button>

      {/* Total Price (Desktop) */}
      <div className="md:flex-col w-full gap-1 flex">
        <div className="flex justify-between items-center w-full booking-price-update-component-charge-total-body">
          <p>Total Price</p>
          {isLoading || isPriceLoading ? (
            <Skeleton className="h-4 w-12 rounded" />
          ) : (
            <p>
              {displayTotalPrice
                ? `${Number(
                    (displayTotalPrice * (1 - GUEST_DEPOSIT_RATE)).toFixed(8)
                  )} ETH`
                : ""}
            </p>
          )}
        </div>
        <p className="text-xs">(Incl. Fee)</p>
      </div>
    </div>
  );
};

export default PriceCard;
