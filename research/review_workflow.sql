-- TurtleBlock AI research review workflow examples
-- Run only from an authenticated/admin context. Never expose these mutations publicly.

-- Inspect pending candidates without exporting raw text broadly.
SELECT
  id,
  created_at,
  anonymous_session_id,
  screening_status,
  redaction_applied,
  review_status,
  dataset_status,
  redacted_text
FROM playground_submissions
WHERE review_status = 'pending'
ORDER BY created_at ASC
LIMIT 100;

-- APPROVE EXAMPLE
-- Replace SUBMISSION_ID and REVIEWER_ID before running.
BEGIN TRANSACTION;

UPDATE playground_submissions
SET
  review_status = 'approved',
  reviewed_at = datetime('now'),
  reviewer_notes = 'Reviewed redacted text; approved for curated dataset.',
  dataset_status = 'approved',
  dataset_decided_at = datetime('now')
WHERE id = 'SUBMISSION_ID'
  AND screening_status = 'clean'
  AND redacted_text IS NOT NULL;

INSERT INTO research_data_events (
  id, submission_id, created_at, event_type, actor_type,
  actor_id, from_status, to_status, notes, metadata_json
) VALUES (
  lower(hex(randomblob(16))),
  'SUBMISSION_ID',
  datetime('now'),
  'dataset_review_decision',
  'reviewer',
  'REVIEWER_ID',
  'candidate',
  'approved',
  'Reviewed redacted text; approved for curated dataset.',
  '{"workflow_version":"0.2"}'
);

COMMIT;

-- REJECT EXAMPLE
-- Replace SUBMISSION_ID and REVIEWER_ID before running.
BEGIN TRANSACTION;

UPDATE playground_submissions
SET
  review_status = 'rejected',
  reviewed_at = datetime('now'),
  reviewer_notes = 'Excluded from curated dataset.',
  dataset_status = 'rejected',
  dataset_decided_at = datetime('now')
WHERE id = 'SUBMISSION_ID';

INSERT INTO research_data_events (
  id, submission_id, created_at, event_type, actor_type,
  actor_id, from_status, to_status, notes, metadata_json
) VALUES (
  lower(hex(randomblob(16))),
  'SUBMISSION_ID',
  datetime('now'),
  'dataset_review_decision',
  'reviewer',
  'REVIEWER_ID',
  'pending',
  'rejected',
  'Excluded from curated dataset.',
  '{"workflow_version":"0.2"}'
);

COMMIT;

-- The export boundary:
SELECT * FROM approved_dataset_rows;
