"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCreateListing } from "../../providers/CreateListingProvider";
import { CurrentPath } from "./CreateListingProgressBar";
import { isListingValidated } from "../../utils/listingValidator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createListing } from "@/lib/api/listing";

interface CreateListingNavigationProps {
  backTo?: string;
  nextTo?: string;
  isNextSubmitButton?: boolean;
}

/**
 * Component for navigation between steps in the listing creation process.
 * Handles validation and submission of listing data at each step.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.backTo] - URL path for the back navigation link
 * @param {string} [props.nextTo] - URL path for the next navigation button
 *
 * @remarks
 * The component handles different validation rules based on the current path:
 * - Location: Requires region_id, address, latitude and longitude
 * - Property Type: Requires property_type
 * - Place Type: Requires place_type
 * - Guest Number: Requires guest_number
 * - Photos: Requires minimum 5 pictures
 * - Property Description: Requires property name
 * - Price: Requires default_price
 * - Agreement: Handles final listing creation and submission
 *
 * @example
 * ```tsx
 * <CreateListingNavigation
 *   backTo="/previous-step"
 *   nextTo="/next-step"
 * />
 * ```
 */
const CreateListingNavigation: React.FC<CreateListingNavigationProps> = ({
  backTo,
  nextTo,
}) => {
  const router = useRouter();
  const { listing, resetListing } = useCreateListing();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const { toast } = useToast();

  const handleNextClick = async () => {
    if (isSubmitting) return; // Prevent multiple clicks

    try {
      if (
        currentPath === CurrentPath.location &&
        (!listing.address || !listing.latitude || !listing.longitude)
      ) {
        toast({
          variant: "destructive",
          title: "Please complete location details",
        });
        return;
      } else if (
        currentPath === CurrentPath.propertyType &&
        !listing.property_type
      ) {
        toast({
          variant: "destructive",
          title: "Please select a property type",
        });
        return;
      } else if (currentPath === CurrentPath.placeType && !listing.place_type) {
        toast({
          variant: "destructive",
          title: "Please select a place type",
        });
        return;
      } else if (
        currentPath === CurrentPath.guestNumber &&
        !listing.guest_number
      ) {
        toast({
          variant: "destructive",
          title: "Please complete all capacity details",
        });
        return;
        // } else if (
        //   currentPath === CurrentPath.amenities &&
        //   (!listing.amenities || listing.amenities?.length === 0)
        // ) {
        //   showCustomToast({
        //     message: "Please select at least one amenity",
        //     typeOfToast: ToastMessageType.error,
        //   });
        //   return;
      } else if (
        currentPath === CurrentPath.photos &&
        (!listing.pictures || listing.pictures?.length < 5)
      ) {
        toast({
          variant: "destructive",
          title: "Please add at least five photos",
        });
        return;
      } else if (
        currentPath === CurrentPath.propertyDescription &&
        !listing.name
      ) {
        toast({
          variant: "destructive",
          title: "Please add a property name",
        });
        return;
      } else if (currentPath === CurrentPath.price && !listing.default_price) {
        toast({
          variant: "destructive",
          title: "Please set a price",
        });
        return;
      } else if (
        currentPath === CurrentPath.agreement &&
        (!listing.security_agreement || listing.security_agreement?.length < 4)
      ) {
        toast({
          variant: "destructive",
          title: "Please check all security agreements",
        });
      } else if (currentPath === CurrentPath.receiveAddress) {
        setIsSubmitting(true); // Set loading state
        const { ...listingData } = listing;

        // Validate listing data before submission
        const { isValidated, toastMessage } = isListingValidated(listingData);
        if (!isValidated) {
          toast({
            variant: "destructive",
            title: toastMessage,
          });
          setIsSubmitting(false);
          return;
        }

        const locationDetails = {
          unit: listingData.location_details?.unit || "",
          building: listingData.location_details?.building || "",
          district: listingData.location_details?.district || "",
          city: listingData.location_details?.city || "",
          details: listingData.location_details?.details || "",
        };

        await createListing({
          ...listingData,
          location_details: locationDetails,
          status: "LISTING_COMPLETED",
        });
        resetListing();
        toast({
          title: "Success",
          description: "Listing created successfully!",
        });
      }
      if (nextTo) {
        router.replace(nextTo);
      }
    } catch (error) {
      console.error("Failed to create listing.", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-between items-center w-full mt-12">
      {backTo ? (
        <Link
          href={backTo}
          className="underline neumorphic-text-button underline-offset-2"
        >
          Back
        </Link>
      ) : (
        <div />
      )}
      {nextTo ? (
        <Button
          type="button"
          variant="default"
          className="h-[48px] md:h-[56px] rounded-full"
          onClick={handleNextClick}
          disabled={isSubmitting} // Disable button while submitting
        >
          <p>{isSubmitting ? "Creating..." : "Next"}</p>
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
};

export default CreateListingNavigation;
