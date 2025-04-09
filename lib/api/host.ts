import { apiClient } from "./api-client";

/**
 * Host authentication and profile management
 */
export const loginHost = async (id: string) => {
  return await apiClient.patch<User>(`/users/${id}`, { is_host: true });
};

export const updateHost = async (id: string, data: Partial<User>) => {
  return await apiClient.patch<User>(`/users/${id}`, data);
};

export const getHostInfo = async () => {
  return await apiClient.get<User>("/users/me");
};

export const getHostStats = async () => {
  return await apiClient.get<{
    totalReservations: number;
    totalListings: number;
    totalEarnings: number;
  }>("/users/me/stats");
};
