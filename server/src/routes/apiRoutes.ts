import { Router } from "express";

import healthRoutes from "./healthRoutes.js";
import busRoutes from "./busRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/buses", busRoutes);

export default router;
