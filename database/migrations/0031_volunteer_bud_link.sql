-- Feniksa Civilizo Web4 0.2
-- Controlled link from administrator-confirmed volunteer service to BUD review.

ALTER TABLE bud_records
  ADD COLUMN IF NOT EXISTS source_volunteer_task_id UUID REFERENCES volunteer_tasks(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS bud_records_volunteer_source_uq
  ON bud_records(user_id,source_volunteer_task_id)
  WHERE source_volunteer_task_id IS NOT NULL AND revoked_at IS NULL;

COMMENT ON COLUMN bud_records.source_volunteer_task_id IS
  'Optional source volunteer task. A confirmed volunteer task may create at most one active BUD review request per user; confirmation does not automatically grant BUD.';
