-- TurtleBlockAI Library physical-copy layer
-- Triggered by a second photographed physical copy of Mindstorms, 2026-09-24.
-- Source basis: Commander-provided photographs only. No external lookup.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS library_physical_copies (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  copy_number INTEGER NOT NULL,
  format TEXT,
  isbn TEXT,
  provenance_note TEXT,
  ownership_marks_json TEXT NOT NULL DEFAULT '[]',
  current_status TEXT NOT NULL DEFAULT 'currently_owned'
    CHECK (current_status IN ('currently_owned','previously_owned','borrowed','unknown')),
  verification_status TEXT NOT NULL DEFAULT 'physical_copy_photographed'
    CHECK (verification_status IN ('physical_copy_photographed','inferred','mixed','unknown')),
  metadata_provenance_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES library_sources(id) ON DELETE CASCADE,
  UNIQUE(source_id, copy_number)
);

CREATE INDEX IF NOT EXISTS idx_library_physical_copies_source
  ON library_physical_copies(source_id, copy_number);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status, metadata_provenance_json
) VALUES (
  'library-copy-0013-01',
  'library-source-0013',
  1,
  'paperback',
  '0-465-04629-0',
  'Photographed paperback copy with a University Bookstore, Iowa State University price/stock sticker on the front cover.',
  '["University Bookstore Iowa State University sticker"]',
  'currently_owned',
  'physical_copy_photographed',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status, metadata_provenance_json
) VALUES (
  'library-copy-0013-02',
  'library-source-0013',
  2,
  'hardcover',
  NULL,
  'Photographed former library copy. Visible marks identify MT DE SALES LIBRARY / Mount de Sales Academy, barcode number 2054, call number 372.7 P, and a Bibb County Board of Education ECIA Chapter 2 stamp. The exact fiscal-year text on the stamp is not fully certain from the photograph.',
  '["MT DE SALES LIBRARY edge stamp","Mount de Sales Academy barcode 2054","call number 372.7 P","Bibb County Board of Education ECIA Chapter 2 stamp","Baker & Taylor checkout pocket"]',
  'currently_owned',
  'physical_copy_photographed',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

UPDATE library_sources
SET notes = notes || ' Two distinct photographed physical copies are now recorded in library_physical_copies: a paperback with an Iowa State University bookstore sticker and a former Mount de Sales Library hardcover copy.',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'library-source-0013';
