"use client";

import React, { useState } from "react";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import NoBorderInput from "@/app/host/create-listing/components/NoBorderInput";
import { Separator } from "@/components/ui/separator";
import { GUEST_DEPOSIT_RATE, SERVICE_FEE_RATE } from "@/constants";

/**
 * EditPrice Component
 *
 * A form component that allows hosts to edit the daily price for their listing and view earnings breakdown.
 *
 * Features:
 * - Input field for setting the daily base price with currency symbol
 * - Real-time price formatting and validation
 * - Automatic calculation of fees and earnings
 * - Price breakdown display showing:
 *   - Base price
 *   - Service fee (5%)
 *   - Guest deposit (5%)
 *   - Final host earnings
 *
 * @component
 * @example
 * ```tsx
 * <EditPrice />
 * ```
 *
 * A form section containing price input and breakdown calculations
 *
 * @remarks
 * The component uses the useEditListing hook to manage listing data and updates.
 * Price input is formatted to handle decimal values appropriately and remove invalid characters.
 * All monetary calculations are performed in real-time as the user types.
 */
const EditPrice = () => {
  const { listing, updateListing } = useEditListing();
  const currency = "ETH";
  const [inputValue, setInputValue] = useState(
    listing.default_price?.toString() || ""
  );

  const formatPrice = (value: string) => {
    // Remove all non-numeric characters except decimal point
    let cleaned = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    return cleaned;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = formatPrice(e.target.value);
    setInputValue(newValue);
    if (newValue === "") {
      updateListing({ default_price: undefined });
    } else {
      // Convert to number for listing update
      updateListing({ default_price: parseFloat(newValue) || 0 });
    }
  };

  const handleBlur = () => {
    let finalValue = inputValue;

    if (inputValue.includes(".")) {
      const [whole, decimal] = inputValue.split(".");

      // Remove trailing zeros from decimal part
      if (decimal.replace(/0+$/, "") === "") {
        finalValue = whole;
      } else {
        finalValue = whole + "." + decimal.replace(/0+$/, "");
      }
    }

    if (finalValue === "") {
      setInputValue("");
      // updateListing({ default_price: undefined });
    } else {
      setInputValue(parseFloat(finalValue).toString());
      updateListing({ default_price: parseFloat(finalValue) || 0 });
    }
  };

  // Calculate fees
  const basePrice = parseFloat(inputValue) || 0;
  const serviceFee = basePrice * SERVICE_FEE_RATE;
  const guestDeposit = basePrice * GUEST_DEPOSIT_RATE;
  const hostEarnings = basePrice - serviceFee - guestDeposit;

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="text-2xl font-bold text-blue-950">Price</h1>
      <div className="flex flex-col gap-20 shadow-neumorphic-card-up w-full rounded-[32px] p-12">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl font-semibold text-blue-950">
            Daily base price
          </h2>
          <NoBorderInput
            value={inputValue ? inputValue + " " + currency : ""}
            onChange={handlePriceChange}
            onBlur={handleBlur}
            placeholder={`0.2 ${currency}`}
          />
        </div>
        <div className="flex flex-col gap-[14px]">
          {/* Base price */}
          <div className="flex justify-between text-blue-950">
            <p>Base price</p>
            <p>
              {Number(basePrice.toFixed(8))} {currency}
            </p>
          </div>
          {/* Service fee */}
          <div className="flex justify-between text-blue-950">
            <p>Service fee (5%)</p>
            <p>
              {Number(serviceFee.toFixed(8))} {currency}
            </p>
          </div>
          {/* Guest deposit */}
          <div className="flex justify-between text-blue-950">
            <p>Guest deposit (5%)</p>
            <p>
              {Number(guestDeposit.toFixed(8))} {currency}
            </p>
          </div>
          <Separator orientation="horizontal" />
          {/* Host earnings */}
          <div className="flex justify-between text-blue-950 !font-bold">
            <p>You earn</p>
            <p>
              {Number(hostEarnings.toFixed(8))} {currency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPrice;
