import { skillGapService } from "./skill-gap.service.js";

export async function getTargets(_req, res, next) {
  try {
    const result = await skillGapService.getTargets();

    res.status(200).json({
      message: "Skill gap targets fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzeSkillGap(req, res, next) {
  try {
    const result = await skillGapService.analyze(req.user.id, req.body);

    res.status(201).json({
      message: "Skill gap analysis generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLatestAnalysis(req, res, next) {
  try {
    const result = await skillGapService.getLatest(req.user.id);

    res.status(200).json({
      message: result
        ? "Latest skill gap analysis fetched successfully."
        : "No skill gap analysis found.",
      data: {
        analysis: result,
      },
    });
  } catch (error) {
    next(error);
  }
}
