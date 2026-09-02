const PORT = Number(process.env.PORT) || 5000;

const MONGO_URI = process.env.MONGO_URI;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

export default {
  PORT,
  MONGO_URI,
  CLIENT_URL,
};
