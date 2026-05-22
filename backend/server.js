require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require('./db');
const { ensureSchema } = require('./schema');

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const matchRoutes = require('./routes/match');
const requestRoutes = require('./routes/request');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/users');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

// Endpoint to fetch all tables in the public schema
app.get('/api/tables', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkillSwap Hub API' });
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Connected to PostgreSQL:', result.rows[0]);
    await ensureSchema();

    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start API:', error);
    process.exit(1);
  }
};

start();
