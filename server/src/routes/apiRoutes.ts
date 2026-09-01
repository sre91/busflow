import { Router } from "express";

import healthRoutes from "./healthRoutes.js";
import busRoutes from "./busRoutes.js";
import seatRoutes from "./seatRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();

router.use("/health", healthRoutes);

router.use("/buses", busRoutes);

router.use("/seats", seatRoutes);

router.use("/bookings", bookingRoutes);

router.use("/auth", authRoutes);

export default router;
