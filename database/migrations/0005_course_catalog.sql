-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 08: course catalog metadata and indexes

ALTER TABLE courses ADD COLUMN IF NOT EXISTS featured_order INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS estimated_lessons INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS content_status TEXT NOT NULL DEFAULT 'outline';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_objectives_zh TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_objectives_eo TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_objectives_en TEXT;

DO $$ BEGIN
  ALTER TABLE courses ADD CONSTRAINT courses_content_status_ck
    CHECK (content_status IN ('outline','partial','complete'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS courses_public_catalog_idx
  ON courses(publication_status, category, featured_order, created_at);
CREATE INDEX IF NOT EXISTS lessons_course_status_idx
  ON lessons(course_id, status, lesson_number);
