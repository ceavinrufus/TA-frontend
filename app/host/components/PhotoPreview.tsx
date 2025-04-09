import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useMemo } from "react";

interface PhotoPreviewProps {
  photo: Blob | string; // Accept both Blob and string types.
  alt: string;
  className?: string;
  photoClassName?: string;
  children?: React.ReactNode;
}

/**
 * PhotoPreview component displays a photo with optional children elements.
 *
 * @param {Object} props - The properties object.
 * @param {Blob|string} props.photo - The photo Blob or URL string to be displayed.
 * @param {string} props.alt - The alt text for the photo.
 * @param {string} [props.className] - Additional class names for the container div.
 * @param {string} [props.photoClassName] - Additional class names for the photo.
 * @param {React.ReactNode} [props.children] - Optional children elements to be rendered inside the container.
 *
 * @returns {JSX.Element} The rendered PhotoPreview component.
 */
const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photo,
  alt,
  className,
  photoClassName,
  children,
}) => {
  // Memoize the photo URL to avoid unnecessary re-computation.
  const photoSrc = useMemo(() => {
    return typeof photo === "string" ? photo : URL.createObjectURL(photo);
  }, [photo]);

  return (
    <div
      className={cn(
        "relative h-[279px] w-full rounded-2xl overflow-hidden shrink-0",
        className,
      )}
    >
      {children}
      <Image
        src={photoSrc} // Use the computed photo source.
        alt={alt}
        className={cn("object-cover", photoClassName)}
        layout="fill"
      />
    </div>
  );
};

export default PhotoPreview;
