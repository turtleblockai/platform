-- TurtleBlockAI Library Sources: entry 25
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
  'library-source-0025', 25,
  'Computer Environments for Children',
  'A Reflection on Theories of Learning and Education',
  'Computer Environments for Children',
  'Cynthia Solomon',
  '[{"name":"Cynthia Solomon","role":"author"}]',
  1986, 1986, 1986, 'original_publication_year',
  NULL,
  NULL,
  'The MIT Press',
  NULL,
  NULL,
  '9780262691253',
  '86-3018',
  'QA20.C65S64 1986',
  '372.13''9445',
  '["mathematics--computer-assisted instruction","computer-assisted instruction","mathematics--study and teaching (elementary)","computers in education","learning theory","education"]',
  '["computer environments","children","computer education","learning theories","rote learning","drill and practice","discovery learning","Socratic interaction","heuristic learning","constructivism","Piagetian learning","Seymour Papert","computer educators","educational technology","Logo lineage"]',
  '[
    {"section":"Acknowledgments","page":"vii"},
    {"section":"1","title":"Computers in Education","page":1},
    {"section":"2","title":"Suppes: Drill and Practice and Rote Learning","page":16},
    {"section":"3","title":"Davis: Socratic Interactions and Discovery Learning","page":31},
    {"section":"4","title":"Dwyer: Eclecticism and Heuristic Learning","page":70},
    {"section":"5","title":"Papert: Constructivism and Piagetian Learning","page":103},
    {"section":"6","title":"Trends in Practice","page":134},
    {"section":"7","title":"Computer Educators","page":146},
    {"section":"Notes","page":163},
    {"section":"Bibliography","page":165},
    {"section":"Index","page":179}
  ]',
  'Copyright page states © 1986 by The Massachusetts Institute of Technology. Library of Congress cataloging identifies Cynthia Solomon as author and notes that the work was originally presented as the author''s doctoral thesis at Harvard University in 1985. The photographed copy gives ISBN 978-0-262-69125-3, LC classification QA20.C65S64 1986, Dewey 372.13''9445, and LCCN 86-3018. The copyright page also states that the discussion on pages 148 to 160 is based on material originally appearing in BYTE magazine, August 1982. The table of contents frames contrasting approaches to computer-supported learning through Suppes, Davis, Dwyer, and Papert, followed by trends in practice and computer educators.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0025-01',
  'library-source-0025',
  1,
  'paperback',
  '9780262691253',
  'Photographed physical copy of Computer Environments for Children by Cynthia Solomon.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
