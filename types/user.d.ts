type User = {
  id: string;
  did: string | null;
  wallet_address: string;
  is_uniqueness_verified: boolean;
  is_liveness_verified: boolean;
  is_identity_verified: boolean;
  is_host: boolean;
  is_admin: boolean;
  is_profile_complete?: boolean;
  has_listed_listing?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

interface HostStats {
  totalReservations: number;
  totalListings: number;
  totalEarnings: number;
}
