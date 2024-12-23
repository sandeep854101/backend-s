import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createComment,
  likeComment,
  dislikeComment,
  replyToComment,
  reportComment,
} from "../controller/commentController.js";

const commentRouter = express.Router();

// Routes
commentRouter.post("/create-comment", authMiddleware, createComment);
commentRouter.post("/like-comment", authMiddleware, likeComment);
commentRouter.post("/dislike-comment", authMiddleware, dislikeComment);
commentRouter.post("/reply-to-comment", authMiddleware, replyToComment);
commentRouter.post("/report-comment", authMiddleware, reportComment);

export default commentRouter;
