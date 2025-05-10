import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import { formatCryptoAddressForDisplay } from "@/lib/ui/ui-utils";
import React from "react";
import HostReputationModal from "./HostReputationModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * HostInfo component displays information about a property host.
 * Includes host's wallet address, verification status, join date, and reputation.
 *
 * Responsive design:
 * - Mobile: Stacked layout with reputation button below host information
 * - Tablet+: Horizontal layout with reputation button aligned to the right
 */
const HostInfo = ({ host }: { host: User }) => {
  // Format the join date once
  const joinDate = formatDateStringForDisplay(
    host.created_at,
    "en-US",
    false,
    DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
  );

  // Determine verification status
  const isVerified =
    host.is_uniqueness_verified &&
    host.is_liveness_verified &&
    host.is_identity_verified;

  // Format wallet address for display
  const displayAddress = formatCryptoAddressForDisplay(host.wallet_address);

  return (
    <section className="space-y-4">
      {/* Mobile Layout (< 640px) */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex items-center gap-3">
          <ResponsiveIcon
            icon={"icon-person"}
            sizeMobile={32}
            sizeDesktop={40}
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm">
                Hosted by{" "}
                <span className="font-semibold">{displayAddress}</span>
              </p>
              <VerificationBadge isVerified={isVerified} />
            </div>
            <p className="text-xs text-gray-600">Joined since {joinDate}</p>
          </div>
        </div>

        {/* Reputation Button - Mobile */}
        <div className="w-full">
          <HostReputationModal hostId={host.wallet_address} />
        </div>
      </div>

      {/* Tablet/Desktop Layout (≥ 640px) */}
      <div className="hidden sm:flex sm:items-center sm:justify-between md:gap-4">
        <div className="flex items-center gap-4">
          <ResponsiveIcon
            icon={"icon-person"}
            sizeMobile={32}
            sizeDesktop={40}
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm lg:text-base">
                Hosted by{" "}
                <span className="font-semibold">{displayAddress}</span>
              </p>
              <VerificationBadge isVerified={isVerified} />
            </div>
            <p className="text-xs lg:text-sm text-gray-600">
              Joined since {joinDate}
            </p>
          </div>
        </div>

        {/* Reputation Button - Desktop */}
        <HostReputationModal hostId={host.wallet_address} />
      </div>
    </section>
  );
};

/**
 * VerificationBadge - Component that shows verification status with tooltip
 */
const VerificationBadge = ({ isVerified }: { isVerified: boolean }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="text-left text-xs text-secondary-placeholder">
          {isVerified ? (
            <ResponsiveIcon
              icon={"icon-check-circle"}
              sizeMobile={14}
              sizeDesktop={16}
              color="#16a34a"
            />
          ) : (
            <ResponsiveIcon
              icon={"icon-warning"}
              sizeMobile={14}
              sizeDesktop={16}
              color="#dc2626"
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {isVerified ? "Verified Host" : "Unverified Host"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HostInfo;
