import React from "react";
import HostHero from "./components/HostHero";

const HostPage = () => {
  return (
    <div className="md:max-w-[1200px] w-full flex flex-col">
      <HostHero />
    </div>
  );
};

export default HostPage;
