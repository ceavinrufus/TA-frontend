import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  getStatusLabel,
  statusColors,
} from "@/app/host/dashboard/reservations/utils/statusLabel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock } from "lucide-react";
import { useOrderStore } from "../store/orderStore";

const CheckoutInfo = () => {
  const { reservationDetails } = useOrderStore();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!reservationDetails?.created_at) return;

    const calculateTimeRemaining = () => {
      const createdAt = new Date(reservationDetails.created_at!);
      const now = new Date();
      const timeLimitMs = 15 * 60 * 1000; // 15 minutes in milliseconds
      const elapsedMs = now.getTime() - createdAt.getTime();
      const remainingMs = timeLimitMs - elapsedMs;

      if (remainingMs <= 0) {
        setTimeRemaining(0);
        setIsExpired(true);
        return;
      }

      setTimeRemaining(remainingMs);
      setIsExpired(false);
    };

    // Calculate initial time
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [reservationDetails?.created_at]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const totalMs = 15 * 60 * 1000; // 15 minutes
    const percentage = (timeRemaining / totalMs) * 100;

    if (percentage > 50) return "text-green-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white flex flex-col justify-between h-full">
      {/* Existing booking info */}
      <div className="flex justify-between gap-2 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-sm text-secondary-foreground">
              {reservationDetails?.booking_number}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Your booking number is {reservationDetails?.booking_number}.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Badge
          className={`text-[#474747] whitespace-nowrap text-xs px-2 py-1 rounded-[4px] ${
            statusColors[getStatusLabel(reservationDetails!)]
          }`}
        >
          {getStatusLabel(reservationDetails!)}
        </Badge>
      </div>

      {/* Payment Timer */}
      {reservationDetails?.created_at && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Payment Timer</span>
          </div>
          <div className="flex items-center gap-2">
            {isExpired ? (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                Expired
              </Badge>
            ) : (
              <div
                className={`font-mono text-lg font-semibold ${getTimerColor()}`}
              >
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expiration warning */}
      {isExpired ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            ⚠️ Payment time has expired. Please create a new reservation.
          </p>
        </div>
      ) : (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            Please complete your payment within 15 minutes.
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutInfo;
