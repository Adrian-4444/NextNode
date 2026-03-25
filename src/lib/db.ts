import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('neon') 
    ? { rejectUnauthorized: false } 
    : undefined
});

export default pool;
