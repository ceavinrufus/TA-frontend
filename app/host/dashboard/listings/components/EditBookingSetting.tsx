import ClickableCard from "@/app/host/components/ClickableCard";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import React, { useState } from "react";
import { generateTimeIntervals } from "@/lib/utils";
import { TimePicker } from "@/components/TimePicker";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CardWithSwitchProps {
  title?: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const CardWithSwitch: React.FC<CardWithSwitchProps> = ({
  title,
  description,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex justify-between w-full rounded-[32px] px-12 py-6 gap-12 items-center flex-row shadow-button-up">
      <div className="flex flex-col gap-2 h-full justify-center">
        {title && <h2 className="host-page-h3-primary-blue">{title}</h2>}
        {description && (
          <p className="edit-listing-card-description">{description}</p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

/**
 * EditBookingSetting Component
 *
 * A component that allows hosts to edit booking settings for their listing.
 * This includes settings for:
 * - Instant booking toggle
 * - Cancellation policy selection (No free cancellation or Flexible policies)
 * - Trip length configurations (same day booking cutoff, min/max nights)
 *
 * @component
 * @returns {JSX.Element} A form interface for editing booking settings
 *
 * @example
 * ```tsx
 * <EditBookingSetting />
 * ```
 *
 * @remarks
 * Uses the following custom hooks and components:
 * - useEditListing - For managing listing data and updates
 * - useDateTimeUtils - For generating time intervals
 * - CardWithSwitch - For toggling instant booking
 * - ClickableCard - For selection cards
 * - TimePicker - For selecting cutoff time
 */
const EditBookingSetting = () => {
  const { listing, updateListing } = useEditListing();
  const [radio1Value, setRadio1Value] = useState();
  const [radio2Value, setRadio2Value] = useState();

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="edit-listing-page-title">Booking Setting</h1>
      <div className="flex flex-col gap-6 w-full">
        <h2 className="edit-listing-form-input-label">Instant booking</h2>
        <CardWithSwitch
          title={"Instant booking"}
          description={
            "No need for you to personally confirm the order after the guest has placed the order, it is automatically confirmed immediately."
          }
          checked={listing.is_instant_booking || false}
          onCheckedChange={(checked: boolean) =>
            updateListing({
              is_instant_booking: checked,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-6 w-full">
        <h2 className="edit-listing-form-input-label">Cancellation policy</h2>
        <div className="flex flex-col gap-4">
          <RadioGroup
            defaultValue={
              listing.is_no_free_cancellation === null
                ? ""
                : listing.is_no_free_cancellation
                ? "No"
                : "Yes"
            }
            value={radio1Value}
            className="w-full"
          >
            <ClickableCard
              className="px-12 py-6 gap-3 rounded-[32px] flex-row justify-between items-center"
              onClick={() => {
                updateListing({
                  is_no_free_cancellation: true,
                  cancellation_policy: "",
                });
                setRadio1Value("No");
                setRadio2Value("")
              }}
            >
              <div className="p-2 space-y-2">
                <p className="host-page-h3-primary-blue">
                  No free cancellation
                </p>
                <p className="edit-listing-card-description">
                  No refunds for cancellations once the guest has made an
                  reservation.
                </p>
              </div>
              <RadioGroupItem value="No" id="r1-1" />
            </ClickableCard>

            <ClickableCard
              className="px-12 py-6 gap-3 rounded-[32px] flex-row justify-between items-center"
              onClick={() => {
                updateListing({
                  is_no_free_cancellation: false,
                  cancellation_policy: "Flexible",
                });
                setRadio1Value("Yes");
                setRadio2Value("Flexible")
              }}
            >
              <div className="p-2 space-y-2">
                <p className="host-page-h3-primary-blue">
                  Flexible cancellation policy
                </p>
                <p className="edit-listing-card-description">
                  The guest can receive a complete refund when he cancels the
                  booking within the stipulated time period.
                </p>
              </div>
              <RadioGroupItem value="Yes" id="r1-2" />
            </ClickableCard>
          </RadioGroup>

          <RadioGroup
            defaultValue={listing.cancellation_policy || ""}
            value={radio2Value}
          >
            <div
              className={`flex flex-col gap-4 w-[719px] self-center ${
                !listing.is_no_free_cancellation ? "" : "hidden"
              }`}
            >
              {[
                {
                  title: "Flexible",
                  description:
                    "Guests get a full refund if they cancel up to a day before check-in.",
                },
                {
                  title: "Moderate",
                  description:
                    "Guests get a full refund if they cancel up to 5 days before check-in.",
                },
                {
                  title: "Firm",
                  description:
                    "Guests get a full refund if they cancel up to 30 days before check-in, except in certain cases.",
                },
                {
                  title: "Strict",
                  description:
                    "Guests get a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.",
                },
              ].map((policy, index) => (
                <ClickableCard
                  key={index}
                  className="px-12 py-6 gap-3 rounded-[32px] flex-row justify-between items-center"
                  onClick={() => {
                    updateListing({ cancellation_policy: policy.title });
                    setRadio2Value(policy.title);
                  }}
                >
                  <div className="p-2 space-y-2">
                    <p className="host-page-h3-primary-blue">{policy.title}</p>
                    <p className="edit-listing-card-description">
                      {policy.description}
                    </p>
                  </div>
                  <RadioGroupItem value={policy.title} id={`r2-${index}`} />
                </ClickableCard>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <h2 className="edit-listing-form-input-label">Trip Length</h2>
        <div className="flex flex-col gap-2 h-full justify-center">
          <label className="edit-listing-form-input-label">
            Guest can book on the same day as check-in until this time
          </label>
          <TimePicker
            timeIntervals={generateTimeIntervals()}
            onChange={(value) =>
              updateListing({ same_day_booking_cutoff_time: value })
            }
            value={listing.same_day_booking_cutoff_time || ""}
          />
        </div>
        <div className="flex flex-col gap-2 h-full justify-center">
          <label className="edit-listing-form-input-label">
            Minimum night for booking
          </label>
          <Input
            className="py-[12px] px-[16px] w-full h-14 rounded-[16px] md:px-[16px] md:py-[12px] md:rounded-[16px]"
            placeholder={"1"}
            value={listing.min_booking_night}
            type="number"
            min={0}
            onChange={(e) =>
              updateListing({ min_booking_night: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-col gap-2 h-full justify-center">
          <label className="edit-listing-form-input-label">
            Maximum night for booking
          </label>
          <Input
            className="py-[12px] px-[16px] w-full h-14 rounded-[16px] md:px-[16px] md:py-[12px] md:rounded-[16px]"
            placeholder={"10"}
            value={listing.max_booking_night}
            type="number"
            min={0}
            onChange={(e) =>
              updateListing({ max_booking_night: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EditBookingSetting;
