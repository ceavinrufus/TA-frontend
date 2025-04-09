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
  name?: string;
  address?: string;
  region_id?: number;
  latitude?: number;
  longitude?: number;
  location_details?: {
    unit: string;
    building: string;
    district: string;
    city: string;
    details: string;
  };
  earliest_check_in_time?: string;
  latest_check_in_time?: string;
  check_out_time?: string;
  description?: string;
  postal_code?: string;
  property_type?: string;
  place_type?: string;
  guest_number?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  default_availability?: boolean;
  default_price?: number;
  phone?: string;
  country_code?: string;
  region_name?: string;
  status?: ListingStatus;
  pictures?: string[];
  tags?: string[];
  rules?: string[];
  security_agreement?: string[];
  amenities?: string[];
  is_instant_booking?: boolean;
  is_no_free_cancellation?: boolean;
  cancellation_policy?: string;
  same_day_booking_cutoff_time?: string;
  max_booking_night?: number;
  min_booking_night?: number;
  booking_window?: string;
  buffer_period?: string;
  restricted_check_in?: number[];
  restricted_check_out?: number[];
  created_by?: string;
  updated_by?: string;
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
