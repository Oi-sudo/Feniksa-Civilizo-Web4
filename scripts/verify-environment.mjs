const major = Number(process.versions.node.split('.')[0]);
const problems = [];
if (major < 22) problems.push(`Node.js 22+ required; found ${process.version}`);
for (const key of ['DATABASE_URL']) {
  if (!process.env[key]) problems.push(`${key} is not set`);
}
const appUrl = process.env.APP_URL || 'http://127.0.0.1:3000';
console.log(`Node: ${process.version}`);
console.log(`APP_URL: ${appUrl}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '[set]' : '[missing]'}`);
if (problems.length) {
  console.error('\nEnvironment check failed:');
  for (const p of problems) console.error(`- ${p}`);
  process.exit(1);
}
console.log('\nEnvironment check passed.');
