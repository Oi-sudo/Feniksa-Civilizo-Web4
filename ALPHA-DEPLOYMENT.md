# Feniksa Civilizo Web4 · Alpha Deployment Checklist

This checklist applies to the `web4-0.1-alpha-runtime` branch.

## 1. Runtime baseline

- Node.js 22+
- PostgreSQL 16+
- HTTPS public URL
- `NODE_ENV=production`
- Run `npm run env:check` before deployment

## 2. Required environment settings

- `DATABASE_URL`
- `APP_URL=https://...`
- `SESSION_COOKIE_NAME=feniksa_session`
- `SESSION_DAYS=30`
- `SESSION_SECRET` stored only in the hosting platform's encrypted secret store
- `PUBLIC_REGISTRATION=false` for the initial public Alpha
- `EMAIL_PROVIDER=console` is acceptable only while public registration remains disabled
- `EMAIL_FROM` must be a real sender before registration is enabled

Never commit production passwords, tokens, database credentials, or session secrets.

## 3. Database deployment

Before starting the new application version:

1. Back up the target database.
2. Run `npm run db:migrate`.
3. Confirm migrations complete successfully.
4. Run `npm run db:seed` only where the environment expects the repository's idempotent base seed.
5. Run `npm run verify:db` when available in the target environment.

Current archive migrations include:

- `0026_dad_archive_snapshots.sql`
- `0027_dad_archive_reports.sql`

Do not manually edit migration history after deployment.

## 4. Application verification

The branch CI must be green before deployment:

- i18n integrity
- locale integrity
- enum integrity
- citation integrity
- smoke check
- TypeScript type check
- production build
- runtime public archive route verification

After deployment, verify at minimum:

- `/api/health`
- `/dad`
- `/dad/archive`
- `/dad/archive/snapshots`
- `/dad/archive/compare`
- `/dad/archive/reports`
- `/dad/archive/years`
- `/dad/archive/annual-reports`

## 5. Public Alpha boundaries

The initial public Alpha is read-mostly.

- Public registration stays disabled until a real transactional email provider is configured and tested.
- Do not expose individual ballots, private membership data, or internal non-public comments.
- Do not enable automated fund movement or treat archive records as financial approvals or ownership certificates.
- Admin-only archive actions remain protected by RBAC.

## 6. Rollback principle

If the deployed application fails health or runtime checks:

1. Stop promotion of the failing release.
2. Revert application code to the previous known-good commit.
3. Do not destructively roll back database migrations unless a specific reviewed rollback migration exists.
4. Preserve governance archive data and audit logs.
5. Re-run health, migration verification, and public route checks before reopening traffic.

## 7. Alpha readiness gate

A release is Alpha-ready only when:

- the latest branch CI concludes `success`;
- production environment validation passes;
- database backup is confirmed;
- migrations complete;
- runtime health and public archive routes return successful responses;
- public registration remains disabled unless real email delivery has been verified.
