import { useEditListing } from "@/app/host/providers/EditListingProvider";
import React from "react";
import { isListingValidated } from "@/app/host/utils/listingValidator";
import { updateListing } from "@/lib/api/listing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SaveEditButton = ({ listingId }: { listingId: string }) => {
  const { listing } = useEditListing();

  const { toast } = useToast();

  const handleUpdateListing = async () => {
    try {
      const { isValidated, toastMessage } = isListingValidated(listing);
      if (!isValidated) {
        toast({
          title: toastMessage,
          variant: "destructive",
        });
        return;
      }

      await updateListing(listingId, listing);
      toast({
        title: "Listing updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Failed to update listing",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      className="self-end rounded-[32px] p-[16px] h-[24px] md:w-[120px] md:py-[16px] md:px-[24px] md:h-[56px]"
      onClick={handleUpdateListing}
    >
      Save
    </Button>
  );
};

export default SaveEditButton;
