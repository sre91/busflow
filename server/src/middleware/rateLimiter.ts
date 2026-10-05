import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

export const chatMessageRateLimiter = rateLimit({
  windowMs: 60 * 1000,

  limit: 30,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many messages. Please slow down.",
  },
});
