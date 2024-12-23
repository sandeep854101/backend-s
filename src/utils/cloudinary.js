import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Function to upload files to Cloudinary in a specific folder
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary inside 'StudyPulse' folder
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // For non-image files
            folder: "StudyPulse",
        });
        

        // File has been uploaded successfully
        // console.log("File uploaded to Cloudinary: ", response);
        
        if (response.secure_url) {
            fs.unlinkSync(localFilePath); // Delete only if upload is successful
        }
         // Remove local file after successful upload
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove local file if upload failed
        console.error("Error uploading to Cloudinary: ", error);
        return null;
    }
};

export { uploadOnCloudinary };
