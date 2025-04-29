"use client";

import React from "react";
import UserVerification from "./components/UserVerification";

const VerificationPage = () => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">User Verification</h1>
      <UserVerification />
    </div>
  );
};

export default VerificationPage;
