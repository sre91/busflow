import http from "http";

import mongoose from "mongoose";

import app from "./app.js";

import env from "./config/env.js";

import connectDatabase from "./config/database.js";

import { connectRedis } from "./config/redis.js";

import redisClient from "./config/redis.js";

import { initializeSocket, getIO } from "./socket/socket.js";

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    try {
      await connectRedis();
    } catch (error) {
      console.error("⚠️ Redis unavailable. Continuing without cache.", error);
    }

    initializeSocket(server);

    server.listen(env.PORT, () => {
      console.log(`🚀 BusFlow server running on port ${env.PORT}`);

      console.log(`🌐 Client URL: ${env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);

    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log("🛑 HTTP server closed");

    try {
      const io = getIO();

      io.close();

      console.log("🔌 Socket.IO closed");
    } catch (error) {
      console.error("❌ Socket.IO shutdown error:", error);
    }

    try {
      await mongoose.connection.close();

      console.log("🗄️ MongoDB connection closed");
    } catch (error) {
      console.error("❌ MongoDB shutdown error:", error);
    }

    try {
      if (redisClient.isOpen) {
        await redisClient.quit();
      }

      console.log("🔴 Redis connection closed");
    } catch (error) {
      console.error("❌ Redis shutdown error:", error);
    }

    process.exit(0);
  });
};

process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});

process.on("SIGINT", () => {
  gracefulShutdown("SIGINT");
});

startServer();
