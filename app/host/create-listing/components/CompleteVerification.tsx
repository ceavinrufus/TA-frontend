"use client";

import React from "react";
import ClickableCard from "../../../../components/ClickableCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * CompleteVerification component displays verification methods for hosts.
 *
 * This component shows a verification page with two options:
 * 1. Identity verification through government-issued ID
 * 2. Security deposit payment
 *
 * The component includes:
 * - A title and subtitle explaining the verification process
 * - Two clickable cards representing different verification methods
 * - Each card contains method details and an action button
 * - A skip option that redirects to the host dashboard
 *
 * @component
 * @returns {JSX.Element} A form-like interface for host verification methods
 *
 * @example
 * return (
 *   <CompleteVerification />
 * )
 */
const CompleteVerification = () => {
  const router = useRouter();

  const verificationMethods = [
    {
      name: "Verify your identity",
      description:
        "Submit a valid government-issued ID (e.g., passport, driver’s license) to verify your identity. This step helps ensure a safe and trusted experience for everyone on the platform.",
      onClick: null,
      buttonText: "Go to submit",
    },
    {
      name: "Provide a Security Deposit",
      description:
        "Pay a one-time refundable security deposit to complete verification. This deposit helps safeguard the platform and will be returned to you after a specified period or when certain conditions are met.",
      onClick: null,
      buttonText: "Pay deposit",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-start gap-12">
      <div className="space-y-6">
        <h1 className="create-listing-page-title !text-center">
          You are almost there! Complete your verification
        </h1>
        <p className="create-listing-verification-subtitle">
          Secure your listing and build trust with guests by completing one of
          the following verification methods.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {verificationMethods.map((method, index) => (
          <ClickableCard
            key={index}
            className="w-full h-[168px] rounded-[32px] justify-between px-12 py-6 flex-row gap-6"
            isClicked={false}
            onClick={method.onClick ?? (() => {})}
          >
            <div className="flex flex-col gap-2 h-full justify-center flex-grow">
              <h2 className="text-xl font-semibold text-blue-950">
                {method.name}
              </h2>
              <p>{method.description}</p>
            </div>
            <Button
              type="button"
              variant="default"
              className="rounded-full h-[48px] md:h-[56px] flex-shrink-0"
              onClick={method.onClick ?? (() => {})}
            >
              <p className="w-full">{method.buttonText}</p>
            </Button>
          </ClickableCard>
        ))}
      </div>
      <div className="flex w-full justify-end">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push("/host/dashboard");
          }}
          className="underline neumorphic-text-button underline-offset-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default CompleteVerification;
