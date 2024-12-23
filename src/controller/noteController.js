import mongoose from "mongoose";
import Note from "../model/Note.js";
import Channel from "../model/Channel.js"; // Assuming Channel model exists

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, description, content, tags, channel, relatedNotes } = req.body;

    // Validate input fields
    if (!title || !content || !channel) {
      return res.status(400).json({ message: "Title, Content, and Channel are required" });
    }

    // Ensure the channel exists
    const channelExists = await Channel.findById(channel);
    if (!channelExists) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Ensure related notes (if provided) exist
    if (relatedNotes && relatedNotes.length > 0) {
      const notesExist = await Note.find({ '_id': { $in: relatedNotes } });
      if (notesExist.length !== relatedNotes.length) {
        return res.status(404).json({ message: "One or more related notes not found" });
      }
    }

    // Create the note
    const note = new Note({
      title,
      description,
      content,
      tags,
      channel,
      relatedNotes,
      author: req.user.id, // Authenticated user ID
    });

    // Save the note to the database
    const savedNote = await note.save();

    // Add the note to the channel's uploaded notes
    channelExists.uploadedNotes.push(savedNote._id);
    await channelExists.save();

    res.status(201).json(savedNote);

  } catch (err) {
    console.error("Error creating note:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("author", "name email")
      .populate("channel", "name")
      .populate("comments");
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("author", "name email")
      .populate("channel", "name")
      .populate("comments");

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (err) {
    console.error("Error fetching note:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a note by ID
export const updateNote = async (req, res) => {
  try {
    const { title, description, content, tags, relatedNotes } = req.body;

    // Ensure the note exists
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Validate input fields for update
    if (title && title.trim() === "") {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    if (content && content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    // Ensure related notes (if provided) exist
    if (relatedNotes && relatedNotes.length > 0) {
      const notesExist = await Note.find({ '_id': { $in: relatedNotes } });
      if (notesExist.length !== relatedNotes.length) {
        return res.status(404).json({ message: "One or more related notes not found" });
      }
    }

    // Update note fields
    note.title = title || note.title;
    note.description = description || note.description;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    note.relatedNotes = relatedNotes || note.relatedNotes;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a note by ID
export const deleteNote = async (req, res) => {
  try {
    // Ensure the note exists
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });

    // Remove the note from the related channel's uploaded notes
    const channel = await Channel.findById(deletedNote.channel);
    if (channel) {
      channel.uploadedNotes.pull(deletedNote._id);
      await channel.save();
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
