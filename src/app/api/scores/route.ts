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
        return NextResponse.json({ success: true, fakeScore: true, teamScore: 25 }); // Fallback if no DB
      }

      const result = await pool.query(
        `SELECT SUM(level_1_score + level_2_score + level_3_score + level_4_score + level_5_score) as total_score 
         FROM player_progress 
         WHERE team_name = $1`,
        [teamName]
      );
      
      const teamScore = result.rows[0].total_score ? parseFloat(result.rows[0].total_score) : 0;
      return NextResponse.json({ success: true, teamScore });
    }

    const { teamName, role, level, score } = body;

    if (!teamName || !role || level === undefined || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided. Score was not saved to Postgres.");
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS player_progress (
        team_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        level_1_score FLOAT DEFAULT 0,
        level_2_score FLOAT DEFAULT 0,
        level_3_score FLOAT DEFAULT 0,
        level_4_score FLOAT DEFAULT 0,
        level_5_score FLOAT DEFAULT 0,
        PRIMARY KEY (team_name, role)
      );
    `);

    // Guard against invalid level inputs to prevent SQL injection or bad columns
    const validLevels = [1, 2, 3, 4, 5];
    if (!validLevels.includes(level)) {
       return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    const levelCol = `level_${level}_score`;

    // Upsert logic: Update the specific level column for this player's row
    const result = await pool.query(
      `INSERT INTO player_progress (team_name, role, ${levelCol}) 
       VALUES ($1, $2, $3)
       ON CONFLICT (team_name, role) 
       DO UPDATE SET ${levelCol} = EXCLUDED.${levelCol}
       RETURNING *`,
      [teamName, role, score]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
