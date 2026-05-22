CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  department VARCHAR(120) NOT NULL DEFAULT 'General',
  teach_skills TEXT[] NOT NULL DEFAULT '{}',
  learn_skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  skill VARCHAR(120) NOT NULL DEFAULT '',
  status VARCHAR(24) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT requests_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'completed'))
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES requests(id) ON DELETE CASCADE,
  matched_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_logs (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL DEFAULT '',
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed test users matching the mock knowledge base
INSERT INTO users (name, email, password, department, teach_skills, learn_skills)
VALUES
  ('Kabir Singh', 'kabir@skillswap.dev', '$2b$10$JhT.sJbcMbKVrqI2rN6pJ.9fJaH9K0A0ZK6mPqI.h5R0J9Z3Z9Z3O', 'Backend Engineering', ARRAY['Docker', 'Node.js'], ARRAY['Kubernetes']),
  ('Aarav Mehta', 'aarav@skillswap.dev', '$2b$10$JhT.sJbcMbKVrqI2rN6pJ.9fJaH9K0A0ZK6mPqI.h5R0J9Z3Z9Z3O', 'Database Admin', ARRAY['PostgreSQL', 'SQL'], ARRAY['NoSQL']),
  ('Maya Iyer', 'maya@skillswap.dev', '$2b$10$JhT.sJbcMbKVrqI2rN6pJ.9fJaH9K0A0ZK6mPqI.h5R0J9Z3Z9Z3O', 'Design', ARRAY['Figma', 'UI Design', 'Prototyping'], ARRAY['Animation']),
  ('Charmitha', 'charmitha@skillswap.dev', '$2b$10$JhT.sJbcMbKVrqI2rN6pJ.9fJaH9K0A0ZK6mPqI.h5R0J9Z3Z9Z3O', 'Full Stack Dev', ARRAY['React', 'JavaScript'], ARRAY['Docker', 'DevOps'])
ON CONFLICT (email) DO NOTHING;
