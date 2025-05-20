"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import QRCode from "qrcode";
import { Skeleton } from "@/components/ui/skeleton";
import ImageWithDownload from "@/components/ImageWithDownload";
import { Button } from "@/components/ui/button";
import { AppWindow } from "lucide-react";

const ReservationProofQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

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
        setUrl(universalLink);

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

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {!qrCode ? (
        <Skeleton className="w-[300px] h-[300px] rounded-lg" />
      ) : (
        <ImageWithDownload
          src={qrCode}
          alt="QR Code"
          fileName={`${reservationDetails!.booking_number}_proof.png`}
          width={300}
          height={300}
          className="rounded-lg"
        />
      )}
      <p className="mt-4 text-sm text-center text-muted-foreground">
        Please scan the QR code below using PrivadoID-compatible wallet to
        receive your reservation proof.
      </p>
      <p className="my-2">or</p>
      <Button
        variant="link"
        className="bg-[#9AFE5B]"
        disabled={!url}
        onClick={() => {
          console.log("URL:", url);
          if (url) {
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("target", "_blank");
            link.click();
          }
        }}
      >
        Open in Wallet <AppWindow />
      </Button>
    </div>
  );
};

export default ReservationProofQR;
