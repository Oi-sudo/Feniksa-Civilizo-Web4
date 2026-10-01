const major = Number(process.versions.node.split('.')[0]);
const problems = [];
const warnings = [];

if (major < 22) problems.push(`Node.js 22+ required; found ${process.version}`);
for (const key of ['DATABASE_URL']) {
  if (!process.env[key]) problems.push(`${key} is not set`);
}

const appUrl = process.env.APP_URL || 'http://127.0.0.1:3000';
const production = process.env.NODE_ENV === 'production';
const publicRegistration = process.env.PUBLIC_REGISTRATION === 'true';
const realEmailProvider = Boolean(
  process.env.EMAIL_PROVIDER &&
  process.env.EMAIL_PROVIDER !== 'console' &&
  process.env.EMAIL_FROM &&
  process.env.EMAIL_FROM !== 'noreply@example.invalid'
);

if (production) {
  if (!appUrl.startsWith('https://')) problems.push('APP_URL must use https:// in production');
  if (publicRegistration && !realEmailProvider) problems.push('PUBLIC_REGISTRATION=true requires a real EMAIL_PROVIDER and EMAIL_FROM');
  if (!publicRegistration) warnings.push('Public registration is disabled (recommended for initial Alpha)');
}

console.log(`Node: ${process.version}`);
console.log(`APP_URL: ${appUrl}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '[set]' : '[missing]'}`);
console.log(`PUBLIC_REGISTRATION: ${publicRegistration ? 'enabled' : 'disabled'}`);
console.log(`EMAIL_PROVIDER: ${process.env.EMAIL_PROVIDER || '[not set]'}`);

if (warnings.length) {
  console.warn('\nEnvironment warnings:');
  for (const w of warnings) console.warn(`- ${w}`);
}
if (problems.length) {
  console.error('\nEnvironment check failed:');
  for (const p of problems) console.error(`- ${p}`);
  process.exit(1);
}
console.log('\nEnvironment check passed.');
