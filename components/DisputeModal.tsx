"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/user-store";
import {
  DisputeStatus,
  ReservationStatus,
} from "@/app/host/dashboard/reservations/utils/statusLabel";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import RentalPayments from "@/abi/RentalPayments.json";
import { createDispute } from "@/lib/api/dispute";
import { useWalletClient } from "wagmi";

export enum DisputeReasonOption {
  PROPERTY_WAS_NOT_AS_DESCRIBED = "PROPERTY_WAS_NOT_AS_DESCRIBED",
  HOST_CANCEL_LAST_MINUTE = "HOST_CANCEL_LAST_MINUTE",
  CHECKIN_ISSUES = "CHECKIN_ISSUES",
  HYGIENE_ISSUES = "HYGIENE_ISSUES",
  INCORRECT_BILLING = "INCORRECT_BILLING",
  OTHERS = "OTHERS",
}

export const disputeReasonOptions = [
  {
    value: DisputeReasonOption.PROPERTY_WAS_NOT_AS_DESCRIBED,
    description: `The property was not as described`,
  },
  {
    value: DisputeReasonOption.HOST_CANCEL_LAST_MINUTE,
    description: `Host canceled last minute`,
  },
  {
    value: DisputeReasonOption.CHECKIN_ISSUES,
    description: `Check-in issues (e.g., no access, host unresponsive)`,
  },
  {
    value: DisputeReasonOption.HYGIENE_ISSUES,
    description: `Cleanliness or hygiene issues`,
  },
  {
    value: DisputeReasonOption.INCORRECT_BILLING,
    description: `Overcharging or incorrect billing`,
  },
  {
    value: DisputeReasonOption.OTHERS,
    description: `Other (please specify)`,
  },
];

