import { Request, Response } from "express";

import mongoose from "mongoose";

import redisClient from "../config/redis.js";

export const getHealth = (_req: Request, res: Response) => {
  const mongoHealthy = mongoose.connection.readyState === 1;

  const redisHealthy = redisClient.isReady;

  const healthy = mongoHealthy && redisHealthy;

  return res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? "healthy" : "unhealthy",

    services: {
      mongodb: mongoHealthy ? "up" : "down",

      redis: redisHealthy ? "up" : "down",
    },
  });
};
