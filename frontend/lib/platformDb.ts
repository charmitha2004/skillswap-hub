import { prisma } from './db'

export async function ensurePlatformTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS discussion_posts (
      id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(180) NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      skill VARCHAR(120) NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL,
      host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill VARCHAR(120) NOT NULL DEFAULT '',
      date DATE,
      time VARCHAR(16),
      scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status VARCHAR(24) NOT NULL DEFAULT 'scheduled',
      meeting_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS date DATE;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS time VARCHAR(16);

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_discussion_posts_author_id ON discussion_posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_host_id ON sessions(host_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_guest_id ON sessions(guest_id);
    CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver_timestamp ON messages(sender_id, receiver_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_messages_receiver_sender_timestamp ON messages(receiver_id, sender_id, timestamp);
  `)
}
