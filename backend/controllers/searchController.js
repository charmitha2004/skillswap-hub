const User = require('../models/User');
const db = require('../db');

const searchUsers = async (req, res) => {
  const { q, department } = req.query;

  try {
    await db.query('INSERT INTO search_logs (query, user_id) VALUES ($1, $2)', [q || '', req.user.id]);
    const users = await User.search({ userId: req.user.id, q, department });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
};

module.exports = { searchUsers };
