import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { teamName, role, timeElapsed } = await request.json();

    if (!teamName || timeElapsed === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided. Score was not saved to Postgres.");
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS escape_results (
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        time_elapsed_seconds INT NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert result
    const result = await pool.query(
      `INSERT INTO escape_results (team_name, role, time_elapsed_seconds) VALUES ($1, $2, $3) RETURNING *`,
      [teamName, role, timeElapsed]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
