import { apiClient } from "./api-client";

export const getGuestInfo = async () => {
  return await apiClient.get<User>("/users/me");
};
