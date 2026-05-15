import { z } from "zod";

export const recommendationQuerySchema = z.object({
  query: z.object({
    industryId: z.string().trim().default("all"),
    sortBy: z.string().trim().default("highest-match"),
    targetRoleId: z.string().trim().optional(),
    levelId: z.string().trim().optional(),
  }),
});

export const generateRecommendationsSchema = z.object({
  body: z.object({
    industryId: z.string().trim().default("all"),
    sortBy: z.string().trim().default("highest-match"),
    targetRoleId: z.string().trim().optional(),
    levelId: z.string().trim().optional(),
  }),
});

export const saveCareerSchema = z.object({
  body: z.object({
    careerId: z.string().trim().min(1, "Career id is required."),
  }),
});

export const deleteSavedCareerSchema = z.object({
  params: z.object({
    careerId: z.string().trim().min(1, "Career id is required."),
  }),
});
