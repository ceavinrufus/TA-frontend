"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { getVerificationResult, requestProof } from "@/lib/api/verifier";
import { useToast } from "@/hooks/use-toast";
import { getUserInfo } from "@/lib/api/user";
import { Skeleton } from "@/components/ui/skeleton";

const UniquenessVerificationQR = ({
  onScanSuccess,
}: {
  onScanSuccess: () => void;
}) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>();
  const [hasIssued, setHasIssued] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateQR = async () => {
      if (hasIssued) return;

      try {
        const user = await getUserInfo();

        if (!user) {
          toast({
            title: "Please connect your wallet",
            description: "You need to connect your wallet to proceed.",
            variant: "destructive",
          });
          return;
        }

        const randomNumber = Math.floor(Math.random() * 1000000);
        // Include reservationId in the sessionId to make it reservation-specific
        setSessionId(`${user.id}${randomNumber}`);

        const {
          data: { request },
        } = await requestProof(
          `${user.id}${randomNumber}`,
          "Uniqueness verification",
          {
            allowedIssuers: ["*"],
            context:
              "https://raw.githubusercontent.com/anima-protocol/claims-polygonid/main/schemas/json-ld/pou-v1.json-ld",
            credentialSubject: JSON.stringify({
              unique: { $eq: true },
            }),
            proofType: "BJJSignature2021",
            type: "AnimaProofOfUniqueness",
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
          setHasIssued(true);
          setIsPolling(true);
        });
      } catch (error) {
        console.error("Proof request failed:", error);
      }
    };

    generateQR();
  }, []);

  useEffect(() => {
    if (!isPolling || !sessionId) return;

    const poll = setInterval(async () => {
      try {
        const response = await getVerificationResult(sessionId);
        console.log("Polling:", sessionId, response);
        if (response && response.from) {
          clearInterval(poll);
          setIsPolling(false);
          onScanSuccess(); // callback with the DID
        }
      } catch {
        console.error("Polling for verification result failed.");
      }
    }, 2000); // Poll every 2s

    return () => clearInterval(poll);
  }, [sessionId, isPolling, onScanSuccess]);

  if (!qrCode) {
    return <Skeleton className="w-[500px] h-[500px] bg-gray-200 rounded-lg" />;
  }

  return (
    <Image
      src={qrCode}
      alt="QR Code"
      width={500}
      height={500}
      className="rounded-lg"
    />
  );
};

export default UniquenessVerificationQR;
