-- Task 04: RBAC hardening and role-assignment audit support.

CREATE INDEX IF NOT EXISTS user_roles_active_lookup_idx
  ON user_roles(user_id, status, expires_at);

-- Application-side authorization always verifies account status and active, unexpired roles.
-- This migration intentionally does not grant database superuser privileges to application roles.

COMMENT ON TABLE roles IS 'Application responsibility roles; not social rank, wealth rank, or spiritual status.';
COMMENT ON TABLE user_roles IS 'Explicit time-bounded role assignments. Application authorization must ignore inactive, revoked, or expired rows.';
