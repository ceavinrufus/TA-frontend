"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { loginHost } from "@/lib/api/host";
import { useHostStore } from "../store/host-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HostHero = () => {
  const { toast } = useToast();
  const router = useRouter();

  // Use the host store
  const { fetchHostStats } = useHostStore();

  // Add loading and failed states for future use
  const [showPage, setShowPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Run the login process asynchronously without blocking page render
    const setupHost = async () => {
      try {
        setIsLoading(true);

        // First, try to fetch host info from the store
        await fetchHostStats();

        // Get the latest host data from the store
        const currentHost = useHostStore.getState().host;

        // If host exists and has listed listings, redirect to dashboard
        if (currentHost?.is_host && currentHost?.has_listed_listing) {
          router.push("/host/dashboard");
          return;
        }

        setShowPage(true);
      } catch (error) {
        console.error("Failed to fetch host stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Start the async process without awaiting it
    setupHost();
  }, [fetchHostStats, router]);

  const handleGoToCreateListing = async () => {
    if (isLoading) {
      return;
    }
    try {
      const currentHost = useHostStore.getState().host;

      if (!currentHost) {
        toast({
          title: "Failed to retrieve user info.",
          description: "Please try again.",
        });
        return;
      }

      const userId = currentHost.id;

      await loginHost(userId);

      router.push("/host/create-listing");
    } catch (error) {
      console.error("Failed to create host:", error);
      toast({
        title: "Failed to create host.",
        description: "Please try again.",
      });
    }
  };

  if (!showPage) {
    return null;
  }
  return (
    <div className="host-hero-background-image flex justify-center relative rounded-[16px] w-full md:h-[550px]">
      <div className="flex flex-col justify-end items-start gap-6 px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-center md:text-start">
          List your house to make money
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          We&apos;re excited to help you share your space with the world!
          Creating a great listing is the first step to connecting with
          travelers and making unforgettable stays possible.
        </p>
        <Button
          type="button"
          variant="default"
          className="h-[48px] md:h-[56px] px-8 rounded-full text-base font-medium hover:opacity-90 transition-opacity"
          onClick={handleGoToCreateListing}
        >
          List Your House Now
        </Button>
      </div>
    </div>
  );
};

export default HostHero;
