"use client";

import React from "react";
import ClickableCard from "../../../../components/ClickableCard";
import { useCreateListing } from "../../providers/CreateListingProvider";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import { tags } from "@/data/tags";
import { Textarea } from "@/components/ui/textarea";

/**
 * Component for the seventh step of the listing creation process.
 * Allows hosts to customize their listing with a name, tags, and description.
 *
 * @component
 * @example
 * ```tsx
 * <CreateListingStepSeven />
 * ```
 *
 * @remarks
 * This component uses the `useCreateListing` hook to manage listing state and updates.
 * It provides three main sections:
 * - Name input: For setting the property's title
 * - Tags selection: For categorizing the property using predefined tags
 * - Description input: For adding a detailed property description
 *
 * @returns A form section with inputs for listing name, tags, and description
 */
const CreateListingStepSeven = () => {
  const { listing, updateListing } = useCreateListing();

  const handleSelect = (name: string) => {
    const updatedTags = listing.tags?.includes(name)
      ? listing.tags.filter((tag) => tag !== name)
      : [...(listing.tags || []), name];
    updateListing({ tags: updatedTags });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateListing({ [name]: value });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <h1 className="create-listing-page-title">Make Your Space Stand Out!</h1>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="host-page-h2-primary-blue">Name Your Place</h2>
        <Textarea
          placeholder={
            "Give your property a unique and memorable name to make it stand out!"
          }
          className="w-full rounded-2xl md:p-4"
          name="name"
          value={listing.name || ""}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="host-page-h2-primary-blue">Tag Your Place</h2>
        <div className="flex flex-wrap gap-6">
          {tags.map((tag, index) => (
            <ClickableCard
              key={index}
              className="w-fit h-[56px] px-6 py-4 rounded-[32px] select-card-tag-text flex-row gap-2"
              isClicked={listing.tags?.includes(tag.name)}
              onClick={() => handleSelect(tag.name)}
            >
              {/* Tag logo */}
              <ResponsiveIcon
                icon={tag.icon as IconType}
                sizeDesktop={24}
                color="#31456A"
              />
              {/* Tag name */}
              <p className="text-nowrap">{tag.name}</p>
            </ClickableCard>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="host-page-h2-primary-blue">
          Write a Captivating Description
        </h2>
        <Textarea
          placeholder={
            "Highlight what makes your property unique and appealing. Mention its standout features, nearby attractions, and any special touches that create an unforgettable experience. Be detailed yet concise to help guests imagine their stay."
          }
          className="w-full rounded-2xl md:p-4 min-h-[167px] flex !items-start"
          name="description"
          value={listing.description || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CreateListingStepSeven;
