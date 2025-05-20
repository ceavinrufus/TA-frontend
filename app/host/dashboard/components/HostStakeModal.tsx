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
  method = "deposit",
}: {
  initialAmount: string;
  setHostStake: React.Dispatch<React.SetStateAction<string | undefined>>;
  method?: "deposit" | "withdraw";
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
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

  const handleStakeProcessing = async () => {
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
        description: "Please enter a valid amount.",
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
      setIsProcessing(true);

      let transaction;
      if (method === "deposit") {
        transaction = await contract.depositHostStake({
          value: ethers.parseEther(amount),
        });
      } else {
        transaction = await contract.withdrawHostStake(
          ethers.parseEther(amount)
        );
      }
      closeModal();

      await transaction.wait();

      let newAmount;
      if (method === "deposit") {
        toast({
          title: "Deposit Successful",
          description: "Your host stake has been successfully deposited.",
          variant: "default",
        });
        newAmount = Number(
          (
            parseFloat(initialAmount || "0") + parseFloat(amount || "0")
          ).toFixed(8)
        ).toString();
      } else {
        toast({
          title: "Withdrawal Successful",
          description: "Your host stake has been successfully withdrawn.",
          variant: "default",
        });
        newAmount = Number(
          (
            parseFloat(initialAmount || "0") - parseFloat(amount || "0")
          ).toFixed(8)
        ).toString();
      }

      setHostStake(newAmount);
    } catch (error) {
      console.error("Error during stake processing:", error);
      toast({
        title: "Transaction Failed",
        description: "An error occurred while processing your stake.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger
          className="flex justify-center items-center cursor-pointer"
          onClick={openModal}
        >
          {method === "deposit" ? (
            <ResponsiveIcon
              icon="icon-add-circle"
              sizeDesktop={24}
              sizeMobile={24}
            />
          ) : (
            <ResponsiveIcon
              icon="icon-minus-circle"
              sizeDesktop={24}
              sizeMobile={24}
            />
          )}
        </DialogTrigger>
        <DialogContent
          className={`hotel-management-cancel-booking-dialog z-[99999] rounded-t-2xl md:rounded-xl`}
        >
          <DialogHeader className="w-full flex flex-row justify-between items-center">
            <DialogTitle className="capitalize">
              {method} Your Host Stake
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
                Enter {method} amount (in ETH):
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
              disabled={isProcessing}
              variant="default"
              onClick={handleStakeProcessing}
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
