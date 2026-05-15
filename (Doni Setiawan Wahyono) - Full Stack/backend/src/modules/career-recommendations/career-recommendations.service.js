import { ApiError } from "../../utils/api-error.js";
import { normalizeSkillName } from "../onboarding/onboarding.utils.js";
import {
  careerCatalog,
  careerFilters,
} from "./career-recommendations.catalog.js";
import { careerRecommendationsRepository } from "./career-recommendations.repository.js";

function buildUserSkillMap(userSkills) {
  const map = new Map();

  for (const skill of userSkills) {
    map.set(skill.normalizedName, skill);
  }

  return map;
}

function getUserScore(proficiencyLevel) {
  if (proficiencyLevel === "advanced") return 1;
  if (proficiencyLevel === "intermediate") return 0.9;
  if (proficiencyLevel === "beginner") return 0.75;
  return 0.9;
}

function findMatchedSkill(requiredSkill, userSkillMap) {
  const names = [requiredSkill.name, ...(requiredSkill.aliases ?? [])].map(normalizeSkillName);

  for (const name of names) {
    if (userSkillMap.has(name)) {
      return userSkillMap.get(name);
    }
  }

  return null;
}

function calculateCareer(career, userSkillMap, savedCareerIds) {
  let matchedWeight = 0;
  let totalWeight = 0;
  const matchedSkills = [];
  const missingSkills = [];

  for (const requiredSkill of career.requiredSkills) {
    const userSkill = findMatchedSkill(requiredSkill, userSkillMap);
    totalWeight += requiredSkill.weight;

    if (userSkill) {
      matchedWeight += requiredSkill.weight * getUserScore(userSkill.proficiencyLevel);
      matchedSkills.push({
        name: requiredSkill.name,
        userSkillId: userSkill.id,
      });
    } else {
      missingSkills.push({
        name: requiredSkill.name,
        normalizedName: normalizeSkillName(requiredSkill.name),
      });
    }
  }

  const matchScore = totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100);
  const readyInMonths = Math.max(1, Math.ceil(missingSkills.length * 0.65));
  const roadmap = career.roadmap.map((step, index) => {
    const owned = step.skills.filter((skill) =>
      userSkillMap.has(normalizeSkillName(skill))
    );
    const missing = step.skills.filter(
      (skill) => !userSkillMap.has(normalizeSkillName(skill))
    );

    let status = "sudah punya";
    if (missing.length > 0 && owned.length > 0) status = "perlu belajar";
    if (missing.length > 0 && owned.length === 0) status = "belum punya";

    return {
      step: index + 1,
      title: step.title,
      duration: step.duration,
      description: step.description,
      ownedSkills: owned,
      missingSkills: missing,
      status,
    };
  });

  return {
    id: career.id,
    title: career.title,
    industryId: career.industryId,
    industry: career.industry,
    levelId: career.levelId,
    salaryRange: career.salaryRange,
    demand: {
      score: career.demandScore,
      label: career.demandLabel,
      status: career.demandStatus,
    },
    badge: career.badge,
    matchScore,
    description: career.description,
    readyInMonths,
    skills: matchedSkills.slice(0, 3).map((skill) => skill.name),
    additionalSkillCount: Math.max(0, career.requiredSkills.length - 3),
    matchedSkills,
    missingSkills,
    roadmap,
    courseRecommendations: career.courses,
    isSaved: savedCareerIds.has(career.id),
  };
}

function sortRecommendations(recommendations, sortBy) {
  const sorted = [...recommendations];

  if (sortBy === "fastest-ready") {
    return sorted.sort(
      (a, b) => a.readyInMonths - b.readyInMonths || b.matchScore - a.matchScore
    );
  }

  if (sortBy === "highest-demand") {
    return sorted.sort(
      (a, b) => b.demand.score - a.demand.score || b.matchScore - a.matchScore
    );
  }

  return sorted.sort(
    (a, b) => b.matchScore - a.matchScore || b.demand.score - a.demand.score
  );
}

