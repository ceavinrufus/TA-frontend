import { apiClient } from "./api-client";

interface ReservationStats {
  check_ins: number;
  check_outs: number;
  total_reservations: number;
}

interface EarningsStats {
  pending_earnings: number;
  monthly_earnings: number;
  yearly_earnings: number;
}

/**
 * Server Action: Update an existing reservation.
 * @param reservationId - The ID of the reservation to update.
 * @param reservationData - The updated reservation data.
 * @returns The updated reservation data.
 */
export async function updateReservation(
  reservationId: string,
  reservationData: Partial<Reservation>
) {
  return await apiClient.patch(
    `/reservations/${reservationId}`,
    reservationData
  );
}

/**
 * Server Action: Retrieve a reservation by ID.
 * @param reservationId - The ID of the reservation to retrieve.
 * @returns The retrieved reservation data.
 */
export async function getReservationById(reservationId: string) {
  return await apiClient.get(`/reservations/${reservationId}`);
}

/**
 * Server Action: Fetches reservations by host ID.
 * @returns A promise that resolves to the reservations data.
 */
export async function getReservationsByHost() {
  return await apiClient.get("/reservations/host");
}

/**
 * Server Action: Fetches today's guests by host ID.
 * @returns A promise that resolves to today's guests data.
 */
export async function getTodaysGuestsByHost(): Promise<ReservationStats> {
  return await apiClient.get("/reservations/host/today-guests");
}

/**
 * Server Action: Fetches earnings statistics for the host.
 * @returns A promise that resolves to the host's earnings data containing pending, monthly, and yearly earnings.
 */
export async function getHostEarnings(): Promise<EarningsStats> {
  return await apiClient.get("/reservations/host/earnings");
}

/**
 * Server Action: Create a new pre-reservation.
 * @param reservationData - The data for the new pre-reservation.
 * @returns The created pre-reservation data.
 */
export async function createPreReservation(
  reservationData: Partial<Reservation>
) {
  return await apiClient.post("/reservations/pre-booking", reservationData);
}

/**
 * Server Action: Generate a booking hash for a reservation.
 * @param reservationData - The reservation data to generate hash for.
 * @returns The generated booking hash.
 */
export async function generateBookingHash(
  reservationData: Partial<Reservation>
): Promise<{ book_hash: string }> {
  return await apiClient.post(
    "/reservations/generate-book-hash",
    reservationData
  );
}

/**
 * Server Action: Create a new reservation.
 * @param reservationData - The data for the new reservation.
 * @returns The created reservation data.
 */
export async function createReservation(reservationData: Partial<Reservation>) {
  return await apiClient.post("/reservations", reservationData);
}

/**
 * Server Action: Retrieve a pre-reservation by hash.
 * @param reservationId - The hash of the pre-reservation to retrieve.
 * @returns The retrieved pre-reservation data.
 */
export async function getPreReservationByHash(reservationId: string) {
  return await apiClient.get(`/reservations/pre-booking/${reservationId}`);
}
