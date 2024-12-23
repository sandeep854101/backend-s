import express from 'express'
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import dotenv from 'dotenv'
import userRouter from "./routes/userRoutes.js";
import channelRouter from "./routes/channelRoutes.js";
import notesRouter from "./routes/noteRoutes.js";
import commentRouter from './routes/commentRoutes.js'
import playlistRouter from './routes/playlistRoutes.js';
import likeDislikeRouter from './routes/likeDislikeNoteRoutes.js';
import emailRouter from './routes/mailRoutes.js';
import fileUploadRouter from './routes/fileUpload.route.js'
const app = express();
dotenv.config()
// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/channels", channelRouter);
app.use("/api/notes", notesRouter);
app.use("/api/comment", commentRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/like-dislike", likeDislikeRouter);
app.use("/api/email", emailRouter);
app.use("/api/upload",fileUploadRouter)

// Database Connection
connectDB();
export default app;
