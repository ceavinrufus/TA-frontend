"use client";

import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

enum ProgressPoint {
  location = "LOCATION",
  propertyType = "PROPERTY-TYPE",
  placeType = "PLACE-TYPE",
  guestNumber = "GUEST-NUMBER",
  amenities = "AMENITIES",
  photos = "PHOTOS",
  propertyDescription = "PROPERTY-DESCRIPTION",
  price = "PRICE",
  agreement = "AGREEMENT",
  receiveAddress = "RECEIVE-ADDRESS",
  verification = "VERIFICATION",
}

export enum CurrentPath {
  location = "/host/create-listing/location",
  propertyType = "/host/create-listing/property-type",
  placeType = "/host/create-listing/place-type",
  guestNumber = "/host/create-listing/guest-number",
  amenities = "/host/create-listing/amenities",
  photos = "/host/create-listing/photos",
  propertyDescription = "/host/create-listing/property-description",
  price = "/host/create-listing/price",
  agreement = "/host/create-listing/agreement",
  receiveAddress = "/host/create-listing/receive-address",
  verification = "/host/create-listing/verification",
}

/**
 * A component that displays a progress bar for the listing creation process.
 * The progress bar updates based on the current path in the application.
 *
 * @component
 * @returns {JSX.Element | null} A progress bar component or null if on verification page or invalid path
 *
 * Features:
 * - Automatically updates progress based on the current route
 * - Shows different progress percentages for different stages:
 *   - Location: 10%
 *   - Property Type: 20%
 *   - Place Type: 30%
 *   - Guest Number: 40%
 *   - Amenities: 50%
 *   - Photos: 60%
 *   - Property Description: 70%
 *   - Price: 80%
 *   - Agreement: 90%
 *   - Receive Address: 100%
 * - Returns null when on verification page or invalid path
 * - Uses NextUI Progress component with custom styling
 *
 * @example
 * ```tsx
 * <CreateListingProgressBar />
 * ```
 */
const CreateListingProgressBar = () => {
  const currentPath = usePathname();

  const [progressPoint, setProgressPoint] = useState<ProgressPoint | null>(
    null
  );

  useEffect(() => {
    const analyzeCurrentPath = (): void => {
      switch (currentPath) {
        case CurrentPath.location:
          setProgressPoint(ProgressPoint.location);
          break;
        case CurrentPath.propertyType:
          setProgressPoint(ProgressPoint.propertyType);
          break;
        case CurrentPath.placeType:
          setProgressPoint(ProgressPoint.placeType);
          break;
        case CurrentPath.guestNumber:
          setProgressPoint(ProgressPoint.guestNumber);
          break;
        case CurrentPath.amenities:
          setProgressPoint(ProgressPoint.amenities);
          break;
        case CurrentPath.photos:
          setProgressPoint(ProgressPoint.photos);
          break;
        case CurrentPath.propertyDescription:
          setProgressPoint(ProgressPoint.propertyDescription);
          break;
        case CurrentPath.price:
          setProgressPoint(ProgressPoint.price);
          break;
        case CurrentPath.agreement:
          setProgressPoint(ProgressPoint.agreement);
          break;
        case CurrentPath.verification:
          setProgressPoint(ProgressPoint.verification);
          break;
        case CurrentPath.receiveAddress:
          setProgressPoint(ProgressPoint.receiveAddress);
          break;
        default:
          setProgressPoint(null);
      }
    };

    analyzeCurrentPath();
  }, [currentPath]);

  const buildBarValue = ({
    point,
  }: {
    point: ProgressPoint | null;
  }): number => {
    if (point === ProgressPoint.location) return 10;
    if (point === ProgressPoint.propertyType) return 20;
    if (point === ProgressPoint.placeType) return 30;
    if (point === ProgressPoint.guestNumber) return 40;
    if (point === ProgressPoint.amenities) return 50;
    if (point === ProgressPoint.photos) return 60;
    if (point === ProgressPoint.propertyDescription) return 70;
    if (point === ProgressPoint.price) return 80;
    if (point === ProgressPoint.agreement) return 90;
    if (point === ProgressPoint.receiveAddress) return 100;
    return 0;
  };

  if (progressPoint === null || currentPath === CurrentPath.verification)
    return null;

  return (
    <div className="mb-[64px] w-[792px]">
      <Progress
        value={buildBarValue({ point: progressPoint })}
        className="max-w-[792px] h-[11px]"
      />
    </div>
  );
};

export default CreateListingProgressBar;
