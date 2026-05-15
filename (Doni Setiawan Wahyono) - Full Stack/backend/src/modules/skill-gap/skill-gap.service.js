import { ApiError } from "../../utils/api-error.js";
import { normalizeSkillName } from "../onboarding/onboarding.utils.js";
import {
  benchmarkCatalog,
  getCourseRecommendations,
  skillGapTargets,
} from "./skill-gap.benchmarks.js";
import { skillGapRepository } from "./skill-gap.repository.js";

const DIMENSIONS = [
  "Problem Solving",
  "Communication",
  "Teamwork",
  "Leadership",
  "Tools",
  "Technical Skill",
];

function findTargetOption(collection, id) {
  return collection.find((item) => item.id === id);
}

function getBenchmark({ roleId, industryId, levelId }) {
  return (
    benchmarkCatalog.find(
      (benchmark) =>
        benchmark.roleId === roleId &&
        benchmark.industryId === industryId &&
        benchmark.levelId === levelId
    ) ??
    benchmarkCatalog.find(
      (benchmark) => benchmark.roleId === roleId && benchmark.levelId === levelId
    ) ??
    benchmarkCatalog.find((benchmark) => benchmark.roleId === roleId)
  );
}

function getUserScore(proficiencyLevel) {
  if (proficiencyLevel === "advanced") return 100;
  if (proficiencyLevel === "intermediate") return 80;
  if (proficiencyLevel === "beginner") return 60;
  return 80;
}

function buildUserSkillMap(userSkills) {
  const map = new Map();

  for (const skill of userSkills) {
    map.set(skill.normalizedName, skill);
  }

  return map;
}

function findMatchingUserSkill(requiredSkill, userSkillMap) {
  const names = [requiredSkill.name, ...(requiredSkill.aliases ?? [])].map(normalizeSkillName);

  for (const name of names) {
    if (userSkillMap.has(name)) {
      return userSkillMap.get(name);
    }
  }

  return null;
}

function getPriority(gapPercent, benchmarkPriority) {
  if (benchmarkPriority === "high" || gapPercent >= 60) return "High Priority";
  if (benchmarkPriority === "low" || gapPercent <= 30) return "Low";
  return "Medium";
}

function getMatchLabel(score) {
  if (score >= 80) return "Excellent Match";
  if (score >= 65) return "Good Match";
  if (score >= 45) return "Moderate Match";
  return "Needs Improvement";
}

function buildRadar(requiredSkills, ownedSkills, gapSkills) {
  return DIMENSIONS.map((dimension) => {
    const requiredByDimension = requiredSkills.filter((skill) => skill.dimension === dimension);
    const ownedByDimension = ownedSkills.filter((skill) => skill.dimension === dimension);
    const gapByDimension = gapSkills.filter((skill) => skill.dimension === dimension);
    const allUserScores = [
      ...ownedByDimension.map((skill) => skill.userScore),
      ...gapByDimension.map((skill) => skill.userScore),
    ];

    const benchmarkScore =
      requiredByDimension.length === 0
        ? 0
        : Math.round(
            requiredByDimension.reduce((total, skill) => total + skill.requiredScore, 0) /
              requiredByDimension.length
          );

    const userScore =
      allUserScores.length === 0
        ? 0
        : Math.round(allUserScores.reduce((total, score) => total + score, 0) / allUserScores.length);

    return {
      dimension,
      userScore,
      benchmarkScore,
    };
  });
}

function buildCourseRecommendations(gapSkills) {
  return gapSkills
    .flatMap((skill) =>
      getCourseRecommendations(skill.normalizedName).map((course) => ({
        ...course,
        skillName: skill.name,
        priority: skill.priority,
      }))
    )
    .slice(0, 5);
}

function calculateEstimatedMonths(gapSkills) {
  const effort = gapSkills.reduce((total, skill) => {
    if (skill.priority === "High Priority") return total + 1;
    if (skill.priority === "Medium") return total + 0.75;
    return total + 0.45;
  }, 0);

  return Math.max(1, Math.ceil(effort));
}

