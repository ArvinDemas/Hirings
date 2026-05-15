import pg from "pg";

import { env } from "./env.js";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}
