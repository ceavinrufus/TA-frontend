"use client";

import React from "react";
import ClickableCard from "../../components/ClickableCard";
import { useCreateListing } from "../../providers/CreateListingProvider";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * CreateListingStepNine component handles the security agreement step in the listing creation process.
 * It displays a list of security agreements that hosts need to confirm regarding their property.
 *
 * @component
 * @returns A form section with selectable security agreement cards
 *
 * @example
 * ```tsx
 * <CreateListingStepNine />
 * ```
 *
 * @remarks
 * The component uses:
 * - ClickableCard component for each agreement item
 * - NeumorphicCheckboxButton for selection indication
 * - useCreateListing hook for managing listing state
 *
 * Each security agreement includes:
 * - No Surveillance Devices confirmation
 * - Safe Environment verification
 * - Accurate Listing Information agreement
 * - No Dangerous Substances confirmation
 *
 * The selection state is managed through the listing.security_agreement array,
 * which stores the titles of selected agreements.
 */
const CreateListingStepNine = () => {
  const agreements = [
    {
      title: "No Surveillance Devices",
      description:
        "I confirm that there are no hidden or visible surveillance devices in private areas, such as bedrooms or bathrooms.",
    },
    {
      title: "Safe Environment",
      description:
        "I confirm that my property is free from any known hazards, such as exposed wires, unsafe furniture, or structural issues.",
    },
    {
      title: "Accurate Listing Information",
      description:
        "I confirm that I will respect my guests' privacy and only enter the property during their stay if absolutely necessary, with prior notice and consent.",
    },
    {
      title: "No Dangerous Substances",
      description:
        "I confirm that there are no dangerous or illegal substances stored within the property.",
    },
  ];

  const { listing, updateListing } = useCreateListing();

  const handleSelect = (index: number) => {
    const newAgreements = [...(listing.security_agreement || [])];
    if (newAgreements.includes(agreements[index].title)) {
      // Deselect agreement
      newAgreements.splice(newAgreements.indexOf(agreements[index].title), 1);
    } else {
      // Select agreement
      newAgreements.push(agreements[index].title);
    }
    updateListing({ security_agreement: newAgreements });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[32px]">
      <div className="space-y-2">
        <h1 className="create-listing-page-title">Security Agreement</h1>
        <p className="create-listing-page-subtitle">
          To ensure the safety and comfort of your guests, please confirm the
          following:
        </p>
      </div>
      {agreements.map((agreement, index) => (
        <ClickableCard
          key={index}
          className="w-full h-[144px] rounded-[32px] justify-between px-12 py-6 flex-row gap-6"
          isClicked={
            listing.security_agreement?.includes(agreement.title) ?? false
          }
          onClick={() => handleSelect(index)}
        >
          <div className="flex flex-col gap-2 h-full justify-center">
            <h2 className="host-page-h2-primary-blue">{agreement.title}</h2>
            <p>{agreement.description}</p>
          </div>
          <Checkbox
            checked={
              listing.security_agreement?.includes(agreement.title) ?? false
            }
            onClick={() => handleSelect(index)}
          />
        </ClickableCard>
      ))}
    </div>
  );
};

export default CreateListingStepNine;
