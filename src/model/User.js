import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: {
    type: Boolean,
    default: false, 
  },
  emailVerificationOtp: {
    type: Number, 
    required: false,
  },
  otpExpiration: {
    type: Date, 
    required: false,
  },
  refreshToken: {
    type: String,
},
  profileDetails: {
    avatarUrl: { type: String },
    bio: { type: String },
    socialLinks: { type: Map, of: String },
  },
  savedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  savedPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
  likedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  dislikedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  downloadedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  subscriptions: [{ channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } }],
  myChannel:[{ channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } }],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  watchHistory: [
    {
      noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
      watchedAt: { type: Date, default: Date.now },
    },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  reportedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  hiddenChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sharedNotes: [
    {
      noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
      sharedAt: { type: Date, default: Date.now },
    },
  ],
}
,{timestamps:true});



userSchema.methods.generateAccessToken=function(){
  return jwt.sign({
      _id:this._id,
      email:this.Email,
      username:this.Name,

  }, 
  process.env.ACCESS_TOKEN_SECRET,
{
  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
})
}


userSchema.methods.generateRefreshToken=function(){
  return  jwt.sign({
        _id:this._id,
    },
process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
}


export const User= mongoose.model("User", userSchema);
