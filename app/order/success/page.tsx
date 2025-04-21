import React from "react";
import ReservationProofQR from "../components/ReservationProofQR";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto py-8 px-4">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Reservation Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your reservation has been confirmed.
        </p>
      </div>
      <ReservationProofQR />
      <p className="text-sm text-gray-500 text-center mt-4">
        Please scan the QR code above using PrivadoID-compatible wallet to
        receive your reservation proof.
      </p>
    </div>
  );
};

export default OrderSuccessPage;
