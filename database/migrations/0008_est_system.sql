-- Task 10: EST learning and knowledge contribution system.
-- EST 0.1 is an internal, non-tradable record. It has no wallet, market price,
-- redemption or governance-purchase function.

CREATE INDEX IF NOT EXISTS idx_est_records_user_status_created
  ON est_records(user_id, review_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_est_records_review_queue
  ON est_records(review_status, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_est_records_course
  ON est_records(course_id) WHERE course_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS est_course_completion_once_uq
  ON est_records(user_id, course_id, activity_type, rule_version)
  WHERE activity_type='course_completion' AND review_status <> 'revoked';

INSERT INTO est_rules (rule_version, activity_type, value, description)
VALUES
 ('EST-0.1','course_completion',1,'完成一门已发布课程后的学习记录；不等于能力认证。'),
 ('EST-0.1','translation',5,'经人工审核确认的翻译贡献基础记录值。'),
 ('EST-0.1','proofreading',3,'经人工审核确认的校对贡献基础记录值。'),
 ('EST-0.1','teaching',5,'经人工审核确认的教学贡献基础记录值。'),
 ('EST-0.1','knowledge_contribution',3,'经人工审核确认的知识贡献基础记录值。')
ON CONFLICT (rule_version, activity_type) DO NOTHING;

COMMENT ON TABLE est_records IS 'EST 0.1 internal learning/knowledge contribution records. Non-tradable, non-redeemable, non-investment.';
