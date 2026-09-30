-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 15: DAD proposal drafting, public discussion, revision history.

ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS short_code TEXT,
  ADD COLUMN IF NOT EXISTS last_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS revision_reason TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS proposals_short_code_uidx
  ON proposals(short_code) WHERE short_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS proposals_status_created_idx ON proposals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS proposals_author_status_idx ON proposals(author_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS proposal_comments_proposal_created_idx ON proposal_comments(proposal_id, created_at ASC)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS proposal_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  from_status proposal_status,
  to_status proposal_status NOT NULL,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS proposal_status_events_proposal_idx
  ON proposal_status_events(proposal_id, created_at ASC);

CREATE TABLE IF NOT EXISTS proposal_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  editor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  snapshot JSONB NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(proposal_id, revision_number)
);

CREATE INDEX IF NOT EXISTS proposal_revisions_proposal_idx
  ON proposal_revisions(proposal_id, revision_number DESC);

COMMENT ON TABLE proposal_status_events IS 'Append-only DAD proposal workflow history; Task 15 does not implement voting.';
COMMENT ON TABLE proposal_revisions IS 'Snapshots preserve proposal wording before formal discussion and later revisions.';
