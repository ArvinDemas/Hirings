import { z } from "zod";

export const analyzeSkillGapSchema = z.object({
  body: z.object({
    roleId: z.string().trim().min(1).default("data-analyst"),
    industryId: z.string().trim().min(1).default("technology"),
    levelId: z.string().trim().min(1).default("entry"),
  }),
});
