-- Task 25: explicit media visibility for museum collection materials.
-- Existing and newly registered materials are NOT public by default.
-- Public display requires a separate human publication action.

ALTER TABLE asset_media
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_by uuid REFERENCES users(id);

DO $$ BEGIN
  ALTER TABLE asset_media ADD CONSTRAINT asset_media_visibility_ck
    CHECK (visibility IN ('private','reviewer','public'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_asset_media_public
  ON asset_media(asset_id,visibility,created_at);

-- Earlier admin-added rows may already exist. Keep them non-public unless explicitly released.
UPDATE asset_media SET visibility='reviewer'
WHERE visibility='private' AND verification_status IN ('source_confirmed','reviewed');

ALTER TABLE asset_review_events DROP CONSTRAINT IF EXISTS asset_review_events_event_type_check;
ALTER TABLE asset_review_events ADD CONSTRAINT asset_review_events_event_type_check
  CHECK (event_type IN (
    'created','updated','submitted','changes_requested','approved','published','archived','restored',
    'evidence_added','evidence_source_confirmed','evidence_reviewed','evidence_published','evidence_hidden'
  ));
