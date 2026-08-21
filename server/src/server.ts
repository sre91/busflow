import express from "express";

const app = express();

const PORT = 5000;

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to BusFlow API 🚌",
  });
});

app.listen(PORT, () => {
  console.log(`🚌 BusFlow server running on http://localhost:${PORT}`);
});
