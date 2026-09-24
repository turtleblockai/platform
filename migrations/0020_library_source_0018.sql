-- TurtleBlockAI Library Sources: entry 18
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
  'library-source-0018', 18,
  'Trees of Santa Monica',
  NULL,
  'Trees of Santa Monica',
  'George T. Hastings',
  '[{"name":"Grace L. Heintz","role":"revised and rewritten by"},{"name":"Morgan Sinclaire","role":"photography"},{"name":"Victoria Franklin","role":"botanical illustrations and cover"}]',
  NULL, 1976, 1976, 'edition_year',
  'Revised and rewritten by Grace L. Heintz',
  NULL,
  'Friends of Santa Monica Library, Committee for Trees of Santa Monica',
  NULL,
  'Santa Monica, California',
  NULL,
  NULL,
  NULL,
  NULL,
  '["Trees -- Santa Monica (Calif.)","Urban trees","Local history","Botany"]',
  '["Santa Monica","trees","urban forestry","botany","local history","Palisades Park","Santa Monica Mall","Lincoln Park","City Hall","RAND Corporation","Santa Monica College","street index","photographic supplement"]',
  '["Preface","Appreciation","Acknowledgements","Where Our Trees Came From","Palisades Park Trees","Santa Monica Mall Plantings","Lincoln Park Trees","City Hall Trees","Santa Monica County Building Trees","Rand Corporation Trees","Municipal Auditorium Trees","High School Trees","Santa Monica College Trees","Street Index","Tree Descriptions Listed Alphabetically","Photographic supplement","Common Name Index"]',
  'Title page: Trees of Santa Monica, by George T. Hastings, revised and rewritten by Grace L. Heintz, Santa Monica, California, 1976. Credits page identifies photography by Morgan Sinclaire, botanical illustrations and cover by Victoria Franklin, cover design based on the Miramar Moreton Bay Fig (Santa Monica Historical Landmark), publication by the Friends of Santa Monica Library Committee for Trees of Santa Monica, typesetting by Heath & Associates, and printing by Scott & Scott, Inc. Copyright 1976 Friends of Santa Monica Library. The photographed copy includes a frontispiece image captioned “Palms - Palisades Park” and a map of Santa Monica.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0018-01',
  'library-source-0018',
  1,
  'paperback',
  NULL,
  'Photographed physical copy of Trees of Santa Monica.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
