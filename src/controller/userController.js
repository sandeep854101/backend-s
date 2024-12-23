import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { User } from '../model/User.js';
import sendEmail from '../utils/sendEmail.js';

// Generate Access and Refresh Tokens
export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Default values for profile
    const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";
    const defaultBio = "This is my bio";
    const defaultSocialLinks = {
      linkedin: "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
    };

    // Validate username
    if (!username || username.trim().length < 3 || username.trim().length > 50) {
      return res.status(400).json({ message: "Username must be between 3 and 50 characters" });
    }

    // Validate email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate password
    if (!password || password.length < 8 || password.length > 100) {
      return res.status(400).json({ message: "Password must be between 8 and 100 characters long" });
    }

    const passwordCriteria = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])/;
    if (!passwordCriteria.test(password)) {
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase, digit, and special character",
      });
    }

    // Check MongoDB connection status
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB connection not established");
      return res.status(500).json({ error: "Database connection error. Please try again later." });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Create new user object
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      emailVerificationOtp: otp,
      otpExpiration,
      profileDetails: {
        avatarUrl: defaultAvatarUrl,
        bio: defaultBio,
        socialLinks: defaultSocialLinks,
      },
    });

    // Save user to database
    await user.save();

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    // Send response with cookies and success message
    res.status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ message: "User registered successfully. Please verify your email with the OTP sent." });

    // Send email with OTP for verification
    const emailContent = `
      <h1>Email Verification</h1>
      <p>Hi ${username},</p>
      <p>Thank you for registering. Use the OTP below to verify your email:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 10 minutes. If you did not register, ignore this email.</p>
    `;

    await sendEmail(email, "Verify Your Email", emailContent);
  } catch (err) {
    console.error("Error during user registration:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    res.status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        message: "Login successful",
        user: { id: user._id, username: user.username, email: user.email },
        tokens: { accessToken, refreshToken }
      });
  } catch (err) {
    console.error("Error during user login:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch Recent Registered User
export const recentRegisteredUser = async (req, res) => {
  try {
    const recentUser = await User.findOne().sort({ createdAt: -1 }).exec();
    if (!recentUser) {
      return res.status(404).json({ message: "No recent user found" });
    }
    res.status(200).json(recentUser);
  } catch (error) {
    console.error("Error fetching recent user:", error);
    res.status(500).json({ error: "Error fetching recent user" });
  }
};



// edit profile 

export const editProfile = async (req, res) => {
  
  try {
    const userId = req.user._id;
    
    const { username, email, avatarUrl, bio, socialLinks, otp } = req.body;

    // Validate input fields
    if (username && (username.length < 3 || username.length > 30)) {
      return res.status(400).json({
        message: "Username must be between 3 and 30 characters.",
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Invalid email format.",
      });
    }

    if (bio && bio.length > 200) {
      return res.status(400).json({
        message: "Bio cannot exceed 200 characters.",
      });
    }

    if (socialLinks) {
      if (typeof socialLinks !== "object" || Array.isArray(socialLinks)) {
        return res.status(400).json({
          message: "Social links must be a valid object.",
        });
      }
      for (const [key, value] of Object.entries(socialLinks)) {
        if (!value.startsWith("http")) {
          return res.status(400).json({
            message: `Invalid URL for ${key}: ${value}`,
          });
        }
      }
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Check if email is updated
    if (email && email !== user.email) {
      // Check if the new email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email is already in use.",
        });
      }

      // Generate OTP for email verification
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP and its expiration time in the user schema
      user.otp = otpCode;
      user.otpExpiry = Date.now() + 3600000; // OTP expires in 1 hour
      user.isVerified = false;  // Set the user email as unverified

      // Save the updated user with OTP details
      await user.save();

      // Send OTP to the new email
      const otpMessage = `
        <p>Dear ${user.username},</p>
        <p>Your OTP for email verification is <strong>${otpCode}</strong>.</p>
        <p>This OTP will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;
      await sendEmail(email, "Verify Your Email Address", otpMessage);

      return res.status(200).json({
        message: "Profile updated successfully. Please verify your new email with the OTP sent.",
      });
    }

    // Update other fields if provided (excluding email)
    if (username) user.username = username;
    if (avatarUrl) user.profileDetails.avatarUrl = avatarUrl;
    if (bio) user.profileDetails.bio = bio;
    if (socialLinks) user.profileDetails.socialLinks = socialLinks;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};



// user details based on their id
export const userDetails = async (req, res) => {
  const { id } = req.params;
console.log(id)
  try {

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User details ",
      user
    });
  } catch (error) {
    console.error("Error user details:", error);
    res.status(500).json({ message: "Unable to getting user details. Please try again later." });
  }
};

// delete profile
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a verification token with expiration (e.g., 1 hour)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = Date.now() + 3600000; // 1 hour expiration

    // Save the verification token and expiration to the user
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationExpiry;
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}/verify-delete?token=${verificationToken}`;
    await sendEmail(
      user.email,
      "Verify Your Account Deletion",
      `<p>Please confirm the deletion of your account by clicking the link below:</p>
       <a href="${verificationUrl}">${verificationUrl}</a>`
    );

    res.status(200).json({
      message: "Verification email sent. Please verify your email to delete your account.",
    });
  } catch (err) {
    console.error("Error deleting profile:", err.message);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};

// Additional route to handle the email verification for deletion
export const verifyDeleteAccount = async (req, res) => {
  try {
    const { token } = req.query;

    // Find the user by the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token." });
    }

    // Check if the token is expired
    if (Date.now() > user.verificationTokenExpiry) {
      return res.status(400).json({ message: "Verification token has expired." });
    }

    // Delete the user's account
    await User.findByIdAndDelete(user.id);

    // Send confirmation email about account deletion
    await sendEmail(
      user.email,
      "Account Deleted",
      "<p>Your account has been successfully deleted.</p>"
    );

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Error verifying deletion:", err.message);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};

// logout profile
export const logout = async (req, res) => {
  try {
    // Clear the token from the client
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
      sameSite: "strict", // Prevent CSRF attacks
    });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Error during logout:", err.message);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};
