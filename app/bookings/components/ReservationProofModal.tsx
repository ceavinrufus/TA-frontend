"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ReservationProofModal = ({
  reservation,
}: {
  reservation: Reservation | null;
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!reservation) return;

    const getIssuedCredential = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const universalLink = `https://wallet.privado.id#request_uri=${encodeURIComponent(
          baseUrl +
            "/identity/" +
            reservation.booking_credential_id +
            "?to=" +
            reservation.guest_did
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
  }, [reservation]);

  if (!reservation) return <Skeleton className="w-full h-9 px-4 py-2" />;

  const isButtonEnabled = reservation.booking_credential_id?.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full"
          disabled={!isButtonEnabled}
        >
          Show Reservation Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservation Proof</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {!qrCode ? (
            <Skeleton className="w-[300px] h-[300px] bg-gray-200 rounded-lg" />
          ) : (
            <Image
              src={qrCode}
              alt="QR Code"
              width={300}
              height={300}
              className="rounded-lg"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationProofModal;
