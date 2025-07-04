"use client";

import React, { useEffect, useState } from "react";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import UploadPhotosModal from "@/app/host/components/UploadPhotosModal";
import PhotoPreview from "@/app/host/components/PhotoPreview";
import IconTrash from "@/components/icons/IconTrash";
import { Badge } from "@/components/ui/badge";
import ClickableCard from "../../../../components/ClickableCard";
import {
  getFileBaseNameFromUploadContext,
  UploadContext,
} from "@/lib/file-upload/file-upload-utils";
import { useCreateListing } from "../../providers/CreateListingProvider";
import { uploadFileToAmazonS3Bucket } from "../../../../api/s3.actions";
import {
  compressImage,
  readFileAsArrayBuffer,
} from "@/lib/file-manip/file-manip-utils";
import path from "path";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

/**
 * Component for the sixth step of the listing creation process, handling photo uploads.
 *
 * @component
 * @description Allows users to upload and manage photos for their listing. Features include:
 * - Upload multiple photos
 * - Display uploaded photos in a grid layout
 * - Set cover image
 * - Delete uploaded photos
 * - Compress images before upload
 * - Upload photos to AWS S3 bucket
 *
 * @example
 * ```tsx
 * <CreateListingStepSix />
 * ```
 *
 * @remarks
 * - Requires at least 2 photos to be uploaded
 * - First photo is automatically set as cover image
 * - Photos are compressed before upload for optimization
 * - Integrates with AWS S3 for photo storage
 * - Uses modal for photo preview and confirmation
 *
 * @requires useCreateListing - Custom hook for managing listing state
 * @requires AWS.S3 - AWS SDK for S3 operations
 * @requires path - Node.js path module
 * @requires crypto - For generating unique file names
 */
const CreateListingStepSix = () => {
  const { listing, updateListing } = useCreateListing();
  const [photos, setPhotos] = useState<Blob[]>([]); // Store preview photo in modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Loading state
  const [uploadProgress, setUploadProgress] = useState(0); // Progress state

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos((prevPhotos) => [...prevPhotos, ...(files as Blob[])]);
    event.target.value = ""; // Reset the file input value
  };

  const { toast } = useToast();

  const uploadPhotosToS3 = async () => {
    setIsUploading(true); // Start loading
    setUploadProgress(0); // Reset progress
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        let fileToUse = photo as File;

        const compressedFile = await compressImage({
          image: fileToUse,
          compressionQuality: 0.3,
        });
        if (compressedFile && compressedFile instanceof File) {
          fileToUse = compressedFile;
        }

        // Read the file as an ArrayBuffer
        const fileBuffer = await readFileAsArrayBuffer(fileToUse);

        // Generate a unique file name for S3
        const { ext: fileExtension } = path.parse(fileToUse.name);
        const randomString = crypto.randomUUID();
        const fileNameToUse = `photos/${getFileBaseNameFromUploadContext(
          UploadContext.listingImage
        )}/${randomString}${fileExtension}`;

        // Set up S3 PutObjectRequest data
        const putObjectRequestData: AWS.S3.PutObjectRequest = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: fileNameToUse,
          ContentType: fileToUse.type,
          Body: new Uint8Array(fileBuffer!),
        };

        const url = await uploadFileToAmazonS3Bucket({
          putObjectRequestData,
        });
        if (url) uploadedUrls.push(url);

        // Update progress
        setUploadProgress(Math.round(((i + 1) / photos.length) * 100));
      }

      updateListing({
        pictures: listing.pictures
          ? [...listing.pictures, ...uploadedUrls]
          : [...uploadedUrls],
      });
      toast({
        title: "Photos uploaded successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast({
        title: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPhotos([]); // Clear modal photos after uploading
      setIsUploading(false); // End loading
    }
  };

  useEffect(() => {
    setIsModalOpen(photos.length > 0);
  }, [photos]);

  return (
    <div className="flex flex-col items-start justify-start gap-[64px]">
      <div className="space-y-2">
        <h1 className="text-3xl">
          Please upload at least 2 photos of your place.
        </h1>
        <p className="create-listing-page-subtitle">
          You can tag the photos with the corresponding room labels for easier
          categorization. Later, you can add more photos or make changes.
        </p>
      </div>
      {/* Photo upload section */}
      {(listing.pictures?.length ?? 0) > 0 ? (
        <div className="w-full grid grid-cols-2 gap-6">
          {/* Cover Image */}
          <PhotoPreview
            photo={listing.pictures?.[0] ?? ""}
            className="h-[350px] w-full col-span-2"
            alt={`Uploaded photo 1`}
          >
            <div className="absolute top-4 left-3 z-20">
              <Badge className="px-3 py-2 justify-center items-center flex gap-2 rounded-2xl badge-content-text w-[130px] hover:bg-background-white bg-background-white">
                Cover Image
              </Badge>
            </div>
            <div className="absolute top-2 right-2 z-20">
              <Button
                variant="outline"
                className="flex w-[40px] h-[40px] rounded-full"
                onClick={() =>
                  updateListing({
                    pictures: listing.pictures?.filter((_, i) => i !== 0),
                  })
                }
                aria-label="Delete photo"
                type="button"
              >
                <IconTrash size={24} />
              </Button>
            </div>
          </PhotoPreview>
          {listing.pictures?.slice(1).map((url, index) => (
            <PhotoPreview
              key={index}
              photo={url}
              className="h-[240px]"
              alt={`Uploaded photo ${index + 2}`}
            >
              <div className="absolute top-2 right-2 z-20">
                <Button
                  variant="outline"
                  className="flex w-[40px] h-[40px] rounded-full"
                  onClick={() =>
                    updateListing({
                      pictures: listing.pictures?.filter(
                        (_, i) => i !== index + 1
                      ),
                    })
                  }
                  aria-label="Delete photo"
                  type="button"
                >
                  <IconTrash size={24} />
                </Button>
              </div>
            </PhotoPreview>
          ))}
          {/* Add more photo */}
          <ClickableCard
            className="h-[240px] p-20 gap-4 w-full"
            onClick={() => document.getElementById("photo-upload")?.click()}
          >
            <ResponsiveIcon icon="icon-add" sizeDesktop={24} />

            <p className="text-xs sm:text-sm md:text-base hover:underline hover:underline-offset-4">
              Add photo here
            </p>
          </ClickableCard>
        </div>
      ) : (
        <div className="shadow-neumorphic-card-down h-[405px] w-full rounded-2xl p-20 flex flex-col items-center gap-16">
          {/* Image Icon */}
          <ResponsiveIcon icon="icon-photo" color="#1A1A1A" sizeDesktop={80} />

          <Button
            type="button"
            variant="default"
            className="h-[48px] md:h-[56px] rounded-full"
            onClick={() => document.getElementById("photo-upload")?.click()}
            disabled={isUploading} // Disable button during upload
          >
            <p>
              {isUploading
                ? `Uploading... ${uploadProgress}%`
                : "Add photo here"}
            </p>
          </Button>
        </div>
      )}
      {/* Hidden file input */}
      <input
        aria-label="photo-upload"
        type="file"
        id="photo-upload"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Display uploaded photos */}
      <UploadPhotosModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        photos={photos}
        setPhotos={setPhotos}
        onUpload={uploadPhotosToS3}
      />
      {/* {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )} */}
    </div>
  );
};

export default CreateListingStepSix;
