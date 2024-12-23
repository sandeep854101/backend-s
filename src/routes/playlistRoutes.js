import express from "express";
import {
  createPlaylist,
  addNoteToPlaylist,
  getAllPlaylists,
  getPlaylistById,
  deletePlaylist,
} from '../controller/playlistController.js'
import authMiddleware from "../middleware/authMiddleware.js";

const playlistRouter = express.Router();

// Create a new playlist
playlistRouter.post("/create-playlist", authMiddleware, createPlaylist);

// Add a note to a playlist
playlistRouter.post("/add-note", authMiddleware, addNoteToPlaylist);

// Get all playlists
playlistRouter.get("/all-playlist", getAllPlaylists);

// Get a playlist by ID
playlistRouter.get("/getById/:playlistId", getPlaylistById);

// Delete a playlist
playlistRouter.delete("/deleteById/:playlistId", authMiddleware, deletePlaylist);

export default playlistRouter;
