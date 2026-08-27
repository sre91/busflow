import { Router } from "express";

import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();

router.get("/", (_req, res) => {
  sendSuccess(
    res,
    {
      status: "ok",
    },
    "BusFlow API is healthy 🚌",
  );
});

export default router;
