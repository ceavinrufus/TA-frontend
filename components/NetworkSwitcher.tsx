import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useSwitchChain, useAccount } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import Image from "next/image";

export const CHAIN_LOGOS: Record<number, string> = {
  [mainnet.id]: "/eth-logo-purple.svg",
  [sepolia.id]: "/eth-logo-purple.svg",
};

const NetworkSwitcher = () => {
  const { switchChain, chains } = useSwitchChain();
  const { chain } = useAccount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-white border h-fit md:px-3 py-2 rounded-2xl font-semibold flex justify-center items-center gap-1">
        <Image
          src={"/network-logos" + CHAIN_LOGOS[chain?.id ?? sepolia.id]}
          alt={chain?.name ?? "Network Logo"}
          width={20}
          height={20}
          className="rounded-full"
          priority
        />

        <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-full justify-center rounded-2xl lg:w-[200px]"
      >
        {chains.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => switchChain({ chainId: c.id })}
            className={"cursor-pointer w-full flex justify-between rounded-2xl"}
          >
            {c.name}
            {c.id === chain?.id && (
              <span className="text-xs text-secondary-placeholder">
                Connected
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NetworkSwitcher;
