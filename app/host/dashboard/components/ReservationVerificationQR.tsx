"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { getVerificationResult, requestProof } from "@/lib/api/verifier";
import ImageWithDownload from "@/components/ImageWithDownload";
import { Skeleton } from "@/components/ui/skeleton";

const ReservationVerificationQR = ({
  onScanSuccess,
  reservationId,
}: {
  onScanSuccess: (did: string) => void;
  reservationId: string;
}) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>();
  const [isPolling, setIsPolling] = useState<boolean>(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const randomNumber = Math.floor(Math.random() * 1000000);
        // Include reservationId in the sessionId to make it reservation-specific
        setSessionId(`${reservationId}${randomNumber}`);

        const {
          data: { request },
        } = await requestProof(
          `${reservationId}${randomNumber}`,
          "Reservation verification",
          {
            allowedIssuers: ["*"],
            context:
              "https://raw.githubusercontent.com/ceavinrufus/claim-schema-vocab/refs/heads/main/schemas/json-ld/ReservationCredential.jsonld",
            credentialSubject: JSON.stringify({
              reservationId: { $eq: reservationId },
            }),
            proofType: "BJJSignature2021",
            type: "Reservation",
          }
        );

        // Base64 encode the verification request
        const base64EncodedRequest = btoa(JSON.stringify(request));

        // Configure the Wallet URL (universal link)
        const universalLink = `https://wallet.privado.id/#i_m=${base64EncodedRequest}`;

        // Generate QR code
        QRCode.toDataURL(universalLink, { width: 500 }, (err, url) => {
          if (err) {
            console.error("QR code generation failed:", err);
            return;
          }
          setQrCode(url);
          setIsPolling(true);
        });
      } catch (error) {
        console.error("Proof request failed:", error);
      }
    };

    generateQR();
  }, [reservationId]);

  useEffect(() => {
    if (!isPolling || !sessionId) return;

    const poll = setInterval(async () => {
      try {
        const response = await getVerificationResult(sessionId);
        console.log("Polling:", sessionId, response);
        if (response && response.from) {
          clearInterval(poll);
          setIsPolling(false);
          console.log(
            `DID verified for reservation ${reservationId}:`,
            response.from
          );
          onScanSuccess(response.from); // callback with the DID
        }
      } catch {
        console.error("Polling for verification result failed.");
      }
    }, 2000); // Poll every 2s

    return () => clearInterval(poll);
  }, [sessionId, isPolling, onScanSuccess, reservationId]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {!qrCode ? (
        <Skeleton className="w-[500px] h-[500px] rounded-lg" />
      ) : (
        <ImageWithDownload
          src={qrCode}
          alt="QR Code"
          fileName={`${reservationId}_verification.png`}
          width={500}
          height={500}
          className="rounded-lg"
        />
      )}
      <p className="mt-4 text-sm text-center text-muted-foreground">
        Show this QR code to the guest to scan using their PrivadoID-compatible
        wallet. Once scanned, the wallet will request verification of the
        reservation. The guest will need to approve the request in their wallet
        app.
      </p>
    </div>
  );
};

export default ReservationVerificationQR;
