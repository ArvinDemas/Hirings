import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  API_PREFIX: z.string().default("/api/v1"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  AI_SERVICE_BASE_URL: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.replace(/\/$/, "") : undefined)),
  AI_SERVICE_PARSE_CV_PATH: z.string().default("/api/v1/cv/parse"),
  AI_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables", parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
