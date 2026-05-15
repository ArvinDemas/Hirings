import { onboardingService } from "./onboarding.service.js";

export async function getCurrentOnboarding(req, res, next) {
  try {
    const result = await onboardingService.getCurrentOnboarding(req.user.id);

    res.status(200).json({
      message: "Onboarding data fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadCv(req, res, next) {
  try {
    const result = await onboardingService.uploadCv(req.user.id, req.file);

    res.status(202).json({
      message:
        result.ai.status === "succeeded"
          ? "CV uploaded and parsed successfully."
          : "CV uploaded, but skill extraction needs attention.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitManualSkills(req, res, next) {
  try {
    const result = await onboardingService.submitManualSkills(req.user.id, req.body);

    res.status(201).json({
      message: "Manual skills submitted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDraftSkills(req, res, next) {
  try {
    const result = await onboardingService.updateDraftSkills(req.user.id, req.body);

    res.status(200).json({
      message: "Draft skills updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmOnboarding(req, res, next) {
  try {
    const result = await onboardingService.confirmOnboarding(req.user.id, req.body);

    res.status(200).json({
      message: "Onboarding confirmed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSkill(req, res, next) {
  try {
    const result = await onboardingService.deleteSkill(req.user.id, req.params.skillId);

    res.status(200).json({
      message: "Skill removed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
