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

function mapAnalysis(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    targetRole: row.target_role,
    targetRoleId: row.target_role_id,
    industry: row.industry,
    industryId: row.industry_id,
    level: row.level,
    levelId: row.level_id,
    overallMatchScore: row.overall_match_score,
    fulfilledSkillCount: row.fulfilled_skill_count,
    totalRequiredSkillCount: row.total_required_skill_count,
    gapSkillCount: row.gap_skill_count,
    estimatedCloseGapMonths: row.estimated_close_gap_months,
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

async function saveAnalysis({ userId, target, summary, result }) {
  const dbResult = await query(
    `INSERT INTO skill_gap_analyses (
       user_id, target_role, target_role_id, industry, industry_id, level, level_id,
       overall_match_score, fulfilled_skill_count, total_required_skill_count,
       gap_skill_count, estimated_close_gap_months, result
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id, user_id, target_role, target_role_id, industry, industry_id, level, level_id,
               overall_match_score, fulfilled_skill_count, total_required_skill_count,
               gap_skill_count, estimated_close_gap_months, result, created_at`,
    [
      userId,
      target.role.name,
      target.role.id,
      target.industry.name,
      target.industry.id,
      target.level.name,
      target.level.id,
      summary.overallMatchScore,
      summary.fulfilledSkillCount,
      summary.totalRequiredSkillCount,
      summary.gapSkillCount,
      summary.estimatedCloseGapMonths,
      JSON.stringify(result),
    ]
  );

  return mapAnalysis(dbResult.rows[0]);
}

async function getLatestAnalysis(userId) {
  const result = await query(
    `SELECT id, user_id, target_role, target_role_id, industry, industry_id, level, level_id,
            overall_match_score, fulfilled_skill_count, total_required_skill_count,
            gap_skill_count, estimated_close_gap_months, result, created_at
     FROM skill_gap_analyses
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  return mapAnalysis(result.rows[0]);
}

export const skillGapRepository = {
  getUserSkills,
  saveAnalysis,
  getLatestAnalysis,
};
