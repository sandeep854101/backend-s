import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controller/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const notesRouter = express.Router();

notesRouter.post("/create-notes", authMiddleware, createNote);
notesRouter.get("/all-notes", authMiddleware, getAllNotes);
notesRouter.get("/notesById/:id", authMiddleware, getNoteById);
notesRouter.put("/updateNoteById/:id", authMiddleware, updateNote);
notesRouter.delete("/deleteNoteById/:id", authMiddleware, deleteNote);
export default notesRouter;
