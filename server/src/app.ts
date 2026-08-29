import express from "express";
import cors from "cors";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import requestLogger from "./middleware/requestLogger.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use(requestLogger);

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to BusFlow API 🚌",
  });
});

app.use("/api/v1", apiRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
