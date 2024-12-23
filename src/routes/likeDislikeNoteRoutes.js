import express from "express";
import { likeNote, dislikeNote, removeReaction } from "../controller/likeDislikeNoteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const likeDislikeRouter = express.Router();

likeDislikeRouter.post("/like", authMiddleware, likeNote);
likeDislikeRouter.post("/dislike", authMiddleware, dislikeNote);
likeDislikeRouter.post("/remove", authMiddleware, removeReaction);

export default likeDislikeRouter;
