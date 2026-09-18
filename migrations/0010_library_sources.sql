-- TurtleBlockAI Library Sources v0.1
-- Source basis: Commander-provided photographs of physical books, 2026-09-17.
-- No external bibliographic lookup was used for seeded metadata.
-- This migration is intentionally self-contained because live application state for
-- migrations 0007-0009 has not yet been verified.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS library_sources (
  id TEXT PRIMARY KEY,
  entry_number INTEGER NOT NULL UNIQUE,
  source_type TEXT NOT NULL DEFAULT 'book',
  title TEXT NOT NULL,
  subtitle TEXT,
  canonical_work_title TEXT,
  author_display TEXT,
  contributors_json TEXT NOT NULL DEFAULT '[]',

  original_publication_year INTEGER,
  edition_year INTEGER,
  chronology_year INTEGER,
  chronology_basis TEXT NOT NULL DEFAULT 'unknown'
    CHECK (chronology_basis IN ('original_publication_year','edition_year','coverage_start_year','unknown')),
  coverage_start_year INTEGER,
  coverage_end_year INTEGER,

  edition_label TEXT,
  printing_label TEXT,
  publisher TEXT,
  imprint TEXT,
  publication_place TEXT,
  isbn TEXT,
  lccn TEXT,
  lc_classification TEXT,
  dewey_classification TEXT,

  subjects_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  contents_json TEXT NOT NULL DEFAULT '[]',
  notes TEXT,

  physical_copy_status TEXT NOT NULL DEFAULT 'currently_owned'
    CHECK (physical_copy_status IN ('currently_owned','previously_owned','borrowed','unknown')),
  digital_copy_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (digital_copy_status IN ('unknown','none_found','partial','complete_unverified','complete_verified','owned_digital')),
  digital_copy_url TEXT,
  digital_copy_type TEXT,
  digital_copy_verified_at TEXT,

  verification_status TEXT NOT NULL DEFAULT 'physical_copy_photographed'
    CHECK (verification_status IN ('physical_copy_photographed','externally_verified','inferred','unknown','mixed')),
  metadata_provenance_json TEXT NOT NULL DEFAULT '{}',
  collection_visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (collection_visibility IN ('private','internal','public')),

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_library_sources_chronology
  ON library_sources(chronology_year, author_display, title);

CREATE INDEX IF NOT EXISTS idx_library_sources_digital
  ON library_sources(digital_copy_status, physical_copy_status);

CREATE INDEX IF NOT EXISTS idx_library_sources_visibility
  ON library_sources(collection_visibility, chronology_year);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display,
  contributors_json, original_publication_year, edition_year, chronology_year,
  chronology_basis, edition_label, printing_label, publisher, imprint,
  publication_place, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0001', 1,
  'The Process of Education', NULL, 'The Process of Education', 'Jerome S. Bruner',
  '[]', 1960, NULL, 1960, 'original_publication_year',
  NULL, 'Eighth Printing', NULL, NULL, NULL, NULL, '60-15235', NULL, NULL,
  '["education","learning theory","pedagogy"]',
  '["Bruner","Woods Hole Conference","interdisciplinary curriculum","psychology","mathematics","science education","educational reform"]',
  '[]',
  'Copyright page shows 1960 copyright by the President and Fellows of Harvard College; distributed in Great Britain by Oxford University Press, London. A photographed conference page identifies Jerome S. Bruner as Director of the Woods Hole Conference, Harvard University, Psychology, among 34 interdisciplinary participants.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  publisher, publication_place, isbn, lccn, lc_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0002', 2,
  'Inventing Kindergarten', 'Inventing Kindergarten', 'Norman Brosterman',
  '["Original photography: Kiyoshi Togashi"]',
  1997, 1997, 1997, 'original_publication_year',
  'Harry N. Abrams, Incorporated', 'New York', '0-8109-3526-0', '96-27191', 'LB1199.B76 1997',
  '["Kindergarten--History--19th century","Kindergarten--History--20th century","Kindergarten--Methods and manuals","Froebel, Friedrich, 1782-1852","Architecture, Modern--20th century","Art, Abstract--History--20th century"]',
  '["Froebel","kindergarten","play","design","manipulatives","educational history","learning environments","art","architecture"]',
  '[]',
  'Cataloging page states that the book includes bibliographical references and index.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0003', 3,
  'The Relevance of Education', 'The Relevance of Education', 'Jerome S. Bruner',
  '[]',
  1971, 1973, 1971, 'original_publication_year',
  'Norton Library edition with a new preface', 'W. W. Norton & Company, Inc.',
  '0-393-00690-5', '73-941', 'LB1051.B74 1973', '370.15',
  '["Educational psychology","Child study"]',
  '["Bruner","educational psychology","child development","cognition","culture","education","learning theory"]',
  '[]',
  'Copyright page shows copyright 1973, 1971 by Jerome S. Bruner and first publication in the Norton Library in 1973.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, lccn, subjects_json, tags_json, contents_json,
  notes, metadata_provenance_json
) VALUES (
  'library-source-0004', 4,
  'Teach Yourself Esperanto', 'A Complete Course for Beginners',
  'Teach Yourself Esperanto', 'John Cresswell and John Hartley',
  '["Revised by J. H. Sullivan"]',
  1957, 1992, 1957, 'original_publication_year',
  'Third edition', 'NTC Publishing Group', '92-80873',
  '["Esperanto","language learning"]',
  '["Esperanto","constructed language","language learning","linguistics","communication","self-directed learning"]',
  '[]',
  'Publication page states this edition was first published in 1992 by NTC Publishing Group; originally published by Hodder and Stoughton Ltd.; copyrights shown for 1987, 1968, and 1957 by John Cresswell and John Hartley.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, lccn, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0005', 5,
  'Teach Yourself Linguistics', 'General Linguistics', 'Jean Aitchison', '[]',
  1972, 1992, 1972, 'original_publication_year',
  'Fourth edition', 'Hodder Headline Plc / NTC Publishing Group', 'UK / US',
  '92-80881', '410.7',
  '["Linguistics"]',
  '["linguistics","language","syntax","semantics","phonology","phonetics","sociolinguistics","psycholinguistics","language acquisition","self-directed learning"]',
  '[]',
  'First printed under the title General Linguistics in 1972; second edition 1978; third edition 1987; fourth edition 1992. UK publication 1992; US publication 1993.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, imprint, publication_place, isbn, lccn, lc_classification,
  dewey_classification, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json
) VALUES (
  'library-source-0006', 6,
  'The New Well-Tempered Sentence',
  'A Punctuation Handbook for the Innocent, the Eager, and the Doomed',
  'The Well-Tempered Sentence', 'Karen Elizabeth Gordon', '[]',
  1983, 1993, 1983, 'original_publication_year',
  'Expanded and revised', 'Ticknor & Fields', 'New York',
  '0-395-62883-0', '93-18454', 'PE1450.G65 1993', '428.2',
  '["English language--Punctuation"]',
  '["punctuation","grammar","writing","English language","style","rhetoric","writing instruction","humor"]',
  '[]',
  '1993 edition is identified as a revised edition of The Well-Tempered Sentence (1983) and includes an index.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0007', 7,
  'Democracy and Education', 'Democracy and Education', 'John Dewey',
  '["Introduction by Sidney Hook"]',
  1916, 1985, 1916, 'original_publication_year',
  'The Middle Works, 1899-1924, Volume 9; first paperback printing 1985',
  'Southern Illinois University', '0-8093-0933-5', '76-7231',
  'LB875.D34 1976', '370.1''092''4',
  '["Education--Philosophy"]',
  '["Dewey","democracy","education","philosophy of education","experience","thinking","curriculum","play","work","social learning","progressive education"]',
  '["Education as a Necessity of Life","Education as a Social Function","Education as Direction","Education as Growth","Preparation, Unfolding, and Formal Discipline","Education as Conservative and Progressive","The Democratic Conception in Education","Aims in Education","Natural Development and Social Efficiency as Aims","Interest and Discipline","Experience and Thinking","Thinking in Education","The Nature of Method","The Nature of Subject Matter","Play and Work in the Curriculum","The Significance of Geography and History","Science in the Course of Study","Educational Values","Labor and Leisure","Intellectual and Practical Studies","Physical and Social Studies: Naturalism and Humanism","The Individual and the World","Vocational Aspects of Education","Philosophy of Education","Theories of Knowledge","Theories of Morals"]',
  'Original work year 1916. Collected edition first published July 1980; photographed copy states first paperback printing 1985.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  publisher, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0008', 8,
  'The Children’s Machine', 'Rethinking School in the Age of the Computer',
  'The Children’s Machine', 'Seymour Papert', '[]',
  1993, 1993, 1993, 'original_publication_year',
  'BasicBooks, a division of HarperCollins Publishers, Inc.',
  '0-465-01830-0', '91-59012', 'LB1028.5.P325 1992', '371.3''34',
  '["Computer assisted instruction","Education--Data processing"]',
  '["Papert","constructionism","computers","Logo","learning","school reform","epistemology","cybernetics","teachers","educational technology","AI","computer culture"]',
  '["Yearners and Schoolers","Personal Thinking","School: Change and Resistance to Change","Teachers","A Word for Learning","An Anthology of Learning Stories","Instructionism versus Constructionism","Computerists","Cybernetics","What Can Be Done?","Sources of Information","Bibliography"]',
  'Jacket biography identifies work with Jean Piaget, arrival at MIT in 1964, the LEGO Chair for Learning Research, co-direction of the Artificial Intelligence Laboratory with Marvin Minsky, founding membership in the Media Laboratory, direction of the Epistemology and Learning Group, and pioneering work on Logo.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  printing_label, publisher, publication_place, isbn, lccn, lc_classification,
  dewey_classification, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json
) VALUES (
  'library-source-0009', 9,
  'To Be or Not', 'An E-Prime Anthology', 'To Be or Not: An E-Prime Anthology',
  'D. David Bourland, Jr. and Paul Dennithorne Johnston, editors',
  '["Foreword by Steve Allen"]',
  1991, 1991, 1991, 'original_publication_year',
  'Third printing 1993', 'International Society for General Semantics', 'San Francisco',
  '0-918970-38-5', '91-29865', 'PE1404.T59 1991', '808''.04207',
  '["English language--Composition and exercises--Study and teaching","English language--Rhetoric--Study and teaching","English language--Semantics","English language--Reform","English language--Verb"]',
  '["E-Prime","general semantics","semantics","epistemology","critical thinking","rhetoric","writing","grammar","language reform","non-Aristotelian language"]',
  '["E-Prime in Action","Epistemological Foundations of E-Prime","Further Applications of E-Prime"]',
  'First printing 1991, second printing 1992, third printing 1993. Dedicated to the memory of Alfred Korzybski. Includes bibliographical references.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, lccn, lc_classification,
  dewey_classification, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json
) VALUES (
  'library-source-0010', 10,
  'Drive Yourself Sane', 'Using the Uncommon Sense of General Semantics',
  'Drive Yourself Sane: Using the Uncommon Sense of General Semantics',
  'Susan Presby Kodish and Bruce I. Kodish',
  '["Foreword by Albert Ellis"]',
  NULL, 2001, 2001, 'edition_year',
  'Revised Second Edition', 'Extensional Publishing', 'Pasadena, California',
  '0-9700664-6-5', '00-104837', 'BF 441', '153.4',
  '["General Semantics","Thinking Skills","Communication","Applied Psychology","Practical Philosophy"]',
  '["general semantics","critical thinking","epistemology","language","abstraction","perception","inference","communication","mapping","E-Prime","Korzybski","metacognition"]',
  '["Introductions","Glass Doors and Unicorns","Uncommon Sense","Endless Complexities","The Process of Abstracting","Mapping Structures","The Structural Differential","Non-Verbal Awareness","Verbal Awareness","The Structure of Language","Self-Reflexive Mapping","The Extensional Orientation","Getting Extensional","Time-Binding","Et Cetera","On Alfred Korzybski","On General Semantics Organizations","Glossary","Notes","References","Index"]',
  'Photographed pages establish the revised second edition copyright year as 2001; no earlier original-work year was established from the supplied pages.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  coverage_start_year, coverage_end_year, subjects_json, tags_json, contents_json,
  notes, metadata_provenance_json
) VALUES (
  'library-source-0011', 11,
  'Evergreen Review Reader 1957-1966',
  'Evergreen Review Reader 1957-1966',
  'Barney Rosset, editor',
  '["Associate editors: Dick Seaver, Fred Jordan, Donald Allen","Special editor: Mike Topp"]',
  NULL, NULL, 1957, 'coverage_start_year',
  1957, 1966,
  '["literature","literary magazine anthology"]',
  '["literature","counterculture","Beat literature","experimental writing","translation","poetry","fiction","literary magazines","postwar American culture","censorship and free expression","Evergreen Review"]',
  '["1957","1958","1959","1960","1961","1962","1963","1964","1965","1966"]',
  'The photographed contents organize selections by original magazine year from 1957 through 1966. Contributors visible in the supplied pages include Samuel Beckett, Jack Kerouac, Lawrence Ferlinghetti, Allen Ginsberg, Frank O’Hara, William Carlos Williams, John Rechy, Gary Snyder, Michael McClure, Carlos Fuentes, Juan Rulfo, Octavio Paz, Boris Pasternak, Henry Miller, William S. Burroughs, Eugène Ionesco, Friedrich Dürrenmatt, Pablo Neruda, Yevgeny Yevtushenko, Jorge Luis Borges, Federico García Lorca, Pauline Réage, Richard Brautigan, Hubert Selby Jr., Witold Gombrowicz, Chester Himes, Curzio Malaparte, and Ho Chi Minh. Publication year of this collected reader was not established from the supplied photographs.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-17","external_lookup":false}'
);

CREATE VIEW IF NOT EXISTS library_sources_chronological AS
SELECT
  entry_number,
  id,
  chronology_year,
  chronology_basis,
  author_display,
  title,
  subtitle,
  original_publication_year,
  edition_year,
  coverage_start_year,
  coverage_end_year,
  physical_copy_status,
  digital_copy_status,
  digital_copy_url,
  verification_status,
  collection_visibility
FROM library_sources
ORDER BY
  CASE WHEN chronology_year IS NULL THEN 1 ELSE 0 END,
  chronology_year,
  author_display,
  title;
