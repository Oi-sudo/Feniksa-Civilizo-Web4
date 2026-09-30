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

### Runtime scripts batch 1
- scripts/migrate.mjs
- scripts/seed.mjs
- scripts/verify-environment.mjs
- scripts/verify-runtime-db.mjs
- scripts/smoke-check.mjs

## Not yet imported

The branch is intentionally incomplete. In particular, migration 0001 and migrations 0006–0017, seed data, application pages/components, locales, and remaining runtime/CI files still need to be imported.

Do not merge this branch into main until the full source package is imported and the Runtime Verified gate is green.
