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

const getStatusBadge = (status: ReservationStatus) => {
  switch (status) {
    case "ORDER_COMPLETED":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "ORDER_PROCESSING":
      return <Badge className="bg-blue-500">Processing</Badge>;
    case "ORDER_CANCELED":
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case "ORDER_WAITING_PAYMENT":
      return <Badge className="bg-yellow-500">Unpaid</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return formatDateStringForDisplay(
    dateString,
    "en-US",
    false,
    DateTimeDisplayMode.FULL_DATE_FORMAT
  );
};

const BookingCard = ({ reservation }: { reservation: Reservation }) => {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden cursor-pointer"
      onClick={() => {
        router.push(`/reservation/${reservation.id}`);
      }}
    >
      <div className="flex flex-row">
        {/* Image section */}
        <div className="relative w-1/4 min-h-full">
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
                {getStatusBadge(reservation.status as ReservationStatus)}
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
                    {formatDate(reservation.check_in_date)} -{" "}
                    {formatDate(reservation.check_out_date)}
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
                      {reservation.total_price} ETH
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
