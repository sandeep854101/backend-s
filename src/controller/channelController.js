import Channel from "../model/Channel.js";
import Note from "../model/Note.js"; // Assuming a Note model exists
import Playlist from "../model/Playlist.js"; // Assuming a Playlist model exists
import mongoose from "mongoose";
import { User } from "../model/User.js";


// Create a Channel
const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: "Channel name is required." });
    }
    if (name.length < 3 || name.length > 50) {
      return res.status(400).json({ message: "Channel name must be between 3 and 50 characters." });
    }
    if (description && description.length > 200) {
      return res.status(400).json({ message: "Description cannot be longer than 200 characters." });
    }

    // Check if the user already has a channel
    const existingUserChannel = await Channel.findOne({ owner: userId });
    if (existingUserChannel) {
      return res.status(400).json({ message: "You already have a channel." });
    }

    // Check if the channel name is already taken
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel name already exists." });
    }

    // Create the new channel
    const channel = new Channel({
      name,
      description,
      owner: userId,
    });

    // Save the channel
    await channel.save();

    // Add the channel ID to the user's schema
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.myChannel.push({ channel: channel._id });
    await user.save();

    res.status(201).json({ message: "Channel created successfully", channel });
  } catch (err) {
    console.error("Error creating channel:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// View Your Channel
const viewYourChannel = async (req, res) => {
  try {
    const userId = req.user.id;

    const channel = await Channel.findOne({ owner: userId }).populate("subscribers.user", "name email");
    if (!channel) {
      return res.status(404).json({ message: "You do not own a channel." });
    }

    res.status(200).json({
      message: "Channel details fetched successfully",
      channel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Update Channel
const updateChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const channel = await Channel.findOne({ owner: userId });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    if (name) {
      if (name.length < 3 || name.length > 50) {
        return res.status(400).json({ message: "Channel name must be between 3 and 50 characters." });
      }
      channel.name = name;
    }

    if (description) {
      if (description.length > 200) {
        return res.status(400).json({ message: "Description cannot be longer than 200 characters." });
      }
      channel.description = description;
    }

    await channel.save();

    res.status(200).json({ message: "Channel updated successfully", channel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Channel
const deleteChannel = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's channel by userId
    const channel = await Channel.findOneAndDelete({ owner: userId });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    // Find the user and remove the channel reference from their myChannel array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove the channel reference from the user's myChannel array
    user.myChannel = [];
    await user.save();

    res.status(200).json({ message: "Channel deleted successfully and removed from user's channels" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// View Playlists
const viewPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlists = await Playlist.find({ creator: userId });
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found." });
    }

    res.status(200).json({ message: "Playlists fetched successfully", playlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add Notes to Playlist
const addNoteToPlaylist = async (req, res) => {
  try {
    const { playlistId, noteId } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid playlist or note ID." });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist || playlist.creator.toString() !== userId) {
      return res.status(404).json({ message: "Playlist not found or unauthorized access." });
    }

    if (playlist.notes.includes(noteId)) {
      return res.status(400).json({ message: "Note already exists in the playlist." });
    }

    playlist.notes.push(noteId);
    await playlist.save();

    res.status(200).json({ message: "Note added to playlist successfully", playlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const subscribeChannel = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.user.id;

    // Validate channelId
    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ message: "Invalid or missing channelId." });
    }

    // Find the channel
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    // Prevent subscribing to own channel
    if (channel.owner.toString() === userId) {
      return res.status(400).json({ message: "You cannot subscribe to your own channel." });
    }

    // Check if user is already subscribed
    const alreadySubscribed = channel.subscribers.some(sub => sub.user.toString() === userId);
    if (alreadySubscribed) {
      return res.status(400).json({ message: "You are already subscribed to this channel." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Subscribe the user to the channel
    channel.subscribers.push({ user: userId });
    channel.stats.totalSubscribers += 1;
    await channel.save();

    // Add channel to the user's subscriptions
    user.subscriptions.push({ channel: channelId });
    await user.save();

    res.status(200).json({
      message: "Subscribed successfully",
      channel,
    });
  } catch (err) {
    console.error("Error subscribing to channel:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export {
  createChannel,
  viewYourChannel,
  updateChannel,
  deleteChannel,
  viewPlaylists,
  addNoteToPlaylist,
  subscribeChannel
};
