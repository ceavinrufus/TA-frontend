"use client";

import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClickableCard from "../../../../components/ClickableCard";
import { useRouter } from "next/navigation";
import { getTodaysGuestsByHost } from "@/lib/api/reservation";
import { Button } from "@/components/ui/button";

/**
 * ReservationsSummary Component
 *
 * A component that displays a summary of today's reservations for a host, including check-ins and check-outs.
 * Fetches reservation data on component mount and displays it in clickable cards.
 *
 * @component
 * @returns {JSX.Element} A component containing:
 * - A header with "Reservations" title and a link to all reservations
 * - Two clickable cards showing:
 *   1. Number of check-ins for today
 *   2. Number of check-outs for today
 *
 * @example
 * ```tsx
 * <ReservationsSummary />
 * ```
 *
 * State:
 * @property {Object} summary - Contains reservation statistics
 * @property {number} summary.check_ins - Number of check-ins today
 * @property {number} summary.check_outs - Number of check-outs today
 * @property {number} summary.total_reservations - Total number of reservations
 *
 * Dependencies:
 * - Requires getTodaysGuestsByHost API function
 * - Uses Next.js router for navigation
 * - Uses custom components: ClickableCard, NeumorphicIconButton, ResponsiveIcon
 */
const ReservationsSummary = () => {
  const router = useRouter();
  const [summary, setSummary] = useState<{
    check_ins: number;
    check_outs: number;
    total_reservations: number;
  }>({
    check_ins: 0,
    check_outs: 0,
    total_reservations: 0,
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getTodaysGuestsByHost();

        setSummary(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="host-page-h2-primary-blue">Reservations</h2>
        <Link
          className="flex items-center gap-1 neumorphic-text-button"
          href={"/host/dashboard/reservations"}
        >
          See all reservations{" "}
          {summary.total_reservations ? `(${summary.total_reservations})` : ""}
          <ResponsiveIcon icon="icon-arrow-forward" sizeDesktop={16} />
        </Link>
      </div>
      <div className="flex gap-8">
        <ClickableCard
          className="relative p-6 items-start justify-between gap-3 w-[276px] group hover:bg-[#E3E8F2]"
          onClick={() => {
            router.replace("/host/dashboard/reservations?status=check-in");
          }}
        >
          <div className="flex flex-col justify-start gap-2 w-full">
            <p>Check-in today</p>
            <div className="flex w-full justify-between gap-1">
              <p className="host-page-h1-primary-blue">{summary.check_ins}</p>
              <Button
                className="size-[40px] group-hover:visible invisible !bg-[#E3E8F2]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.replace(
                    "/host/dashboard/reservations?status=check-in"
                  );
                }}
              >
                <ResponsiveIcon icon="icon-arrow-forward" sizeDesktop={16} />
              </Button>
            </div>
          </div>
        </ClickableCard>
        <ClickableCard
          className="relative p-6 items-start justify-between gap-3 w-[276px] group hover:bg-[#E3E8F2]"
          onClick={() => {
            router.replace("/host/dashboard/reservations?status=check-out");
          }}
        >
          <div className="flex flex-col justify-start gap-2 w-full">
            <p>Check-out today</p>
            <div className="flex w-full justify-between gap-1">
              <p className="host-page-h1-primary-blue">{summary.check_outs}</p>
              <Button
                className="size-[40px] group-hover:visible invisible !bg-[#E3E8F2]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.replace(
                    "/host/dashboard/reservations?status=check-out"
                  );
                }}
              >
                <ResponsiveIcon icon="icon-arrow-forward" sizeDesktop={16} />
              </Button>
            </div>
          </div>
        </ClickableCard>
      </div>
    </div>
  );
};

export default ReservationsSummary;
