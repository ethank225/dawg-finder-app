import { NextResponse } from 'next/server';
import { getDbPool } from '@/app/lib/db.ts';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    console.log('Searching for courses with Course Code:', query);

    // Get the database pool and connect to the database
    const pool = getDbPool();

    // Get a client from the pool
    const client = await pool.connect();

    try {
      // Query the database
      const result = await client.query(
        'SELECT DISTINCT * FROM courses WHERE "index" LIKE $1 AND "Activity Type" = $2',
        [`%${query}%`, 'lecture']
      );

      console.log(result.rows);
      return NextResponse.json(result.rows);
    } finally {
      // Release the client back to the pool
      client.release();
    }

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
