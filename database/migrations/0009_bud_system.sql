-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 11: BUD vow-action and public-service record system.
-- BUD 0.1 is a non-tradable contribution record. It does not certify spiritual attainment.

CREATE TABLE IF NOT EXISTS bud_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_version TEXT NOT NULL,
  service_type TEXT NOT NULL,
  unit_type TEXT NOT NULL DEFAULT 'hour',
  value_per_unit NUMERIC(12,2) NOT NULL,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rule_version, service_type),
  CONSTRAINT bud_rules_service_ck CHECK (service_type IN ('volunteer_service','community_support','translation_service','museum_service','teaching_support','public_project')),
  CONSTRAINT bud_rules_unit_ck CHECK (unit_type IN ('hour','event')),
  CONSTRAINT bud_rules_value_ck CHECK (value_per_unit >= 0)
);

ALTER TABLE bud_records ADD COLUMN IF NOT EXISTS verified_hours NUMERIC(8,2);
ALTER TABLE bud_records ADD COLUMN IF NOT EXISTS project_confirmation_status TEXT NOT NULL DEFAULT 'not_required';
ALTER TABLE bud_records ADD COLUMN IF NOT EXISTS project_confirmed_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE bud_records ADD COLUMN IF NOT EXISTS project_confirmed_at TIMESTAMPTZ;
ALTER TABLE bud_records ADD COLUMN IF NOT EXISTS project_confirmation_note TEXT;

DO $$ BEGIN
  ALTER TABLE bud_records ADD CONSTRAINT bud_project_confirmation_ck
    CHECK (project_confirmation_status IN ('not_required','pending','confirmed','rejected'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_bud_records_user_status ON bud_records(user_id, review_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bud_records_pending ON bud_records(review_status, created_at) WHERE review_status='pending';
CREATE INDEX IF NOT EXISTS idx_bud_records_project_confirmation ON bud_records(project_id, project_confirmation_status, created_at) WHERE project_id IS NOT NULL;

INSERT INTO bud_rules(rule_version,service_type,unit_type,value_per_unit,description) VALUES
 ('BUD-0.1','volunteer_service','hour',1,'Verified general volunteer service: 1 BUD record unit per confirmed hour.'),
 ('BUD-0.1','community_support','hour',1,'Verified community support: 1 BUD record unit per confirmed hour.'),
 ('BUD-0.1','translation_service','hour',1,'Verified public-interest translation service: 1 BUD record unit per confirmed hour.'),
 ('BUD-0.1','museum_service','hour',1,'Verified museum/archive service: 1 BUD record unit per confirmed hour.'),
 ('BUD-0.1','teaching_support','hour',1,'Verified teaching support: 1 BUD record unit per confirmed hour.'),
 ('BUD-0.1','public_project','event',5,'Verified public-project milestone/event: 5 BUD record units per approved event.')
ON CONFLICT(rule_version,service_type) DO NOTHING;

COMMENT ON TABLE bud_rules IS 'Rules for internal non-tradable BUD contribution records. No cash value, exchange function, investment return, or spiritual rank.';
COMMENT ON COLUMN bud_records.bud_value IS 'Derived by server-side BUD rule after verification; never user-entered.';
COMMENT ON COLUMN bud_records.project_confirmation_status IS 'Project-linked service requires project confirmation before final administrative approval.';
