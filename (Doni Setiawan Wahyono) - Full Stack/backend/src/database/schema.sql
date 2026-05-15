CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS onboarding_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  input_method VARCHAR(30),
  status VARCHAR(30) NOT NULL DEFAULT 'not_started',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  ai_status VARCHAR(30) NOT NULL DEFAULT 'idle',
  ai_error TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_onboarding_input_method
    CHECK (input_method IS NULL OR input_method IN ('cv_upload', 'manual')),
  CONSTRAINT chk_onboarding_status
    CHECK (status IN ('not_started', 'needs_review', 'completed')),
  CONSTRAINT chk_onboarding_ai_status
    CHECK (ai_status IN ('idle', 'processing', 'succeeded', 'failed', 'skipped'))
);

DROP TRIGGER IF EXISTS trg_onboarding_profiles_updated_at ON onboarding_profiles;

CREATE TRIGGER trg_onboarding_profiles_updated_at
BEFORE UPDATE ON onboarding_profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS cv_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0),
  checksum_sha256 VARCHAR(64) NOT NULL,
  ai_status VARCHAR(30) NOT NULL DEFAULT 'processing',
  ai_response JSONB,
  ai_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_cv_upload_ai_status
    CHECK (ai_status IN ('processing', 'succeeded', 'failed', 'skipped'))
);

CREATE INDEX IF NOT EXISTS idx_cv_uploads_user_id_created_at
  ON cv_uploads (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(120) NOT NULL,
  normalized_name VARCHAR(120) NOT NULL,
  proficiency_level VARCHAR(30),
  source VARCHAR(30) NOT NULL,
  confidence NUMERIC(5, 4),
  is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_user_skill_source
    CHECK (source IN ('cv_upload', 'manual', 'edited')),
  CONSTRAINT chk_user_skill_proficiency
    CHECK (
      proficiency_level IS NULL
      OR proficiency_level IN ('beginner', 'intermediate', 'advanced')
    ),
  CONSTRAINT chk_user_skill_confidence
    CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  CONSTRAINT uq_user_skills_normalized_name UNIQUE (user_id, normalized_name)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id_confirmed
  ON user_skills (user_id, is_confirmed);

DROP TRIGGER IF EXISTS trg_user_skills_updated_at ON user_skills;

CREATE TRIGGER trg_user_skills_updated_at
BEFORE UPDATE ON user_skills
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS skill_gap_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_role VARCHAR(120) NOT NULL,
  target_role_id VARCHAR(80) NOT NULL,
  industry VARCHAR(120) NOT NULL,
  industry_id VARCHAR(80) NOT NULL,
  level VARCHAR(80) NOT NULL,
  level_id VARCHAR(80) NOT NULL,
  overall_match_score INTEGER NOT NULL CHECK (
    overall_match_score >= 0 AND overall_match_score <= 100
  ),
  fulfilled_skill_count INTEGER NOT NULL DEFAULT 0,
  total_required_skill_count INTEGER NOT NULL DEFAULT 0,
  gap_skill_count INTEGER NOT NULL DEFAULT 0,
  estimated_close_gap_months INTEGER NOT NULL DEFAULT 0,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_gap_analyses_user_id_created_at
  ON skill_gap_analyses (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS career_recommendation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_role_id VARCHAR(80),
  target_role VARCHAR(120),
  level_id VARCHAR(80),
  level VARCHAR(80),
  industry_filter VARCHAR(80) NOT NULL DEFAULT 'all',
  sort_by VARCHAR(80) NOT NULL DEFAULT 'highest-match',
  match_count INTEGER NOT NULL DEFAULT 0,
  average_ready_months INTEGER NOT NULL DEFAULT 0,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_recommendation_runs_user_id_created_at
  ON career_recommendation_runs (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS saved_career_recommendations (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_id VARCHAR(80) NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, career_id)
);
