import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Hirings API running on http://localhost:${env.PORT}${env.API_PREFIX}`);
});

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down API server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
