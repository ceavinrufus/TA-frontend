"use client";

import { issueCredential } from "@/lib/api/issuer";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import QRCode from "qrcode";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const ReservationProofQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [hasIssued, setHasIssued] = useState(false);

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
    if (!reservationDetails || !reservationId || hasIssued) return;

    const getIssuedCredential = async () => {
      try {
        const body = {
          credentialSubject: JSON.stringify({
            id: reservationDetails.guest_did,
            reservationId,
          }),
          type: "Reservation",
          credentialSchema:
            "https://raw.githubusercontent.com/ceavinrufus/claim-schema-vocab/refs/heads/main/schemas/json/ReservationCredential.json",
          expiration: Math.floor(
            new Date(reservationDetails.check_out_date!).getTime() / 1000
          ),
        };

        const response = await issueCredential(body);
        const { credential_id: credentialId } = response.data;

        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://192.168.0.101:8000/api/v1"
            : process.env.NEXT_PUBLIC_BASE_URL;

        const universalLink = `https://wallet.privado.id#request_uri=${encodeURIComponent(
          baseUrl +
            "/identity/" +
            credentialId +
            "?to=" +
            reservationDetails.guest_did
        )}`;

        QRCode.toDataURL(universalLink, { width: 300 }, (err, url) => {
          if (err) {
            console.error("Error generating QR code:", err);
            return;
          }
          setQrCode(url);
          setHasIssued(true); // Prevent re-issuing
        });
      } catch (error) {
        console.error("Error issuing credential:", error);
      }
    };

    getIssuedCredential();
  }, [reservationDetails, reservationId, hasIssued]);

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
