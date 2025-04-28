import { getHostInfo, getHostStats } from "@/lib/api/host";
import { create } from "zustand";

interface HostStore {
  host: User | null;
  hostStats: HostStats | null;
  isLoading: boolean;
  error: string | null;
  setHost: (host: User) => void;
  setHostStats: (hostStats: HostStats) => void;
  fetchHostStats: () => Promise<void>;
  reset: () => void;
}

export const useHostStore = create<HostStore>((set) => ({
  host: null,
  hostStats: null,
  isLoading: false,
  error: null,

  setHost: (host: User) => {
    set({ host });
  },

  setHostStats: (hostStats: HostStats) => {
    set({ hostStats });
  },

  fetchHostStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const host = await getHostInfo();
      const stats = await getHostStats();
      set({
        host: host,
        hostStats: { ...stats, hostStake: "0.0" },
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch host stats:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch host stats",
        isLoading: false,
      });
    }
  },

  reset: () => {
    set({
      host: null,
      hostStats: null,
      isLoading: false,
      error: null,
    });
  },
}));
