import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if this is a request to get the final score
    if (body.action === 'get_team_score') {
      const { teamName } = body;
      if (!teamName) {
        return NextResponse.json({ error: 'Missing team name' }, { status: 400 });
      }

      if (!process.env.DATABASE_URL) {
        return NextResponse.json({ success: true, fakeScore: true, teamScore: 42 }); // Fallback if no DB
      }

      const result = await pool.query(
        `SELECT SUM(score) as total_score FROM level_scores WHERE team_name = $1`,
        [teamName]
      );
      
      const teamScore = result.rows[0].total_score ? parseInt(result.rows[0].total_score) : 0;
      return NextResponse.json({ success: true, teamScore });
    }

    const { teamName, role, level, score, timeTaken, solved } = body;

    if (!teamName || level === undefined || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided. Score was not saved to Postgres.");
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Ensure tables exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS level_scores (
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        level INT NOT NULL,
        score INT NOT NULL,
        time_taken_seconds INT NOT NULL,
        solved BOOLEAN NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert result
    const result = await pool.query(
      `INSERT INTO level_scores (team_name, role, level, score, time_taken_seconds, solved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [teamName, role, level, score, timeTaken || 0, solved || false]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
