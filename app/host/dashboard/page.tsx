import React from "react";
import HostSummaryCard from "./components/HostSummaryCard";
import TaskReminders from "./components/TaskReminders";
import ReservationsSummary from "./components/ReservationsSummary";
import ListingsSummary from "./components/ListingsSummary";
import EarningsSummary from "./components/EarningsSummary";

const DashboardPage = () => {
  return (
    <div className="md:min-w-[1200px] flex flex-col gap-20">
      <HostSummaryCard />
      <TaskReminders />
      <ReservationsSummary />
      <ListingsSummary />
      <EarningsSummary />
    </div>
  );
};

export default DashboardPage;
