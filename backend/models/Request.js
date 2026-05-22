const db = require('../db');

const mapUser = (prefix, row) => ({
  id: row[`${prefix}_id`],
  _id: String(row[`${prefix}_id`]),
  name: row[`${prefix}_name`],
  email: row[`${prefix}_email`],
  department: row[`${prefix}_department`],
  teachSkills: row[`${prefix}_teach_skills`] || [],
  learnSkills: row[`${prefix}_learn_skills`] || [],
});

const mapRequest = (row) => ({
  id: row.id,
  _id: String(row.id),
  userId: row.user_id,
  receiverId: row.receiver_id,
  title: row.title,
  description: row.description,
  skill: row.skill,
  status: row.status,
  createdAt: row.created_at,
  sender: mapUser('sender', row),
  receiver: row.receiver_id ? mapUser('receiver', row) : null,
});

const selectRequest = `
  SELECT
    r.*,
    sender.id AS sender_id,
    sender.name AS sender_name,
    sender.email AS sender_email,
    sender.department AS sender_department,
    sender.teach_skills AS sender_teach_skills,
    sender.learn_skills AS sender_learn_skills,
    receiver.id AS receiver_id,
    receiver.name AS receiver_name,
    receiver.email AS receiver_email,
    receiver.department AS receiver_department,
    receiver.teach_skills AS receiver_teach_skills,
    receiver.learn_skills AS receiver_learn_skills
  FROM requests r
  JOIN users sender ON sender.id = r.user_id
  LEFT JOIN users receiver ON receiver.id = r.receiver_id
`;

const create = async ({ userId, receiverId = null, title, description = '', skill = '' }) => {
  const result = await db.query(
    `INSERT INTO requests (user_id, receiver_id, title, description, skill)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, receiverId, title, description, skill]
  );

  return findById(result.rows[0].id);
};

const findById = async (id) => {
  const result = await db.query(`${selectRequest} WHERE r.id = $1`, [id]);
  return result.rows[0] ? mapRequest(result.rows[0]) : null;
};

const findPending = async ({ userId, receiverId }) => {
  const result = await db.query(
    `SELECT * FROM requests
     WHERE user_id = $1 AND receiver_id = $2 AND status = 'pending'
     LIMIT 1`,
    [userId, receiverId]
  );

  return result.rows[0] || null;
};

const listForUser = async (userId) => {
  const incomingResult = await db.query(
    `${selectRequest} WHERE r.receiver_id = $1 ORDER BY r.created_at DESC`,
    [userId]
  );
  const outgoingResult = await db.query(
    `${selectRequest} WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
    [userId]
  );

  return {
    incoming: incomingResult.rows.map(mapRequest),
    outgoing: outgoingResult.rows.map(mapRequest),
  };
};

const updateStatus = async ({ requestId, userId, status }) => {
  const result = await db.query(
    `UPDATE requests
     SET status = $3, updated_at = NOW()
     WHERE id = $1 AND receiver_id = $2
     RETURNING id`,
    [requestId, userId, status]
  );

  if (!result.rows[0]) return null;
  return findById(result.rows[0].id);
};

const countAll = async () => {
  const result = await db.query('SELECT COUNT(*)::int AS total FROM requests');
  return result.rows[0].total;
};

module.exports = {
  countAll,
  create,
  findById,
  findPending,
  listForUser,
  updateStatus,
};
