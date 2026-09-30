-- Task 09: strengthen lesson-level learning progress.
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_course_status ON learning_progress(user_id, course_id, status);
CREATE INDEX IF NOT EXISTS idx_learning_progress_lesson ON learning_progress(lesson_id);
COMMENT ON TABLE learning_progress IS 'Per-user lesson progress. Course completion is derived from published lesson completion; it does not certify competence or spiritual attainment.';
