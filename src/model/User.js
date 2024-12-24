import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    emailVerificationOtp: { type: Number },
    otpExpiration: { type: Date },
    refreshToken: { type: String },
    profileDetails: {
      avatarUrl: { type: String },
      bio: { type: String },
      socialLinks: { type: Map, of: String },
    },
    savedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    savedPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
    likedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    dislikedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    downloadedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    subscriptions: [
      { channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } },
    ],
    myChannel: [
      { channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } },
    ],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    watchHistory: [
      {
        noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reportedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hiddenChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sharedNotes: [
      {
        noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
        sharedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Utility function to generate tokens
const generateToken = (payload, secret, options) => {
  if (!secret) {
    throw new Error("JWT Secret is not defined");
  }
  return jwt.sign(payload, secret, options);
};

// Method to generate Access Token
userSchema.methods.generateAccessToken = function (additionalClaims = {}) {
  try {
    const payload = {
      _id: this._id,
      email: this.email,
      username: this.username,
      ...additionalClaims,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" };

    return generateToken(payload, secret, options);
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

// Method to generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  try {
    const payload = { _id: this._id };

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" };

    return generateToken(payload, secret, options);
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Failed to generate refresh token");
  }
};

export const User = mongoose.model("User", userSchema);
