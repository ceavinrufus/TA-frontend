"use client";

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  copyToClipboard,
  formatCryptoAddressForDisplay,
} from "@/lib/ui/ui-utils";
import { usePathname, useRouter } from "next/navigation";
import RoleSwitcher from "./RoleSwitcher";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { UserAvatar } from "./UserAvatar";
import Image from "next/image";
import NetworkSwitcher, { CHAIN_LOGOS } from "./NetworkSwitcher";
import { useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Button } from "./ui/button";
import ResponsiveIcon from "./icons/ResponsiveIconBuilder";
import { useUserStore } from "@/store/user-store";

const UserMenu = () => {
  const {
    address,
    disconnect,
    isAuthenticated,
    isAuthenticating,
    authenticate,
    isConnected,
    connect,
  } = useWalletAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { chain } = useAccount();
  const pathname = usePathname();
  const { user, fetchUser } = useUserStore();

  const [isInHost, setIsInHost] = useState(false);
  const [isInAdmin, setIsInAdmin] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/host")) {
      setIsInHost(true);
      setIsInAdmin(false);
    } else if (pathname.startsWith("/admin")) {
      setIsInHost(false);
      setIsInAdmin(true);
    } else {
      setIsInHost(false);
      setIsInAdmin(false);
    }
  }, [pathname]);

  useEffect(() => {
    fetchUser();
  }, [isAuthenticated]);

  return isConnected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group flex h-12 w-12 items-center justify-start gap-2 overflow-hidden rounded-full pr-0 group-hover:px-3 shadow-lg transition-all duration-300 ease-in-out hover:w-[200px]"
        >
          <Image
            src={"/network-logos" + CHAIN_LOGOS[chain?.id ?? sepolia.id]}
            alt={chain?.name ?? "Network Logo"}
            width={32}
            height={32}
            className="h-8 w-full group-hover:w-8 flex-shrink-0 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 ease-in-out"
            priority
          />
          <span className="text-base font-medium opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            {chain?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <UserAvatar
              walletAddress={address || ""}
              size={20}
              typeOfAvatar="beam"
            />
            {formatCryptoAddressForDisplay(address)}
            {address && (
              <div
                onClick={async () => {
                  await copyToClipboard({ text: address });
                  toast({
                    title: "Copied to clipboard!",
                    description: "Address copied to clipboard",
                  });
                }}
                className="w-fit cursor-pointer"
              >
                <ResponsiveIcon
                  icon="icon-copy"
                  sizeDesktop={14}
                  sizeMobile={12}
                />
              </div>
            )}
          </div>
          <NetworkSwitcher />
        </div>
        <Command className="rounded-lg">
          <CommandList>
            {!isAuthenticated ? (
              <CommandGroup heading="Authentication">
                <CommandItem
                  onSelect={authenticate}
                  disabled={isAuthenticating}
                >
                  {isAuthenticating
                    ? "Authenticating..."
                    : "Retry Authentication"}
                </CommandItem>
              </CommandGroup>
            ) : (
              <CommandGroup heading="Menu">
                <CommandItem>
                  <RoleSwitcher isInHost={isInHost} />
                </CommandItem>
                {user?.is_admin && (
                  <CommandItem
                    onSelect={() => router.push(isInAdmin ? "/" : "/admin")}
                  >
                    {isInAdmin ? "Switch to Guest" : "Switch to Admin"}
                  </CommandItem>
                )}
                {(!user?.is_uniqueness_verified ||
                  !user?.is_liveness_verified ||
                  !user?.is_identity_verified) && (
                  <CommandItem onSelect={() => router.push("/verification")}>
                    Verify yourself
                  </CommandItem>
                )}
                {isInHost ? (
                  <CommandItem onSelect={() => router.push("/host/dashboard")}>
                    Dashboard
                  </CommandItem>
                ) : (
                  <CommandItem onSelect={() => router.push("/bookings")}>
                    Bookings
                  </CommandItem>
                )}
              </CommandGroup>
            )}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  localStorage.removeItem("auth_token");
                  disconnect();
                  toast({
                    title: "Disconnected",
                    description: "Wallet disconnected successfully",
                  });
                }}
                className="text-red-400"
              >
                Disconnect
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      variant="outline"
      className="group flex h-12 w-12 items-center justify-start gap-2 overflow-hidden rounded-full pr-0 group-hover:px-3 shadow-lg transition-all duration-300 ease-in-out hover:w-[200px]"
      onClick={() => connect()}
    >
      <Image
        src="/metamask.svg"
        alt="Ethereum Logo"
        width={32}
        height={32}
        priority
        className="h-8 w-full group-hover:w-8 flex-shrink-0 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 ease-in-out"
      />
      <span className="text-base font-medium opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Connect Wallet
      </span>
    </Button>
  );
};

export default UserMenu;
