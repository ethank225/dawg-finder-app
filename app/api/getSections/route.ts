import { NextResponse } from 'next/server';
import { getDbPool } from '@/app/lib/db.ts';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get("courseCode")?.trim();
    const section = searchParams.get("section")?.trim();
    const term = searchParams.get("term")?.trim();

    if (!courseCode || !section || !term) {
      return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
    }

    console.log('Searching for course sections:', { courseCode, section, term });

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // Query PostgreSQL (handling `Terms` stored as an array)
      const sectionPattern = `${section}_`; // Ensure exactly one more character after "A"

      const results = await client.query(
        `SELECT DISTINCT *
         FROM courses
         WHERE "Course Code" = $1
         AND "Term" = $3
         AND "Section" LIKE $2
         AND LENGTH("Section") = 2`,
        [courseCode, sectionPattern, term]
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
