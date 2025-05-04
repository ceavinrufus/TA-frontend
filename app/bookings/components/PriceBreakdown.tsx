import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ValueWrapper = ({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) => (
  <div className="flex gap-20 text-base">
    {loading ? (
      <Skeleton className="w-[200px] h-6 rounded"></Skeleton>
    ) : (
      children
    )}
  </div>
);

const PriceBreakdown = ({
  reservation,
  loading,
}: {
  reservation: Reservation;
  loading: boolean;
}) => {
  return (
    <Card className="border border-neutral-200 rounded-lg p-6 bg-white">
      <CardTitle className="text-xl font-semibold mb-4">
        Price Details
      </CardTitle>
      <CardContent className="space-y-4 p-0">
        <div className="flex justify-between text-base">
          <span>Room price</span>
          <ValueWrapper loading={loading}>
            {reservation?.base_price
              ? `${Number(reservation.base_price.toFixed(8))} ETH`
              : "-"}
          </ValueWrapper>
        </div>

        <div className="flex justify-between text-base">
          <span>Service fee</span>
          <ValueWrapper loading={loading}>
            {reservation?.service_fee
              ? `${Number(reservation.service_fee.toFixed(8))} ETH`
              : "-"}
          </ValueWrapper>
        </div>

        <div className="flex justify-between text-base">
          <span>Guest deposit</span>
          <ValueWrapper loading={loading}>
            {reservation?.guest_deposit
              ? `${Number(reservation.guest_deposit.toFixed(8))} ETH`
              : "-"}
          </ValueWrapper>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <ValueWrapper loading={loading}>
              {reservation?.total_price
                ? `${Number(reservation.total_price.toFixed(8))} ETH`
                : "-"}
            </ValueWrapper>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;
