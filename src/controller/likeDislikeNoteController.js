import LikeDislikeNote from "../model/LikeDislikeNote.js";
import Note from "../model/Note.js"

// Like a note
export const likeNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    // Validate note existence
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Check if user already disliked
    const existingDislike = await LikeDislikeNote.findOne({
      note: noteId,
      user: userId,
      action: "dislike",
    });
    if (existingDislike) {
      await existingDislike.deleteOne();
      note.dislikes = Math.max(0, note.dislikes - 1);
    }

    // Check if user already liked
    const existingLike = await LikeDislikeNote.findOne({
      note: noteId,
      user: userId,
      action: "like",
    });
    if (existingLike) return res.status(400).json({ message: "You have already liked this note" });

    // Add like
    const like = new LikeDislikeNote({ note: noteId, user: userId, action: "like" });
    await like.save();

    note.likes = (note.likes || 0) + 1;
    await note.save();

    res.status(200).json({ message: "Note liked successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dislike a note
export const dislikeNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    // Validate note existence
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Check if user already liked
    const existingLike = await LikeDislikeNote.findOne({
      note: noteId,
      user: userId,
      action: "like",
    });
    if (existingLike) {
      await existingLike.deleteOne();
      note.likes = Math.max(0, note.likes - 1);
    }

    // Check if user already disliked
    const existingDislike = await LikeDislikeNote.findOne({
      note: noteId,
      user: userId,
      action: "dislike",
    });
    if (existingDislike) return res.status(400).json({ message: "You have already disliked this note" });

    // Add dislike
    const dislike = new LikeDislikeNote({ note: noteId, user: userId, action: "dislike" });
    await dislike.save();

    note.dislikes = (note.dislikes || 0) + 1;
    await note.save();

    res.status(200).json({ message: "Note disliked successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove like or dislike
export const removeReaction = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    // Validate note existence
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Remove like or dislike
    const reaction = await LikeDislikeNote.findOne({ note: noteId, user: userId });
    if (!reaction) return res.status(400).json({ message: "No reaction found" });

    if (reaction.action === "like") {
      note.likes = Math.max(0, note.likes - 1);
    } else if (reaction.action === "dislike") {
      note.dislikes = Math.max(0, note.dislikes - 1);
    }

    await reaction.deleteOne();
    await note.save();

    res.status(200).json({ message: "Reaction removed successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
