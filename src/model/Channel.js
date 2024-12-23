import mongoose from "mongoose";

// Channel Schema
const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    avatarUrl: { type: String, trim: true, match: /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i }, // URL validation
    bannerUrl: { type: String, trim: true, match: /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i }, // URL validation
    subscribers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        subscribedAt: { type: Date, default: Date.now },
        notificationsEnabled: { type: Boolean, default: true }, // Option for subscriber notifications
      },
    ],
    subscriptions: [
      {
        channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
        subscribedAt: { type: Date, default: Date.now },
      },
    ],
    uploadedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    activities: [
      {
        type: { type: String, enum: ["like", "share", "comment", "subscribe", "unsubscribe", "follow"], required: true },
        note: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }, // Added to track channel-related activities
        timestamp: { type: Date, default: Date.now },
      },
    ],
    stats: {
      totalNotes: { type: Number, default: 0 },
      totalLikes: { type: Number, default: 0 },
      totalShares: { type: Number, default: 0 },
      totalSubscribers: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` timestamps
);

// Indexing for performance
channelSchema.index({ owner: 1 });
channelSchema.index({ "subscribers.user": 1 });
channelSchema.index({ "subscriptions.channel": 1 });

export default mongoose.model("Channel", channelSchema);
