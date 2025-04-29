import { getUserInfo } from "@/lib/api/user";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user: User) => {
    set({ user });
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await getUserInfo();
      set({
        user: user,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch user",
        isLoading: false,
      });
    }
  },

  reset: () => {
    set({
      user: null,
      isLoading: false,
      error: null,
    });
  },
}));
