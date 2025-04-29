"use client";

import React from "react";
import { useHostStore } from "../../store/host-store";
import { ethers } from "ethers";
import HostStake from "@/abi/HostStake.json";
import SecurityDepositModal from "./SecurityDepositModal";
import { useAccount } from "wagmi";
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
 * @returns {JSX.Element} A card displaying host summary information
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

  const { hostStats, isLoading, error, setHostStats, fetchHostStats } =
    useHostStore();
  const currency = "$";
  const [isSecurityDepositLoading, setIsSecurityDepositLoading] =
    React.useState<boolean>(true);

  const checkHostStake = async () => {
    setIsSecurityDepositLoading(true); // Set loading state to true
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractAddress =
        process.env.NEXT_PUBLIC_RENTAL_PAYMENTS_CONTRACT_ADDRESS!;

      const contract = new ethers.Contract(
        contractAddress,
        HostStake.abi,
        signer
      );

      const host = await signer.getAddress(); // Get host wallet address
      const hostStake = await contract.checkHostStake(host);

      const stake = ethers.formatEther(hostStake); // Convert to Ether

      setHostStats({
        totalListings: hostStats?.totalListings ?? 0,
        totalReservations: hostStats?.totalReservations ?? 0,
        totalEarnings: hostStats?.totalEarnings ?? 0,
        hostStake: stake,
      }); // Update host stats with host stake
    } catch (error) {
      console.error("Error checking host stake:", error);
    } finally {
      setIsSecurityDepositLoading(false); // Set loading state to false
    }
  };

  React.useEffect(() => {
    const fetchAllStats = async () => {
      await fetchHostStats();
      await checkHostStake(); // Call the function to check host stake
    };
    fetchAllStats();
  }, []);

  const summaryItems = [
    {
      label: "Total listings",
      value: `${hostStats?.totalListings ?? 0}`,
      desc: "",
    },
    {
      label: "Total reservations",
      value: `${hostStats?.totalReservations ?? 0}`,
      desc: "",
    },
    {
      label: "Total earnings",
      value: `${currency}${hostStats?.totalEarnings ?? 0}`,
      desc: "",
    },
  ];

  if (isLoading) {
    return (
      <div className="host-summary-section">
        <Skeleton className="h-8 w-72 rounded mb-4" />
        <div className="flex shadow-neumorphic-card-up rounded-3xl p-12 gap-20 bg-[#D2DFFB]">
          <div className="flex flex-col gap-4">
            <Skeleton className="size-[139px] rounded-full flex-shrink-0" />
            <div className="space-y-1">
              <Skeleton className="w-full h-6 rounded-sm" />
              <Skeleton className="w-full h-6 rounded-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 w-full h-full gap-y-8">
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

  if (error || !hostStats) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="host-summary-section">
      <h1 className="text-3xl font-semibold mb-2">
        Welcome back, {formatCryptoAddressForDisplay(address)}
      </h1>
      <div className="flex shadow-neumorphic-card-up rounded-3xl p-12 gap-20 bg-[#D2DFFB]">
        <div className="flex flex-col gap-4">
          <div className="size-[139px] rounded-full border border-off-white flex items-center justify-center flex-shrink-0">
            <UserAvatar
              walletAddress={address || ""}
              size={139}
              typeOfAvatar="beam"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 w-full h-full gap-y-8">
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
          {isSecurityDepositLoading ? (
            <div className="flex flex-col gap-2 text-blue-950">
              <p>Host stake</p>
              <Skeleton className="h-9 w-16 rounded" />
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-blue-950">
              <p>Host stake</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold text-blue-950">{`${
                  hostStats.hostStake ?? 0
                } ETH`}</p>
                <SecurityDepositModal initialAmount={hostStats.hostStake} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostSummaryCard;
