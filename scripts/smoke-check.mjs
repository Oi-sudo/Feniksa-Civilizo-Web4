import fs from 'node:fs';

const required = [
  'app/page.tsx',
  'app/login/page.tsx',
  'app/register/page.tsx',
  'app/passport/page.tsx',
  'app/est/page.tsx',
  'app/bud/page.tsx',
  'app/museum/page.tsx',
  'app/dad/page.tsx',
  'app/projects/page.tsx',
  'app/admin/page.tsx',
  'app/admin/audit/page.tsx',
  'app/api/health/route.ts',
  'ALPHA-DEPLOYMENT.md',
  '.env.example',
  'database/migrations/0017_audit_integrity.sql',
  'database/migrations/0026_dad_archive_snapshots.sql',
  'database/migrations/0027_dad_archive_reports.sql',
  'locales/zh.json', 'locales/eo.json', 'locales/en.json'
];

const missing = required.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error('Smoke check failed. Missing:', missing.join(', '));
  process.exit(1);
}
console.log(`Smoke check passed: ${required.length} required project artifacts found.`);
