-- Feniksa Civilizo Web4 0.1 Alpha
-- DAD governance change report archive registry.

CREATE TABLE IF NOT EXISTS governance_archive_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_snapshot_date DATE NOT NULL REFERENCES governance_archive_snapshots(snapshot_date) ON DELETE RESTRICT,
  to_snapshot_date DATE NOT NULL REFERENCES governance_archive_snapshots(snapshot_date) ON DELETE RESTRICT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT governance_archive_reports_date_order_ck CHECK (from_snapshot_date < to_snapshot_date),
  CONSTRAINT governance_archive_reports_pair_uk UNIQUE (from_snapshot_date,to_snapshot_date)
);

CREATE INDEX IF NOT EXISTS governance_archive_reports_created_idx
  ON governance_archive_reports(created_at DESC);

COMMENT ON TABLE governance_archive_reports IS
  'Registry of intentionally archived public DAD governance change reports. Each ordered snapshot pair may be archived once.';
