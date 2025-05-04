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
 * Update an existing reservation.
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
 * Retrieve a reservation by ID.
 * @param reservationId - The ID of the reservation to retrieve.
 * @returns The retrieved reservation data.
 */
export async function getReservationById(
  reservationId: string
): Promise<Reservation> {
  return await apiClient.get(`/reservations/${reservationId}`);
}

/**
 * Fetches reservations by host ID.
 * @returns A promise that resolves to the reservations data.
 */
export async function getReservationsByHost() {
  return await apiClient.get("/reservations/host");
}

/**
 * Fetches today's guests by host ID.
 * @returns A promise that resolves to today's guests data.
 */
export async function getTodaysGuestsByHost(): Promise<ReservationStats> {
  return await apiClient.get("/reservations/host/today-guests");
}

/**
 * Fetches earnings statistics for the host.
 * @returns A promise that resolves to the host's earnings data containing pending, monthly, and yearly earnings.
 */
export async function getHostEarnings(): Promise<EarningsStats> {
  return await apiClient.get("/reservations/host/earnings");
}

/**
 * Create a new pre-reservation.
 * @param reservationData - The data for the new pre-reservation.
 * @returns The created pre-reservation data.
 */
export async function createPreReservation(
  reservationData: Partial<Reservation>
) {
  return await apiClient.post("/reservations/pre-booking", reservationData);
}

/**
 * Generate a booking hash for a reservation.
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
 * Create a new reservation.
 * @param reservationData - The data for the new reservation.
 * @returns The created reservation data.
 */
export async function createReservation(reservationData: Partial<Reservation>) {
  return await apiClient.post("/reservations", reservationData);
}

/**
 * Retrieve a pre-reservation by hash.
 * @param reservationId - The hash of the pre-reservation to retrieve.
 * @returns The retrieved pre-reservation data.
 */
export async function getPreReservationByHash(
  reservationId: string
): Promise<Partial<Reservation>> {
  return await apiClient.get(`/reservations/pre-booking/${reservationId}`);
}

/**
 * Fetches reservations by guest ID with pagination and category filtering.
 * @param guestId - The ID of the guest.
 * @param category - The category of reservations to fetch (upcoming, past, cancelled, paid, or not-paid).
 * @param page - The page number for pagination.
 * @param limit - The number of items per page.
 * @returns A promise that resolves to the paginated reservations data.
 */
export async function getReservationsByGuest(
  category: "all" | "upcoming" | "past" | "cancelled" | "paid" | "not-paid"
) {
  return await apiClient.get(`/reservations/guest?category=${category}`);
}
