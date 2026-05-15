import { z } from "zod";

const skillSchema = z.object({
  name: z
    .string({ required_error: "Skill name is required." })
    .trim()
    .min(1, "Skill name is required.")
    .max(120, "Skill name must be 120 characters or fewer."),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

export const manualSkillsSchema = z.object({
  body: z.object({
    skills: z
      .array(skillSchema, { required_error: "Skills are required." })
      .min(1, "At least one skill is required.")
      .max(50, "You can submit up to 50 skills."),
  }),
});

export const updateSkillsSchema = manualSkillsSchema;

export const confirmOnboardingSchema = z.object({
  body: z
    .object({
      skills: z.array(skillSchema).min(1).max(50).optional(),
    })
    .optional()
    .default({}),
});

export const deleteSkillSchema = z.object({
  params: z.object({
    skillId: z.string().uuid("Skill id is invalid."),
  }),
});
