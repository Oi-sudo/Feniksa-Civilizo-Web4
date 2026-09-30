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

### Database batch 1
- database/migrations/0002_auth_identity.sql
- database/migrations/0003_rbac.sql
- database/migrations/0004_passport_experience.sql
- database/migrations/0005_course_catalog.sql

### Database batch 2
- database/migrations/0001_core.sql
- database/migrations/0006_course_catalog_seed.sql
- database/migrations/0007_learning_progress.sql
- database/migrations/0008_est_system.sql
- database/migrations/0009_bud_system.sql
- database/migrations/0010_museum_catalog.sql
- database/migrations/0011_museum_asset_detail.sql

### Runtime scripts batch 1
- scripts/migrate.mjs
- scripts/seed.mjs
- scripts/verify-environment.mjs
- scripts/verify-runtime-db.mjs
- scripts/smoke-check.mjs

## Current database coverage

Migrations 0001 through 0011 are now present on the Alpha branch.

This covers:
- core identity and RBAC
- learning passport and courses
- lesson progress
- EST records
- BUD records
- museum catalog
- museum asset dossier / exhibition texts

## Not yet imported

The branch is intentionally incomplete. Remaining work includes:
- database/migrations/0012 through 0017
- database seed data
- application pages and components
- locale JSON files
- remaining runtime / Docker / CI files

Do not merge this branch into main until the full source package is imported and the Runtime Verified gate is green.
