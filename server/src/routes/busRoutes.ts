import { Router } from "express";

import { getBuses, getBusById } from "../controllers/busController.js";

const router = Router();

router.get("/", getBuses);
router.get("/:id", getBusById);

export default router;
