"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  Award,
  Clock,
  Scale,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  DateTimeDisplayMode,
  formatDateStringForDisplay,
} from "@/lib/time/time-utils";

const HOST_REPUTATION_QUERY = gql`
  query GetHostReputation($id: ID!) {
    hostReputation(id: $id) {
      id
      totalDisputes
      disputesWon
      disputesLost
      lastRaiseDisputeTimestamp
      lastResolveDisputeTimestamp
      disputesRaised
    }
  }
`;

const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/110828/ta-subgraph/version/latest";

// Define the interface for the HostReputation data
interface HostReputation {
  id: string;
  totalDisputes: string; // BigInt comes as string from GraphQL
  disputesWon: string;
  disputesLost: string;
  lastRaiseDisputeTimestamp: string;
  lastResolveDisputeTimestamp: string;
  disputesRaised: string;
}

interface QueryResponse {
  hostReputation: HostReputation | null;
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  if (!timestamp || timestamp === "0") return "Never";

  const date = new Date(parseInt(timestamp) * 1000).toString();
  return formatDateStringForDisplay(
    date,
    "en-US",
    false,
    DateTimeDisplayMode.SHORT_MONTH_DATE_FORMAT
  );
};

// Calculate win rate percentage
const calculateWinRate = (won: string, total: string): string => {
  if (parseInt(total) === 0) return "0%";
  return Math.round((parseInt(won) / parseInt(total)) * 100) + "%";
};

/**
 * Calculate reputation score - Newcomer-friendly algorithm
 *
 * This algorithm:
 * 1. Gives new hosts a starting bonus (70/100) to make them competitive
 * 2. Win rate has the biggest impact on score
 * 3. Gradually reduces the newcomer bonus as more disputes occur
 * 4. Penalizes excessive dispute raising slightly
 * 5. Rewards recent activity
 *
 * Score range: 0-100
 */
const calculateReputationScore = (rep: HostReputation): number => {
  // Parse values
  const totalDisputes = parseInt(rep.totalDisputes);
  const disputesWon = parseInt(rep.disputesWon);
  const disputesRaised = parseInt(rep.disputesRaised);
  const lastActivity = Math.max(
    parseInt(rep.lastRaiseDisputeTimestamp) || 0,
    parseInt(rep.lastResolveDisputeTimestamp) || 0
  );

  // Handle new hosts with no disputes
  if (totalDisputes === 0) {
    return 70; // Starting score for newcomers
  }

  // Calculate win rate component (most important factor)
  const winRate = disputesWon / totalDisputes;
  const winRateScore = winRate * 80; // Win rate can contribute up to 80 points

  // Experience penalty - reduces newcomer bonus as disputes increase
  // Gradually reduces starting bonus from 15 to 0 as disputes approach 10
  const experienceBonus = Math.max(
    0,
    15 * (1 - Math.min(totalDisputes, 10) / 10)
  );

  // Calculate dispute raising penalty (minor effect)
  // Penalizes excessive dispute raising compared to total disputes
  const raiseRatio = disputesRaised / Math.max(1, totalDisputes);
  const raisePenalty = raiseRatio > 2 ? Math.min(10, (raiseRatio - 2) * 5) : 0;

  // Activity bonus - rewards recent activity (within last 30 days)
  const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
  const currentTime = Math.floor(Date.now() / 1000);
  const activityBonus =
    lastActivity > currentTime - thirtyDaysInSeconds ? 5 : 0;

  // Calculate final score with floor at 0 and ceiling at 100
  return Math.min(
    100,
    Math.max(0, winRateScore + experienceBonus + activityBonus - raisePenalty)
  );
};

