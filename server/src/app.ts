import express from "express";

import healthRoutes from "./routes/healthRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to BusFlow API 🚌",
  });
});

app.use("/api/health", healthRoutes);

app.use(errorMiddleware);

export default app;
