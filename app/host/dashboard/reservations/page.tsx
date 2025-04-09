import React from "react";
import ReservationTable from "../components/ReservationTable";
import BackToDashboardButton from "../components/BackToDashboardButton";

const ReservationsPage = () => {
  return (
    <div className="md:min-w-[1200px] flex flex-col gap-6">
      <div className="">
        <BackToDashboardButton />
      </div>
      <div className="flex flex-col gap-12 pt-12">
        <h2 className="host-page-h2-primary-black">Your Reservations</h2>
        <ReservationTable />
      </div>
    </div>
  );
};

export default ReservationsPage;
