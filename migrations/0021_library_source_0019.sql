-- TurtleBlockAI Library Sources: entry 19
-- Source basis: Commander-provided photographs of physical copy, 2026-09-24.
-- No external bibliographic lookup used.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, printing_label, publisher, imprint, publication_place,
  isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0019', 19,
  'The Connected Family',
  'Bridging the Digital Generation Gap',
  'The Connected Family: Bridging the Digital Generation Gap',
  'Seymour Papert',
  '[{"name":"Nicholas Negroponte","role":"foreword"}]',
  1996, 1996, 1996, 'original_publication_year',
  NULL,
  '1st printing 1996',
  'Longstreet Press, Inc.',
  NULL,
  'Marietta, Georgia',
  '1-56352-335-3',
  '96-76500',
  NULL,
  NULL,
  '["Computers and families","Technology and learning","Digital generation gap","Education","Children and computers"]',
  '["Seymour Papert","family","digital generation gap","technology","learning","values","projects","school","future","children and computers","constructionism","Logo","multimedia","CD-ROM"]',
  '["Foreword","1: Generations","2: Technology","3: Learning","4: Values","5: Family","6: Projects","7: School","8: Future","Conclusion","Acknowledgments","Hot Word Index","Resource Guide","CD-ROM Instructions"]',
  'Copyright page states copyright 1996 by Seymour Papert; published by Longstreet Press, Inc., a subsidiary of Cox Newspapers / Cox Enterprises, Inc.; first printing 1996. Cover identifies a companion CD-ROM and Web Site. Photographed physical copy includes the companion CD-ROM in its sleeve. Jacket and book design by Fabrizio La Rocca; typesetting by Jill Dible.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0019-01',
  'library-source-0019',
  1,
  'hardcover',
  '1-56352-335-3',
  'Photographed physical copy of The Connected Family: Bridging the Digital Generation Gap. Companion CD-ROM is present in the copy.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[{"type":"companion_media","format":"CD-ROM","status":"present","note":"Companion CD-ROM photographed in publisher sleeve inside the book."}]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