function calculateAnalysis({ target, benchmark, userSkills }) {
  const userSkillMap = buildUserSkillMap(userSkills);
  const ownedSkills = [];
  const gapSkills = [];
  let weightedScore = 0;
  let totalWeight = 0;

  for (const requiredSkill of benchmark.requiredSkills) {
    const normalizedName = normalizeSkillName(requiredSkill.name);
    const userSkill = findMatchingUserSkill(requiredSkill, userSkillMap);
    const userScore = userSkill ? getUserScore(userSkill.proficiencyLevel) : 0;
    const matchPercent = Math.min(100, Math.round((userScore / requiredSkill.requiredScore) * 100));
    const gapPercent = Math.max(0, requiredSkill.requiredScore - userScore);

    weightedScore += Math.min(userScore / requiredSkill.requiredScore, 1) * requiredSkill.weight;
    totalWeight += requiredSkill.weight;

    const base = {
      name: requiredSkill.name,
      normalizedName,
      category: requiredSkill.category,
      dimension: requiredSkill.dimension,
      userScore,
      requiredScore: requiredSkill.requiredScore,
      matchPercent,
      weight: requiredSkill.weight,
    };

    if (userSkill && userScore >= requiredSkill.requiredScore) {
      ownedSkills.push({
        ...base,
        userSkillId: userSkill.id,
        proficiencyLevel: userSkill.proficiencyLevel,
      });
    } else {
      gapSkills.push({
        ...base,
        gapPercent,
        priority: getPriority(gapPercent, requiredSkill.priority),
      });

      if (userSkill) {
        ownedSkills.push({
          ...base,
          userSkillId: userSkill.id,
          proficiencyLevel: userSkill.proficiencyLevel,
        });
      }
    }
  }

  const overallMatchScore = totalWeight === 0 ? 0 : Math.round((weightedScore / totalWeight) * 100);
  const fulfilledSkillCount = benchmark.requiredSkills.length - gapSkills.length;
  const estimatedCloseGapMonths = calculateEstimatedMonths(gapSkills);

  const summary = {
    overallMatchScore,
    matchLabel: getMatchLabel(overallMatchScore),
    fulfilledSkillCount,
    totalRequiredSkillCount: benchmark.requiredSkills.length,
    gapSkillCount: gapSkills.length,
    estimatedCloseGapMonths,
  };

  return {
    target,
    summary,
    radar: buildRadar(benchmark.requiredSkills, ownedSkills, gapSkills),
    ownedSkills: ownedSkills.sort((a, b) => b.matchPercent - a.matchPercent),
    gapSkills: gapSkills.sort((a, b) => b.gapPercent - a.gapPercent),
    courseRecommendations: buildCourseRecommendations(gapSkills),
    generatedAt: new Date().toISOString(),
  };
}

async function getTargets() {
  return skillGapTargets;
}

async function analyze(userId, payload) {
  const role = findTargetOption(skillGapTargets.roles, payload.roleId);
  const industry = findTargetOption(skillGapTargets.industries, payload.industryId);
  const level = findTargetOption(skillGapTargets.levels, payload.levelId);

  if (!role || !industry || !level) {
    throw new ApiError(400, "Target role, industry, or level is invalid.");
  }

  const benchmark = getBenchmark(payload);

  if (!benchmark) {
    throw new ApiError(404, "Skill benchmark for selected target was not found.");
  }

  const userSkills = await skillGapRepository.getUserSkills(userId);

  if (userSkills.length === 0) {
    throw new ApiError(400, "Please complete onboarding skills before running skill gap analysis.");
  }

  const target = { role, industry, level };
  const result = calculateAnalysis({ target, benchmark, userSkills });
  const analysis = await skillGapRepository.saveAnalysis({
    userId,
    target,
    summary: result.summary,
    result,
  });

  return {
    id: analysis.id,
    ...result,
  };
}

async function getLatest(userId) {
  const analysis = await skillGapRepository.getLatestAnalysis(userId);

  if (!analysis) {
    return null;
  }

  return {
    id: analysis.id,
    ...analysis.result,
    createdAt: analysis.createdAt,
  };
}

export const skillGapService = {
  getTargets,
  analyze,
  getLatest,
};
