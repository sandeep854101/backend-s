import Playlist from "../model/Playlist.js";
import Note from "../model/Note.js";
// Create a new playlist
export const createPlaylist = async (req, res) => {
    try {
      const { title, description, visibility } = req.body;
      const creator = req.user.id;
  
      // Validate required fields
      if (!title) return res.status(400).json({ message: "Title is required" });
  
      const newPlaylist = new Playlist({
        title,
        description,
        creator,
        visibility,
      });
  
      const savedPlaylist = await newPlaylist.save();
      res.status(201).json({ message: "Playlist created successfully", playlist: savedPlaylist });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Add a note to a playlist
export const addNoteToPlaylist = async (req, res) => {
    try {
      const { playlistId, noteId } = req.body;
  
      // Validate inputs
      if (!playlistId || !noteId)
        return res.status(400).json({ message: "Playlist ID and Note ID are required" });
  
      // Check if the playlist exists
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) return res.status(404).json({ message: "Playlist not found" });
  
      // Check if the note exists
      const note = await Note.findById(noteId);
      if (!note) return res.status(404).json({ message: "Note not found" });
  
      // Check if the note is already in the playlist
      if (playlist.notes.includes(noteId)) {
        return res.status(400).json({ message: "Note already exists in the playlist" });
      }
  
      // Add the note to the playlist
      playlist.notes.push(noteId);
      playlist.updatedDate = new Date();
      await playlist.save();
  
      res.status(200).json({ message: "Note added to playlist", playlist });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Get all playlists
export const getAllPlaylists = async (req, res) => {
    try {
      const playlists = await Playlist.find()
        .populate("creator", "name email")
        .populate("notes", "title content");
  
      if (playlists.length === 0)
        return res.status(404).json({ message: "No playlists found" });
  
      res.status(200).json({ playlists });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


// Get a playlist by ID
export const getPlaylistById = async (req, res) => {
    try {
      const { playlistId } = req.params;
  
      // Validate ID
      if (!playlistId) return res.status(400).json({ message: "Playlist ID is required" });
  
      // Find playlist
      const playlist = await Playlist.findById(playlistId)
        .populate("creator", "name email")
        .populate("notes", "title content");
  
      if (!playlist) return res.status(404).json({ message: "Playlist not found" });
  
      res.status(200).json({ playlist });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Delete a playlist
export const deletePlaylist = async (req, res) => {
    try {
      const { playlistId } = req.params;
  
      // Validate ID
      if (!playlistId) return res.status(400).json({ message: "Playlist ID is required" });
  
      // Check if playlist exists
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) return res.status(404).json({ message: "Playlist not found" });
  
      // Ensure the requesting user is the creator of the playlist
      if (playlist.creator.toString() !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to delete this playlist" });
      }
  
      await Playlist.findByIdAndDelete(playlistId);
  
      res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

