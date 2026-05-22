require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

async function createDatabase() {
  try {
    // Check if database exists
    const databaseName = process.env.DB_NAME || 'skillswap';
    const res = await pool.query('SELECT 1 FROM pg_database WHERE datname = $1', [databaseName]);
    if (res.rows.length === 0) {
      await pool.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database ${databaseName} created successfully`);
    } else {
      console.log(`Database ${databaseName} already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await pool.end();
  }
}

createDatabase();
