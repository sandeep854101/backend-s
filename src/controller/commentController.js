import Comment from "../model/comment.js";
import Note from "../model/Note.js";

// TODO: here one user like and dislike both can do but onr user like or dislike not can do both resolve problem
// TODO: each reply , like ,dislike and other each time save the data but i want to update the data (optional )
// Create a new comment on a note
export const createComment = async (req, res) => {
  try {
    const { noteId, content } = req.body;
    const userId = req.user.id;

    // Validate input fields
    if (!noteId || !content) return res.status(400).json({ message: "Note ID and content are required" });

    // Check if the note exists
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Create and save the comment
    const newComment = new Comment({
      user: userId,
      note: noteId,
      content,
    });
    const savedComment = await newComment.save();

    // Add the comment to the note's comments array
    note.comments.push(savedComment._id);
    await note.save();

    res.status(201).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.user.id;

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the user has already liked this comment
    if (comment.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this comment" });
    }

    // Add the user to likedBy array and increment likes
    comment.likedBy.push(userId);
    comment.likes += 1;

    // Save the updated comment
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Dislike a comment
export const dislikeComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.user.id;

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the user has already disliked this comment
    if (comment.dislikedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already disliked this comment" });
    }

    // Add the user to dislikedBy array and increment dislikes
    comment.dislikedBy.push(userId);
    comment.dislikes += 1;

    // Save the updated comment
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reply to a comment
export const replyToComment = async (req, res) => {
  try {
    const { commentId, content } = req.body;
    const userId = req.user.id;

    // Validate input fields
    if (!commentId || !content) return res.status(400).json({ message: "Comment ID and content are required" });

    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) return res.status(404).json({ message: "Parent comment not found" });

    // Create and save the reply
    const newReply = new Comment({
      user: userId,
      note: parentComment.note,  // Use the note of the parent comment
      content,
    });
    const savedReply = await newReply.save();

    // Add the reply to the parent comment's replies array
    parentComment.replies.push(savedReply._id);
    await parentComment.save();

    res.status(201).json(savedReply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Report a comment
export const reportComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.user.id;

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the user has already reported this comment
    if (comment.reportedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already reported this comment" });
    }

    // Add the user to reportedBy array and increment reports
    comment.reportedBy.push(userId);
    comment.reports += 1;

    // Save the updated comment
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
