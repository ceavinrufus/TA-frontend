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
import { Button } from "@/components/ui/button";
import UniquenessVerificationQR from "./UniquenessVerificationQR";
import { useUserStore } from "@/store/user-store";
import LivenessVerificationQR from "./LivenessVerificationQR";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import IdentityVerificationQR from "./IdentityVerificationQR";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const UserVerification = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const totalSteps = 3;
  const [isJustDone, setIsJustDone] = useState(false);
  const { user, fetchUser, isLoading } = useUserStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // Assuming the attributes below are sequentially filled
    if (user?.is_identity_verified) {
      // router.back();
      setCurrentStep(3);
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

  if (currentStep === 3) {
    return (
      <div className="h-[50vh] flex flex-col justify-between w-full mt-16">
        <div className="text-center py-8">
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {isJustDone ? "Verification Complete!" : "All steps completed!"}
          </h3>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            {isJustDone
              ? "Congratulations! You have successfully completed the verification process. You can now access all the features of our platform."
              : "You have completed all the verification steps. You can now proceed to use the application."}
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => router.push("/")} variant={"default"}>
            Go to Home
          </Button>
        </div>
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
                  setIsJustDone(true);
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
