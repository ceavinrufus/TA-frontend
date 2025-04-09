import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import ClickableCard from "@/app/host/components/ClickableCard";

/**
 * Component for editing availability settings of a listing
 *
 * Allows hosts to configure:
 * - Booking window (how far in advance guests can book)
 * - Buffer period (blocked nights before/after bookings)
 * - Restricted check-in days
 * - Restricted check-out days
 *
 * Uses custom dropdown components and clickable cards for selection
 * Integrates with listing data through useEditListing hook
 *
 * @component
 * @example
 * ```tsx
 * <EditAvailabilitySetting />
 * ```
 */
const EditAvailabilitySetting = () => {
  const { listing, updateListing } = useEditListing();
  const [bookingWindowOpen, setBookingWindowOpen] = useState(false);
  const [bufferPeriodOpen, setBufferPeriodOpen] = useState(false);

  const bookingWindowOptions = [
    {
      label: "Inactive",
      value: "Inactive",
    },
    {
      label: "1 month",
      value: "1 month",
    },
    {
      label: "3 months",
      value: "3 months",
    },
    {
      label: "6 months",
      value: "6 months",
    },
    {
      label: "9 months",
      value: "9 months",
    },
    {
      label: "12 months",
      value: "12 months",
    },
    {
      label: "24 months",
      value: "24 months",
    },
  ];

  const bufferPeriodOptions = [
    {
      label: "None",
      value: "None",
    },
    {
      label: "1 night before and after each booking",
      value: "1 night",
    },
    {
      label: "2 nights before and after each booking",
      value: "2 nights",
    },
  ];

  const daysOfWeek = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="edit-listing-page-title">Availability Setting</h1>

      <div className="flex flex-col w-full gap-2">
        <label
          className="edit-listing-form-input-label"
          htmlFor="bookingWindow"
        >
          How far in advance can guests book?
        </label>
        <CustomDropdown
          id="bookingWindow"
          open={bookingWindowOpen}
          onToggle={() => setBookingWindowOpen(!bookingWindowOpen)}
          selectedValue={listing.booking_window ?? null}
          onChange={(value) => updateListing({ booking_window: value })}
          disabled={false}
          options={bookingWindowOptions}
          placeholder="Select a booking window"
          className="md:p-4 md:h-[56px] md:rounded-2xl"
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <label className="edit-listing-form-input-label" htmlFor="bufferPeriod">
          How many nights do you need to block before and after each booking?
        </label>
        <CustomDropdown
          id="bufferPeriod"
          open={bufferPeriodOpen}
          onToggle={() => setBufferPeriodOpen(!bufferPeriodOpen)}
          selectedValue={listing.buffer_period ?? null}
          onChange={(value) => updateListing({ buffer_period: value })}
          disabled={false}
          options={bufferPeriodOptions}
          placeholder="Select a buffer period"
          className="md:p-4 md:h-[56px] md:rounded-2xl"
        />
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2 h-full justify-center">
          <div className="flex flex-col gap-1 h-full justify-center">
            <label className="edit-listing-form-input-label">
              Restricted check-in
            </label>
            <p className="edit-listing-page-subtitle">
              If guests start their stay on these days, they will not be able to
              book your room.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            {daysOfWeek.map(({ label, value }) => (
              <ClickableCard
                key={value}
                className="w-fit h-[48px] px-6 py-4 gap-2 rounded-[32px]"
                isClicked={listing.restricted_check_in?.includes(value)}
                onClick={() => {
                  const currentCheckin = listing.restricted_check_in || [];
                  const updatedCheckin = currentCheckin.includes(value)
                    ? currentCheckin.filter((d) => d !== value)
                    : [...currentCheckin, value];
                  updateListing({ restricted_check_in: updatedCheckin });
                }}
              >
                <p>{label}</p>
              </ClickableCard>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 h-full justify-center">
          <div className="flex flex-col gap-1 h-full justify-center">
            <label className="edit-listing-form-input-label">
              Restricted check-out
            </label>
            <p className="edit-listing-page-subtitle">
              If guests end their stay on these days, they will not be able to
              book your room.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            {daysOfWeek.map(({ label, value }) => (
              <ClickableCard
                key={value}
                className="w-fit h-[48px] px-6 py-4 gap-2 rounded-[32px]"
                isClicked={listing.restricted_check_out?.includes(value)}
                onClick={() => {
                  const currentCheckout = listing.restricted_check_out || [];
                  const updatedCheckout = currentCheckout.includes(value)
                    ? currentCheckout.filter((d) => d !== value)
                    : [...currentCheckout, value];
                  updateListing({ restricted_check_out: updatedCheckout });
                }}
              >
                <p>{label}</p>
              </ClickableCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAvailabilitySetting;
