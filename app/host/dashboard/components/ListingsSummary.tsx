"use client";

import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClickableCard from "../../../../components/ClickableCard";
import { useRouter } from "next/navigation";
import { getHostListingSummary } from "@/lib/api/listing";
import { Button } from "@/components/ui/button";

/**
 * ListingsSummary Component
 *
 * Displays a summary of host listings categorized by availability status and draft status.
 * The component fetches and displays counts for Available, Reserved, Not Available, and Draft listings.
 *
 * @component
 *
 * @example
 * ```tsx
 * <ListingsSummary />
 * ```
 *
 * @state {Object} summary - Contains the listing statistics
 * @state {Object} summary.status_counts - Counts of listings by status
 * @state {Object} summary.availability_counts - Counts of listings by availability
 * @state {number} summary.total_listings - Total number of listings
 *
 * @hooks
 * - useRouter - Next.js router hook for navigation
 * - useEffect - Fetches listing data on component mount
 * - useState - Manages the summary state
 *
 * A component displaying listing statistics with clickable cards
 * that navigate to filtered listing views
 */
const ListingsSummary = () => {
  const router = useRouter();
  const [summary, setSummary] = useState<{
    status_counts: { [key: string]: number };
    availability_counts: { [key: string]: number };
    total_listings: number;
  }>({
    status_counts: {},
    availability_counts: {},
    total_listings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHostListingSummary();

      const transformedStatusCounts = data.status_counts.reduce(
        (acc: { [key: string]: number }, item) => {
          acc[item.status] = item.count;
          return acc;
        },
        {}
      );

      const transformedAvailabilityCounts = data.availability_counts.reduce(
        (acc: { [key: string]: number }, item) => {
          acc[item.availability] = item.count;
          return acc;
        },
        {}
      );

      const transformedData = {
        status_counts: transformedStatusCounts,
        availability_counts: transformedAvailabilityCounts,
        total_listings: data.total_listings,
      };
      setSummary(transformedData);
    };

    fetchData();
  }, []);

  const showedAvailability = [
    { label: "Available", key: "AVAILABLE" },
    { label: "Reserved", key: "RESERVED" },
    { label: "Not Available", key: "NOT_AVAILABLE" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-950">Listings</h2>
        <Link
          className="flex items-center gap-1 text-xs sm:text-sm md:text-base hover:underline hover:underline-offset-4"
          href={"/host/dashboard/listings"}
        >
          See all listings{" "}
          {summary.total_listings ? `(${summary.total_listings})` : ""}
          <ResponsiveIcon icon="icon-arrow-forward" sizeDesktop={16} />
        </Link>
      </div>
      <div className="flex gap-8 flex-wrap">
        {showedAvailability.map((item, index) => (
          <ClickableCard
            key={index}
            className="relative p-6 items-start justify-between gap-3 w-full sm:w-[276px] group hover:bg-[#D2DFFB]"
            onClick={() => {
              router.replace(
                `/host/dashboard/listings?availability=${item.key.toLowerCase()}`
              );
            }}
          >
            <div className="flex flex-col justify-start gap-2 w-full">
              <p>{item.label}</p>
              <div className="flex w-full justify-between gap-1">
                <p className="text-2xl font-semibold text-blue-950">
                  {summary.availability_counts[item.key] ?? 0}
                </p>
                <Button
                  className="size-[40px] group-hover:visible invisible !bg-[#D2DFFB]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.replace(
                      `/host/dashboard/listings?availability=${item.key.toLowerCase()}`
                    );
                  }}
                >
                  <ResponsiveIcon icon="icon-arrow-forward" sizeDesktop={16} />
                </Button>
              </div>
            </div>
          </ClickableCard>
        ))}
        <ClickableCard
          className="relative p-6 items-start justify-between gap-3 w-full sm:w-[276px] group hover:bg-[#D2DFFB]"
          onClick={() => {
            router.replace(`/host/dashboard/listings?status=draft`);
          }}
        >
          <div className="flex flex-col justify-start gap-2 w-full">
            <p>Draft</p>
            <div className="flex w-full justify-between gap-1">
              <p className="text-2xl font-semibold text-blue-950">
                {summary.status_counts["LISTING_DRAFT"] ?? 0}
              </p>
              <Button
                className="size-[40px] group-hover:visible invisible !bg-[#D2DFFB]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.replace(`/host/dashboard/listings?status=draft`);
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

export default ListingsSummary;
