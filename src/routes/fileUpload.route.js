import express from 'express'
import multer from 'multer';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
const fileUploadRouter = express.Router();

const upload = multer({ 
    dest: "uploads/", 
    storage: multer.diskStorage({}) 
});

// File upload API
fileUploadRouter.post("/", upload.single("file"), async (req, res) => {
    try {   
        const localFilePath = req.file.path; // Path to the file saved locally
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        if (cloudinaryResponse) {
            res.json({
                message: "File uploaded successfully!",
                cloudinary_url: cloudinaryResponse.secure_url,
            });
        } else {
            res.status(500).json({ message: "File upload failed!" });
        }
    } catch (error) {
        console.error("Error in upload API: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default fileUploadRouter;
