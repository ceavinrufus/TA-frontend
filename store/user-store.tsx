import { toast } from "@/hooks/use-toast";
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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user";
      set({
        error: errorMessage,
        isLoading: false,
      });
      const pathname = window.location.pathname;
      if (
        pathname !== "/" &&
        !pathname.startsWith("/search") &&
        !pathname.startsWith("/order/details")
      ) {
        console.error("Failed to fetch user.", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
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
