import { z } from "zod";

export const searchSkillsSchema = z.object({
  query: z.object({
    q: z.string().trim().max(80, "Search query must be 80 characters or fewer.").optional(),
    limit: z.coerce.number().int().min(1).max(25).default(10),
  }),
});
