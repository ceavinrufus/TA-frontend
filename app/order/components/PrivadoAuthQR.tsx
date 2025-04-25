import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { getVerificationResult } from "@/lib/api/verifier";
import { basicPrivadoAuth } from "@/lib/api/auth";
import { getGuestInfo } from "@/lib/api/guest";
import { useToast } from "@/hooks/use-toast";

const PrivadoAuthQR = ({
  onScanSuccess,
}: {
  onScanSuccess: (did: string) => void;
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
        const user = await getGuestInfo();

        if (!user) {
          toast({
            title: "Please connect your wallet",
            description: "You need to connect your wallet to proceed.",
            variant: "destructive",
          });
          return;
        }

        const randomNumber = Math.floor(Math.random() * 1000000);
        setSessionId(`${user.id}${randomNumber}`);

        const {
          data: { request },
        } = await basicPrivadoAuth(`${user.id}${randomNumber}`);

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
        if (response && response.from) {
          clearInterval(poll);
          setIsPolling(false);
          console.log("DID verified:", response.from);
          onScanSuccess(response.from); // callback with the DID
        }
      } catch {
        console.error("Polling for verification result failed.");
      }
    }, 2000); // Poll every 2s

    return () => clearInterval(poll);
  }, [sessionId, isPolling, onScanSuccess]);

  if (!qrCode) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading QR code...</p>
      </div>
    );
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

export default PrivadoAuthQR;
