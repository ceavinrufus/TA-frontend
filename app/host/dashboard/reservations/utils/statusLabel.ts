export const statusColors = {
  Completed: "bg-green-success",
  Resolved: "bg-green-success",
  Pending: "bg-[#EBEBEB]",
  Unpaid: "bg-yellow-100",
  Cancelled: "bg-red-error",
  Disputed: "bg-red-error",
  Upcoming: "bg-[#D2DFFB]",
  "Checked-in": "bg-[#F2EAD5]",
  "Checked-out": "bg-[#F2EAD5]",
  "": "",
};

export enum DisputeStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED_FAVOR_GUEST = "RESOLVED_FAVOR_GUEST",
  RESOLVED_FAVOR_HOST = "RESOLVED_FAVOR_HOST",
  RESOLVED_COMPROMISE = "RESOLVED_COMPROMISE",
}
export enum ReservationStatus {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_WAITING_PAYMENT = "ORDER_WAITING_PAYMENT",
  ORDER_PAID_PARTIAL = "ORDER_PAID_PARTIAL",
  ORDER_PAID_COMPLETED = "ORDER_PAID_COMPLETED",
  ORDER_PROCESSING = "ORDER_PROCESSING",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  ORDER_CANCELED = "ORDER_CANCELED",
  ORDER_FAIL = "ORDER_FAIL",
  REFUND_PENDING = "REFUND_PENDING",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REFUND_FAIL = "REFUND_FAIL",
}

export const getStatusLabel = (reservation: Partial<Reservation>) => {
  if (!reservation) {
    return "";
  }
  if (reservation.status === ReservationStatus.ORDER_COMPLETED) {
    const now = new Date().toISOString();

    // Check if dispute exists and is resolved
    if (reservation.dispute?.status) {
      if (
        [
          DisputeStatus.RESOLVED_FAVOR_GUEST,
          DisputeStatus.RESOLVED_FAVOR_HOST,
          DisputeStatus.RESOLVED_COMPROMISE,
        ].includes(reservation.dispute.status as DisputeStatus)
      ) {
        return "Resolved";
      } else {
        return "Disputed";
      }
    }

    // Check if past dispute period (7 days after checkout)
    const checkoutDate = new Date(reservation.check_out_date!);
    const disputePeriodEnd = new Date(checkoutDate);
    disputePeriodEnd.setDate(disputePeriodEnd.getDate() + 7);

    if (new Date(now) > disputePeriodEnd) {
      return "Completed";
    }

    if (reservation.check_in_date! > now) {
      return "Upcoming";
    } else if (reservation.check_out_date! < now) {
      return "Checked-out";
    } else {
      return "Checked-in";
    }
  } else if (reservation.status === ReservationStatus.ORDER_CANCELED) {
    return "Cancelled";
  } else if (reservation.status === ReservationStatus.ORDER_PROCESSING) {
    return "Pending";
  } else if (reservation.status === ReservationStatus.ORDER_WAITING_PAYMENT) {
    return "Unpaid";
  } else {
    return "";
  }
};
