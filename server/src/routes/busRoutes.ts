import { Router } from "express";

import {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
} from "../controllers/busController.js";

const router = Router();

router.get("/", getBuses);
router.post("/", createBus);
router.put("/:id", updateBus);
router.get("/:id", getBusById);
router.delete("/:id", deleteBus);

export default router;
