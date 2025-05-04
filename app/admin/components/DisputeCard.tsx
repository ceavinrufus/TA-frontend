import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import { DisputeStatus } from "@/app/host/dashboard/reservations/utils/statusLabel";
import DisputeResolutionModal from "./DisputeResolutionModal";
import { formatCryptoAddressForDisplay } from "@/lib/ui/ui-utils";

const DisputeCard = ({ initialData }: { initialData: Dispute }) => {
  const [dispute, setDispute] = useState<Dispute>(initialData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case DisputeStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case DisputeStatus.UNDER_REVIEW:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case DisputeStatus.RESOLVED_FAVOR_GUEST:
        return "bg-green-100 text-green-800 border-green-200";
      case DisputeStatus.RESOLVED_FAVOR_HOST:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case DisputeStatus.RESOLVED_COMPROMISE:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case DisputeStatus.PENDING:
        return <Clock className="h-4 w-4 mr-1" />;
      case DisputeStatus.UNDER_REVIEW:
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case DisputeStatus.RESOLVED_FAVOR_GUEST:
      case DisputeStatus.RESOLVED_FAVOR_HOST:
      case DisputeStatus.RESOLVED_COMPROMISE:
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  const handleResolve = (updatedDispute: Dispute) => {
    setDispute(updatedDispute);
  };

  return (
    <>
      <Card className="w-full overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">
                Dispute ID: {dispute.id}
              </CardTitle>
              <CardDescription className="mt-1">
                Reservation ID: {dispute.reservation_id}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                dispute.status
              )}`}
            >
              {getStatusIcon(dispute.status)}{" "}
              {dispute.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-secondary-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-medium">Raised:</span>&nbsp;
                {format(new Date(dispute.raised_at), "MMM d, yyyy 'at' h:mm a")}
              </div>

              {dispute.resolved_at && (
                <div className="flex items-center text-sm text-secondary-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">Resolved:</span>&nbsp;
                  {format(
                    new Date(dispute.resolved_at),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-secondary-foreground" />
                <span className="font-medium text-secondary-foreground">
                  Reasons:
                </span>
              </div>
              <ul className="list-disc pl-8 text-sm space-y-1">
                {dispute.reasons.map((reason, index) => (
                  <li key={index} className="text-secondary-foreground">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-4 w-4 mr-2 text-secondary-foreground" />
              <h3 className="font-medium text-secondary-foreground">
                Guest Claim
              </h3>
            </div>
            <p className="text-sm p-3 rounded-md border border-secondary-placeholder">
              {dispute.guest_claim}
            </p>
          </div>

          {dispute.host_response && (
            <div className="border-t pt-4">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 mr-2 text-secondary-foreground" />
                <h3 className="font-medium text-secondary-foreground">
                  Host Response
                </h3>
              </div>
              <p className="text-sm p-3 rounded-md border border-secondary-placeholder">
                {dispute.host_response}
              </p>
            </div>
          )}

          {dispute.mediator_notes && (
            <div className="border-t pt-4">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 mr-2 text-secondary-foreground" />
                <h3 className="font-medium text-secondary-foreground">
                  Mediator Notes
                </h3>
              </div>
              <p className="text-sm p-3 rounded-md border border-secondary-placeholder">
                {dispute.mediator_notes}
              </p>
            </div>
          )}

          {dispute.evidences.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2 text-secondary-foreground" />
                <h3 className="font-medium text-secondary-foreground">
                  Evidence
                </h3>
              </div>
              <ul className="list-disc pl-8 text-sm space-y-1">
                {dispute.evidences.map((evidence, index) => (
                  <li key={index} className="text-secondary-foreground">
                    {evidence}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-4">
            {dispute.raise_dispute_transaction_hash && (
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-left text-xs text-secondary-placeholder">
                      <span className="font-medium">
                        Raise dispute tx hash:
                      </span>{" "}
                      {formatCryptoAddressForDisplay(
                        dispute.raise_dispute_transaction_hash
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {dispute.raise_dispute_transaction_hash}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            {dispute.resolve_dispute_transaction_hash && (
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-left text-xs text-secondary-placeholder">
                      <span className="font-medium">
                        Resolve dispute tx hash:
                      </span>{" "}
                      {formatCryptoAddressForDisplay(
                        dispute.resolve_dispute_transaction_hash
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {dispute.resolve_dispute_transaction_hash}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </CardContent>

        {dispute.status === DisputeStatus.PENDING ||
          (dispute.status === DisputeStatus.UNDER_REVIEW && (
            <CardFooter className="flex justify-end space-x-3 py-4">
              <DisputeResolutionModal
                dispute={dispute}
                onResolve={handleResolve}
              />
            </CardFooter>
          ))}
      </Card>
    </>
  );
};

export default DisputeCard;
