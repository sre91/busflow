import mongoose from "mongoose";

import env from "./env.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      // Connection Pool
      maxPoolSize: 10,
      minPoolSize: 2,

      serverSelectionTimeoutMS: 5000,

      socketTimeoutMS: 45000,
    });

    console.log("🗄️ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);

    process.exit(1);
  }
};

export default connectDatabase;
