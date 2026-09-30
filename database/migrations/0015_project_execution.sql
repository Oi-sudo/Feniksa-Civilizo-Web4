-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 17: DAD project execution, budget, milestones, outputs and risk management.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS approved_budget NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS completed_summary TEXT,
  ADD COLUMN IF NOT EXISTS terminated_reason TEXT;

UPDATE projects SET approved_budget = budget WHERE approved_budget IS NULL;
ALTER TABLE projects ALTER COLUMN approved_budget SET DEFAULT 0;

CREATE TABLE IF NOT EXISTS project_budget_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  note TEXT,
  requested_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  CONSTRAINT project_budget_events_type_ck CHECK (event_type IN ('initial_budget','budget_change','expense_record','adjustment')),
  CONSTRAINT project_budget_events_status_ck CHECK (status IN ('pending','approved','rejected','recorded'))
);

CREATE TABLE IF NOT EXISTS project_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE project_milestones
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE project_outputs
  ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE project_risks
  ADD COLUMN IF NOT EXISTS mitigation TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS projects_manager_idx ON projects(manager_id, status);
CREATE INDEX IF NOT EXISTS project_milestones_project_idx ON project_milestones(project_id, status, due_date);
CREATE INDEX IF NOT EXISTS project_outputs_project_idx ON project_outputs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS project_risks_project_idx ON project_risks(project_id, status, risk_level);
CREATE INDEX IF NOT EXISTS project_budget_events_project_idx ON project_budget_events(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS project_status_events_project_idx ON project_status_events(project_id, created_at ASC);
