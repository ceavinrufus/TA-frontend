/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";

/**
 * Create a new dispute.
 * @param disputeData - The data for the new dispute.
 * @returns The created dispute data.
 */
export async function createDispute(
  disputeData: Partial<Dispute>
): Promise<Dispute> {
  return await apiClient.post("/disputes", disputeData);
}

/**
 * Update an existing dispute.
 * @param disputeId - The ID of the dispute to update.
 * @param disputeData - The updated dispute data.
 * @returns The updated dispute data.
 */
export async function updateDispute(
  disputeId: string,
  disputeData: Partial<Dispute>
) {
  return await apiClient.patch(`/disputes/${disputeId}`, disputeData);
}

/**
 * Retrieve a dispute by ID.
 * @returns The retrieved disputes data.
 */
export async function getAllDispute() {
  return await apiClient.get(`/disputes`);
}

/**
 * Retrieve a dispute by ID.
 * @param disputeId - The ID of the dispute to retrieve.
 * @returns The retrieved dispute data.
 */
export async function getDisputeById(disputeId: string): Promise<Dispute> {
  return await apiClient.get(`/disputes/${disputeId}`);
}

/**
 * Delete a dispute by ID.
 * @param disputeId - The ID of the dispute to delete.
 * @returns Void
 */
export async function deleteDispute(disputeId: string): Promise<void> {
  return await apiClient.delete(`/disputes/${disputeId}`);
}
