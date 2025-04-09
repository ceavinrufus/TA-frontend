type Payment = {
  id: string;
  amount: number;
  currency: string;
  is_successful: boolean;
  transaction_hash?: string;
  reservation_id: string;
  reservation?: Reservation;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
};
