import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import RentalPayments from "@/abi/RentalPayments.json";
import { Button } from "@/components/ui/button";
import { DisputeStatus } from "@/app/host/dashboard/reservations/utils/statusLabel";
import { updateDispute } from "@/lib/api/dispute";
import { useWalletClient } from "wagmi";

const DisputeResolutionModal = ({
  dispute,
  onResolve,
}: {
  dispute: Dispute;
  onResolve: (dispute: Dispute) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resolutionType, setResolutionType] = useState<string | null>(null);
  const [refundDeposit, setRefundDeposit] = useState(false);
  const [resolutionReason, setResolutionReason] = useState("");

  const { toast } = useToast();

  const { data: walletClient } = useWalletClient();

  const resolveDispute = async (favorGuest: boolean) => {
    try {
      if (!walletClient) {
        toast({
          title: "Please connect your wallet",
          description: "You need to connect your wallet to proceed.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      const provider = new ethers.BrowserProvider(walletClient.transport);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // Setup contract
      const contractABI = RentalPayments.abi;
      const contractAddress =
        process.env.NEXT_PUBLIC_RENTAL_PAYMENTS_CONTRACT_ADDRESS!;
      const rentalPaymentsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Get booking ID from transaction hash
      const disputeReceipt = await provider.getTransactionReceipt(
        dispute.raise_dispute_transaction_hash!
      );

      const log = disputeReceipt!.logs[0];
      const parsedLog = rentalPaymentsContract.interface.parseLog({
        topics: log.topics,
        data: log.data,
      });

      // Extract bookingId and call resolveDispute function
      if (parsedLog) {
        const bookingId = parsedLog.args.bookingId;

        const transaction = await rentalPaymentsContract.resolveDispute(
          bookingId,
          favorGuest, // true for guest, false for host
          refundDeposit // whether to refund deposit
        );

        const receipt = await transaction.wait();
        const txHash = receipt.hash;

        // Update dispute in database
        const newStatus = favorGuest
          ? DisputeStatus.RESOLVED_FAVOR_GUEST
          : DisputeStatus.RESOLVED_FAVOR_HOST;

        const payload = {
          status: newStatus,
          resolved_at: new Date(),
          resolution_reason: resolutionReason,
          resolve_dispute_transaction_hash: txHash,
        };

        await updateDispute(dispute.id, payload);

        // Call the onResolve function passed as a prop
        onResolve({
          ...dispute,
          ...payload,
        });

        toast({
          title: "Dispute resolved",
          description: `Dispute has been resolved in favor of the ${
            favorGuest ? "guest" : "host"
          }.`,
        });

        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast({
        title: "Error",
        description: "Failed to resolve dispute. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmResolution = () => {
    if (resolutionType === "guest") {
      resolveDispute(true);
    } else if (resolutionType === "host") {
      resolveDispute(false);
    }
  };
  const openResolutionDialog = (type: string) => {
    setResolutionType(type);
    setIsDialogOpen(true);
  };
  return (
    <>
      <Button variant="outline" onClick={() => openResolutionDialog("host")}>
        Favor Host
      </Button>
      <Button onClick={() => openResolutionDialog("guest")}>Favor Guest</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              You are about to resolve this dispute in favor of the{" "}
              {resolutionType === "guest" ? "guest" : "host"}. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolutionReason">Resolution Reason</Label>
              <Textarea
                id="resolutionReason"
                placeholder="Provide a reason for this resolution..."
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                className="min-h-24"
              />
            </div>

            {resolutionType === "guest" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="refundDeposit"
                  checked={refundDeposit}
                  onCheckedChange={(checked) =>
                    setRefundDeposit(checked === true)
                  }
                />
                <Label htmlFor="refundDeposit" className="text-sm">
                  Refund guest deposit
                </Label>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmResolution}
              disabled={isLoading || !resolutionReason}
            >
              {isLoading ? "Processing..." : "Confirm Resolution"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisputeResolutionModal;
