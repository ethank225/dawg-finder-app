// lib/db.ts
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Force SSL whether in dev or production:
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return pool;
}
