-- Task 23: classify museum evidence attachments.
-- Evidence role is distinct from authentication. A linked item can be original evidence,
-- publication-history evidence, comparison material, or a research reference without
-- becoming an authentication certificate.

ALTER TABLE asset_media
  ADD COLUMN IF NOT EXISTS evidence_role TEXT NOT NULL DEFAULT 'original',
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS source_note TEXT;

DO $$ BEGIN
  ALTER TABLE asset_media ADD CONSTRAINT asset_media_evidence_role_ck
    CHECK (evidence_role IN ('original','publication_history','comparison','research_reference'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE asset_media ADD CONSTRAINT asset_media_verification_status_ck
    CHECK (verification_status IN ('unverified','source_confirmed','reviewed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_asset_media_evidence_role
  ON asset_media(asset_id,evidence_role,created_at);
