import express from "express";
import cors from "cors";
import compression from "compression";

import env from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

import { apiRateLimiter } from "./middleware/rateLimiter.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.set("trust proxy", 1);

// CORS

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Rate limiting

app.use(apiRateLimiter);

app.use(compression());

app.use(express.json());

// Routes

app.use("/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/buses", busRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/seats", seatRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/notifications", notificationRoutes);

app.use(errorMiddleware);

export default app;
