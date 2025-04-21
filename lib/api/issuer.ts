import { apiClient } from "./api-client";

export const issueCredential = async (body: {
  credentialSubject: string;
  type: string;
  credentialSchema: string;
  expiration: number;
}) => {
  return await apiClient.post<{
    data: {
      credential_id: string;
    };
  }>("/identity/issuer/issue-credential", body);
};
