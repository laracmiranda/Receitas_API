import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export async function uploadImageToCloudinary(fileBuffer, folder = "recipes") {
  if (!fileBuffer) return null;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}
