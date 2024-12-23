import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  visibility: { type: String, enum: ["public", "private"], default: "public" },
});

export default mongoose.model("Playlist", playlistSchema);
