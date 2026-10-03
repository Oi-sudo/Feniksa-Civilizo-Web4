-- Feniksa Civilizo Web4 0.2
-- Volunteer task review: separate participant submission from confirmed service.

ALTER TABLE volunteer_task_assignments
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_note TEXT;

DO $$ BEGIN
  ALTER TABLE volunteer_task_assignments
    ADD CONSTRAINT volunteer_task_assignments_review_status_ck
    CHECK (review_status IN ('pending','approved','rejected'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS volunteer_task_assignments_review_idx
  ON volunteer_task_assignments(review_status,completed_at DESC)
  WHERE status='completed';

COMMENT ON COLUMN volunteer_task_assignments.review_status IS
  'Participant completion is self-submitted. approved means administrator-confirmed service; rejected means returned for correction.';
