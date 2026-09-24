-- TurtleBlockAI Library Sources: entry 12
-- Source basis: Commander-provided photographs of physical copy, 2026-09-24.
-- No external bibliographic lookup used.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, lccn, lc_classification,
  dewey_classification, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json
) VALUES (
  'library-source-0012', 12,
  'The F Word',
  'The F-Word',
  'Jesse Sheidlower, editor',
  '["Foreword by Roy Blount, Jr."]',
  1995, 1995, 1995, 'original_publication_year',
  'First Edition',
  'Random House, Inc.',
  'New York; Toronto; London; Sydney; Auckland',
  '0-679-44573-0',
  '95-35505',
  'PE1599.F83F2 1995',
  '422--dc20',
  '["Fuck (The English word)","English language--Semantics","English language--Etymology","English language--Obscene words"]',
  '["English language","lexicography","semantics","etymology","slang","profanity","taboo language","dictionary history","American slang"]',
  '["Acknowledgments","Enough to Perpetuate the Race: Foreword by Roy Blount, Jr.","About the F-Word","Introduction","The F-Word","Appendix: A Guide to the F-Word in Some Other Languages"]',
  'Copyright page states copyright 1995 by Random House, Inc.; foreword copyright 1995 by Roy Blount, Jr.; first edition. The work is based on the Random House Historical Dictionary of American Slang.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
