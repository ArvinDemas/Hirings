import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

function extractSkillsFromResponse(payload) {
  const candidates =
    payload?.skills ??
    payload?.detectedSkills ??
    payload?.data?.skills ??
    payload?.data?.detectedSkills ??
    [];

  if (!Array.isArray(candidates)) {
    return [];
  }

  return candidates
    .map((item) => {
      if (typeof item === "string") {
        return { name: item };
      }

      return {
        name: item.name ?? item.skill ?? item.skillName,
        confidence: item.confidence ?? item.score,
      };
    })
    .filter((item) => typeof item.name === "string" && item.name.trim().length > 0);
}

async function parseCv(file) {
  if (!env.AI_SERVICE_BASE_URL) {
    throw new ApiError(503, "AI service is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.AI_SERVICE_TIMEOUT_MS);
  const formData = new FormData();
  const blob = new Blob([file.buffer], { type: file.mimetype });

  formData.append("file", blob, file.originalname);

  try {
    const response = await fetch(
      `${env.AI_SERVICE_BASE_URL}${env.AI_SERVICE_PARSE_CV_PATH}`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        response.status,
        payload.message ?? payload.detail ?? "AI service failed to parse CV."
      );
    }

    return {
      rawResponse: payload,
      skills: extractSkillsFromResponse(payload),
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError(504, "AI service timed out while parsing CV.");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(503, "AI service is currently unavailable.");
  } finally {
    clearTimeout(timeout);
  }
}

export const onboardingAiClient = {
  parseCv,
};
