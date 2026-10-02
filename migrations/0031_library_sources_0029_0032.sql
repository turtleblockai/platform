-- TurtleBlockAI Library intake: entries 0029-0032
-- Source basis: Commander-provided photographs, 2026-10-02.
-- No external bibliographic lookup used.

PRAGMA foreign_keys = ON;

-- 0029 Paulo Freire, Pedagogy of the Oppressed
INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, lccn, lc_classification,
  dewey_classification, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0029', 29,
  'Pedagogy of the Oppressed', 'Pedagogy of the Oppressed', 'Paulo Freire',
  '["Translated by Myra Bergman Ramos"]',
  1970, 1993, 1970, 'original_publication_year',
  'New revised edition / 20th-anniversary edition; photographed printing dated 1997',
  'The Continuum Publishing Company', 'New York',
  '0-8264-0611-4', '92-39086', 'LB880.F73P4313 1993', '370.11/5--dc20',
  '["Freire, Paulo, 1921-","Education--Philosophy","Popular education","Critical pedagogy"]',
  '["Paulo Freire","critical pedagogy","education philosophy","popular education","oppression","dialogue","pedagogy","research lineage"]',
  '[]',
  'Photographed copyright page shows copyright 1970 and 1993 by Paulo Freire; cataloging identifies the new revised edition translated by Myra Bergman Ramos. The page is headed 1997, while the cover identifies the volume as the New Revised 20th-Anniversary Edition.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-10-02","external_lookup":false,"photo_file_ids":["file_000000007cc48230935c60606e6f771a","file_00000000b6748230b5c192d025b93fab"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0029-01','library-source-0029','historical_context','1970 work / revised anniversary edition',
 'The photographed copyright and cataloging page preserves the original 1970 copyright alongside the 1993 revision history, while the physical copy itself is marked 1997 and the cover identifies it as a revised 20th-anniversary edition.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0029-02','library-source-0029','intellectual_connection','Critical pedagogy node',
 'The photographed Library of Congress subjects explicitly place the book at the intersection of education philosophy, popular education, and critical pedagogy, making it a major theory node in the research library.',
 'mixed','photographed_cataloging_data_plus_cataloging_interpretation',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0029-03','library-source-0029','artifact','Cover history',
 'The photographed cover advertises “500,000 copies sold worldwide” and frames the book as a revised 20th-anniversary edition, preserving how this particular physical edition presented the work to readers.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0030 Jack Kerouac, On the Road
INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, lccn,
  subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0030', 30,
  'On the Road', 'On the Road', 'Jack Kerouac', '[]',
  1957, 1976, 1957, 'original_publication_year',
  'Penguin Books edition, 1976; Viking Compass edition first published 1959',
  'Penguin Books', 'New York / London and other Penguin offices',
  '0-14-004259-8', '57-9425',
  '["American literature","Beat literature","fiction"]',
  '["Jack Kerouac","Beat literature","road narrative","American literature","counterculture","Evergreen Review network"]',
  '[]',
  'Photographed publication page states Viking Compass Edition published 1959, numerous reprintings through 1975, and publication in Penguin Books in 1976. Copyright is shown as Jack Kerouac 1955, 1957. The photographed copy is heavily worn and carries a sticky note reading “BRYAN’S!!!”.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-10-02","external_lookup":false,"photo_file_ids":["file_00000000158c8230841c3876fe992dec","file_0000000004008230b839b0d9aca6eab9"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0030-01','library-source-0030','artifact','“BRYAN’S!!!” copy',
 'A blue sticky note on the photographed front cover reads “BRYAN’S!!!”, making this copy visibly personal rather than an anonymous duplicate in the collection.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0030-02','library-source-0030','artifact','Well-read physical object',
 'The photographed copy shows substantial edge, corner, spine, and cover wear. That wear is preserved as part of the provenance of the physical object rather than treated as irrelevant to the catalog.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0030-03','library-source-0030','historical_context','Parts circulated before this Penguin edition',
 'The photographed publication page notes that parts of the work appeared in The Paris Review under “The Mexican Girl,” in New World Writing as “Jazz of the Beat Generation,” and in New Dimensions 16 as “A Billowy Trip in the World.”',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0031 Plautus, The Menaechmi
INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  edition_year, chronology_year, chronology_basis, edition_label, printing_label,
  publisher, isbn, lccn, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0031', 31,
  'The Menaechmi', 'The Menaechmi', 'Plautus',
  '["Translated by Frank O. Copley"]',
  1956, 1956, 'edition_year', 'Second Edition', 'Ninth Printing',
  'The Liberal Arts Press, Inc., a division of The Bobbs-Merrill Company, Inc.',
  '0-672-60178-8', '50-5706',
  '["Roman drama","comedy","classical literature","translation"]',
  '["Plautus","The Menaechmi","Roman comedy","classics","drama","translation","Frank O. Copley"]',
  '[]',
  'Photographed copyright page states copyright 1949, second edition 1956, ninth printing. The page identifies Titus Maccius Plautus as c. 254-184 B.C. The original composition date of the play is not established by the supplied photographs, so the catalog chronology uses this physical edition year rather than inventing an ancient work date.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-10-02","external_lookup":false,"photo_file_ids":["file_0000000095748230a9cabc32383556c4","file_00000000a5b882309066b3c4eab7164c"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0031-01','library-source-0031','historical_context','Ancient author / modern edition',
 'The photographed page identifies Titus Maccius Plautus as c. 254-184 B.C., while the physical book is a 1956 second edition and ninth printing. The catalog deliberately keeps those two time scales separate.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0031-02','library-source-0031','cataloging_insight','Do not fake an ancient publication year',
 'Because the supplied pages do not establish when The Menaechmi itself was composed or first performed, the chronology uses the verified 1956 edition year rather than assigning a speculative B.C. work date.',
 'interpretive','cataloging_session_design_decision',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0032 Samuel Beckett, Waiting for Godot
INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  chronology_year, chronology_basis, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0032', 32,
  'Waiting for Godot', 'A Tragicomedy in Two Acts',
  'Waiting for Godot', 'Samuel Beckett', '[]',
  NULL, 'unknown',
  '["drama","theater","tragicomedy"]',
  '["Samuel Beckett","Waiting for Godot","drama","theater","tragicomedy","literary interpretation","performance"]',
  '[]',
  'The supplied photographs establish the title, subtitle, and author from the cover but do not establish publication year, publisher, ISBN, or edition history. The inside front matter contains handwritten interpretive notes that are preserved separately as an artifact note.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-10-02","external_lookup":false,"photo_file_ids":["file_000000001cb881f6935fd6237149ca0c","file_000000004df881f597ebf712edca7633"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0032-01','library-source-0032','artifact','Handwritten Daft Punk / Life Alert annotations',
 'The photographed inside page contains two handwritten joke-annotations: “DAFT PUNK / Pozzo’s up all night to → get lucky” and “LIFE ALERT / Pozzo, blind, fallen and can’t get up.” The notes turn close reading into playful cultural remix and are preserved as part of this physical copy.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0032-02','library-source-0032','intellectual_connection','Interpretation as remix',
 'The handwritten notes are a compact example of literary interpretation operating through remix, humor, and contemporary cultural reference rather than through formal analytic prose alone.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_annotation',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Expected after apply:
-- SELECT COUNT(*) FROM library_sources; -- 32
-- SELECT COUNT(*) FROM library_special_notes; -- 84
-- SELECT COUNT(*) FROM library_sources WHERE collection_visibility='public'; -- 32
