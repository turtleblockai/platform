-- TurtleBlock AI Playground research data schema v0.2
-- This remains migration 0001 because no production D1 database existed when the
-- research-data lifecycle was expanded.

CREATE TABLE IF NOT EXISTS playground_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  anonymous_session_id TEXT NOT NULL,

  -- Raw research input is retained separately from the redacted candidate text.
  input_text TEXT NOT NULL,
  redacted_text TEXT,

  consent_version TEXT NOT NULL,
  worldspec_version TEXT NOT NULL,
  interpretation_json TEXT NOT NULL,

  -- Automated screening lifecycle.
  screening_version TEXT NOT NULL,
  screened_at TEXT NOT NULL,
  screening_status TEXT NOT NULL CHECK (screening_status IN ('clean', 'needs_review', 'rejected')),
  redaction_applied INTEGER NOT NULL DEFAULT 0 CHECK (redaction_applied IN (0, 1)),

  -- Human/research review lifecycle. No public endpoint is allowed to set these.
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  reviewed_at TEXT,
  reviewer_notes TEXT,

  -- Dataset lifecycle. Automated screening may create a candidate; approval is explicit.
  dataset_status TEXT NOT NULL DEFAULT 'raw' CHECK (dataset_status IN ('raw', 'candidate', 'approved', 'rejected')),
  dataset_candidate_at TEXT,
  dataset_decided_at TEXT,

  -- Provenance belongs with the record, not only in application logs.
  provenance_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS screening_findings (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  screening_version TEXT NOT NULL,
  finding_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'review', 'reject')),
  start_offset INTEGER,
  end_offset INTEGER,
  replacement_label TEXT,
  -- Deliberately do not store the matched sensitive value again here.
  FOREIGN KEY (submission_id) REFERENCES playground_submissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS research_data_events (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('system', 'reviewer')),
  actor_id TEXT,
  from_status TEXT,
  to_status TEXT,
  notes TEXT,
  metadata_json TEXT,
  FOREIGN KEY (submission_id) REFERENCES playground_submissions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_playground_created_at
  ON playground_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_playground_session
  ON playground_submissions(anonymous_session_id);

CREATE INDEX IF NOT EXISTS idx_playground_screening_status
  ON playground_submissions(screening_status);

CREATE INDEX IF NOT EXISTS idx_playground_review_status
  ON playground_submissions(review_status);

CREATE INDEX IF NOT EXISTS idx_playground_dataset_status
  ON playground_submissions(dataset_status);

CREATE INDEX IF NOT EXISTS idx_screening_submission
  ON screening_findings(submission_id);

CREATE INDEX IF NOT EXISTS idx_events_submission
  ON research_data_events(submission_id, created_at);

-- Only explicitly approved, redacted rows are eligible for export/training use.
CREATE VIEW IF NOT EXISTS approved_dataset_rows AS
SELECT
  id,
  created_at,
  anonymous_session_id,
  redacted_text,
  consent_version,
  worldspec_version,
  interpretation_json,
  screening_version,
  provenance_json
FROM playground_submissions
WHERE dataset_status = 'approved'
  AND review_status = 'approved'
  AND redacted_text IS NOT NULL;
