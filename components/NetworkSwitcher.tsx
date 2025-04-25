import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useSwitchChain, useAccount } from "wagmi";

const NetworkSwitcher = () => {
  const { switchChain, chains } = useSwitchChain();
  const { chain } = useAccount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-white h-fit md:px-3 py-2 rounded-2xl font-semibold flex justify-center items-center gap-1">
        {chain?.name.split(" ").slice(0, 2).join(" ")} <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full justify-center rounded-2xl">
        {chains.map(
          (c) =>
            c.id !== chain?.id && (
              <DropdownMenuItem
                key={c.id}
                onClick={() => switchChain({ chainId: c.id })}
                className="cursor-pointer w-full flex justify-center rounded-2xl font-semibold"
              >
                {c.name}
              </DropdownMenuItem>
            )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NetworkSwitcher;
