"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import FilterComponent from "./FilterComponent";
import {
  getStatusLabel,
  statusColors,
} from "../reservations/utils/statusLabel";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import { Button } from "@/components/ui/button";
import IconEye from "@/components/icons/IconEye";
import { getReservationsByHost } from "@/lib/api/reservation";
import { formatCryptoAddressForDisplay } from "@/lib/ui/ui-utils";

/**
 * A component that displays a table of reservations for a host's listings.
 *
 * Features:
 * - Displays reservation details including listing name, guest info, dates, pricing and status
 * - Supports filtering by listing name and reservation status
 * - Responsive design with mobile/desktop views
 * - Clickable rows to view detailed reservation information
 *
 * @component
 * @example
 * ```tsx
 * <ReservationTable />
 * ```
 *
 * State:
 * @state reservations - Array of reservation data fetched from backend
 * @state selectedListingFilters - Set of selected listing name filters
 * @state selectedReservationFilters - Set of selected reservation status filters
 *
 * Hooks:
 * @hook useEffect - Fetches reservation data on component mount
 * @hook useMemo - Memoizes filtered reservations and filter options
 *
 * Dependencies:
 * - Requires user preferences store for localization
 * - Requires reservation APIs for data fetching
 * - Uses shared UI components like Badge, Tooltip, NeumorphicIconButton
 *
 * @returns A table component showing filtered reservation data with filtering controls
 */
const ReservationTable = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedListingFilters, setSelectedListingFilters] = useState(
    new Set(["all"])
  );
  const [selectedReservationFilters, setSelectedReservationFilters] = useState(
    new Set(["all"])
  );
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = (await getReservationsByHost()) as {
          data: Reservation[];
        };
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  const listingsFilter = useMemo(() => {
    const listingNames = Array.from(
      new Set(reservations.map((r) => r.listing.name))
    );
    return [
      { label: "All Listings", value: "all" },
      ...listingNames.map((name) => ({ label: name, value: name })),
    ];
  }, [reservations]);

  const reservationsFilter = useMemo(() => {
    const statuses = ["Upcoming", "Checked-in", "Checked-out", "Cancelled"];
    return [
      { label: "All Reservations", value: "all" },
      ...statuses.map((status) => ({ label: status, value: status })),
    ];
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesListing =
        selectedListingFilters.has("all") ||
        selectedListingFilters.has(reservation.listing.name);
      const matchesStatus =
        selectedReservationFilters.has("all") ||
        selectedReservationFilters.has(getStatusLabel(reservation));
      return matchesListing && matchesStatus;
    });
  }, [reservations, selectedListingFilters, selectedReservationFilters]);

  return (
    <div className="flex flex-col w-full shadow-neumorphic-card-up p-8 pb-12 rounded-2xl gap-12">
      <div className="hidden md:flex justify-end gap-6">
        <FilterComponent
          accessMode="desktop"
          filters={listingsFilter}
          selectedFilters={selectedListingFilters}
          onFilterChange={setSelectedListingFilters}
        />
        <FilterComponent
          accessMode="desktop"
          filters={reservationsFilter}
          selectedFilters={selectedReservationFilters}
          onFilterChange={setSelectedReservationFilters}
        />
      </div>
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="host-dashboard-table-header">List name</th>
              <th className="host-dashboard-table-header">Guest</th>
              <th className="host-dashboard-table-header">Check-in Date</th>
              <th className="host-dashboard-table-header">Check-out Date</th>
              <th className="host-dashboard-table-header">No. of Guests</th>
              <th className="host-dashboard-table-header">Total Amount</th>
              <th className="host-dashboard-table-header">Status</th>
              <th className="host-dashboard-table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation, index) => (
              <tr key={index}>
                <td className="text-center table-cell max-w-[130px]">
                  {reservation.listing.name}
                </td>
                <td className="text-center table-cell">
                  {reservation.user_billing_detail?.wallet_address
                    ? formatCryptoAddressForDisplay(
                        reservation.user_billing_detail.wallet_address
                      )
                    : reservation.guest_info?.[0]?.email}
                </td>
                <td className="text-center table-cell">
                  {reservation.check_in_date
                    ? formatDateStringForDisplay(
                        reservation.check_in_date,
                        "en-US",
                        false,
                        DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
                      )
                    : "-"}
                </td>
                <td className="text-center table-cell">
                  {reservation.check_out_date
                    ? formatDateStringForDisplay(
                        reservation.check_out_date,
                        "en-US",
                        false,
                        DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
                      )
                    : "-"}
                </td>
                <td className="text-center table-cell">
                  {reservation.guest_number}
                </td>
                <td className="text-center table-cell">
                  {reservation.total_price !== null
                    ? reservation?.currency === "ETH"
                      ? `${reservation?.total_price?.toFixed(2)} ETH`
                      : `$${reservation?.total_price?.toFixed(2)}`
                    : "-"}
                </td>
                <td className="text-center table-cell">
                  <Badge
                    className={`text-[#474747] table-content px-2 py-1 rounded-[4px] w-[85px] ${
                      statusColors[getStatusLabel(reservation)]
                    }`}
                  >
                    <p className="text-center w-full">
                      {getStatusLabel(reservation)}
                    </p>
                  </Badge>
                </td>
                <td className="text-center table-cell flex-shrink-0">
                  <div className="flex gap-4">
                    <Button
                      className="size-8"
                      variant={"outline"}
                      onClick={() => {
                        router.push(
                          `/host/dashboard/reservations/${reservation.id}`
                        );
                      }}
                    >
                      <IconEye size={16} />
                    </Button>
                    {/* <Tooltip content="Send message to guest">
                      <NeumorphicIconButton
                        icon={"icon-send"}
                        className="size-8"
                      />
                    </Tooltip> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;