function buildSummary(recommendations) {
  const careerMatches = recommendations.filter((career) => career.matchScore >= 65);
  const averageReadyMonths =
    recommendations.length === 0
      ? 0
      : Math.max(
          1,
          Math.round(
            recommendations.reduce((total, career) => total + career.readyInMonths, 0) /
              recommendations.length
          )
        );

  return {
    matchCount: careerMatches.length,
    demandTrend:
      recommendations.some((career) => career.demand.status === "rising")
        ? "Demand Naik"
        : "Stabil",
    averageReadyMonths,
  };
}

function getContext({ latestSkillGap, payload }) {
  return {
    targetRoleId: payload.targetRoleId ?? latestSkillGap?.targetRoleId ?? null,
    targetRole: latestSkillGap?.targetRole ?? null,
    levelId: payload.levelId ?? latestSkillGap?.levelId ?? "entry",
    level: latestSkillGap?.level ?? "Entry Level",
  };
}

async function getFilters() {
  return careerFilters;
}

async function generate(userId, payload = {}) {
  const filters = {
    industryId: payload.industryId ?? "all",
    sortBy: payload.sortBy ?? "highest-match",
  };

  const industryExists = careerFilters.industries.some(
    (industry) => industry.id === filters.industryId
  );
  const sortExists = careerFilters.sortOptions.some((sort) => sort.id === filters.sortBy);

  if (!industryExists || !sortExists) {
    throw new ApiError(400, "Industry filter or sort option is invalid.");
  }

  const [userSkills, latestSkillGap, savedCareerIds] = await Promise.all([
    careerRecommendationsRepository.getUserSkills(userId),
    careerRecommendationsRepository.getLatestSkillGapAnalysis(userId),
    careerRecommendationsRepository.getSavedCareerIds(userId),
  ]);

  const userSkillMap = buildUserSkillMap(userSkills);
  const context = getContext({ latestSkillGap, payload });
  const sourceCareers =
    filters.industryId === "all"
      ? careerCatalog
      : careerCatalog.filter((career) => career.industryId === filters.industryId);

  const recommendations = sortRecommendations(
    sourceCareers.map((career) => calculateCareer(career, userSkillMap, savedCareerIds)),
    filters.sortBy
  );
  const summary = buildSummary(recommendations);
  const result = {
    context,
    filters,
    summary,
    recommendations,
    generatedAt: new Date().toISOString(),
  };

  const run = await careerRecommendationsRepository.saveRun({
    userId,
    context,
    filters,
    summary,
    result,
  });

  return {
    id: run.id,
    ...result,
  };
}

async function getLatest(userId, query = {}) {
  const hasQuery = Boolean(query.industryId || query.sortBy || query.targetRoleId || query.levelId);

  if (hasQuery) {
    return generate(userId, query);
  }

  const latest = await careerRecommendationsRepository.getLatestRun(userId);

  if (!latest) {
    return generate(userId, {});
  }

  const savedCareerIds = await careerRecommendationsRepository.getSavedCareerIds(userId);
  const result = {
    ...latest.result,
    recommendations: latest.result.recommendations.map((career) => ({
      ...career,
      isSaved: savedCareerIds.has(career.id),
    })),
  };

  return {
    id: latest.id,
    ...result,
    createdAt: latest.createdAt,
  };
}

async function saveCareer(userId, careerId) {
  const exists = careerCatalog.some((career) => career.id === careerId);

  if (!exists) {
    throw new ApiError(404, "Career recommendation was not found.");
  }

  await careerRecommendationsRepository.saveCareer({ userId, careerId });
  return getLatest(userId);
}

async function deleteSavedCareer(userId, careerId) {
  const deleted = await careerRecommendationsRepository.deleteSavedCareer({ userId, careerId });

  if (!deleted) {
    throw new ApiError(404, "Saved career recommendation was not found.");
  }

  return getLatest(userId);
}

export const careerRecommendationsService = {
  getFilters,
  generate,
  getLatest,
  saveCareer,
  deleteSavedCareer,
};
