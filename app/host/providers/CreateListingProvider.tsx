"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useHostStore } from "../store/host-store";

export type ListingStatus =
  | "LISTING_DRAFT"
  | "LISTING_IN_REVIEW"
  | "LISTING_REJECTED"
  | "LISTING_COMPLETED"
  | "LISTING_DELETED";

export interface CreateListing {
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
  created_by?: string;
  updated_by?: string;
}

interface CreateListingContextType {
  listing: CreateListing;
  updateListing: (updatedFields: Partial<CreateListing>) => void;
  resetListing: () => void;
}

const CreateListingContext = createContext<
  CreateListingContextType | undefined
>(undefined);

interface CreateListingProviderProps {
  children: ReactNode;
  initialListing?: Partial<CreateListing>;
}

export const CreateListingProvider = ({
  children,
  initialListing = {},
}: CreateListingProviderProps) => {
  const { isLoading, host, fetchHostStats } = useHostStore();

  // Load from localStorage or fallback to initialListing
  const savedListing =
    typeof window !== "undefined"
      ? localStorage.getItem("new-listing-data")
      : null;
  const [listing, setListing] = useState<CreateListing>(
    savedListing
      ? JSON.parse(savedListing)
      : {
          host_id: "",
          guest_number: 1,
          bedrooms: 0,
          beds: 0,
          bathrooms: 0,
          ...initialListing,
        }
  );

  useEffect(() => {
    // Store updated listing to localStorage
    if (listing && host) {
      localStorage.setItem(
        "new-listing-data",
        JSON.stringify({
          ...listing,
          host_id: host.id,
        })
      );
    }
  }, [listing, host, isLoading]);

  useEffect(() => {
    fetchHostStats();
  }, []);

  const updateListing = (updatedFields: Partial<CreateListing>) => {
    setListing((prevListing) => ({
      ...prevListing,
      ...updatedFields,
    }));
  };

  const resetListing = () => {
    const resetListing = {
      host_id: "",
      guest_number: 1,
      bedrooms: 0,
      beds: 0,
      bathrooms: 0,
      ...initialListing,
    };
    setListing(resetListing);
    localStorage.setItem("new-listing-data", JSON.stringify(resetListing));
  };

  return (
    <CreateListingContext.Provider
      value={{ listing, updateListing, resetListing }}
    >
      {children}
    </CreateListingContext.Provider>
  );
};

export const useCreateListing = (): CreateListingContextType => {
  const context = useContext(CreateListingContext);
  if (!context) {
    throw new Error(
      "useCreateListing must be used within a CreateListingProvider"
    );
  }
  return context;
};
