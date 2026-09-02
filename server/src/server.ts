import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDatabase from "./config/database.js";
import env from "./config/env.js";
import initializeSocket from "./socket/socket.js";

const startServer = async () => {
  await connectDatabase();

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  initializeSocket(io);

  httpServer.listen(env.PORT, () => {
    console.log(`🚌 BusFlow server running on port ${env.PORT}`);
  });
};

startServer();
