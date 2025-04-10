import React from "react";
import ListingResults from "./components/ListingResults";
import SearchComponent from "@/components/SearchComponent";

const SearchPage = () => {
  return (
    <div>
      <SearchComponent />
      <ListingResults />
    </div>
  );
};

export default SearchPage;
