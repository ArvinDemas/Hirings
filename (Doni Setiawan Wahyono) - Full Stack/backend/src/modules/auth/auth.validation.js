import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required." })
      .trim()
      .min(2, "Full name must contain at least 2 characters.")
      .max(120, "Full name must be 120 characters or fewer."),
    email: z
      .string({ required_error: "Email is required." })
      .trim()
      .email("Email format is invalid.")
      .max(255, "Email must be 255 characters or fewer."),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, "Password must contain at least 8 characters.")
      .max(72, "Password must be 72 characters or fewer."),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required." })
      .trim()
      .email("Email format is invalid."),
    password: z.string({ required_error: "Password is required." }).min(1, "Password is required."),
  }),
});
