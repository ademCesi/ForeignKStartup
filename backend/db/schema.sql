-- Core + Advanced phase schema.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  target_visa TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roadmap_steps (
  id SERIAL PRIMARY KEY,
  step_order INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  official_url TEXT
);

ALTER TABLE roadmap_steps ADD COLUMN IF NOT EXISTS details TEXT;

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  step_id INTEGER NOT NULL REFERENCES roadmap_steps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  needs_apostille BOOLEAN NOT NULL DEFAULT false,
  needs_translation BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_id INTEGER NOT NULL REFERENCES roadmap_steps(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'done')),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, step_id)
);

CREATE TABLE IF NOT EXISTS user_documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'ready')),
  UNIQUE (user_id, document_id)
);

CREATE TABLE IF NOT EXISTS visas (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  best_for TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  operator TEXT NOT NULL,
  url TEXT,
  category TEXT NOT NULL,
  address TEXT,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6)
);

CREATE TABLE IF NOT EXISTS funding_programs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('grant', 'rnd', 'loan', 'accelerator')),
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  url TEXT
);

CREATE TABLE IF NOT EXISTS glossary_terms (
  id SERIAL PRIMARY KEY,
  term_kr TEXT UNIQUE NOT NULL,
  romanization TEXT,
  definition_en TEXT NOT NULL,
  definition_fr TEXT NOT NULL,
  definition_kr TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN NOT NULL DEFAULT false
);

-- Dedupe any pre-existing rows (from before this constraint existed) so the
-- unique index below can be created; re-marking a step done then refreshes
-- the existing reminder instead of inserting a new one each time.
DELETE FROM notifications a USING notifications b
  WHERE a.id < b.id AND a.user_id = b.user_id AND a.type = b.type;

CREATE UNIQUE INDEX IF NOT EXISTS notifications_user_type_idx ON notifications(user_id, type);

CREATE TABLE IF NOT EXISTS faq_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_id INTEGER REFERENCES roadmap_steps(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faq_answers (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES faq_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
