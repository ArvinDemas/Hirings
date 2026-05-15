import { ZodError } from "zod";
import multer from "multer";

import { ApiError } from "../utils/api-error.js";

export function errorHandler(error, _req, res, _next) {
  if (error instanceof multer.MulterError) {
    const statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    return res.status(statusCode).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "CV file must be 5MB or smaller."
          : error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: error.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error.",
  });
}
