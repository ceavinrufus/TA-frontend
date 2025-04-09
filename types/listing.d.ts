import { ListingStatus } from "@/app/host/providers/CreateListingProvider";

type Listing = {
  id?: string;
  user_id: string;
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
  default_availability?: boolean;
  default_price?: number | null;
  phone?: string | null;
  country_code?: string | null;
  region_name?: string | null;
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
  user?: Host;
  reservations?: SelfListingReservation[];
  prices?: Price[];
  availabilities?: Availability[];
  created_at?: Date | string;
  updated_at?: Date | string;
};

type SearchListing = {
  id: string;
  slug: string;
  name: string;
  address: string;
  region_id: number;
  latitude: number;
  longitude: number;
  earliest_check_in_time: string;
  latest_check_in_time: string;
  check_out_time: string;
  description: string;
  postal_code: string;
  property_type: string;
  place_type: string;
  guest_number: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  daily_price: number[];
  total_price: number;
  phone: string;
  country_code: string;
  region_name: string;
  status: ListingStatus;
  pictures: string[];
  tags: string[];
  rules: string[];
  security_agreement: string[];
  amenities: string[];
  location_details: {
    unit: string;
    building: string;
    district: string;
    city: string;
    details: string;
  };
  is_instant_booking: boolean;
  is_no_free_cancellation: boolean;
  cancellation_policy: string;
  same_day_booking_cutoff_time: string;
  max_booking_night: number;
  min_booking_night: number;
  booking_window?: string;
  buffer_period?: string;
  restricted_check_in?: number[];
  restricted_check_out?: number[];
  user_id: string;
  user: Host;
  prices: Price[];
  availabilities: Availability[];
  created_at: Date | string;
  updated_at: Date | string;
};

type Price = {
  listing_id: string;
  price_override: number;
  currency: string;
  type: string;
  start_date: string;
  end_date: string;
  created_at: Date | string;
  updated_at: Date | string;
};

type Availability = {
  listing_id: string;
  start_date: string;
  end_date: string;
  availability_override: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

type ListingAggregateResDto = {
  status_counts: StatusCountDto[];
  availability_counts: AvailabilityCountDto[];
  total_listings: number;
};

type StatusCountDto = {
  status: string;
  count: number;
};

type AvailabilityCountDto = {
  availability: string;
  count: number;
};
