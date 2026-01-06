import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

/**
 * Upload a file buffer to Cloudinary using streams
 * @param {Buffer} fileBuffer - multer file buffer
 * @param {string} folder - cloudinary folder name
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadBufferToCloudinary = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
