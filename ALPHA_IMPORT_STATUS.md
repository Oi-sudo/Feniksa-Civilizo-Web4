# Alpha Runtime Import Status

Branch: `web4-0.1-alpha-runtime`

## Imported so far

### Project/runtime configuration
- package.json
- tsconfig.json
- next.config.mjs
- next-env.d.ts
- .gitignore
- .env.example
- .env.runtime.example

### Database migrations
- database/migrations/0001_core.sql
- database/migrations/0002_auth_identity.sql
- database/migrations/0003_rbac.sql
- database/migrations/0004_passport_experience.sql
- database/migrations/0005_course_catalog.sql
- database/migrations/0006_course_catalog_seed.sql
- database/migrations/0007_learning_progress.sql
- database/migrations/0008_est_system.sql
- database/migrations/0009_bud_system.sql
- database/migrations/0010_museum_catalog.sql
- database/migrations/0011_museum_asset_detail.sql
- database/migrations/0012_museum_workflow.sql
- database/migrations/0013_dad_proposal_discussion.sql
- database/migrations/0014_dad_voting_decisions.sql
- database/migrations/0015_project_execution.sql
- database/migrations/0016_admin_dashboard.sql
- database/migrations/0017_audit_integrity.sql

### Seed data
- database/seeds/001_seed.sql

### Runtime scripts imported
- scripts/migrate.mjs
- scripts/seed.mjs
- scripts/verify-environment.mjs
- scripts/verify-runtime-db.mjs
- scripts/smoke-check.mjs

## Current database coverage

The full migration chain 0001 through 0017 is now present on the Alpha branch.

This covers:
- core identity and RBAC
- learning passport and course catalog
- lesson progress
- EST records
- BUD records
- museum catalog, dossier and editorial workflow
- DAD proposal discussion
- DAD voting and decision snapshots
- project execution, risks, milestones and budget-change events
- admin-dashboard read indexes
- append-only / tamper-evident audit-log integrity

The seed set now includes:
- core responsibility roles
- all nine museum halls
- AI / SI terminology records
- EST / BUD / WFB system-term records

## Runtime-import correction recorded

During source review, migration 0016 was corrected to index `audit_logs(created_at)`, matching the actual core schema, instead of the older `audit_logs(timestamp)` reference.

## Not yet imported

The branch is still intentionally incomplete. Remaining work includes:
- application pages and components
- lib modules
- locale JSON files
- remaining runtime scripts
- Docker files
- GitHub Actions workflow
- acceptance / deployment documentation

Do not merge this branch into main until the full source package is imported and the Runtime Verified gate is green.
