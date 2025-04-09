/**
 * File Manipulation Utilities Module
 *
 * @description A utility module for working with files, particularly focusing on
 * image compression and conversion between File and Blob objects. These utilities
 * support file uploads in different contexts of the application.
 */
import Compressor from "compressorjs";

/**
 * Reads the content of a File as an ArrayBuffer.
 * @param {File} file - The File object to be read.
 * @returns {Promise<ArrayBuffer | null>} A Promise that resolves to the ArrayBuffer containing the file content,
 * or null if there was an error reading the file.
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    /**
     * Event handler for the 'load' event when the file reading is successful.
     * @param {ProgressEvent<FileReader>} event - The 'load' event.
     */
    reader.onload = (event) => {
      let arrayBuffer: string | ArrayBuffer | null;
      if (event.target) {
        arrayBuffer = event.target.result;
      } else {
        arrayBuffer = null;
      }

      resolve(arrayBuffer as ArrayBuffer);
    };

    /**
     * Event handler for the 'error' event when there is an error reading the file.
     * @param {ProgressEvent<FileReader>} event - The 'error' event.
     */
    reader.onerror = (event) => {
      resolve(null);
    };

    // Start reading the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Compresses an image using the Compressor library.
 *
 * @param {Object} options - The options object.
 * @param {File} options.image - The image file to be compressed.
 * @param {number} options.compressionQuality - The quality level for compression (0 to 1).
 * @returns {Promise<File | Blob | undefined | null>} A Promise that resolves to the compressed image file
 * if successful, or null if there was an error during compression.
 */
async function compressImage({
  image,
  compressionQuality,
}: {
  image: File;
  compressionQuality: number;
}): Promise<File | Blob | undefined | null> {
  return new Promise((resolve, reject) => {
    // Use the Compressor library to compress the image
    new Compressor(image, {
      async success(result) {
        // Resolve with the compressed image file
        resolve(result);
      },
      error(error) {
        // Resolve with null in case of an error
        resolve(null);
      },
      // Additional options for the Compressor library
      retainExif: false,
      checkOrientation: false,
      quality: compressionQuality,
    });
  });
}

/**
 * Converts a native File object to a Blob.
 *
 * @param {Object} params - The parameters object.
 * @param {File} params.file - The File object to be converted to a Blob.
 * @returns {Promise<Blob | null>} A Promise that resolves to the Blob representation of the File, or null on error.
 */
const convertNativeFileToBlob = async ({
  file,
}: {
  file: File;
}): Promise<Blob | null> => {
  try {
    // Create a Blob from the File
    const blobFromSelectedFile = new Blob([file]);
    return blobFromSelectedFile;
  } catch (error) {
    console.error("Error converting File to Blob:", error);
    return null;
  }
};

/**
 * Converts a Blob to a native JavaScript File object.
 *
 * @param {Object} params - The parameters object.
 * @param {Blob} params.blob - The Blob to be converted to a File.
 * @param {string} params.fileName - The desired name for the new File.
 * @param {string} [params.fileType] - The MIME type of the Blob, used as the type of the new File.
 * @returns {File} The File representation of the Blob.
 */
const convertBlobToNativeJSFile = ({
  blob,
  fileName,
  fileType,
}: {
  blob: Blob;
  fileName: string;
  fileType?: string;
}): File => {
  // Create a new File from the Blob
  return new File([blob], fileName, { type: fileType || blob.type });
};

export {
  compressImage,
  convertBlobToNativeJSFile,
  convertNativeFileToBlob,
  readFileAsArrayBuffer,
};
