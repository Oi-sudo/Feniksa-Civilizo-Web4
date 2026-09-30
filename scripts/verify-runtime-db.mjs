import pg from 'pg';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const expectedMigrationCount = 17;
const expectedRoles = ['visitor', 'learner', 'member', 'project_staff', 'admin', 'curator', 'museum_reviewer'];

const client = new Client({ connectionString });
await client.connect();
try {
  const migrations = await client.query('SELECT COUNT(*)::int AS count FROM schema_migrations');
  const migrationCount = migrations.rows[0]?.count ?? 0;
  if (migrationCount !== expectedMigrationCount) {
    throw new Error(`Expected ${expectedMigrationCount} applied migrations, found ${migrationCount}.`);
  }

  const roleRows = await client.query('SELECT code FROM roles ORDER BY code');
  const roleSet = new Set(roleRows.rows.map((row) => row.code));
  for (const role of expectedRoles) {
    if (!roleSet.has(role)) throw new Error(`Missing seeded role: ${role}`);
  }

  const halls = await client.query('SELECT COUNT(*)::int AS count FROM museum_halls');
  const hallCount = halls.rows[0]?.count ?? 0;
  if (hallCount < 9) throw new Error(`Expected at least 9 museum halls, found ${hallCount}.`);

  const terms = await client.query("SELECT COUNT(*)::int AS count FROM system_terms WHERE term_key IN ('technology_ai','technology_si')");
  const termCount = terms.rows[0]?.count ?? 0;
  if (termCount < 2) throw new Error('AI/SI system terms are not both present.');

  console.log(`Runtime DB verification passed: ${migrationCount} migrations, ${roleSet.size} roles, ${hallCount} museum halls, AI/SI terms present.`);
} finally {
  await client.end();
}
