# Feniksa Civilizo Web4 · Vercel Alpha Deployment

Target branch: `web4-0.1-alpha-runtime`

## Import

Create a Vercel project by importing the GitHub repository:

`Oi-sudo/Feniksa-Civilizo-Web4`

Set the production branch for the Alpha project to:

`web4-0.1-alpha-runtime`

Framework: Next.js (auto-detected; also declared in `vercel.json`).

Node.js: 22.x (declared in `package.json` and `.nvmrc`).

## Required Vercel environment variables

Configure these in Vercel Project Settings → Environment Variables.

### Required

- `DATABASE_URL` — external PostgreSQL connection string reachable from Vercel
- `APP_URL` — the final HTTPS Alpha URL
- `NODE_ENV=production`
- `SESSION_COOKIE_NAME=feniksa_session`
- `SESSION_DAYS=30`
- `SESSION_SECRET` — long random secret stored only in Vercel secrets
- `PUBLIC_REGISTRATION=false`
- `EMAIL_PROVIDER=console`
- `EMAIL_FROM=noreply@example.invalid`

For the initial Alpha, keep public registration disabled. The console email adapter must not be used for public registration.

## Database

Vercel needs an externally reachable PostgreSQL database. The GitHub Actions PostgreSQL service is CI-only and cannot be used by the deployed site.

Before first deployment to a persistent Alpha database:

1. Back up the database if it already contains data.
2. Set `DATABASE_URL`.
3. Run `npm run db:migrate` against the Alpha database.
4. Run the repository's idempotent base seed only if required.
5. Run `npm run verify:db` where the environment permits.

Archive migrations required by the current DAD system:

- `0026_dad_archive_snapshots.sql`
- `0027_dad_archive_reports.sql`

## Build

Vercel should use the repository defaults:

- Install: `npm install`
- Build: `npm run build`
- Framework: Next.js

No secret values belong in `vercel.json` or the Git repository.

## Post-deploy verification

After Vercel reports READY, verify:

- `/api/health`
- `/dad`
- `/dad/archive`
- `/dad/archive/snapshots`
- `/dad/archive/compare`
- `/dad/archive/reports`
- `/dad/archive/years`
- `/dad/archive/annual-reports`

The same route set is already exercised by GitHub Actions through `npm run runtime:routes`.

## Promotion rule

Do not promote the Alpha deployment if:

- Vercel build is not READY;
- database migration fails;
- `/api/health` fails;
- public archive routes return errors;
- public registration is unintentionally enabled;
- runtime logs show repeated server errors.

Keep the initial deployment as an Alpha test environment until these checks remain clean.
