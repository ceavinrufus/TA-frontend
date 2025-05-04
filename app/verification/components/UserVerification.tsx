"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import UniquenessVerificationQR from "./UniquenessVerificationQR";
import { useUserStore } from "@/store/user-store";
import LivenessVerificationQR from "./LivenessVerificationQR";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import IdentityVerificationQR from "./IdentityVerificationQR";
import { useToast } from "@/hooks/use-toast";

const UserVerification = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const totalSteps = 3;
  const { user, fetchUser, isLoading } = useUserStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.is_identity_verified) {
      router.back();
    } else if (user?.is_liveness_verified) {
      setCurrentStep(2);
    } else if (user?.is_uniqueness_verified) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [user]);

  const steps = [
    {
      id: 1,
      title: "Proof of Uniqueness",
      description: "Verify that you are a unique individual",
    },
    {
      id: 2,
      title: "Proof of Liveness",
      description: "Confirm that you are a real person",
    },
    {
      id: 3,
      title: "Proof of Identity",
      description: "Verify your identity documents",
    },
  ];

  if (isLoading || !user || currentStep === null) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Progress value={0} className="w-full h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Step 0 of {totalSteps}</span>
            <span>{Math.round(0)}% Complete</span>
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 rounded w-1/4"></Skeleton>
            <Skeleton className="h-4 rounded w-1/2 mt-2"></Skeleton>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[500px] rounded-lg"></Skeleton>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Progress value={progress} className="w-full h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Content for each step */}
          {currentStep === 0 && (
            <div className="flex items-center w-full">
              <UniquenessVerificationQR
                onScanSuccess={() => {
                  toast({
                    title: "Uniqueness verification successful",
                    description: "You have been verified as a unique user.",
                  });
                }}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <LivenessVerificationQR
                onScanSuccess={() => {
                  toast({
                    title: "Liveness verification successful",
                    description: "You have been verified as a real user.",
                  });
                }}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <IdentityVerificationQR
                onScanSuccess={() => {
                  toast({
                    title: "Identity verification successful",
                    description: "Your identity has been verified.",
                  });
                }}
              />
            </div>
          )}
        </CardContent>
        {/* <CardFooter className="flex justify-end mt-6">
          <Button
            variant={"default"}
            onClick={handleNextStep}
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? "Submit" : "Next"}
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default UserVerification;
