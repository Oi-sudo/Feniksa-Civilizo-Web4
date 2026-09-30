import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const client = new Client({ connectionString });
await client.connect();
try {
  const dir = path.resolve('database/seeds');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const filename of files) {
    const sql = fs.readFileSync(path.join(dir, filename), 'utf8');
    await client.query(sql);
    process.stdout.write(`seeded ${filename}\n`);
  }
} finally {
  await client.end();
}
