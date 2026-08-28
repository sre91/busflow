const PORT = Number(process.env.PORT) || 5000;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

export default {
  PORT,
  MONGO_URI,
};
