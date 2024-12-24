import { User } from "../model/User.js";
import sendEmail from "../utils/sendEmail.js";

// Function to generate OTP and store it in the user model
export const sendVerificationOnUpdate = async (user) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    user.emailVerificationOtp = otp; // Store OTP in the user model (can be expired after a certain time)
    user.isVerified = false; // Set email verification as false
    await user.save();

    // Send the OTP to the user email
    await sendEmail(user.email, otp);

  } catch (error) {
    console.error("Error sending OTP email on update:", error.message);
    throw new Error("OTP email sending failed.");
  }
};


// Email verification route
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find user by the verification token
    const user = await User.findOne({ verificationToken: token });

    // If the user is not found, return an error message
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // If the token is valid, mark the email as verified
     user.isVerified = true;
    // Clear the verification token after successful verification
     user.emailVerificationOtp = undefined;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Email successfully verified!" });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyEmailUpdateTime = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  // Check if OTP is provided and if it matches the stored OTP
  if (!otp) {
    return res.status(400).json({
      message: "OTP is required.",
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP.",
    });
  }

  // Check if OTP has expired
  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({
      message: "OTP has expired. Please request a new one.",
    });
  }

  // OTP is valid, so update the user's email verification status
  user.isVerified = true;
  user.otp = undefined;  // Clear OTP after successful verification
  user.otpExpiry = undefined;  // Clear OTP expiry time

  // Save the updated user
  await user.save();

  res.status(200).json({
    message: "Email successfully verified.",
  });
};
