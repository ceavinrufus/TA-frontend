import { PICKED_IMAGE_SIZE_LIMIT, PICKED_VIDEO_SIZE_LIMIT } from "@/constants";

export enum UploadContext {
  listingImage,
  disputeEvidence,
}

/**
 * Checks whether a picked file is within the accepted size limit based on its type (image or video).
 *
 * @param {Object} options - The options object.
 * @param {File} options.file - The picked file to be checked.
 * @returns {boolean | undefined} Returns true if the file size is within the accepted limit,
 * false if it exceeds the limit, and undefined if the file is not provided.
 */
export function fileSizeIsWithinAcceptedRange({
  file,
}: {
  file: File;
}): boolean | undefined {
  // Check if a file is provided
  if (!file) {
    return;
  }

  // Calculate the size of the file in bytes and megabytes
  const sizeInBytes = file.size;
  const sizeInMbs = sizeInBytes / 1024 ** 2;

  // Determine the file type (image or video)
  const fileType = file.type.split("/")[0];

  // Check the size limit based on file type
  if (fileType === "image") {
    // Check against the image size limit
    return sizeInMbs <= PICKED_IMAGE_SIZE_LIMIT;
  } else if (fileType === "video") {
    // Check against the video size limit
    return sizeInMbs <= PICKED_VIDEO_SIZE_LIMIT;
  }

  // Default case: unsupported file type
  return false;
}

export function getFileBaseNameFromUploadContext(
  uploadContext: UploadContext
): string {
  switch (uploadContext) {
    case UploadContext.listingImage:
      return "listings";
    case UploadContext.disputeEvidence:
      return "dispute-evidences";
    default:
      return "listings";
  }
}
