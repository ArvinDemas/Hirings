import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ApiError } from "./api-error.js";

export function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (_error) {
    throw new ApiError(401, "Invalid or expired authorization token.");
  }
}
