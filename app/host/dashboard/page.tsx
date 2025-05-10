import React from "react";
import HostSummaryCard from "./components/HostSummaryCard";
import TaskReminders from "./components/TaskReminders";
import ReservationsSummary from "./components/ReservationsSummary";
import ListingsSummary from "./components/ListingsSummary";
import EarningsSummary from "./components/EarningsSummary";

const DashboardPage = () => {
  return (
    <div className="w-full flex flex-col gap-20">
      <HostSummaryCard />
      <TaskReminders />
      <ReservationsSummary />
      <ListingsSummary />
      <EarningsSummary />
    </div>
  );
};

export default DashboardPage;
