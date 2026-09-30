import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const client = new Client({ connectionString });
await client.connect();
try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  const dir = path.resolve('database/migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const filename of files) {
    const found = await client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [filename]);
    if (found.rowCount) continue;
    const sql = fs.readFileSync(path.join(dir, filename), 'utf8');
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations(filename) VALUES($1)', [filename]);
      await client.query('COMMIT');
      process.stdout.write(`applied ${filename}\n`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
} finally {
  await client.end();
}
