import crypto from "node:crypto";

import { ApiError } from "../../utils/api-error.js";
import { ONBOARDING_PROGRESS } from "./onboarding.constants.js";
import { onboardingAiClient } from "./onboarding.ai-client.js";
import { onboardingRepository } from "./onboarding.repository.js";
import { deduplicateSkills } from "./onboarding.utils.js";

async function getCurrentOnboarding(userId) {
  const [profile, skills, latestCvUpload] = await Promise.all([
    onboardingRepository.getProfile(userId),
    onboardingRepository.getUserSkills(userId),
    onboardingRepository.getLatestCvUpload(userId),
  ]);

  return {
    profile:
      profile ??
      {
        userId,
        inputMethod: null,
        status: "not_started",
        progress: ONBOARDING_PROGRESS.notStarted,
        aiStatus: "idle",
        aiError: null,
        completedAt: null,
      },
    skills,
    latestCvUpload,
  };
}

async function uploadCv(userId, file) {
  if (!file) {
    throw new ApiError(400, "CV file is required. Use multipart field name 'cv'.");
  }

  const checksumSha256 = crypto.createHash("sha256").update(file.buffer).digest("hex");
  const upload = await onboardingRepository.createCvUpload({
    userId,
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    checksumSha256,
  });

  let aiResult;
  let updatedUpload;
  let profile;
  let skills = [];

  try {
    aiResult = await onboardingAiClient.parseCv(file);
    const detectedSkills = deduplicateSkills(aiResult.skills);

    skills = await onboardingRepository.replaceUserSkills({
      userId,
      skills: detectedSkills,
      source: "cv_upload",
      isConfirmed: false,
    });

    updatedUpload = await onboardingRepository.updateCvUploadAiResult({
      uploadId: upload.id,
      aiStatus: "succeeded",
      aiResponse: aiResult.rawResponse,
    });

    profile = await onboardingRepository.upsertProfile({
      userId,
      inputMethod: "cv_upload",
      status: "needs_review",
      progress: ONBOARDING_PROGRESS.inputReceived,
      aiStatus: "succeeded",
      aiError: null,
    });
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "CV was uploaded, but skill extraction failed.";

    updatedUpload = await onboardingRepository.updateCvUploadAiResult({
      uploadId: upload.id,
      aiStatus: "failed",
      aiError: message,
    });

    profile = await onboardingRepository.upsertProfile({
      userId,
      inputMethod: "cv_upload",
      status: "needs_review",
      progress: ONBOARDING_PROGRESS.inputReceived,
      aiStatus: "failed",
      aiError: message,
    });
  }

  return {
    profile,
    upload: updatedUpload,
    skills,
    ai: {
      status: profile.aiStatus,
      message:
        profile.aiStatus === "succeeded"
          ? "CV parsed successfully. Please review detected skills."
          : profile.aiError,
    },
  };
}

async function submitManualSkills(userId, payload) {
  const skillsInput = deduplicateSkills(payload.skills);

  const skills = await onboardingRepository.replaceUserSkills({
    userId,
    skills: skillsInput,
    source: "manual",
    isConfirmed: false,
  });

  const profile = await onboardingRepository.upsertProfile({
    userId,
    inputMethod: "manual",
    status: "needs_review",
    progress: ONBOARDING_PROGRESS.inputReceived,
    aiStatus: "skipped",
    aiError: null,
  });

  return {
    profile,
    skills,
  };
}

async function updateDraftSkills(userId, payload) {
  const skillsInput = deduplicateSkills(payload.skills);

  const skills = await onboardingRepository.replaceUserSkills({
    userId,
    skills: skillsInput,
    source: "edited",
    isConfirmed: false,
  });

  const current = await onboardingRepository.getProfile(userId);
  const profile = await onboardingRepository.upsertProfile({
    userId,
    inputMethod: current?.inputMethod ?? "manual",
    status: "needs_review",
    progress: ONBOARDING_PROGRESS.inputReceived,
    aiStatus: current?.aiStatus ?? "skipped",
    aiError: current?.aiError ?? null,
  });

  return {
    profile,
    skills,
  };
}

async function confirmOnboarding(userId, payload = {}) {
  let skills;

  if (payload.skills) {
    const skillsInput = deduplicateSkills(payload.skills);

    skills = await onboardingRepository.replaceUserSkills({
      userId,
      skills: skillsInput,
      source: "edited",
      isConfirmed: true,
    });
  } else {
    skills = await onboardingRepository.confirmExistingSkills(userId);
  }

  if (skills.length === 0) {
    throw new ApiError(400, "At least one skill is required before confirming onboarding.");
  }

  const current = await onboardingRepository.getProfile(userId);
  const profile = await onboardingRepository.upsertProfile({
    userId,
    inputMethod: current?.inputMethod ?? "manual",
    status: "completed",
    progress: ONBOARDING_PROGRESS.completed,
    aiStatus: current?.aiStatus ?? "skipped",
    aiError: current?.aiError ?? null,
    completedAt: new Date(),
  });

  return {
    profile,
    skills,
  };
}

async function deleteSkill(userId, skillId) {
  const deleted = await onboardingRepository.deleteUserSkill({ userId, skillId });

  if (!deleted) {
    throw new ApiError(404, "Skill was not found.");
  }

  return getCurrentOnboarding(userId);
}

export const onboardingService = {
  getCurrentOnboarding,
  uploadCv,
  submitManualSkills,
  updateDraftSkills,
  confirmOnboarding,
  deleteSkill,
};
