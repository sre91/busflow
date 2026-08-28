import mongoose from "mongoose";

import env from "./env.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("🗄️ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed");

    process.exit(1);
  }
};

export default connectDatabase;
