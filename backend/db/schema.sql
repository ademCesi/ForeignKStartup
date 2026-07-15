-- Core-phase schema. Advanced-phase tables (funding_programs, glossary_terms,
-- notifications, faq_posts) will be added when that phase starts.

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
