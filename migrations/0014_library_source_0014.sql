-- TurtleBlockAI Library Sources: entry 14
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
  'library-source-0014', 14,
  'The Klingon Hamlet',
  'The Restored Klingon Version',
  'The Klingon Hamlet',
  'William Shakespeare',
  '["Restored to the original Klingon by Nick Nicholas and Andrew Strader","Edited by Mark Shoulson with assistance from Will Martin and d’Armond Speers","Layout and design by Lawrence M. Schoen with assistance from Sarah Ekstrom","Prepared by the Klingon Language Institute"]',
  1996, 2000, 1996, 'original_publication_year',
  'Pocket Books paperback edition',
  'First Pocket Books paperback printing February 2000',
  'Pocket Books, a division of Simon & Schuster Inc.',
  NULL,
  'New York',
  '0-671-03578-9',
  NULL,
  NULL,
  NULL,
  '["Hamlet","Klingon language","literary translation","constructed language","Shakespeare"]',
  '["Shakespeare","Hamlet","Klingon","constructed language","translation","Star Trek","Klingon Language Institute","language play","literary adaptation","STEAMHAMLET"]',
  '[]',
  'Title page identifies Hamlet, Prince of Denmark by William Shakespeare, restored to the original Klingon by Nick Nicholas and Andrew Strader. The volume is part of the Klingon Shakespeare Restoration Project, sponsored by the Klingon Language Institute. Copyright page states originally published in 1996 by the Klingon Language Institute; Klingon translation copyright 2000 by Paramount Pictures; first Pocket Books paperback printing February 2000. Illustration copyright 1995 by Gennie Summers. The dedication thanks Paramount Pictures for commissioning the creation of the Klingon language and dedicates the volume to the memory of Gene Roddenberry.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
