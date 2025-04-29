"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UniquenessVerificationQR from "./UniquenessVerificationQR";
import { useUserStore } from "@/store/user-store";

const UserVerification = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

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

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Progress value={progress} className="w-full h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Content for each step */}
          {currentStep === 1 && (
            <div className="flex items-center w-full">
              <UniquenessVerificationQR
                onScanSuccess={() => {
                  setCurrentStep(2);
                }}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Add liveness verification components here */}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Add identity verification components here */}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between mt-6">
          <Button
            variant={"outline"}
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            variant={"default"}
            onClick={() =>
              setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
            }
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserVerification;
