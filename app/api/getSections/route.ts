import { NextResponse } from 'next/server';
import { getDbPool } from '@/app/lib/db.ts';


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("courseId")?.replace(/\s/g, ""); // Remove all spaces

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    console.log('Searching for courses sections:', query);

    const pool = getDbPool();
    const client = await pool.connect();


    const lectureId = query.slice(-1); // Extract the last character
    const updatedQuery = query.slice(0, -1); // Remove the last character

    console.log("Lecture ID:", lectureId);
    console.log("Updated Query:", updatedQuery);

    if (!lectureId) {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    // Query PostgreSQL
    const results = await client.query(
      `SELECT DISTINCT * FROM courses WHERE "index" = $1 AND LEFT("Section", 1) = $2 AND "Activity Type" = $3`,
      [updatedQuery, lectureId, "quiz"]
    );
    client.release();

    console.log("Results:", results.rows);
    return NextResponse.json(results.rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
