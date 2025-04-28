"use client";

import React, { useEffect } from "react";
import ClickableCard from "../../../../components/ClickableCard";
import { useRouter } from "next/navigation";
import { getHostEarnings } from "@/lib/api/reservation";

/**
 * A component that displays a summary of earnings for a host.
 * Shows three categories of earnings: pending, monthly, and yearly.
 *
 * @component
 * @example
 * ```tsx
 * <EarningsSummary />
 * ```
 *
 * @returns A layout containing earnings summary cards with:
 * - A header section with "Earnings" title
 * - Three clickable cards showing different earning categories
 * - Each card displays a label and monetary value
 *
 * @remarks
 * - Uses React Router for navigation
 * - Fetches earnings data on component mount
 * - Displays monetary values with currency symbol ($)
 * - Cards are clickable and can navigate to specific routes (if linkHref is provided)
 * - Includes hover effects for interactive elements
 */
const EarningsSummary = () => {
  const router = useRouter();
  const currency = "$";
  const [summary, setSummary] = React.useState([
    { label: "Pending earning", value: 0, linkHref: "" },
    { label: "Monthly earning", value: 0, linkHref: "" },
    { label: "Yearly earning", value: 0, linkHref: "" },
  ]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const earnings = await getHostEarnings();
        setSummary([
          {
            label: "Pending earning",
            value: earnings.pending_earnings,
            linkHref: "",
          },
          {
            label: "Monthly earning",
            value: earnings.monthly_earnings,
            linkHref: "",
          },
          {
            label: "Yearly earning",
            value: earnings.yearly_earnings,
            linkHref: "",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch earnings:", error);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-950">Earnings</h2>
      </div>
      <div className="flex gap-8">
        {summary.map((item, index) => (
          <ClickableCard
            key={index}
            className="relative p-6 items-start justify-between gap-3 w-[276px] group hover:bg-[#D2DFFB]"
            onClick={() => {
              router.replace(item.linkHref);
            }}
          >
            <div className="flex flex-col justify-start gap-2 w-full">
              <p>{item.label}</p>
              <div className="flex w-full justify-between gap-1">
                <p className="text-2xl font-semibold text-blue-950">
                  {currency}
                  {item.value}
                </p>
                {/* <NeumorphicIconButton
                  icon="icon-arrow-forward"
                  className="size-[40px] group-hover:visible invisible !bg-[#D2DFFB]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.replace(item.linkHref);
                  }}
                /> */}
              </div>
            </div>
          </ClickableCard>
        ))}
      </div>
    </div>
  );
};

export default EarningsSummary;
