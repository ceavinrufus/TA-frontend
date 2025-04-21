import { apiClient } from "./api-client";

export const issueCredential = async (body) => {
  return await apiClient.post<{
    credential_id: string;
    universal_link: string;
  }>("/identity/issuer/issue-credential", body);
};
