import "dotenv/config";

const PORT = Number(process.env.PORT) || 5000;

const MONGO_URI = process.env.MONGO_URI;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined");
}

export default {
  PORT,
  MONGO_URI,
  CLIENT_URL,
  GROQ_API_KEY,
  REDIS_URL,
};
