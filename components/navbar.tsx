"use client";

import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { formatCryptoAddressForDisplay } from "@/lib/ui/ui-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RoleSwitcher from "./RoleSwitcher";
import NetworkSwitcher from "./NetworkSwitcher";

export function Navbar() {
  const {
    address,
    isConnected,
    connect,
    disconnect,
    isAuthenticated,
    isAuthenticating,
    authenticate,
  } = useWalletAuth();

  const router = useRouter();
  const { toast } = useToast();

  return (
    <nav className="flex w-full px-3 md:px-0 h-fit py-10 justify-between items-center">
      <Link href={"/"} className="text-xl">
        <span className="font-bold">Stay</span>
        Chain
      </Link>

      {isConnected ? (
        <div className="flex-col md:flex-row flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${
                isAuthenticated ? "bg-green-100" : "bg-white"
              } h-fit px-7 py-2 rounded-2xl font-semibold flex items-center gap-1`}
            >
              {formatCryptoAddressForDisplay(address)} {isAuthenticated && "✓"}{" "}
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex-col w-full flex justify-center rounded-2xl">
              {!isAuthenticated ? (
                <DropdownMenuItem
                  onClick={authenticate}
                  disabled={isAuthenticating}
                  className="cursor-pointer w-full flex justify-center rounded-2xl font-semibold"
                >
                  {isAuthenticating
                    ? "Authenticating..."
                    : "Retry Authentication"}
                </DropdownMenuItem>
              ) : (
                <>
                  {/* Show protected menu here */}
                  <DropdownMenuItem className="cursor-pointer w-full flex justify-center rounded-2xl font-semibold">
                    <RoleSwitcher />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer w-full flex justify-center rounded-2xl font-semibold"
                  >
                    Dashboard
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onClick={() => {
                  disconnect();
                  toast({
                    title: "Disconnected",
                    description: "Wallet disconnected successfully",
                  });
                }}
                className="text-red-400 cursor-pointer w-full flex justify-center rounded-2xl font-semibold"
              >
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <NetworkSwitcher />
        </div>
      ) : (
        <Button
          className="bg-blue-500 rounded-xl hover:bg-blue-600 shadow-xl md:px-10 font-semibold"
          onClick={() => connect()}
        >
          Connect Wallet
        </Button>
      )}
    </nav>
  );
}
