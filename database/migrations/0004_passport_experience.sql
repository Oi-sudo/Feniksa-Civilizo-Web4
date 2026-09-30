-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 07: learning passport experience, portfolio, and privacy support.

CREATE TABLE IF NOT EXISTS project_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participation_role TEXT NOT NULL DEFAULT 'participant',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  PRIMARY KEY (project_id, user_id),
  CONSTRAINT project_members_status_ck CHECK (status IN ('active','completed','withdrawn'))
);

CREATE INDEX IF NOT EXISTS project_members_user_idx ON project_members(user_id, status);

CREATE TABLE IF NOT EXISTS passport_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  visibility TEXT NOT NULL DEFAULT 'private',
  status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT passport_works_type_ck CHECK (work_type IN ('translation','article','video','museum_record','course_work','research','other')),
  CONSTRAINT passport_works_visibility_ck CHECK (visibility IN ('private','members','public'))
);

CREATE INDEX IF NOT EXISTS passport_works_user_idx ON passport_works(user_id, created_at DESC) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS passport_works_updated_at ON passport_works;
CREATE TRIGGER passport_works_updated_at BEFORE UPDATE ON passport_works
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
