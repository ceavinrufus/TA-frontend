import { apiClient } from "./api-client";

export const basicPrivadoAuth = async (
  sessionId: string
): Promise<{ data: { request: any } }> => {
  return await apiClient.post(`/auth/did/${sessionId}`, {});
};
