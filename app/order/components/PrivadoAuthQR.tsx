import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { requestProof, getVerificationResult } from "@/lib/api/verifier";

const PrivadoAuthQR = ({
  onScanSuccess,
}: {
  onScanSuccess: (did: string) => void;
}) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [sessionId, setSessionId] = useState<number>();
  const [hasIssued, setHasIssued] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  useEffect(() => {
    const generateQR = async () => {
      if (hasIssued) return;

      try {
        // Request proof
        const randomNumber = Math.floor(Math.random() * 1000000);
        setSessionId(randomNumber);

        const {
          data: { request },
        } = await requestProof(randomNumber, "verification", {
          allowedIssuers: ["*"],
          context:
            "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
          credentialSubject: JSON.stringify({ birthday: { $lt: 20040101 } }),
          type: "KYCAgeCredential",
        });

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
  }, [hasIssued]);

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
  }, [sessionId, hasIssued, isPolling, onScanSuccess]);

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
