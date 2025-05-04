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
  service_fee: number;
  guest_deposit: number;
  night_staying: number;
  check_in_date: string;
  check_out_date: string;
  guest_number: number;
  total_price: number;
  payments: Payment[] | null;
  guest_info: GuestInfo[] | null;
  guest_wallet_address: string;
  status: string;
  cancel_reason: string;
  book_hash: string;
  guest_did: string;
  booking_credential_id: string;
  dispute?: Dispute | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};

type OnChainReservation = {
  renter: string;
  owner: string;
  amount: number;
  guestDeposit: number;
  startTime: number;
  endTime: number;
  isDisputeRaised: boolean;
  isResolved: boolean;
  isPaymentReleased: boolean;
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

enum ReservationStatus {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_WAITING_PAYMENT = "ORDER_WAITING_PAYMENT",
  ORDER_PAID_PARTIAL = "ORDER_PAID_PARTIAL",
  ORDER_PAID_COMPLETED = "ORDER_PAID_COMPLETED",
  ORDER_PROCESSING = "ORDER_PROCESSING",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  ORDER_CANCELED = "ORDER_CANCELED",
  ORDER_FAIL = "ORDER_FAIL",
  REFUND_PENDING = "REFUND_PENDING",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REFUND_FAIL = "REFUND_FAIL",
}
