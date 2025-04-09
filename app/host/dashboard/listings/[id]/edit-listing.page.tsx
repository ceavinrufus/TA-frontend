"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditLocation from "../components/EditLocation";
import { useSearchParams } from "next/navigation";
import EditPropertyType from "../components/EditPropertyType";
import EditAmenities from "../components/EditAmenities";
import EditPropertyDescription from "../components/EditPropertyDescription";
import EditPrice from "../components/EditPrice";
import EditSecurityAgreement from "../components/EditSecurityAgreement";
import EditHouseRule from "../components/EditHouseRule";
import EditBookingSetting from "../components/EditBookingSetting";
import SaveEditButton from "../components/SaveEditButton";
import BackToListingButton from "../components/BackToListingButton";
import EditListingNavigation from "../components/EditListingNavigation";
import {
  EditListing,
  useEditListing,
} from "@/app/host/providers/EditListingProvider";
import { convertTimeFormat } from "../utils/convertTime";
import EditPhotos from "../components/EditPhotos";
import EditAvailabilitySetting from "../components/EditAvailabilitySetting";
import { getListingById } from "@/lib/api/listing";
import { useHostStore } from "@/app/host/store/host-store";

export default function EditListingPage({ id }: { id: string }) {
  const router = useRouter();
  const { setListing } = useEditListing();
  const params = useSearchParams();
  const currentStep = params.get("step") || "location";
  const [loading, setLoading] = useState(true);

  const { host } = useHostStore();

  let Component: React.ComponentType;
  switch (currentStep) {
    case "location":
      Component = EditLocation;
      break;
    case "property-type":
      Component = EditPropertyType;
      break;
    case "amenities":
      Component = EditAmenities;
      break;
    case "photos":
      Component = EditPhotos;
      break;
    case "description":
      Component = EditPropertyDescription;
      break;
    case "price":
      Component = EditPrice;
      break;
    case "accessibility":
      Component = EditSecurityAgreement;
      break;
    case "house-rule":
      Component = EditHouseRule;
      break;
    case "booking-setting":
      Component = EditBookingSetting;
      break;
    case "availability-setting":
      Component = EditAvailabilitySetting;
      break;
    default:
      // eslint-disable-next-line react/display-name
      Component = () => <></>;
  }

  useEffect(() => {
    async function fetchListing() {
      try {
        const currentUserId = host?.id;

        const response = await getListingById(id);
        const currentListing = response as EditListing;

        console.log("currentListing", currentListing);
        console.log("currentUserId", currentUserId);

        if (currentListing.host_id !== currentUserId) {
          router.replace("/host/dashboard/listings"); // Redirect to an unauthorized page
          return;
        }

        const earliestCheckInTime = currentListing.earliest_check_in_time
          ? convertTimeFormat(currentListing.earliest_check_in_time)
          : undefined;
        const latestCheckInTime = currentListing.latest_check_in_time
          ? convertTimeFormat(currentListing.latest_check_in_time)
          : undefined;
        const checkOutTime = currentListing.check_out_time
          ? convertTimeFormat(currentListing.check_out_time)
          : undefined;
        const sameDayBookingCutoffTime =
          currentListing.same_day_booking_cutoff_time
            ? convertTimeFormat(currentListing.same_day_booking_cutoff_time)
            : undefined;

        setListing({
          ...currentListing,
          earliest_check_in_time: earliestCheckInTime ?? undefined,
          latest_check_in_time: latestCheckInTime ?? undefined,
          check_out_time: checkOutTime ?? undefined,
          same_day_booking_cutoff_time: sameDayBookingCutoffTime ?? undefined,
        });
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        router.replace("/host/dashboard/listings"); // Redirect to an unauthorized page
        console.error("Error fetching listing data:", error);
      }
    }

    fetchListing();
  }, [id]);

  if (loading) {
    return;
  }

  return (
    <div className="flex flex-col md:w-[1200px] gap-6">
      <div className="">
        <BackToListingButton />
      </div>
      <div className="flex gap-[80px]">
        <EditListingNavigation />
        <div className="flex flex-col gap-14 w-full">
          <Component />
          <SaveEditButton listingId={id} />
        </div>
      </div>
    </div>
  );
}
