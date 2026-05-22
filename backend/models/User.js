const crypto = require('crypto');
const db = require('../db');

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const comparePassword = (password, storedPassword = '') => {
  const [salt, storedHash] = storedPassword.split(':');
  if (!salt || !storedHash) return false;

  const [, hash] = hashPassword(password, salt).split(':');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
};

const mapUser = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    _id: String(row.id),
    name: row.name,
    email: row.email,
    password: row.password,
    department: row.department,
    teachSkills: row.teach_skills || [],
    learnSkills: row.learn_skills || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const toSafeObject = (user) => {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
};

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  return mapUser(result.rows[0]);
};

const findById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return mapUser(result.rows[0]);
};

const create = async ({ name, email, password, department = 'General' }) => {
  const result = await db.query(
    `INSERT INTO users (name, email, password, department)
     VALUES ($1, LOWER($2), $3, $4)
     RETURNING *`,
    [name, email, hashPassword(password), department]
  );

  return mapUser(result.rows[0]);
};

const updateProfile = async (id, { name, department, teachSkills = [], learnSkills = [] }) => {
  const result = await db.query(
    `UPDATE users
     SET name = COALESCE($2, name),
         department = COALESCE($3, department),
         teach_skills = $4,
         learn_skills = $5,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, name, department, teachSkills, learnSkills]
  );

  return mapUser(result.rows[0]);
};

const search = async ({ userId, q = '', department = 'All' }) => {
  const values = [userId];
  const where = ['id <> $1'];

  if (q) {
    values.push(`%${q}%`);
    where.push(`(
      name ILIKE $${values.length}
      OR EXISTS (SELECT 1 FROM unnest(teach_skills) skill WHERE skill ILIKE $${values.length})
      OR EXISTS (SELECT 1 FROM unnest(learn_skills) skill WHERE skill ILIKE $${values.length})
    )`);
  }

  if (department && department !== 'All') {
    values.push(department);
    where.push(`department ILIKE $${values.length}`);
  }

  const result = await db.query(
    `SELECT * FROM users WHERE ${where.join(' AND ')} ORDER BY name ASC`,
    values
  );

  return result.rows.map(mapUser).map(toSafeObject);
};

const list = async () => {
  const result = await db.query('SELECT * FROM users ORDER BY name ASC');
  return result.rows.map(mapUser).map(toSafeObject);
};

const count = async () => {
  const result = await db.query('SELECT COUNT(*)::int AS total FROM users');
  return result.rows[0].total;
};

module.exports = {
  comparePassword,
  count,
  create,
  findByEmail,
  findById,
  list,
  search,
  toSafeObject,
  updateProfile,
};
