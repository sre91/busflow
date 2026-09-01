import { Router } from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createBooking);

router.get("/my", authMiddleware, getMyBookings);

router.get("/:id", authMiddleware, getBookingById);

router.patch("/:id/cancel", authMiddleware, cancelBooking);

export default router;
