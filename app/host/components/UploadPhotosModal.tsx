"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import IconClose from "@/components/icons/IconClose";
import IconTrash from "@/components/icons/IconTrash";
import IconAdd from "@/components/icons/IconAdd";
import PhotoPreview from "./PhotoPreview";
import { Button } from "@/components/ui/button";

interface UploadPhotosModalProps {
  photos: Blob[];
  setPhotos: React.Dispatch<React.SetStateAction<Blob[]>>;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onUpload: () => void;
}

/**
 * UploadPhotosModal component.
 *
 * This component renders a modal for uploading photos. It displays a grid of photo previews,
 * each with a delete button, and provides options to cancel or upload the selected photos.
 *
 * @component
 * @param {UploadPhotosModalProps} props - The props for the UploadPhotosModal component.
 * @param {Blob[]} props.photos - An array of photo blobs to be displayed in the modal.
 * @param {React.Dispatch<React.SetStateAction<Blob[]>>} props.setPhotos - Function to update the photos array.
 * @param {boolean} [props.isModalOpen=false] - Boolean indicating whether the modal is open.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsModalOpen - Function to update the modal open state.
 * @param {() => void} props.onUpload - Callback function to be called when the upload button is clicked.
 *
 * The rendered UploadPhotosModal component.
 */
const UploadPhotosModal: React.FC<UploadPhotosModalProps> = ({
  photos,
  setPhotos,
  isModalOpen = false,
  setIsModalOpen,
  onUpload,
}) => {
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos((prevPhotos) => [...prevPhotos, ...(files as Blob[])]);

    // Reset the file input value to allow re-uploading the same files
    event.target.value = "";
  };

  const closeModal = () => {
    setPhotos([]);
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl p-4 sm:p-6 rounded-xl z-[99999]">
        <DialogHeader className="flex flex-row items-center justify-between p-0 mb-4">
          <Button
            variant="outline"
            className="w-[32px] h-[32px] rounded-full"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <IconClose size={16} />
          </Button>
          <DialogTitle className="hotel-gallery-modal-title text-center flex-grow">
            Upload photos
          </DialogTitle>
          <Button
            variant="outline"
            className="w-[32px] h-[32px] rounded-full"
            onClick={() => {
              document.getElementById("photo-upload-modal")?.click();
            }}
            aria-label="Add photo"
          >
            <IconAdd size={16} />
          </Button>
          <input
            type="file"
            id="photo-upload-modal"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </DialogHeader>

        <div className="w-full grid grid-cols-3 gap-[10px] max-h-[400px] overflow-y-auto">
          {photos.map((photo, index) => (
            <PhotoPreview
              key={index}
              photo={photo}
              alt={`Uploaded photo ${index + 1}`}
            >
              <div className="absolute top-2 right-2 z-20">
                <Button
                  variant="outline"
                  className="w-[40px] h-[40px] rounded-full"
                  onClick={() => {
                    setPhotos((prevPhotos) =>
                      prevPhotos.filter((_, i) => i !== index)
                    );
                  }}
                  aria-label="Remove photo"
                >
                  <IconTrash size={24} />
                </Button>
              </div>
            </PhotoPreview>
          ))}
        </div>

        <DialogFooter className="flex flex-row justify-between pt-4">
          <button
            onClick={closeModal}
            className="underline text-xs sm:text-sm md:text-base hover:underline hover:underline-offset-4 underline-offset-2"
          >
            Cancel
          </button>
          <Button
            type="button"
            variant="default"
            className="h-[48px] md:h-[56px] rounded-full"
            onClick={() => {
              setPhotos([]);
              setIsModalOpen(false);
              onUpload();
            }}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPhotosModal;
