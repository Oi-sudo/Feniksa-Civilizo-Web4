-- Task 14: museum intake, review, publication and archive workflow

INSERT INTO roles (code, name_zh, name_eo, name_en)
VALUES
  ('curator','馆员','kuratoro','Curator'),
  ('museum_reviewer','馆藏审核员','muzea kontrolanto','Museum reviewer')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE cultural_assets
  ADD COLUMN IF NOT EXISTS workflow_status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS submitted_for_review_at timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_for_review_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS review_note text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS archive_reason text;

DO $$ BEGIN
  ALTER TABLE cultural_assets
    ADD CONSTRAINT cultural_assets_workflow_status_check
    CHECK (workflow_status IN ('draft','review','changes_requested','approved','published','archived'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

UPDATE cultural_assets
SET workflow_status = CASE
  WHEN public_status='published' THEN 'published'
  WHEN public_status='archived' THEN 'archived'
  ELSE COALESCE(NULLIF(workflow_status,''),'draft')
END
WHERE workflow_status IS NULL OR workflow_status='draft';

CREATE INDEX IF NOT EXISTS idx_cultural_assets_workflow_status ON cultural_assets(workflow_status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cultural_assets_review_queue ON cultural_assets(submitted_for_review_at DESC) WHERE workflow_status='review';

CREATE TABLE IF NOT EXISTS asset_review_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES cultural_assets(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('created','updated','submitted','changes_requested','approved','published','archived','restored')),
  actor_id uuid REFERENCES users(id),
  note text,
  snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_review_events_asset ON asset_review_events(asset_id, created_at DESC);
