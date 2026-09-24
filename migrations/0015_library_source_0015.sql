-- TurtleBlockAI Library Sources: entry 15
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
  'library-source-0015', 15,
  'The Dots-and-Boxes Game',
  'Sophisticated Child''s Play',
  'The Dots-and-Boxes Game: Sophisticated Child''s Play',
  'Elwyn Berlekamp',
  '[]',
  2000, 2000, 2000, 'original_publication_year',
  NULL,
  'First printing sequence shown for 2000',
  'A K Peters, Ltd.',
  NULL,
  'Natick, Massachusetts',
  '1-56881-129-2',
  '00-033185',
  'QA269.B39 2000',
  '519.3--dc21',
  '["Game theory","Dots-and-boxes (Game)"]',
  '["game theory","Dots and Boxes","combinatorial games","strategy","nimbers","nimstring graphs","chain counting","mathematics","child''s play","problem solving"]',
  '["Dots-and-Boxes—An Introduction","Strings-and-Coins","Elementary Chain Counting Problems","Advanced Chain Counting","Advanced Chain Counting Problems","Nimber Values for Nimstring Graphs","Elementary Problems with Nimbers","More about Nimstring, Arrays, Mutations, Vines, etc.","Advanced Nimstring Problems","Playing Dots-and-Boxes with Very Close Scores","Dots-and-Boxes Problems with Close Scores","Unsolved Problems","Bibliography","Index"]',
  'Copyright page states copyright 2000 by A K Peters, Ltd. Cataloging data identifies game theory and Dots-and-boxes as subjects. The photographed physical copy also contains a loose handwritten Dots-and-Boxes game sheet dated January 2001, labeled “Simultaneous Exhibition,” with 36 dots and player/color annotations; authorship and event location are not established from the supplied photograph.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status, metadata_provenance_json
) VALUES (
  'library-copy-0015-01',
  'library-source-0015',
  1,
  'paperback',
  '1-56881-129-2',
  'Photographed copy includes a loose handwritten Dots-and-Boxes game sheet dated January 2001. The sheet reads “Simultaneous Exhibition,” “36 dots,” includes the name Steve and player/color labels, and records a partially completed game. No author or event location is inferred.',
  '["Loose handwritten Dots-and-Boxes game sheet dated January 2001"]',
  'currently_owned',
  'physical_copy_photographed',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
