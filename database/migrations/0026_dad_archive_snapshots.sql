-- Feniksa Civilizo Web4 0.1 Alpha
-- DAD public governance archive snapshots.

CREATE TABLE IF NOT EXISTS governance_archive_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL UNIQUE,
  proposal_count INTEGER NOT NULL DEFAULT 0,
  decision_count INTEGER NOT NULL DEFAULT 0,
  governance_event_count INTEGER NOT NULL DEFAULT 0,
  project_count INTEGER NOT NULL DEFAULT 0,
  milestone_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT governance_archive_snapshots_nonnegative_ck CHECK (
    proposal_count >= 0 AND decision_count >= 0 AND governance_event_count >= 0 AND project_count >= 0 AND milestone_count >= 0
  )
);

CREATE INDEX IF NOT EXISTS governance_archive_snapshots_date_idx
  ON governance_archive_snapshots(snapshot_date DESC);

COMMENT ON TABLE governance_archive_snapshots IS
  'Daily read-only summary snapshots for the public DAD governance archive. Each date is unique and stores aggregate public counts only.';
