"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import IconClose from "@/components/icons/IconClose";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { ethers } from "ethers";
import HostStake from "@/abi/HostStake.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWalletClient } from "wagmi";

const HostStakeModal = ({
  initialAmount,
  setHostStake,
}: {
  initialAmount: string;
  setHostStake: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isMakingDeposit, setIsMakingDeposit] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const { data: walletClient } = useWalletClient();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setAmount("");
    setIsModalOpen(false);
  };

  const formatHostStake = (value: string) => {
    // Remove all non-numeric characters except decimal point
    let cleaned = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    return cleaned;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = formatHostStake(e.target.value);
    setAmount(newValue);
  };

  const handleDeposit = async () => {
    if (!walletClient) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Deposit Failed",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(walletClient.transport);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractAddress =
        process.env.NEXT_PUBLIC_HOST_STAKE_CONTRACT_ADDRESS!;

      const contract = new ethers.Contract(
        contractAddress,
        HostStake.abi,
        signer
      );
      setIsMakingDeposit(true);
      const transaction = await contract.depositHostStake({
        value: ethers.parseEther(amount),
      });
      closeModal();

      await transaction.wait();
      toast({
        title: "Deposit Successful",
        description: "Your host stake has been successfully topped up.",
        variant: "default",
      });

      const newAmount = Number(
        (parseFloat(initialAmount || "0") + parseFloat(amount || "0")).toFixed(
          8
        )
      ).toString();

      setHostStake(newAmount);
    } catch (error) {
      console.error("Error during deposit:", error);
      toast({
        title: "Deposit Failed",
        description: "An error occurred while processing your deposit.",
        variant: "destructive",
      });
    } finally {
      setIsMakingDeposit(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger
          className="flex justify-center items-center cursor-pointer"
          onClick={openModal}
        >
          <ResponsiveIcon
            icon="icon-add-circle"
            sizeDesktop={24}
            sizeMobile={24}
          />
        </DialogTrigger>
        <DialogContent
          className={`hotel-management-cancel-booking-dialog z-[99999] rounded-t-2xl md:rounded-xl`}
        >
          <DialogHeader className="w-full flex flex-row justify-between items-center">
            <DialogTitle className="hotel-management-cancel-booking-dialog-title">
              Top Up Your Security Deposit
            </DialogTitle>
            <Button
              variant="outline"
              className="w-[32px] h-[32px] rounded-full"
              onClick={closeModal}
              type="button"
            >
              <IconClose size={16} />
            </Button>
          </DialogHeader>

          <div className="flex flex-col gap-[32px]">
            <div className="space-y-6">
              <p className="hotel-management-dispute-booking-option-description">
                Your host stake ensures smooth transactions and compliance with
                platform policies. You can add funds at any time to maintain
                sufficient coverage.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-base">
                <span className="font-bold">Current Balance:</span>{" "}
                {initialAmount} ETH
              </p>
              <p className="text-base">
                <span className="font-bold">Minimum Required:</span> 0.25 ETH
              </p>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="hotel-management-cancel-booking-dialog-subtitle text-start">
                Enter Amount to Top Up (in ETH):
              </p>
              <Input
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter your receiving address"
                className="py-[12px] px-[16px] h-[52px] rounded-[16px] md:h-[56px] w-full md:p-[16px] bg-primary-black"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between items-center gap-[12px] md:gap-[20px]">
            <Button
              variant="secondary"
              onClick={closeModal}
              className="!hidden md:!inline-block md:px-[24px] md:h-[56px] md:py-[16px] p-[16px] flex-1"
            >
              <p className="neumorphic-button-engraved-text">Cancel</p>
            </Button>
            <Button
              disabled={isMakingDeposit}
              variant="default"
              onClick={handleDeposit}
              className="md:px-[24px] md:py-[16px] p-[16px] flex-1 md:h-[56px]"
            >
              <p className="">Confirm</p>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HostStakeModal;
