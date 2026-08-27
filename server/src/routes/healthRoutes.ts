import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "BusFlow API is healthy 🚌",
  });
});

export default router;
