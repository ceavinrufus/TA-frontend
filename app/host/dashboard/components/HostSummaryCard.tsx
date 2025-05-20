"use client";

import React, { useEffect, useState } from "react";
import { useHostStore } from "../../store/host-store";
import { ethers } from "ethers";
import HostStake from "@/abi/HostStake.json";
import HostStakeModal from "./HostStakeModal";
import { useAccount, useWalletClient } from "wagmi";
import { UserAvatar } from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCryptoAddressForDisplay } from "@/lib/ui/ui-utils";

/**
 * HostSummaryCard Component
 *
 * A dashboard component that displays a host's summary information including:
 * - Welcome message with formatted crypto address
 * - Profile avatar
 * - Statistical summary (total listings, reservations, earnings, host stake)
 *
 * @component
 * A card displaying host summary information
 *
 * @remarks
 * The component handles three states:
 * 1. Loading state - displays skeleton loading UI
 * 2. Error state - displays error message
 * 3. Data state - displays actual host summary data
 *
 * Uses data from:
 * - useParticleAccountStore - for user address
 * - useHostStore - for host statistics
 *
 * @example
 * ```tsx
 * <HostSummaryCard />
 * ```
 */
const HostSummaryCard = () => {
  const { address } = useAccount();

  const { hostStats, isLoading, fetchHostStats } = useHostStore();
  const currency = "$";
  const [hostStake, setHostStake] = useState<string>();
  const [isHostStakeLoading, setIsHostStakeLoading] = useState<boolean>(false);

  const { data: walletClient } = useWalletClient();

  const checkHostStake = async () => {
    if (!walletClient) return; // Check if wallet client is available

    setIsHostStakeLoading(true); // Set loading state to true

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

      const host = await signer.getAddress(); // Get host wallet address
      const hostStake = await contract.checkHostStake(host);

      const stake = ethers.formatEther(hostStake); // Convert to Ether

      setHostStake(stake); // Update host stake
    } catch (error) {
      console.error("Error checking host stake:", error);
    } finally {
      setIsHostStakeLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      await fetchHostStats();
      await checkHostStake(); // Call the function to check host stake
    };
    fetchAllStats();
  }, [walletClient]); // Fetch stats when wallet client is available

  const summaryItems = [
    {
      label: "Total listings",
      value: `${hostStats?.totalListings ?? "-"}`,
      desc: "",
    },
    {
      label: "Total reservations",
      value: `${hostStats?.totalReservations ?? "-"}`,
      desc: "",
    },
    {
      label: "Total earnings",
      value: `${hostStats?.totalEarnings ? currency : ""}${
        hostStats?.totalEarnings ?? "-"
      }`,
      desc: "",
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="h-8 w-72 rounded mb-4" />
        <div className="flex flex-col md:flex-row shadow-neumorphic-card-up rounded-3xl p-12 gap-20 bg-[#D2DFFB]">
          <div className="flex items-center justify-center flex-col gap-4">
            <Skeleton className="size-[139px] rounded-full flex-shrink-0" />
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full h-full gap-y-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-9 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-3xl font-semibold mb-2">
        Welcome back, {formatCryptoAddressForDisplay(address)}
      </h1>
      <div className="flex flex-col md:flex-row shadow-neumorphic-card-up rounded-3xl p-12 gap-20 bg-[#D2DFFB]">
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="size-[139px] rounded-full border border-off-white flex items-center justify-center flex-shrink-0">
            <UserAvatar
              walletAddress={address || ""}
              size={139}
              typeOfAvatar="beam"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full h-full gap-y-8">
          {summaryItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 text-blue-950">
              <p>{item.label}</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-semibold text-blue-950">
                  {item.value}
                </p>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
          {isHostStakeLoading ? (
            <div className="flex flex-col gap-2 text-blue-950">
              <p>Host stake</p>
              <Skeleton className="h-9 w-16 rounded" />
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-blue-950">
              <p>Host stake</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold text-blue-950">{`${
                  hostStake ?? "-"
                } ${hostStake ? "ETH" : ""}`}</p>
                {hostStake && (
                  <HostStakeModal
                    initialAmount={hostStake}
                    setHostStake={setHostStake}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostSummaryCard;
