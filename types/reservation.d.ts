type Reservation = {
  id: string;
  booking_number: string;
  listing_id: string;
  listing: Listing;
  guest_id: string;
  host_id: string;
  listing_name: string;
  listing_address: string;
  base_price: number;
  tax: number;
  currency: string;
  night_staying: number;
  check_in_date: string;
  check_out_date: string;
  guest_number: number;
  total_price: number;
  payments: Payment[] | null;
  guest_info: GuestInfo[] | null;
  user_billing_detail: UserBillingDetail | null;
  status: string;
  cancel_reason: string;
  book_hash: string;
  dispute?: Dispute | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};

type GuestInfo = {
  first_name?: string;
  last_name?: string;
  is_child?: boolean;
  age?: number;
  email?: string;
  phone?: string;
  residency?: string;
  title?: string;
};

type UserBillingDetail = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  city?: string;
  address?: string;
  company_name?: string;
  vat_number?: string;
  wallet_address?: string;
};
