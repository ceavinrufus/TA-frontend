import { apiClient } from "./api-client";

export const requestProof = async (
  sessionId: number,
  reason: string,
  body: {
    allowedIssuers: string[];
    context: string;
    credentialSubject: string;
    proofType?: string;
    skipClaimRevocationCheck?: boolean;
    groupId?: number;
    type: string;
  }
): Promise<{ data: { request: any } }> => {
  return await apiClient.post(
    `/identity/verifier/request-proof/${sessionId}?reason=${reason}`,
    body
  );
};

export const getVerificationResult = async (
  sessionId: number
): Promise<any> => {
  return await apiClient.get(
    `/identity/verifier/verification-result/${sessionId}`
  );
};
