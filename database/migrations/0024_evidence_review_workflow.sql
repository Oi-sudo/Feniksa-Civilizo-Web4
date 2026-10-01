-- Task 24: evidence verification workflow and history.
-- "reviewed" means the attachment has been archivally reviewed; it does not authenticate
-- the object's age, material, provenance or scientific identity.

ALTER TABLE asset_media
  ADD COLUMN IF NOT EXISTS source_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS source_confirmed_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES users(id);

CREATE TABLE IF NOT EXISTS asset_media_review_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid NOT NULL REFERENCES asset_media(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES cultural_assets(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL CHECK (to_status IN ('unverified','source_confirmed','reviewed')),
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_asset_media_review_events_media
  ON asset_media_review_events(media_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_asset_media_review_events_asset
  ON asset_media_review_events(asset_id,created_at DESC);

-- Earlier evidence code records evidence_added in the asset review event stream.
-- Expand the event vocabulary so runtime inserts do not fail.
ALTER TABLE asset_review_events DROP CONSTRAINT IF EXISTS asset_review_events_event_type_check;
ALTER TABLE asset_review_events ADD CONSTRAINT asset_review_events_event_type_check
  CHECK (event_type IN ('created','updated','submitted','changes_requested','approved','published','archived','restored','evidence_added','evidence_source_confirmed','evidence_reviewed'));

-- New attachments begin unverified; source confirmation is an explicit human action.
UPDATE asset_media
SET verification_status='unverified'
WHERE verification_status='source_confirmed'
  AND source_confirmed_at IS NULL
  AND source_confirmed_by IS NULL;
