"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ListingStatus } from "./CreateListingProvider";

export interface EditListing {
  host_id: string;
  name?: string | null;
  address?: string | null;
  region_id?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  location_details?: {
    unit: string;
    building: string;
    district: string;
    city: string;
    details: string;
  } | null;
  earliest_check_in_time?: string | null;
  latest_check_in_time?: string | null;
  check_out_time?: string | null;
  description?: string | null;
  postal_code?: string | null;
  property_type?: string | null;
  place_type?: string | null;
  guest_number?: number | null;
  bedrooms?: number | null;
  beds?: number | null;
  bathrooms?: number | null;
  default_availability?: boolean | null;
  default_price?: number | null;
  phone?: string | null;
  country_code?: string | null;
  region_name?: string | null;
  status?: ListingStatus | null;
  pictures?: string[] | null;
  tags?: string[] | null;
  rules?: string[] | null;
  security_agreement?: string[] | null;
  amenities?: string[] | null;
  is_instant_booking?: boolean | null;
  is_no_free_cancellation?: boolean | null;
  cancellation_policy?: string | null;
  same_day_booking_cutoff_time?: string | null;
  max_booking_night?: number | null;
  min_booking_night?: number | null;
  booking_window?: string | null;
  buffer_period?: string | null;
  restricted_check_in?: number[] | null;
  restricted_check_out?: number[] | null;
  created_by?: string | null;
  updated_by?: string | null;
}

interface EditListingContextType {
  listing: EditListing;
  setListing: React.Dispatch<React.SetStateAction<EditListing>>;
  updateListing: (updatedFields: Partial<EditListing>) => void;
  resetListing: () => void;
}

const EditListingContext = createContext<EditListingContextType | undefined>(
  undefined
);

interface EditListingProviderProps {
  children: ReactNode;
  initialListing?: Partial<EditListing>;
}

export const EditListingProvider = ({
  children,
  initialListing = {},
}: EditListingProviderProps) => {
  const pathname = usePathname(); // Get the current pathname
  const isInTargetPath = /^\/host\/dashboard\/listings\/[0-9a-fA-F-]{36}$/.test(
    pathname
  );

  // Load from localStorage or fallback to initialListing
  const savedListing =
    typeof window !== "undefined" && isInTargetPath
      ? localStorage.getItem("edit-listing-data")
      : null;

  const [listing, setListing] = useState<EditListing>(
    savedListing ? JSON.parse(savedListing) : { host_id: "", ...initialListing }
  );

  useEffect(() => {
    if (isInTargetPath) {
      // Store updated listing to localStorage only on the target path
      if (listing) {
        localStorage.setItem("edit-listing-data", JSON.stringify(listing));
      }
    } else {
      // Reset listing when not on the target path
      localStorage.removeItem("edit-listing-data");
    }
  }, [listing, isInTargetPath]);

  const updateListing = (updatedFields: Partial<EditListing>) => {
    setListing((prevListing) => ({
      ...prevListing,
      ...updatedFields,
    }));
  };

  const resetListing = () => {
    const resetListing = { host_id: "", ...initialListing };
    setListing(resetListing);
    localStorage.setItem("edit-listing-data", JSON.stringify(resetListing));
  };

  return (
    <EditListingContext.Provider
      value={{ listing, setListing, updateListing, resetListing }}
    >
      {children}
    </EditListingContext.Provider>
  );
};

export const useEditListing = (): EditListingContextType => {
  const context = useContext(EditListingContext);
  if (!context) {
    throw new Error("useEditListing must be used within a EditListingProvider");
  }
  return context;
};
