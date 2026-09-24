-- TurtleBlockAI Library Sources: entry 16
-- Source basis: Commander-provided photograph of physical copy cover, 2026-09-24.
-- No external bibliographic lookup used. Unknown bibliographic fields remain unknown.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, printing_label, publisher, imprint, publication_place,
  isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0016', 16,
  'The Playful Brain',
  'Venturing to the Limits of Neuroscience',
  'The Playful Brain: Venturing to the Limits of Neuroscience',
  'Sergio Pellis and Vivien Pellis',
  '[]',
  NULL, NULL, NULL, 'unknown',
  NULL, NULL,
  NULL, NULL, NULL,
  NULL, NULL, NULL, NULL,
  '["play","neuroscience"]',
  '["play","brain","neuroscience","behavior","learning"]',
  '[]',
  'Cover-only intake from a photographed physical copy. Title, subtitle, and authors are established from the cover. Publication year, edition, publisher, ISBN, classifications, and contents have not yet been established from the supplied material.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"intake_completeness":"cover_only"}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status, metadata_provenance_json
) VALUES (
  'library-copy-0016-01',
  'library-source-0016',
  1,
  NULL,
  NULL,
  'Photographed physical copy; only the front cover has been cataloged so far.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"intake_completeness":"cover_only"}'
);
