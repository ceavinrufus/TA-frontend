import React from "react";
import ReservationTable from "../components/ReservationTable";
import BackToDashboardButton from "../components/BackToDashboardButton";

const ReservationsPage = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="">
        <BackToDashboardButton />
      </div>
      <div className="flex flex-col gap-12 pt-12">
        <h2 className="text-xl font-semibold">Your Reservations</h2>
        <ReservationTable />
      </div>
    </div>
  );
};

export default ReservationsPage;
