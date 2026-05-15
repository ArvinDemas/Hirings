import { query } from "../../config/db.js";

function mapUserSkill(row) {
  return {
    id: row.id,
    name: row.skill_name,
    normalizedName: row.normalized_name,
    proficiencyLevel: row.proficiency_level,
    source: row.source,
    isConfirmed: row.is_confirmed,
  };
}

function mapSkillGapAnalysis(row) {
  if (!row) {
    return null;
  }

  return {
    targetRoleId: row.target_role_id,
    targetRole: row.target_role,
    levelId: row.level_id,
    level: row.level,
    result: row.result,
    createdAt: row.created_at,
  };
}

function mapRun(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    targetRoleId: row.target_role_id,
    targetRole: row.target_role,
    levelId: row.level_id,
    level: row.level,
    industryFilter: row.industry_filter,
    sortBy: row.sort_by,
    matchCount: row.match_count,
    averageReadyMonths: row.average_ready_months,
    result: row.result,
    createdAt: row.created_at,
  };
}

async function getUserSkills(userId) {
  const result = await query(
    `SELECT id, skill_name, normalized_name, proficiency_level, source, is_confirmed
     FROM user_skills
     WHERE user_id = $1
     ORDER BY is_confirmed DESC, skill_name ASC`,
    [userId]
  );

  return result.rows.map(mapUserSkill);
}

async function getLatestSkillGapAnalysis(userId) {
  const result = await query(
    `SELECT target_role_id, target_role, level_id, level, result, created_at
     FROM skill_gap_analyses
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  return mapSkillGapAnalysis(result.rows[0]);
}

async function getSavedCareerIds(userId) {
  const result = await query(
    `SELECT career_id
     FROM saved_career_recommendations
     WHERE user_id = $1`,
    [userId]
  );

  return new Set(result.rows.map((row) => row.career_id));
}

async function saveRun({ userId, context, filters, summary, result }) {
  const dbResult = await query(
    `INSERT INTO career_recommendation_runs (
       user_id, target_role_id, target_role, level_id, level, industry_filter, sort_by,
       match_count, average_ready_months, result
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, user_id, target_role_id, target_role, level_id, level,
               industry_filter, sort_by, match_count, average_ready_months,
               result, created_at`,
    [
      userId,
      context.targetRoleId,
      context.targetRole,
      context.levelId,
      context.level,
      filters.industryId,
      filters.sortBy,
      summary.matchCount,
      summary.averageReadyMonths,
      JSON.stringify(result),
    ]
  );

  return mapRun(dbResult.rows[0]);
}

async function getLatestRun(userId) {
  const result = await query(
    `SELECT id, user_id, target_role_id, target_role, level_id, level,
            industry_filter, sort_by, match_count, average_ready_months,
            result, created_at
     FROM career_recommendation_runs
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  return mapRun(result.rows[0]);
}

async function saveCareer({ userId, careerId }) {
  await query(
    `INSERT INTO saved_career_recommendations (user_id, career_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, career_id) DO NOTHING`,
    [userId, careerId]
  );
}

async function deleteSavedCareer({ userId, careerId }) {
  const result = await query(
    `DELETE FROM saved_career_recommendations
     WHERE user_id = $1 AND career_id = $2`,
    [userId, careerId]
  );

  return result.rowCount > 0;
}

export const careerRecommendationsRepository = {
  getUserSkills,
  getLatestSkillGapAnalysis,
  getSavedCareerIds,
  saveRun,
  getLatestRun,
  saveCareer,
  deleteSavedCareer,
};
