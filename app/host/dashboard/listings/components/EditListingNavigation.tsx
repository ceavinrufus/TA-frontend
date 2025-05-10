"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";

/**
 * EditListingNavigation component provides a floating navigation menu for editing a listing.
 * It displays various sections of the listing form with their current status/values.
 *
 * The component uses URL search parameters to track the current editing step and
 * updates the URL when navigating between different sections.
 *
 * @component
 * A responsive collapsible navigation menu with different listing sections
 *
 * Features:
 * - Displays current section status with visual indicators
 * - Shows current values/descriptions for each section
 * - Handles navigation between different editing steps
 * - Responsive icons with dynamic colors based on selection
 * - Collapsible on mobile for better UX
 * - Floating positioning
 */
export default function EditListingNavigation() {
  const router = useRouter();
  const params = useSearchParams();
  const currentStep = params.get("step") || "location";
  const { listing } = useEditListing();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const amenitiesCount = listing.amenities?.length || 0;

  const menuItems = [
    {
      icon: "icon-map" as IconType,
      name: "Location",
      description: listing.address || "",
      step: "location",
    },
    {
      icon: "icon-home" as IconType,
      name: "Property Type",
      description: [
        listing.property_type ? listing.property_type : null,
        listing.place_type ? listing.place_type : null,
      ]
        .filter(Boolean)
        .join(" · "),
      step: "property-type",
    },
    {
      icon: "icon-tv" as IconType,
      name: "Amenities",
      description: `${amenitiesCount || 0} selected`,
      step: "amenities",
    },
    {
      icon: "icon-photo" as IconType,
      name: "Photos",
      description: `${listing.pictures?.length || 0} photo${
        listing.pictures?.length !== 1 ? "s" : ""
      }`,
      step: "photos",
    },
    {
      icon: "icon-menu" as IconType,
      name: "Description",
      description: [
        listing.name ? listing.name : null,
        listing.description ? listing.description : null,
      ]
        .filter(Boolean)
        .join(" · "),
      step: "description",
    },
    {
      icon: "icon-card" as IconType,
      name: "Price",
      description: listing.default_price
        ? `${listing.default_price} ETH daily base price`
        : "",
      step: "price",
    },
    {
      icon: "icon-list" as IconType,
      name: "House rule",
      description: [
        listing.earliest_check_in_time
          ? `Check-in after ${listing.earliest_check_in_time}`
          : null,
        listing.check_out_time
          ? `Check-out before ${listing.check_out_time}`
          : null,
        listing.guest_number
          ? `Maximum ${listing.guest_number} guest${
              listing.guest_number !== 1 ? "s" : ""
            }`
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
      step: "house-rule",
    },
    {
      icon: "icon-options" as IconType,
      name: "Booking setting",
      description: [
        listing.is_instant_booking ? "Instant booking" : null,
        !listing.is_no_free_cancellation
          ? "Free cancellation"
          : "No free cancellation",
      ]
        .filter(Boolean)
        .join(" · "),
      step: "booking-setting",
    },
    {
      icon: "icon-calendar" as IconType,
      name: "Availability setting",
      description: [
        listing.booking_window
          ? `${listing.booking_window} months availability window`
          : null,
        (listing.restricted_check_in?.length ?? 0) > 0
          ? "Check-in date restriction"
          : null,
        (listing.restricted_check_out?.length ?? 0) > 0
          ? "Check-out date restriction"
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
      step: "availability-setting",
    },
  ];

  const handleNavigation = (step: string) => {
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("step", step);
    router.push(`?${searchParams.toString()}`);

    // Close the menu on mobile after selection
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Find current menu item
  const currentMenuItem = menuItems.find((item) => item.step === currentStep);

  return (
    <div className="lg:relative">
      <div
        className={`${
          isMobile ? "fixed" : ""
        } bottom-8 left-4 right-4  lg:bottom-auto lg:top-0 lg:left-0 lg:w-[335px] z-10`}
      >
        <Collapsible
          open={!isMobile || isOpen}
          onOpenChange={setIsOpen}
          className="rounded-2xl shadow-neumorphic-card-up bg-white overflow-hidden"
        >
          {isMobile && (
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-2xl">
              <div className="flex items-center gap-4">
                {currentMenuItem && (
                  <>
                    <div className="flex items-center justify-center size-8 rounded-full bg-blue-950">
                      <ResponsiveIcon
                        icon={currentMenuItem.icon}
                        sizeMobile={14}
                        sizeDesktop={16}
                        color="#F6F6F6"
                      />
                    </div>
                    <div className="font-semibold">{currentMenuItem.name}</div>
                  </>
                )}
              </div>
              <div className="flex items-center">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </div>
            </CollapsibleTrigger>
          )}

          <CollapsibleContent className="lg:block">
            <div className="py-6 px-4">
              <ul className="flex flex-col lg:gap-6 max-h-[75vh] lg:max-h-screen overflow-y-auto">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className={`flex cursor-pointer rounded-[8px] p-4 gap-4 ${
                      currentStep === item.step ? "bg-[#D2DFFB]" : ""
                    }`}
                    onClick={() => handleNavigation(item.step)}
                  >
                    <div
                      className={`flex items-center justify-center size-[28px] md:size-[32px] rounded-full ${
                        currentStep === item.step
                          ? "bg-blue-950"
                          : "bg-[#D2DFFB]"
                      }`}
                    >
                      <ResponsiveIcon
                        icon={item.icon || "icon-person"}
                        sizeDesktop={16}
                        sizeMobile={14}
                        color={
                          currentStep === item.step ? "#F6F6F6" : "#31456A"
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-sm md:text-base">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
