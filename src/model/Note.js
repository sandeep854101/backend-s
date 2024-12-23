// models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true }, // URL or text
  tags: [{ type: String }],
  uploadDate: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  sharedCount: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false },
  relatedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true }, // Channel reference
});

export default mongoose.model("Note", noteSchema);
