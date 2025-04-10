import React from "react";
import ListingResults from "./components/ListingResults";
import SearchComponent from "@/components/SearchComponent";
import { Separator } from "@/components/ui/separator";

const SearchPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <SearchComponent />
      <Separator className="my-4" />
      <ListingResults />
    </div>
  );
};

export default SearchPage;
