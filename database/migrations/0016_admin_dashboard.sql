-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 18: dashboard/read-model indexes for pending work and risk triage.
-- Runtime-import correction: audit_logs uses created_at, not timestamp.

CREATE INDEX IF NOT EXISTS users_status_dashboard_idx ON users(account_status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS est_pending_dashboard_idx ON est_records(review_status,created_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS bud_pending_dashboard_idx ON bud_records(review_status,created_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS assets_workflow_dashboard_idx ON cultural_assets(public_status,updated_at);
CREATE INDEX IF NOT EXISTS project_budget_pending_dashboard_idx ON project_budget_events(status,created_at) WHERE event_type='budget_change';
CREATE INDEX IF NOT EXISTS project_risk_dashboard_idx ON project_risks(risk_level,status,created_at);
CREATE INDEX IF NOT EXISTS proposal_dashboard_idx ON proposals(status,created_at);
CREATE INDEX IF NOT EXISTS audit_dashboard_idx ON audit_logs(created_at DESC);
