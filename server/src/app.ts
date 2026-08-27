import express from "express";

import healthRoutes from "./routes/healthRoutes.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import requestLogger from "./middleware/requestLogger.js";

const app = express();

app.use(express.json());

app.use(requestLogger);

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to BusFlow API 🚌",
  });
});

app.use("/api/health", healthRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
