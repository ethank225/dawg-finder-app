import { NextResponse } from 'next/server';
import { getDbPool } from '@/app/lib/db.ts';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const UUID = searchParams.get("UUID")?.trim();


    if (!UUID) {
      return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
    }

    console.log('Searching for course sections:', { UUID });

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // Query PostgreSQL (handling `Terms` stored as an array)

      const results = await client.query(
        `SELECT DISTINCT *
         FROM sections
         WHERE "UUID" LIKE $1`,
        [UUID]
      );
      return NextResponse.json(results.rows);
    } finally {
      client.release(); // Ensure client is always released
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
