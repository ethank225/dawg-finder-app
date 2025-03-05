import { NextResponse } from 'next/server';
import { getDbPool } from '@/app/lib/db.ts';

export async function GET(req: Request) {
  try {
    // Get the teacherId from the query parameter
    const url = new URL(req.url);
    const teacherId = url.searchParams.get('teacherId');

    console.log("Teacher ID received:", teacherId); // Debugging

    if (!teacherId) {
      return NextResponse.json({ error: "Missing teacherId parameter" }, { status: 400 });
    }

    // Get database pool connection
    const pool = getDbPool();

    const client = await pool.connect();


    // Correct PostgreSQL query
    const result = await client.query(`
      SELECT DISTINCT
        "Rating",
        "Difficulty",
        "amount_learned_median",
        "grading_techniques_median",
        "instructors_contribution_median",
        "instructors_effectiveness_median",  -- ✅ Fixed missing "s"
        "instuctors_interest_median",        -- ✅ Fixed typo
        "the_course_content_median",
        "Link"
      FROM courses
      WHERE "Instructor" ILIKE $1
    `, [teacherId]); // ✅ Use parameterized query


    // Execute the query (parameterized)
    console.log(result.rows);
    return NextResponse.json(result.rows);



  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
