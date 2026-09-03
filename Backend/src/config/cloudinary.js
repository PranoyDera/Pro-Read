import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadBufferToCloudinary = (fileBuffer, folder = "stories") => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("No file buffer provided for Cloudinary upload"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const uploadBase64ToCloudinary = async (base64String, folder = "profiles") => {
  if (!base64String) return null;
  const result = await cloudinary.uploader.upload(base64String, {
    folder,
    resource_type: "auto",
  });
  return result;
};

export default cloudinary;
