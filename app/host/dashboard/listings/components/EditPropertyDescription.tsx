"use client";

import React from "react";
import ResponsiveIcon, {
  IconType,
} from "@/components/icons/ResponsiveIconBuilder";
import ClickableCard from "@/components/ClickableCard";
import { useEditListing } from "@/app/host/providers/EditListingProvider";
import { Textarea } from "@/components/ui/textarea";
import { tags } from "@/data/tags";

/**
 * EditPropertyDescription component allows hosts to edit their property's title, tags, and description.
 *
 * @component
 * @returns {JSX.Element} A form section containing inputs for property name, tags, and description
 *
 * @example
 * ```tsx
 * <EditPropertyDescription />
 * ```
 *
 * The component uses the useEditListing hook to:
 * - Display and update the property name
 * - Allow selection of predefined tags
 * - Provide a text area for detailed property description
 *
 * @remarks
 * The component includes three main sections:
 * 1. Property name input using NeumorphicTextarea
 * 2. Tag selection using ClickableCard components
 * 3. Property description input using NeumorphicTextarea
 *
 * All changes are managed through the useEditListing hook's updateListing function.
 */
const EditPropertyDescription = () => {
  const { listing, updateListing } = useEditListing();

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
      <h1 className="edit-listing-page-title">Title and Description</h1>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="edit-listing-form-input-label">Name Your Place</h2>
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
        <h2 className="edit-listing-form-input-label">Tag Your Place</h2>
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
        <h2 className="edit-listing-form-input-label">
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

export default EditPropertyDescription;
