import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB