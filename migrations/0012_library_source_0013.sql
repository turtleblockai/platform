-- TurtleBlockAI Library Sources: entry 13
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
  'library-source-0013', 13,
  'Mindstorms',
  'Children, Computers, and Powerful Ideas',
  'Mindstorms: Children, Computers, and Powerful Ideas',
  'Seymour Papert',
  '[]',
  1980, 1980, 1980, 'original_publication_year',
  NULL, NULL,
  'Basic Books, Inc.',
  NULL,
  'New York',
  '0-465-04629-0',
  '79-5200',
  'QA20.C65P36 1980',
  '372.7',
  '["Education","Psychology","Mathematics--Computer-assisted instruction"]',
  '["Papert","children","computers","computer culture","mathophobia","turtle geometry","Logo","microworlds","powerful ideas","Piaget","AI","learning society","mathematics","computer-assisted instruction"]',
  '["Foreword: The Gears of My Childhood","Introduction: Computers for Children","Computers and Computer Cultures","Mathophobia: The Fear of Learning","Turtle Geometry: A Mathematics Made for Learning","Languages for Computers and for People","Microworlds: Incubators for Knowledge","Powerful Ideas in Mind-Size Bites","LOGO’s Roots: Piaget and AI","Images of the Learning Society","Epilogue: The Mathematical Unconscious","Afterword and Acknowledgments","Notes","Index"]',
  'Copyright page states copyright 1980 by Basic Books, Inc.; includes bibliographical references and index. Cataloging page also lists cloth ISBN 0-465-04627-4 and paper ISBN 0-465-04629-0. Frontispiece is captioned “LOGO Turtle.” Photographed figures show turtle-drawn geometric sequences.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
