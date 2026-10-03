-- Feniksa Civilizo Web4 0.2
-- Volunteer participation profile and task-interest registration.

CREATE TABLE IF NOT EXISTS volunteer_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  interests TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT,
  note TEXT,
  consent_public_contact BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT volunteer_profiles_status_ck CHECK (status IN ('active','paused','withdrawn'))
);

CREATE INDEX IF NOT EXISTS volunteer_profiles_status_idx
  ON volunteer_profiles(status, updated_at DESC);

DROP TRIGGER IF EXISTS volunteer_profiles_updated_at ON volunteer_profiles;
CREATE TRIGGER volunteer_profiles_updated_at BEFORE UPDATE ON volunteer_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE volunteer_profiles IS
  'Web4 0.2 volunteer interests. Participation registration does not grant governance authority or financial entitlement.';
