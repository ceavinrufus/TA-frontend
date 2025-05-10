import React from "react";
import BackToDashboardButton from "../components/BackToDashboardButton";
import ListingsCards from "../components/ListingsCards";

const ListingsPage = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="">
        <BackToDashboardButton />
      </div>
      <div className="flex flex-col gap-12 pt-12">
        <h1 className="text-xl font-semibold text-blue-950">Your Listings</h1>
        <ListingsCards />
      </div>
    </div>
  );
};

export default ListingsPage;
