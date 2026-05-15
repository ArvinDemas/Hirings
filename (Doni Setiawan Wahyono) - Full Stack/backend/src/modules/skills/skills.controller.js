import { skillsService } from "./skills.service.js";

export async function searchSkills(req, res, next) {
  try {
    const skills = await skillsService.searchSkills(req.query);

    res.status(200).json({
      message: "Skill suggestions fetched successfully.",
      data: {
        skills,
      },
    });
  } catch (error) {
    next(error);
  }
}
