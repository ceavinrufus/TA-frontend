import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";
import { formatCryptoAddressForDisplay } from "@/lib/ui/ui-utils";
import React from "react";
import HostReputationModal from "./HostReputationModal";

const HostInfo = ({ host }: { host: User }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ResponsiveIcon icon={"icon-person"} sizeDesktop={40} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p>
                Hosted by{" "}
                <span className="font-semibold">
                  {formatCryptoAddressForDisplay(host.wallet_address)}
                </span>
              </p>
              {host.is_uniqueness_verified &&
              host.is_liveness_verified &&
              host.is_identity_verified ? (
                <ResponsiveIcon
                  icon={"icon-check-circle"}
                  sizeDesktop={16}
                  color="#16a34a"
                />
              ) : (
                <ResponsiveIcon
                  icon={"icon-warning"}
                  sizeDesktop={16}
                  color="#dc2626"
                />
              )}
            </div>
            <p className="text-sm">
              Joined since{" "}
              {formatDateStringForDisplay(
                host.created_at,
                "en-US",
                false,
                DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
              )}
            </p>
          </div>
        </div>

        {/* Reputation Button */}
        <HostReputationModal hostId={host.wallet_address} />
      </div>
    </section>
  );
};
export default HostInfo;
