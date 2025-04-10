import { create } from "zustand";
import { Listing } from "@/types/listing";
import { getPreReservationByHash } from "@/lib/api/reservation";
import { getListingById } from "@/lib/api/listing";

interface OrderStore {
  reservationDetails: Partial<Reservation> | null; // Consider creating a proper type for price details
  listingDetails: Listing | null;
  isLoading: boolean;
  error: string | null;
  fetchOrderDetails: (hash: string) => Promise<void>;
  reset: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  reservationDetails: null,
  listingDetails: null,
  isLoading: false,
  error: null,

  fetchOrderDetails: async (hash: string) => {
    try {
      set({ isLoading: true, error: null });

      const reservationDetails = await getPreReservationByHash(hash);
      console.log(reservationDetails);
      const listingDetails = await getListingById(
        reservationDetails.listing_id!
      );

      set({
        reservationDetails,
        listingDetails,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false,
      });
    }
  },

  reset: () => {
    set({
      reservationDetails: null,
      listingDetails: null,
      isLoading: false,
      error: null,
    });
  },
}));
