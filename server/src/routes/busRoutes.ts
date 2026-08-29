import { Router } from "express";

import {
  getBuses,
  getBusById,
  createBus,
} from "../controllers/busController.js";

const router = Router();

router.get("/", getBuses);
router.post("/", createBus);
router.get("/:id", getBusById);

export default router;
