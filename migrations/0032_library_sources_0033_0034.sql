-- TurtleBlockAI Library intake: entries 0033-0034
-- Source basis: Commander-provided photographs, 2026-10-02.
-- No external bibliographic lookup used.

PRAGMA foreign_keys = ON;

-- 0033 Neil Wechsler, Grenadine
INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0033', 33,
  'Grenadine', 'A play', 'Grenadine', 'Neil Wechsler',
  '["Foreword by Edward Albee"]',
  2009, 2009, 2009, 'original_publication_year',
  'The Yale Drama Series', '978-0-300-14992-0', '2009009673',
  'PS3623.E3977G74 2009', '812/.6--dc22',
  '["Male friendship--Drama","Voyages and travels--Drama"]',
  '["Neil Wechsler","Grenadine","drama","theater","male friendship","voyages and travels","Edward Albee","Yale Drama Series"]',
  '["Foreword: Judgment Day","Grenadine"]',
  'Photographed cover identifies Grenadine as a play by Neil Wechsler in The Yale Drama Series, with a foreword by Edward Albee. Copyright page shows copyright 2009 by Neil Wechsler and foreword copyright 2009 by Edward Albee. The supplied photographs do not explicitly establish the publisher name, so that field remains unset.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-10-02","external_lookup":false,"photo_file_ids":["file_000000003dd881f686f132f684651272","file_00000000e38481f5a3775bd818d48e7d"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0033-01','library-source-0033','visual_detail','Wheelchair dachshund cover image',
 'The photographed cover features a stylized dachshund using a wheeled rear-support cart beneath a large red circle. The image is preserved as a distinctive visual marker for this physical edition.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0033-02','library-source-0033','historical_context','Edward Albee foreword',
 'The photographed cover and copyright page identify Edward Albee as the author of the foreword, whose copyright is separately dated 2009.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0033-03','library-source-0033','intellectual_connection','Contemporary drama branch',
 'The cataloging subjects place the play around male friendship and voyages/travel, adding a contemporary dramatic-literature node to a library that already includes Shakespeare, Plautus, and Beckett.',
 'mixed','photographed_cataloging_data_plus_cataloging_interpretation',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0034 Ferdinand de Saussure, Course in General Linguistics
INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  edition_year, chronology_year, chronology_basis, edition_label, printing_label,
  publisher, publication_place, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0034', 34,
  'Course in General Linguistics', 'Cours de linguistique générale',
  'Ferdinand de Saussure',
  '["English translation and editorial matter by Roy Harris","Charles Bally","Albert Sechehaye","Albert Riedlinger"]',
  1986, 1986, 'edition_year',
  'Open Court Classics; English-language reprint edition',
  'Seventh printing 1995',
  'Open Court Publishing Company', 'La Salle, Illinois',
  '0-8126-9023-0', '86-4322', 'P121.S363 1986', '410',
  '["Linguistics"]',
  '["Ferdinand de Saussure","linguistics","structural linguistics","linguistic sign","semiology","synchronic linguistics","diachronic linguistics","phonetics","grammar","language structure","language change","Roy Harris"]',
  '["Translator’s Introduction","Preface to the First Edition","Preface to the Second Edition","Preface to the Third Edition","Introduction","A brief survey of the history of linguistics","Data and aims of linguistics: connections with related sciences","The object of study","Linguistics of language structure and linguistics of speech","Internal and external elements of a language","Representation of a language by writing","Physiological phonetics","Part One: General Principles","Nature of the linguistic sign","Immutability and variability of the sign","Static linguistics and evolutionary linguistics","Part Two: Synchronic Linguistics","Linguistic value","Syntagmatic relations and associative relations","The language mechanism","Grammar and its subdivisions","Abstract entities in grammar","Part Three: Diachronic Linguistics","Sound changes","Grammatical consequences of phonetic evolution","Analogy","Analogy and evolution","Popular etymology","Agglutination","Diachronic units, identities and realities","Part Four: Geographical Linguistics","On the diversity of languages","Geographical diversity: its complexity","Causes of geographical diversity","Propagation of linguistic waves","Part Five: Questions of Retrospective Linguistics — Conclusion","The perspectives of diachronic linguistics","Earliest languages and prototypes","Reconstruction","Linguistic evidence in anthropology and prehistory","Language families and linguistic types","Index"]',
  'Photographed copyright page states copyright 1972 for the main text by Editions Payot, Paris; copyright 1983 for the English translation and editorial matter by Roy Harris; and publication in 1986 by Open Court Publishing Company. It identifies this as a reprint of an English edition originally published in London by G. Duckworth in 1983. Printing history shown: fifth printing 1992, sixth printing 1994, seventh printing 1995. The original publication year of the underlying French work is not established by the supplied photographs and is therefore left unset.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-10-02","external_lookup":false,"photo_file_ids":["file_00000000d36c823090316c7f1bcf9001","file_00000000610c8230aad8bc5a52e68777","file_00000000446081fd9321875c23ea6a9c","file_0000000062a8823081c73dfade13d5a7","file_00000000addc81f594fc0aafa103279a","file_00000000959481f7b9f0b8d31d60af0a"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0034-01','library-source-0034','historical_context','Layered publication history',
 'The photographed copyright page preserves several distinct layers: a 1972 main-text copyright by Editions Payot, a 1983 English translation and editorial copyright by Roy Harris, an English edition originally published in London in 1983, Open Court publication in 1986, and a seventh printing in 1995.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0034-02','library-source-0034','cataloging_insight','Original French work year left unknown',
 'Although the book is historically older than this English edition, the supplied photographs do not establish the original publication year of Cours de linguistique générale. The catalog therefore uses the verified 1986 edition year for chronology rather than silently importing an outside date.',
 'interpretive','cataloging_session_design_decision',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0034-03','library-source-0034','intellectual_connection','The linguistic sign',
 'The photographed contents foreground the nature of the linguistic sign, including sign, signification, signal; the arbitrariness of the sign; and the linear character of the signal. This creates a foundational language-and-meaning node in the library.',
 'mixed','photographed_contents_plus_cataloging_interpretation',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0034-04','library-source-0034','intellectual_connection','Synchronic and diachronic language systems',
 'The contents explicitly divide the work into general principles, synchronic linguistics, diachronic linguistics, geographical linguistics, and retrospective linguistics, with sections on linguistic value, syntagmatic and associative relations, sound change, analogy, language diversity, and linguistic reconstruction.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',40,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0034-05','library-source-0034','intellectual_connection','Language branch becomes historical and structural',
 'Placed beside Aitchison, Esperanto, E-Prime, general semantics, and the language-play sources, Saussure extends the library’s language branch toward structural relations, semiology, language change, and the distinction between synchronic and diachronic analysis.',
 'interpretive','cataloging_interpretation_grounded_in_collection',50,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Expected after apply:
-- SELECT COUNT(*) FROM library_sources; -- 34
-- SELECT COUNT(*) FROM library_special_notes; -- 92
-- SELECT COUNT(*) FROM library_sources WHERE collection_visibility='public'; -- 34
