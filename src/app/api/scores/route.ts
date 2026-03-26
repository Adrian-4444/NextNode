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
        `SELECT SUM(total_role_score) as total_score FROM (
           SELECT DISTINCT ON (role) 
             (level_1_score + level_2_score + level_3_score + level_4_score + level_5_score) as total_role_score
           FROM player_progress
           WHERE team_name = $1
           ORDER BY role, id DESC
         ) subquery`,
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
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        level_1_score FLOAT DEFAULT 0,
        level_2_score FLOAT DEFAULT 0,
        level_3_score FLOAT DEFAULT 0,
        level_4_score FLOAT DEFAULT 0,
        level_5_score FLOAT DEFAULT 0,
        total_time INT DEFAULT 0
      );
    `);

    // Safely attempt to migrate existing tables
    try { await pool.query(`ALTER TABLE player_progress DROP CONSTRAINT IF EXISTS player_progress_pkey CASCADE`); } catch (e) {}
    try { await pool.query(`ALTER TABLE player_progress ADD COLUMN id SERIAL PRIMARY KEY`); } catch (e) {}
    try { await pool.query(`ALTER TABLE player_progress ADD COLUMN total_time INT DEFAULT 0`); } catch (e) {}

    if (body.action === 'save_final_time') {
      const { teamName, role, totalTime } = body;
      if (!teamName || !role || totalTime === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const result = await pool.query(
        `UPDATE player_progress 
         SET total_time = $3
         WHERE id = (
           SELECT id FROM player_progress 
           WHERE team_name = $1 AND role = $2 
           ORDER BY id DESC LIMIT 1
         )
         RETURNING *`,
        [teamName, role, totalTime]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    }



    // Guard against invalid level inputs to prevent SQL injection or bad columns
    const validLevels = [1, 2, 3, 4, 5];
    if (!validLevels.includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    const levelCol = `level_${level}_score`;

    let result;
    if (level === 1) {
      result = await pool.query(
        `INSERT INTO player_progress (team_name, role, ${levelCol}) 
         VALUES ($1, $2, $3)
         RETURNING *`,
        [teamName, role, score]
      );
    } else {
      result = await pool.query(
        `UPDATE player_progress 
         SET ${levelCol} = $3
         WHERE id = (
           SELECT id FROM player_progress 
           WHERE team_name = $1 AND role = $2 
           ORDER BY id DESC LIMIT 1
         )
         RETURNING *`,
        [teamName, role, score]
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
