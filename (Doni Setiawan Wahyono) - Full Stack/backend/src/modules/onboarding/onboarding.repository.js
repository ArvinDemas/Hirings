import { query } from "../../config/db.js";

function mapProfile(row) {
  if (!row) {
    return null;
  }

  return {
    userId: row.user_id,
    inputMethod: row.input_method,
    status: row.status,
    progress: row.progress,
    aiStatus: row.ai_status,
    aiError: row.ai_error,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUpload(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    originalName: row.original_name,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    checksumSha256: row.checksum_sha256,
    aiStatus: row.ai_status,
    aiResponse: row.ai_response,
    aiError: row.ai_error,
    createdAt: row.created_at,
  };
}

function mapSkill(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    name: row.skill_name,
    normalizedName: row.normalized_name,
    proficiencyLevel: row.proficiency_level,
    source: row.source,
    confidence: row.confidence === null ? null : Number(row.confidence),
    isConfirmed: row.is_confirmed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getProfile(userId) {
  const result = await query(
    `SELECT user_id, input_method, status, progress, ai_status, ai_error,
            completed_at, created_at, updated_at
     FROM onboarding_profiles
     WHERE user_id = $1`,
    [userId]
  );

  return mapProfile(result.rows[0]);
}

async function upsertProfile({
  userId,
  inputMethod,
  status,
  progress,
  aiStatus,
  aiError = null,
  completedAt = null,
}) {
  const result = await query(
    `INSERT INTO onboarding_profiles (
       user_id, input_method, status, progress, ai_status, ai_error, completed_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id)
     DO UPDATE SET
       input_method = EXCLUDED.input_method,
       status = EXCLUDED.status,
       progress = EXCLUDED.progress,
       ai_status = EXCLUDED.ai_status,
       ai_error = EXCLUDED.ai_error,
       completed_at = EXCLUDED.completed_at
     RETURNING user_id, input_method, status, progress, ai_status, ai_error,
               completed_at, created_at, updated_at`,
    [userId, inputMethod, status, progress, aiStatus, aiError, completedAt]
  );

  return mapProfile(result.rows[0]);
}

async function createCvUpload({ userId, originalName, mimeType, fileSize, checksumSha256 }) {
  const result = await query(
    `INSERT INTO cv_uploads (user_id, original_name, mime_type, file_size, checksum_sha256)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, original_name, mime_type, file_size, checksum_sha256,
               ai_status, ai_response, ai_error, created_at`,
    [userId, originalName, mimeType, fileSize, checksumSha256]
  );

  return mapUpload(result.rows[0]);
}

async function updateCvUploadAiResult({ uploadId, aiStatus, aiResponse = null, aiError = null }) {
  const result = await query(
    `UPDATE cv_uploads
     SET ai_status = $2, ai_response = $3, ai_error = $4
     WHERE id = $1
     RETURNING id, user_id, original_name, mime_type, file_size, checksum_sha256,
               ai_status, ai_response, ai_error, created_at`,
    [uploadId, aiStatus, aiResponse, aiError]
  );

  return mapUpload(result.rows[0]);
}

async function getLatestCvUpload(userId) {
  const result = await query(
    `SELECT id, user_id, original_name, mime_type, file_size, checksum_sha256,
            ai_status, ai_response, ai_error, created_at
     FROM cv_uploads
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  return mapUpload(result.rows[0]);
}

async function replaceUserSkills({ userId, skills, source, isConfirmed }) {
  await query("DELETE FROM user_skills WHERE user_id = $1", [userId]);

  if (skills.length === 0) {
    return [];
  }

  const insertedSkills = [];

  for (const skill of skills) {
    const result = await query(
      `INSERT INTO user_skills (
         user_id, skill_name, normalized_name, proficiency_level, source, confidence, is_confirmed
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, normalized_name)
       DO UPDATE SET
         skill_name = EXCLUDED.skill_name,
         proficiency_level = EXCLUDED.proficiency_level,
         source = EXCLUDED.source,
         confidence = EXCLUDED.confidence,
         is_confirmed = EXCLUDED.is_confirmed
       RETURNING id, user_id, skill_name, normalized_name, proficiency_level, source,
                 confidence, is_confirmed, created_at, updated_at`,
      [
        userId,
        skill.name,
        skill.normalizedName,
        skill.proficiencyLevel ?? null,
        source,
        skill.confidence ?? null,
        isConfirmed,
      ]
    );

    insertedSkills.push(mapSkill(result.rows[0]));
  }

  return insertedSkills;
}

async function getUserSkills(userId) {
  const result = await query(
    `SELECT id, user_id, skill_name, normalized_name, proficiency_level, source,
            confidence, is_confirmed, created_at, updated_at
     FROM user_skills
     WHERE user_id = $1
     ORDER BY is_confirmed DESC, skill_name ASC`,
    [userId]
  );

  return result.rows.map(mapSkill);
}

async function confirmExistingSkills(userId) {
  const result = await query(
    `UPDATE user_skills
     SET is_confirmed = TRUE, source = CASE WHEN source = 'edited' THEN source ELSE source END
     WHERE user_id = $1
     RETURNING id, user_id, skill_name, normalized_name, proficiency_level, source,
               confidence, is_confirmed, created_at, updated_at`,
    [userId]
  );

  return result.rows.map(mapSkill);
}

async function deleteUserSkill({ userId, skillId }) {
  const result = await query(
    `DELETE FROM user_skills
     WHERE user_id = $1 AND id = $2
     RETURNING id`,
    [userId, skillId]
  );

  return result.rowCount > 0;
}

export const onboardingRepository = {
  getProfile,
  upsertProfile,
  createCvUpload,
  updateCvUploadAiResult,
  getLatestCvUpload,
  replaceUserSkills,
  getUserSkills,
  confirmExistingSkills,
  deleteUserSkill,
};
