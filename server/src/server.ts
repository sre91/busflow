import app from "./app.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚌 BusFlow server running on http://localhost:${PORT}`);
});
