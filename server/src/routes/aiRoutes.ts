import { Router } from "express";

import {
  chatWithAI,
  extractIntent,
  searchWithAI,
  bookingAssist,
} from "../controllers/aiController.js";

const router = Router();

router.post("/chat", chatWithAI);

router.post("/intent", extractIntent);

router.post("/search", searchWithAI);

router.post("/booking-assist", bookingAssist);

export default router;
