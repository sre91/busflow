import "dotenv/config";

import app from "./app.js";
import connectDatabase from "./config/database.js";
import env from "./config/env.js";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`🚌 BusFlow server running on port ${env.PORT}`);
  });
};

startServer();
