-- TurtleBlockAI Library Sources: entry 17
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
  'library-source-0017', 17,
  'LogoWorks',
  'Challenging Programs in Logo',
  'LogoWorks: Challenging Programs in Logo',
  'Cynthia Solomon, Margaret Minsky, and Brian Harvey',
  '[]',
  1986, 1986, 1986, 'original_publication_year',
  NULL,
  'First printing indicated by number line 1234567890',
  'McGraw-Hill, Inc.',
  NULL,
  NULL,
  '0-07-042425-X',
  '85-14976',
  'QA76.73.L63L635 1986',
  '005.36''2',
  '["LOGO (Computer program language)","Computer programs"]',
  '["Logo","programming","computer programming","wordplay","stories","games","turtle geometry","music","programming ideas","Atari Logo","creative computing","constructionism"]',
  '["Preface","Contributors","Introduction","Acknowledgments","Wordplay: Sengen: A Sentence Generator; Argue; Animal Game; Dictionary; Hangman; Math: A Sentence Generator; Number Speller; Drawing Letters; Mail; Wordscram; Madlibs","Stories: Exercise; Cartoon; Jack and Jill; Rocket","Games: Boxgame; Pacgame; Blaster; Alien; Adventure; Dungeon","Turtle Geometry: Turtle Race; Four-Corner Problem; Towards and Arctan; Gongram: Making Complex Polygon Designs; Polycirc; Animating Line Drawings","Music: Melodies; Ear Training; Sound Effects; Naming Notes","Programming Ideas: Adding Numbers; Fill; Savepict and Loadpict; Display Workspace Manager; A Logo Interpreter; Map; Mergesort; Bestline; Lines and Mirrors","Appendix: Special Features of Atari Logo: Turtle Graphics; Turtles and Their Shapes; Sounds and Music; Demons, Turtle Collisions, and Other Events","Index"]',
  'Copyright page states copyright 1986 by McGraw-Hill, Inc. Library of Congress data lists Cynthia Solomon, Margaret Minsky, and Brian Harvey and identifies LOGO and computer programs as subjects. The page states that two disks containing all programs in the book were available for Atari Logo.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0017-01',
  'library-source-0017',
  1,
  'paperback',
  '0-07-042425-X',
  'Photographed physical copy of LogoWorks: Challenging Programs in Logo.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
