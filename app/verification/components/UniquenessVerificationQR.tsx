"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { getVerificationResult, requestProof } from "@/lib/api/verifier";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/lib/api/user";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user-store";
import { useAccount } from "wagmi";

const UniquenessVerificationQR = ({
  onScanSuccess,
}: {
  onScanSuccess: () => void;
}) => {
  const [qrCode, setQrCode] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const { toast } = useToast();
  const { user, setUser } = useUserStore();
  const { isConnected } = useAccount();

  const generateQR = async () => {
    try {
      if (!user || !isConnected) {
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
        setIsPolling(true);
      });
    } catch (error) {
      console.error("Proof request failed:", error);
    }
  };

  useEffect(() => {
    generateQR();
  }, []);

  useEffect(() => {
    if (!isPolling || !sessionId || !user) return;

    const poll = setInterval(async () => {
      try {
        const response = await getVerificationResult(sessionId);

        if (response && response.from) {
          clearInterval(poll);
          setIsPolling(false);

          // Update user state with the verification result
          const newUser = {
            ...user!,
            is_uniqueness_verified: true,
            did: response.from,
          };
          try {
            await updateUser(user.id, newUser);
          } catch (error) {
            const errorMessage = (error as Error).message;
            console.error("Error updating user:", errorMessage);
            if (errorMessage === "UQ_user_did") {
              toast({
                title: "Verification failed",
                description:
                  "You are not unique! Please use your existing account.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error updating user",
                description: "Failed to update user information.",
                variant: "destructive",
              });
            }
            setIsPolling(true);
            setQrCode(undefined);
            generateQR();
            return;
          }
          setUser(newUser);

          onScanSuccess(); // callback
        }
      } catch {
        console.error("Polling for verification result failed.");
      }
    }, 2000); // Poll every 2s

    return () => clearInterval(poll);
  }, [sessionId, isPolling, onScanSuccess, user]);

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
