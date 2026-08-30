import { Router } from "express";

import { getSeatsByBus } from "../controllers/seatController.js";

const router = Router();

router.get("/:busId", getSeatsByBus);

export default router;
