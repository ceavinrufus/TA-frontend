import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import GuestCountModifier from "@/components/GuestCountModifier";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import { cn, generateTimeIntervals } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/TimePicker";

/**
 * EditHouseRule component allows hosts to modify house rules and settings for their listing.
 *
 * Features:
 * - Toggle guest-specific rules (pets, parties, smoking, infants, elderly)
 * - Adjust maximum guest capacity
 * - Set check-in/check-out time windows
 *
 * @component
 * @uses useEditListing - Custom hook for managing listing state and updates
 * @uses useDateTimeUtils - Custom hook providing time interval generation utilities
 * @uses ResponsiveIcon - Icon component that adapts to screen size
 * @uses GuestCountModifier - Component for incrementing/decrementing guest count
 * @uses TimePicker - Component for selecting time values
 *
 * A form section for editing house rules and guest policies
 */
const EditHouseRule = () => {
  const { listing, updateListing } = useEditListing();

  const handleDecrease = () => {
    updateListing({
      guest_number: Math.max((listing.guest_number ?? 0) - 1, 1),
    });
  };

  const handleIncrease = () => {
    updateListing({
      guest_number: (listing.guest_number ?? 0) + 1,
    });
  };

  const guestRules = [
    "Pet allowed",
    "Party allowed",
    "Smoking allowed",
    "Infant allowed",
    "Elderly allowed",
  ];

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="text-2xl font-bold text-blue-950">House Rule</h1>
      <div className="flex flex-col gap-6 w-full">
        <h2 className="font-semibold">Rule for guest</h2>
        {guestRules.map((rule) => (
          <div
            className="flex justify-between w-full rounded-[32px] px-12 py-6 gap-12 items-center flex-row shadow-button-up"
            key={rule}
          >
            <div className="flex flex-col gap-2 h-full justify-center">
              <h2 className="text-lg font-semibold text-blue-950">{rule}</h2>
            </div>
            <div className="flex items-center h-full gap-6">
              {(() => {
                const isDisabled = !listing.rules?.includes(rule);
                return (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (listing.rules?.includes(rule)) {
                        updateListing({
                          rules: listing.rules.filter((r) => r !== rule),
                        });
                      }
                    }}
                    className={cn(
                      "h-[32px] w-[32px] rounded-full",
                      isDisabled ? "!bg-blue-950" : ""
                    )}
                    disabled={isDisabled}
                  >
                    <ResponsiveIcon
                      icon="icon-close"
                      color={isDisabled ? "#F6F6F6" : "#34561A"}
                      sizeDesktop={16}
                    />
                  </Button>
                );
              })()}
              {(() => {
                const isDisabled = listing.rules?.includes(rule);
                return (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      updateListing({
                        rules: [...(listing.rules ?? []), rule],
                      });
                    }}
                    className={cn(
                      "h-[32px] w-[32px] rounded-full",
                      isDisabled ? "!bg-blue-950" : ""
                    )}
                    disabled={isDisabled}
                  >
                    <ResponsiveIcon
                      icon="icon-check"
                      color={isDisabled ? "#F6F6F6" : "#34561A"}
                      sizeDesktop={16}
                    />
                  </Button>
                );
              })()}
            </div>
          </div>
        ))}
        <GuestCountModifier
          className="py-6 h-fit gap-12"
          labelClassName="text-lg font-semibold text-blue-950"
          label={"Maximum guest number"}
          count={listing.guest_number ?? 1}
          onDecrease={() => handleDecrease()}
          onIncrease={() => handleIncrease()}
          minCount={1}
          maxCount={10}
        />
      </div>
      <div className="flex flex-col gap-6 w-full">
        <h2 className="font-semibold">Check-in and check-out time</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 h-full justify-center">
            <label className="font-semibold">Earliest check-in time</label>
            <TimePicker
              timeIntervals={generateTimeIntervals()}
              onChange={(value) =>
                updateListing({ earliest_check_in_time: value })
              }
              value={listing.earliest_check_in_time || ""}
            />
          </div>
          <div className="flex flex-col gap-2 h-full justify-center">
            <label className="font-semibold">Latest check-in time</label>
            <TimePicker
              timeIntervals={generateTimeIntervals()}
              onChange={(value) =>
                updateListing({ latest_check_in_time: value })
              }
              value={listing.latest_check_in_time || ""}
            />
          </div>
          <div className="flex flex-col gap-2 h-full justify-center">
            <label className="font-semibold">Check-out time</label>
            <TimePicker
              timeIntervals={generateTimeIntervals()}
              onChange={(value) => updateListing({ check_out_time: value })}
              value={listing.check_out_time || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHouseRule;
