-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 02: PostgreSQL core schema
-- Design principles: auditable, multilingual, non-trading EST/BUD, WFB registry only.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('active','suspended','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE record_status AS ENUM ('pending','approved','rejected','revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE publication_status AS ENUM ('draft','review','published','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE learning_status AS ENUM ('not_started','in_progress','completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE proposal_status AS ENUM ('draft','discussion','revision','voting','approved','rejected','executing','completed','terminated','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE vote_type AS ENUM ('approve','reject','abstain','revise');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE risk_level AS ENUM ('green','yellow','orange','red');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE auth_level AS ENUM ('A','B','C','D','E');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE media_type AS ENUM ('image','video','document','certificate','3d_model');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE term_status AS ENUM ('active','alternative','research','deprecated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- COMMON FUNCTION ----------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------- IDENTITY / RBAC ----------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT,
  preferred_language VARCHAR(8) NOT NULL DEFAULT 'zh',
  account_status account_status NOT NULL DEFAULT 'active',
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT users_email_lower_ck CHECK (email = lower(email)),
  CONSTRAINT users_lang_ck CHECK (preferred_language IN ('zh','eo','en'))
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_active_uq
  ON users(email) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_eo TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT user_roles_status_ck CHECK (status IN ('active','inactive','revoked'))
);

-- ---------- LEARNING PASSPORT ----------
CREATE TABLE IF NOT EXISTS learning_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  public_visibility TEXT NOT NULL DEFAULT 'private',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT passport_visibility_ck CHECK (public_visibility IN ('private','members','public'))
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_zh TEXT NOT NULL,
  title_eo TEXT,
  title_en TEXT,
  description_zh TEXT,
  description_eo TEXT,
  description_en TEXT,
  category TEXT NOT NULL,
  level TEXT,
  version TEXT NOT NULL DEFAULT '0.1',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  access_level TEXT NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT courses_category_ck CHECK (category IN ('esperanto','buddhist_study','six_yao','dad_governance','web4','museum','ai')),
  CONSTRAINT courses_access_ck CHECK (access_level IN ('public','registered','member','staff'))
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title_zh TEXT NOT NULL,
  title_eo TEXT,
  title_en TEXT,
  content_zh TEXT,
  content_eo TEXT,
  content_en TEXT,
  status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, lesson_number)
);

CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  status learning_status NOT NULL DEFAULT 'not_started',
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id, lesson_id),
  CONSTRAINT learning_progress_percent_ck CHECK (progress_percent >= 0 AND progress_percent <= 100)
);

CREATE TABLE IF NOT EXISTS six_yao_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  yao_stage SMALLINT NOT NULL,
  learning_status learning_status NOT NULL DEFAULT 'not_started',
  practice_status TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, yao_stage),
  CONSTRAINT six_yao_stage_ck CHECK (yao_stage BETWEEN 1 AND 6)
);

-- ---------- PROJECTS (defined before EST/BUD because they reference projects) ----------
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  proposal_id UUID,
  budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  spent NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'green',
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT projects_money_ck CHECK (budget >= 0 AND spent >= 0),
  CONSTRAINT projects_status_ck CHECK (status IN ('draft','approved','active','paused','completed','terminated','archived'))
);

-- ---------- EST ----------
CREATE TABLE IF NOT EXISTS est_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_version TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  value NUMERIC(12,2) NOT NULL,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rule_version, activity_type),
  CONSTRAINT est_value_nonnegative_ck CHECK (value >= 0)
);

CREATE TABLE IF NOT EXISTS est_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  evidence_url TEXT,
  est_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  rule_version TEXT NOT NULL,
  review_status record_status NOT NULL DEFAULT 'pending',
  reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  CONSTRAINT est_activity_ck CHECK (activity_type IN ('course_completion','translation','proofreading','teaching','knowledge_contribution')),
  CONSTRAINT est_nonnegative_ck CHECK (est_value >= 0)
);

-- ---------- BUD ----------
CREATE TABLE IF NOT EXISTS bud_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  hours NUMERIC(8,2),
  evidence_url TEXT,
  bud_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  rule_version TEXT NOT NULL,
  review_status record_status NOT NULL DEFAULT 'pending',
  reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  CONSTRAINT bud_service_ck CHECK (service_type IN ('volunteer_service','community_support','translation_service','museum_service','teaching_support','public_project')),
  CONSTRAINT bud_hours_ck CHECK (hours IS NULL OR hours >= 0),
  CONSTRAINT bud_nonnegative_ck CHECK (bud_value >= 0)
);

