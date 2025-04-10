import { apiClient } from "./api-client";

/**
 * Payment management and operations
 */

/**
 * Create a new payment
 * @param paymentData - The data for the new payment
 */
export const createPayment = async (paymentData: Partial<Payment>) => {
  return await apiClient.post<Payment>("/payments", paymentData);
};

/**
 * Get all payments
 */
export const getAllPayments = async () => {
  return await apiClient.get<Payment[]>("/payments");
};

/**
 * Get a payment by ID
 * @param paymentId - The ID of the payment to retrieve
 */
export const getPaymentById = async (paymentId: string) => {
  return await apiClient.get<Payment>(`/payments/${paymentId}`);
};

/**
 * Update a payment
 * @param paymentId - The ID of the payment to update
 * @param paymentData - The updated payment data
 */
export const updatePayment = async (
  paymentId: string,
  paymentData: Partial<Payment>
) => {
  return await apiClient.patch<Payment>(`/payments/${paymentId}`, paymentData);
};

/**
 * Delete a payment
 * @param paymentId - The ID of the payment to delete
 */
export const deletePayment = async (paymentId: string) => {
  return await apiClient.delete(`/payments/${paymentId}`);
};
