import express from "express";
import {
  createChannel,
  viewYourChannel,
  updateChannel,
  deleteChannel,
  viewPlaylists,
  addNoteToPlaylist,
  subscribeChannel
} from "../controller/channelController.js";
import authenticate  from "../middleware/authMiddleware.js";

const channelRouter = express.Router();

channelRouter.post("/create", authenticate, createChannel);
channelRouter.post("/subscribe", authenticate, subscribeChannel);
channelRouter.get("/view", authenticate, viewYourChannel);
channelRouter.put("/update", authenticate, updateChannel);
channelRouter.delete("/delete", authenticate, deleteChannel);
channelRouter.get("/playlists", authenticate, viewPlaylists);


// channelRouter.post("/playlists/add-note", authenticate, addNoteToPlaylist);

export default channelRouter;