-- ---------- MUSEUM ----------
CREATE TABLE IF NOT EXISTS museum_halls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title_zh TEXT NOT NULL,
  title_eo TEXT,
  title_en TEXT,
  description_zh TEXT,
  description_eo TEXT,
  description_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultural_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permanent_code TEXT NOT NULL UNIQUE,
  batch_code TEXT,
  title_zh TEXT NOT NULL,
  title_eo TEXT,
  title_en TEXT,
  primary_hall_id UUID REFERENCES museum_halls(id) ON DELETE SET NULL,
  category TEXT,
  material TEXT,
  period_description TEXT,
  dimensions TEXT,
  weight TEXT,
  provenance TEXT,
  ownership_status TEXT NOT NULL DEFAULT 'ownership_pending',
  authentication_level auth_level NOT NULL DEFAULT 'E',
  valuation_status TEXT NOT NULL DEFAULT 'not_valued',
  digital_rights_status TEXT NOT NULL DEFAULT 'pending',
  public_status publication_status NOT NULL DEFAULT 'draft',
  current_location_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT asset_ownership_ck CHECK (ownership_status IN ('private','public_institution','dad_legal_entity','long_term_loan','temporary_loan','digital_display_license','donation_in_process','permanent_donation','ownership_pending')),
  CONSTRAINT asset_valuation_ck CHECK (valuation_status IN ('not_valued','holder_aspiration','market_reference','expert_opinion','auction_reference','formal_report')),
  CONSTRAINT asset_rights_ck CHECK (digital_rights_status IN ('pending','authorized_noncommercial','authorized_commercial','restricted','expired'))
);

CREATE TABLE IF NOT EXISTS asset_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES cultural_assets(id) ON DELETE CASCADE,
  media_type media_type NOT NULL,
  file_url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  copyright_status TEXT NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asset_research_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES cultural_assets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  note_type TEXT NOT NULL,
  content TEXT NOT NULL,
  source_reference TEXT,
  status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asset_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES cultural_assets(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  change_summary TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(asset_id, version_number)
);

CREATE TABLE IF NOT EXISTS cultural_support_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  purpose TEXT NOT NULL,
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'recorded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT support_amount_ck CHECK (amount >= 0),
  CONSTRAINT support_status_ck CHECK (status IN ('recorded','confirmed','refunded','cancelled'))
);

-- ---------- DAD GOVERNANCE ----------
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  problem_statement TEXT NOT NULL,
  proposed_solution TEXT NOT NULL,
  budget_requested NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  public_value TEXT,
  risk_description TEXT,
  status proposal_status NOT NULL DEFAULT 'draft',
  discussion_start TIMESTAMPTZ,
  discussion_end TIMESTAMPTZ,
  vote_start TIMESTAMPTZ,
  vote_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT proposal_budget_ck CHECK (budget_requested >= 0)
);

ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_proposal_fk;
ALTER TABLE projects
  ADD CONSTRAINT projects_proposal_fk FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS proposal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS proposal_votes (
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (proposal_id, user_id)
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  CONSTRAINT milestone_status_ck CHECK (status IN ('pending','in_progress','completed','blocked','cancelled'))
);

CREATE TABLE IF NOT EXISTS project_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  output_type TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  risk_level risk_level NOT NULL,
  description TEXT NOT NULL,
  reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  CONSTRAINT project_risk_status_ck CHECK (status IN ('open','mitigating','resolved','accepted'))
);

-- ---------- SYSTEM TERMS (Task 21 prepared early) ----------
CREATE TABLE IF NOT EXISTS system_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_key TEXT NOT NULL,
  zh TEXT NOT NULL,
  eo TEXT,
  en TEXT,
  status term_status NOT NULL DEFAULT 'active',
  version TEXT NOT NULL DEFAULT '1.0',
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(term_key, version)
);

-- ---------- AUDIT / NOTIFICATIONS ----------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- INDEXES ----------
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_course ON learning_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_est_records_user ON est_records(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_est_records_status ON est_records(review_status);
CREATE INDEX IF NOT EXISTS idx_bud_records_user ON bud_records(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bud_records_status ON bud_records(review_status);
CREATE INDEX IF NOT EXISTS idx_assets_hall ON cultural_assets(primary_hall_id);
CREATE INDEX IF NOT EXISTS idx_assets_auth ON cultural_assets(authentication_level);
CREATE INDEX IF NOT EXISTS idx_assets_public_status ON cultural_assets(public_status);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at);

-- ---------- UPDATED_AT TRIGGERS ----------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','learning_passports','courses','lessons','learning_progress','six_yao_progress','projects','cultural_assets','proposals','proposal_votes']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I', t, t);
    EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', t, t);
  END LOOP;
END $$;

-- ---------- COMMENTS / NON-FINANCIAL BOUNDARY ----------
COMMENT ON TABLE est_records IS 'Internal non-tradable education/knowledge contribution records. No market-price or exchange function in Web4 0.1.';
COMMENT ON TABLE bud_records IS 'Internal non-tradable vow/public-service contribution records. Not a spiritual attainment score.';
COMMENT ON TABLE cultural_support_records IS 'WFB 0.1 support registry only; no token issuance, market price, exchange, or RWA transaction functionality.';
COMMENT ON TABLE six_yao_progress IS 'Learning/practice pathway record only; not certification of religious attainment or human rank.';
