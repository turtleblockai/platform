-- Turtle Lab operational persistence v0.1
-- Private by default. Public exposure requires an explicit visibility change.

CREATE TABLE IF NOT EXISTS turtle_sessions (
  id TEXT PRIMARY KEY,
  worldspec_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'discord',
  discord_guild_id TEXT,
  discord_channel_id TEXT,
  discord_thread_id TEXT,
  learner_id TEXT,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'exploring',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','unlisted','public')),
  published_at TEXT,
  learner_approved_summary TEXT
);

CREATE INDEX IF NOT EXISTS idx_turtle_sessions_worldspec ON turtle_sessions(worldspec_id);
CREATE INDEX IF NOT EXISTS idx_turtle_sessions_visibility ON turtle_sessions(visibility, updated_at);
CREATE INDEX IF NOT EXISTS idx_turtle_sessions_discord_thread ON turtle_sessions(discord_thread_id);

CREATE TABLE IF NOT EXISTS turtle_turns (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  actor TEXT NOT NULL CHECK (actor IN ('learner','turtle','world','system')),
  raw_text TEXT NOT NULL,
  interpretation_json TEXT,
  worldspec_delta_json TEXT,
  provenance_json TEXT,
  FOREIGN KEY (session_id) REFERENCES turtle_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_turtle_turns_session ON turtle_turns(session_id, created_at);

CREATE TABLE IF NOT EXISTS worldspec_revisions (
  id TEXT PRIMARY KEY,
  worldspec_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  revision_number INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  created_by_turn_id TEXT,
  worldspec_json TEXT NOT NULL,
  delta_json TEXT,
  provenance_json TEXT,
  UNIQUE(worldspec_id, revision_number),
  FOREIGN KEY (session_id) REFERENCES turtle_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_worldspec_revisions_worldspec ON worldspec_revisions(worldspec_id, revision_number);

-- Public Lab records are deliberately separate from the private operational session.
-- Publishing is a projection, not a privacy toggle on raw conversation data.
CREATE TABLE IF NOT EXISTS turtle_publications (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  worldspec_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  featured_revision_number INTEGER,
  artifact_json TEXT,
  reflection_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  FOREIGN KEY (session_id) REFERENCES turtle_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_turtle_publications_status ON turtle_publications(status, updated_at);
