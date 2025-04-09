"use server";

import AWS from "aws-sdk";

// Configure AWS SDK with your credentials and region
AWS.config.update({
  // AWS S3 Configs
  accessKeyId: process.env.APP_SECRET_AWS_ACCESS_KEY!,
  secretAccessKey: process.env.APP_SECRET_AWS_SECRET_KEY!,
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
});

// Create an instance of the Amazon S3 service
const s3Client = new AWS.S3();

/**
 * Uploads a file to an Amazon S3 bucket, optionally compressing it before uploading.
 *
 * @param {Object} options - The options object.
 * @param {File | null} options.file - The file to be uploaded. If null, the function returns early.
 * @param {UploadContext} options.uploadContext - The context for the upload.
 * @returns {Promise<string | undefined | null>} A Promise that resolves to the S3 object URL if successful,
 * undefined if no file is provided, or null if there was an error during the upload.
 */
export async function uploadFileToAmazonS3Bucket({
  putObjectRequestData,
}: {
  putObjectRequestData: AWS.S3.PutObjectRequest;
}): Promise<string | undefined | null> {
  // Return early if no file is provided
  try {
    // Upload the file to S3
    const uploadedData = await s3Client.upload(putObjectRequestData).promise();
    return uploadedData.Location;
  } catch (error) {
    throw new Error(`Error uploading file to Amazon S3: ${error}`);
  }
}
