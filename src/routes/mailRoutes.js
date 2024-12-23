import express from "express";
import { verifyEmail,verifyEmailUpdateTime } from "../controller/mailController.js";

const emailRouter = express.Router();

// Route for verifying email
emailRouter.get("/signup-email", verifyEmail);
emailRouter.get("/update-email", verifyEmailUpdateTime);

export default emailRouter;
