import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  HomeIcon,
  CalendarIcon,
  Users2Icon,
  CreditCardIcon,
  MoonIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import { useRouter } from "next/navigation";
import {
  getStatusLabel,
  statusColors,
} from "@/app/host/dashboard/reservations/utils/statusLabel";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (dateString: string) => {
  return formatDateStringForDisplay(
    dateString,
    "en-US",
    false,
    DateTimeDisplayMode.FULL_DATE_FORMAT
  );
};

const BookingCard = ({ reservation }: { reservation: Reservation | null }) => {
  const router = useRouter();

  if (!reservation) {
    return (
      <Card className="overflow-hidden">
        {/* Mobile Skeleton */}
        <div className="flex flex-col md:hidden">
          <div className="relative w-full h-48">
            <Skeleton className="h-full w-full" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="pr-2">
                <Skeleton className="h-7 w-[144px] rounded" />
                <Skeleton className="h-4 w-[144px] rounded mt-2" />
              </div>
              <div>
                <Skeleton className="h-7 w-24 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-20 rounded mt-1" />
          </CardHeader>
          <CardContent className="pb-3 pt-0">
            <div className="grid grid-cols-1 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full rounded" />
              ))}
            </div>
            <div className="mt-3">
              <Skeleton className="h-4 w-full rounded" />
            </div>
          </CardContent>
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden md:flex flex-row">
          <div className="relative w-1/4 min-h-[200px]">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="w-3/4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-48 rounded" />
                  <Skeleton className="h-4 w-32 rounded mt-2" />
                </div>
                <div className="flex flex-col items-end">
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-4 w-24 rounded mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-4 w-32 rounded" />
                ))}
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-64 rounded" />
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  }

  // Format check-in/out dates for display
  const checkInDate = formatDate(reservation.check_in_date);
  const checkOutDate = formatDate(reservation.check_out_date);

  return (
    <Card
      className="overflow-hidden cursor-pointer"
      onClick={() => {
        router.push(`/bookings/${reservation.id}`);
      }}
    >
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden">
        {/* Image section - full width on mobile */}
        <div className="relative w-full h-48">
          <Image
            src={reservation.listing.pictures[0] || "/api/placeholder/300/200"}
            alt={reservation.listing_name}
            className="object-cover"
            fill
          />
        </div>

        {/* Content section */}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="pr-2">
              <CardTitle className="text-lg line-clamp-1">
                {reservation.listing_name}
              </CardTitle>
              <CardDescription className="flex items-center mt-1 text-xs flex-wrap">
                <HomeIcon size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">
                  {reservation.listing.property_type} ·{" "}
                  {reservation.listing.place_type}
                </span>
              </CardDescription>
            </div>
            <Badge
              className={`text-[#474747] whitespace-nowrap text-xs px-2 py-1 rounded-[4px] ${
                statusColors[getStatusLabel(reservation)]
              }`}
            >
              {getStatusLabel(reservation)}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {reservation.booking_number}
          </p>
        </CardHeader>

        <CardContent className="pb-3 pt-0">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center">
              <CalendarIcon size={14} className="mr-2 flex-shrink-0" />
              <span className="text-xs">
                {checkInDate} - {checkOutDate}
              </span>
            </div>
            <div className="flex items-center">
              <Users2Icon size={14} className="mr-2 flex-shrink-0" />
              <span className="text-xs">
                {reservation.guest_number} guest(s)
              </span>
            </div>
            <div className="flex items-center">
              <CreditCardIcon size={14} className="mr-2 flex-shrink-0" />
              <span className="text-xs">
                <span className="font-medium">
                  {reservation.total_price - reservation.guest_deposit} ETH
                </span>{" "}
                total
              </span>
            </div>
            <div className="flex items-center">
              <MoonIcon size={14} className="mr-2 flex-shrink-0" />
              <span className="text-xs">
                {reservation.night_staying} night(s)
              </span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-600 line-clamp-1">
              {reservation.listing_address}
            </p>
          </div>
        </CardContent>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row">
        {/* Image section */}
        <div className="relative w-1/4 min-h-[200px]">
          <Image
            src={reservation.listing.pictures[0] || "/api/placeholder/300/200"}
            alt={reservation.listing_name}
            className="h-full w-full object-cover"
            fill
          />
        </div>

        {/* Content section */}
        <div className="w-3/4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  {reservation.listing_name}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <HomeIcon size={16} className="mr-1" />
                  {reservation.listing.property_type} ·{" "}
                  {reservation.listing.place_type}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <Badge
                  className={`text-[#474747] table-content px-2 py-1 rounded-[4px] w-[85px] ${
                    statusColors[getStatusLabel(reservation)]
                  }`}
                >
                  <p className="text-center w-full">
                    {getStatusLabel(reservation)}
                  </p>
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  {reservation.booking_number}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarIcon size={16} className="mr-2" />
                  <span className="text-sm">
                    {checkInDate} - {checkOutDate}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users2Icon size={16} className="mr-2" />
                  <span className="text-sm">
                    {reservation.guest_number} guest(s)
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CreditCardIcon size={16} className="mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">
                      {reservation.total_price - reservation.guest_deposit} ETH
                    </span>{" "}
                    total
                  </span>
                </div>
                <div className="flex items-center">
                  <MoonIcon size={16} className="mr-2" />
                  <span className="text-sm">
                    {reservation.night_staying} night(s)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {reservation.listing_address}
              </p>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