const DisputeModal = ({
  reservation,
  onSubmit,
}: {
  reservation: Reservation | null;
  onSubmit: (reservation: Reservation) => void;
}) => {
  const [selectedReasons, setSelectedReasons] = useState<DisputeReasonOption[]>(
    []
  );
  const [guestClaim, setGuestClaim] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [evidences, setEvidences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();
  const { toast } = useToast();

  const { data: walletClient } = useWalletClient();

  const handleSubmit = async () => {
    if (!walletClient) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (!reservation || !user) return;
    if (!reservation.payments![0].transaction_hash) {
      toast({
        title: "No payment transaction found",
        description:
          "This reservation does not have a valid payment transaction.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (selectedReasons.length > 0 && guestClaim.trim()) {
        const provider = new ethers.BrowserProvider(walletClient.transport);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractABI = RentalPayments.abi;
        const contractAddress =
          process.env.NEXT_PUBLIC_RENTAL_PAYMENTS_CONTRACT_ADDRESS!;

        const rentalPaymentsContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Get on chain reservation details using the transaction hash
        const bookingReceipt = await provider.getTransactionReceipt(
          reservation.payments![0].transaction_hash!
        );
        const log = bookingReceipt!.logs[0];
        const parsedLog = rentalPaymentsContract.interface.parseLog({
          topics: log.topics,
          data: log.data,
        });

        if (parsedLog && parsedLog.name === "PaymentInitiated") {
          const bookingId = parsedLog.args.bookingId; // Extract bookingId from the log
          const transaction = await rentalPaymentsContract.raiseDispute(
            bookingId
          );
          const receipt = await transaction.wait();
          const txHash = receipt.hash;

          // Handle dispute creation here
          const disputeData: Partial<Dispute> = {
            reservation_id: reservation.id,
            raised_by_id: user?.id,
            reasons: selectedReasons,
            guest_claim: guestClaim,
            evidences: evidences,
            status: DisputeStatus.PENDING,
            raise_dispute_transaction_hash: txHash,
          };

          try {
            const data = await createDispute(disputeData);
            onSubmit({
              ...reservation,
              dispute: data,
            } as Reservation);
            toast({
              title: "Dispute raised successfully",
              description: "Your dispute has been submitted.",
              variant: "default",
            });
          } catch (error) {
            console.error("Error creating dispute:", error);
            toast({
              title: "Error raising dispute",
              description: (error as Error).message,
              variant: "destructive",
            });
          }
        }

        setIsOpen(false);
        setSelectedReasons([]);
        setGuestClaim("");
        setEvidences([]);
      }
    } catch (error) {
      console.error("Error creating dispute:", error);
      toast({
        title: "Error raising dispute",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReasonToggle = (reason: DisputeReasonOption) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  if (!reservation) return <Skeleton className="w-full h-9 px-4 py-2" />;

  const checkOutDate = new Date(reservation.check_out_date);
  const today = new Date();
  const sevenDaysAfterCheckout = new Date(
    new Date(reservation.check_out_date).setDate(checkOutDate.getDate() + 7)
  );

  const inDisputePeriod =
    sevenDaysAfterCheckout >= today && today > checkOutDate;
  const isDisputed = reservation.dispute !== null;
  const isCancelledStatus =
    reservation.status === ReservationStatus.ORDER_CANCELED;

  // Button is enabled when:
  // 1. EITHER of these conditions is true:
  //    a) reservation cancelled AND checkOutDate is in the future
  //    OR
  //    b) in dispute period (7 days after checkout date)
  // AND
  // 2. not already disputed
  //
  // In other words:
  // - For cancelled bookings: can only dispute if checkout date hasn't passed yet
  // - For any booking: can dispute if within dispute period
  // - Can never dispute if already disputed
  const canBeDisputed =
    ((isCancelledStatus && checkOutDate > today) || inDisputePeriod) &&
    !isDisputed;

  const isButtonEnabled = canBeDisputed || isDisputed;

  const renderDisputeDetails = () => {
    if (!reservation.dispute) return null;

    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Dispute Status</Label>
          <p className="text-sm">{reservation.dispute.status}</p>
        </div>
        <div className="space-y-1">
          <Label>Reasons for Dispute</Label>
          {reservation.dispute.reasons.map((reason) => (
            <div key={reason} className="flex items-center space-x-2">
              <p className="text-sm">
                •{" "}
                {
                  disputeReasonOptions.find((opt) => opt.value === reason)
                    ?.description
                }
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <Label>Detailed Explanation</Label>
          <p className="text-sm whitespace-pre-wrap">
            {reservation.dispute.guest_claim}
          </p>
        </div>
        {reservation.dispute.evidences &&
          reservation.dispute.evidences.length > 0 && (
            <div className="space-y-2">
              <Label>Evidence Links</Label>
              {reservation.dispute.evidences.map((evidence, index) => (
                <p
                  key={index}
                  className="text-sm text-blue-600 hover:underline"
                >
                  <a href={evidence} target="_blank" rel="noopener noreferrer">
                    Evidence {index + 1}
                  </a>
                </p>
              ))}
            </div>
          )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full"
          disabled={!isButtonEnabled || isLoading}
        >
          {isDisputed
            ? "View Dispute"
            : isLoading
            ? "Raising dispute..."
            : "Raise a Dispute"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Dispute</DialogTitle>
          <DialogDescription>
            {isDisputed
              ? "Below are the details of your submitted dispute."
              : "Please select all applicable reasons and provide details about your dispute."}
          </DialogDescription>
        </DialogHeader>

        {isDisputed ? (
          renderDisputeDetails()
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reasons for Dispute</Label>
              {disputeReasonOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedReasons.includes(option.value)}
                    onCheckedChange={() => handleReasonToggle(option.value)}
                  />
                  <Label htmlFor={option.value}>{option.description}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Detailed Explanation</Label>
              <Textarea
                placeholder="Please provide specific details about your dispute..."
                value={guestClaim}
                onChange={(e) => setGuestClaim(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={
                selectedReasons.length === 0 || !guestClaim.trim() || isLoading
              }
            >
              {isLoading ? "Raising dispute..." : "Submit Dispute"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DisputeModal;
