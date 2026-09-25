-- Publish the first complete TurtleBlockAI Library catalog.
-- The records exposed here are bibliographic/source records derived from
-- Commander-provided photographs and the cataloging session. Raw private
-- conversation data and source photographs are not made public by this flag.

PRAGMA foreign_keys = ON;

UPDATE library_sources
SET collection_visibility='public',
    updated_at=CURRENT_TIMESTAMP
WHERE entry_number BETWEEN 1 AND 25;

-- Verification:
-- SELECT COUNT(*) FROM library_sources WHERE collection_visibility='public'; -- expected 25
