const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["new_note", "new_comment", "system_alert", "subscription_update"],
      required: true,
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
  });
  
export default  mongoose.model("Notification", notificationSchema);
  