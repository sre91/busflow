import { Router } from "express";

import { register, login } from "../controllers/authController.js";

import {
  authMiddleware,
  type AuthRequest,
} from "../middleware/authMiddleware.js";

import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authRateLimiter, register);

router.post("/login", authRateLimiter, login);

router.get("/me", authMiddleware, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful",
    data: {
      userId: req.user?.userId,
      role: req.user?.role,
    },
  });
});

export default router;
