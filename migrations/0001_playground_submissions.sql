CREATE TABLE IF NOT EXISTS playground_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  anonymous_session_id TEXT NOT NULL,
  input_text TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  worldspec_version TEXT NOT NULL,
  interpretation_json TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'unreviewed',
  redacted_text TEXT,
  dataset_status TEXT NOT NULL DEFAULT 'raw'
);

CREATE INDEX IF NOT EXISTS idx_playground_created_at
  ON playground_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_playground_session
  ON playground_submissions(anonymous_session_id);

CREATE INDEX IF NOT EXISTS idx_playground_dataset_status
  ON playground_submissions(dataset_status);
