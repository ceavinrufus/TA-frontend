"use client";

import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

/**
 * EditListingNavigation component provides a navigation menu for editing a listing.
 * It displays various sections of the listing form with their current status/values.
 *
 * The component uses URL search parameters to track the current editing step and
 * updates the URL when navigating between different sections.
 *
 * @component
 * @returns {JSX.Element} A navigation menu with different listing sections
 *
 * Features:
 * - Displays current section status with visual indicators
 * - Shows current values/descriptions for each section
 * - Handles navigation between different editing steps
 * - Responsive icons with dynamic colors based on selection
 *
 * Navigation sections include:
 * - Location
 * - Property Type
 * - Amenities
 * - Photos
 * - Description
 * - Price
 * - House Rules
 * - Booking Settings
 * - Availability Settings
 */
const EditListingNavigation = () => {
  const router = useRouter();
  const params = useSearchParams();
  const currentStep = params.get("step") || "location";
  const { listing } = useEditListing();

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
    // {
    //   icon: "icon-accessibility" as IconType,
    //   name: "Accessibility feature?",
    //   description: "",
    //   step: "accessibility",
    // },
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
    // {
    //   icon: "icon-person" as IconType,
    //   name: "Host Info",
    //   description: "",
    //   step: "host-info",
    // },
  ];

  const handleNavigation = (step: string) => {
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("step", step);
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className="w-[335px] shadow-neumorphic-card-up py-6 px-4 rounded-2xl h-fit flex-shrink-0">
      <ul className="flex flex-col gap-6">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`flex cursor-pointer rounded-[8px] p-4 gap-4 ${
              currentStep === item.step ? "bg-[#E3E8F2]" : ""
            }`}
            onClick={() => handleNavigation(item.step)}
          >
            <div
              className={`p-1 h-fit rounded-full ${
                currentStep === item.step ? "bg-blue-950" : "bg-[#E3E8F2]"
              }`}
            >
              <ResponsiveIcon
                icon={item.icon || "icon-person"}
                sizeDesktop={16}
                color={currentStep === item.step ? "#F6F6F6" : "#31456A"}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{item.name}</p>
              {item.description && (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditListingNavigation;
