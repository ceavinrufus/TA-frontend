"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import QRCode from "qrcode";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const ReservationProofQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const router = useRouter();

  const { fetchOrderDetailsById, reservationDetails } = useOrderStore();

  useEffect(() => {
    if (!reservationId) {
      console.error("Id not found in URL");
      router.back();
      return;
    }
    fetchOrderDetailsById(reservationId);
  }, [reservationId]);

  useEffect(() => {
    if (!reservationDetails || !reservationId) return;

    const getIssuedCredential = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const universalLink = `https://wallet.privado.id#request_uri=${encodeURIComponent(
          baseUrl +
            "/identity/" +
            reservationDetails.booking_credential_id +
            "?to=" +
            reservationDetails.guest_did
        )}`;

        QRCode.toDataURL(universalLink, { width: 300 }, (err, url) => {
          if (err) {
            console.error("Error generating QR code:", err);
            return;
          }
          setQrCode(url);
        });
      } catch (error) {
        console.error("Error issuing credential:", error);
      }
    };

    getIssuedCredential();
  }, [reservationDetails, reservationId]);

  if (!qrCode) {
    return <Skeleton className="w-[300px] h-[300px] bg-gray-200 rounded-lg" />;
  }

  return (
    <Image
      src={qrCode}
      alt="QR Code"
      width={300}
      height={300}
      className="rounded-lg"
    />
  );
};

export default ReservationProofQR;
