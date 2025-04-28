type User = {
  id: string;
  name: string | null;
  email: string;
  wallet_address: string;
  is_verified: boolean;
  is_anonymous: boolean;
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
  hostStake: string;
}
