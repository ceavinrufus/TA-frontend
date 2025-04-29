import { apiClient } from "./api-client";

export const getUserInfo = async () => {
  return await apiClient.get<User>("/users/me");
};

export const updateUser = async (id: string, data: Partial<User>) => {
  return await apiClient.patch<User>(`/users/${id}`, data);
};
