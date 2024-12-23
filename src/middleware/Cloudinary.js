


import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log(result);
    return result;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error.message);
    throw new Error("File upload failed");
  }
};

export { uploadFile };