// Helper to determine reputation level
const getReputationLevel = (
  score: number
): { level: string; color: string } => {
  if (score >= 80)
    return { level: "Excellent", color: "bg-green-100 text-green-800" };
  if (score >= 60) return { level: "Good", color: "bg-blue-100 text-blue-800" };
  if (score >= 40)
    return { level: "Average", color: "bg-yellow-100 text-yellow-800" };
  if (score >= 20)
    return { level: "Poor", color: "bg-orange-100 text-orange-800" };
  return { level: "Bad", color: "bg-red-100 text-red-800" };
};

export default function HostReputationModal({ hostId }: { hostId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<QueryResponse>({
    queryKey: ["host-reputation", hostId],
    queryFn: async () => {
      const response = await request(SUBGRAPH_URL, HOST_REPUTATION_QUERY, {
        id: hostId,
      });
      return response as QueryResponse;
    },
    enabled: isOpen, // Only fetch when modal is open
  });

  const rep = data?.hostReputation;

  // Calculate reputation score using our algorithm
  const calculatedScore = rep ? calculateReputationScore(rep) : 0;
  const reputationInfo = getReputationLevel(calculatedScore);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Shield size={16} />
          Host Reputation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Host Reputation
          </DialogTitle>
          <DialogDescription>
            Reputation profile for host{" "}
            <code className="px-1 py-0.5 bg-gray-100 rounded">
              {hostId.slice(0, 6)}...{hostId.slice(-4)}
            </code>
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-6 text-red-500 gap-2">
            <AlertTriangle size={36} />
            <p className="font-medium">Failed to fetch reputation data</p>
          </div>
        )}

        {rep && (
          <div className="space-y-6">
            {/* Reputation Score Card */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Reputation Score</h3>
                <Badge className={reputationInfo.color}>
                  {reputationInfo.level}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${calculatedScore}%` }}
                ></div>
              </div>

              <p className="text-lg font-bold text-center">
                {calculatedScore} / 100
              </p>
            </div>

            {/* Dispute Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Scale size={20} className="mb-1 text-blue-600" />
                <p className="text-sm text-gray-500">Total Disputes</p>
                <p className="font-bold text-lg">
                  {parseInt(rep.totalDisputes)}
                </p>
              </div>

              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                <Award size={20} className="mb-1 text-green-600" />
                <p className="text-sm text-gray-500">Win Rate</p>
                <p className="font-bold text-lg">
                  {calculateWinRate(rep.disputesWon, rep.totalDisputes)}
                </p>
              </div>

              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                <ThumbsUp size={20} className="mb-1 text-green-600" />
                <p className="text-sm text-gray-500">Disputes Won</p>
                <p className="font-bold text-lg">{parseInt(rep.disputesWon)}</p>
              </div>

              <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                <ThumbsDown size={20} className="mb-1 text-red-600" />
                <p className="text-sm text-gray-500">Disputes Lost</p>
                <p className="font-bold text-lg">
                  {parseInt(rep.disputesLost)}
                </p>
              </div>
            </div>

            {/* Reputation Score Formula Explanation */}
            <div className="bg-blue-50 p-3 rounded-lg text-xs border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-1">
                <Star size={14} className="text-blue-500" />
                How We Calculate Reputation
              </h4>
              <ul className="space-y-1 text-gray-700">
                <li>• New hosts start with a 70/100 baseline score</li>
                <li>• Win rate has the highest impact (up to 80 points)</li>
                <li>• Bonus points for recent activity (+5)</li>
                <li>
                  • Experience bonus gradually decreases as disputes increase
                </li>
                <li>• Small penalty for excessive dispute raising</li>
              </ul>
            </div>

            {/* Additional information */}
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <AlertTriangle size={14} /> Disputes Raised
                </span>
                <span className="font-medium">
                  {parseInt(rep.disputesRaised)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock size={14} /> Last Dispute Raised
                </span>
                <span className="font-medium">
                  {formatTimestamp(rep.lastRaiseDisputeTimestamp)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock size={14} /> Last Dispute Resolved
                </span>
                <span className="font-medium">
                  {formatTimestamp(rep.lastResolveDisputeTimestamp)}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
