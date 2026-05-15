import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");

  await pool.query(schema);
  await pool.end();

  console.log("Database schema migrated successfully.");
}

migrate().catch(async (error) => {
  console.error("Database migration failed:", error);
  await pool.end();
  process.exit(1);
});
