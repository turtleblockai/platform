-- TurtleBlockAI Library recovery v0.1
-- Recovers physical-library entries 0012-0025 from Commander-provided photographs.
-- No external bibliographic lookup was used.
-- Migration 0010 was already applied remotely with entries 0001-0011, so this
-- additive migration preserves that history and brings the live catalog to 25 physical items.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, lccn, lc_classification,
  dewey_classification, subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0012', 12,
  'The F-Word', 'The F-Word', 'Jesse Sheidlower, editor',
  '["Foreword by Roy Blount, Jr."]',
  1995, 1995, 1995, 'original_publication_year',
  'First Edition', 'Random House, Inc.', 'New York',
  '0-679-44573-0', '95-35505', 'PE1599.F83F2 1995', '422--dc20',
  '["Fuck (English word)","English language--Semantics","English language--Etymology","English language--Obscene words"]',
  '["language","semantics","etymology","slang","lexicography","usage"]',
  '["Acknowledgments","Enough to Perpetuate the Race","About the F-Word","Introduction","The F-Word","Appendix: A Guide to the F-Word in Some Other Languages"]',
  'Copyright 1995 Random House, Inc. The photographed copyright page states that the work is based on the Random House Historical Dictionary of American Slang.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_000000000e3081fd92a8efe6aac2b5ef","file_0000000066bc822f8c38823e394aa802"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, imprint, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0013', 13,
  'Mindstorms', 'Children, Computers, and Powerful Ideas',
  'Mindstorms: Children, Computers, and Powerful Ideas', 'Seymour Papert', '[]',
  1980, 1980, 1980, 'original_publication_year',
  'Paper copy photographed with orange Harper Colophon cover', 'Basic Books, Inc.', 'Harper Colophon Books',
  '0-465-04629-0', '79-5200', 'QA20.C65P36 1980', '372.7',
  '["Education","Psychology","Mathematics--Computer-assisted instruction"]',
  '["Papert","Logo","constructionism","computer culture","mathophobia","turtle geometry","microworlds","Piaget","AI","learning society"]',
  '["Foreword: The Gears of My Childhood","Introduction: Computers for Children","Computers and Computer Cultures","Mathophobia: The Fear of Learning","Turtle Geometry: A Mathematics Made for Learning","Languages for Computers and for People","Microworlds: Incubators for Knowledge","Powerful Ideas in Mind-Size Bites","LOGO''s Roots: Piaget and AI","Images of the Learning Society","Epilogue: The Mathematical Unconscious","Afterword and Acknowledgments","Notes","Index"]',
  'Copyright 1980 Basic Books, Inc. This entry represents the orange paper copy. The cataloging page also lists cloth ISBN 0-465-04627-4.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"copy_identity":"orange_paper_copy","photo_file_ids":["file_00000000d6cc81f89e554e979de7d832","file_000000003d808230a2ec2feed6e1e48f","file_0000000081a881f8b9366348e146a988","file_00000000ab9081fda5c3f3c1700f99d1","file_0000000091f481fd9d0c0d3efe806892"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, isbn, subjects_json, tags_json, contents_json, notes,
  verification_status, metadata_provenance_json
) VALUES (
  'library-source-0014', 14,
  'Mindstorms', 'Children, Computers, and Powerful Ideas',
  'Mindstorms: Children, Computers, and Powerful Ideas', 'Seymour Papert', '[]',
  1980, 1980, 1980, 'original_publication_year',
  'Second physical copy; red dust-jacket/library copy', 'Basic Books, Inc.', '0-465-04627-4',
  '["Education","Psychology","Mathematics--Computer-assisted instruction"]',
  '["Papert","Logo","constructionism","turtle geometry","microworlds","former library copy"]',
  '[]',
  'Second physical Mindstorms item in the collection. Photographs show a red dust jacket plus Mount de Sales Library / Mount de Sales Academy ownership and circulation markings. Edition-level metadata is linked to the same 1980 work; this copy was photographed separately and therefore remains a separate physical-library entry.',
  'mixed',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"copy_identity":"red_dust_jacket_former_library_copy","edition_metadata_shared_from_same_photographed_work_batch":true,"photo_file_ids":["file_000000009e7881fd912ca3b995cbfadd","file_00000000907481f887d4b131a693f961","file_00000000207481fda654ca1d02b070b1"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json
) VALUES (
  'library-source-0015', 15,
  'The Klingon Hamlet', 'The Restored Klingon Version',
  'Hamlet, Prince of Denmark -- Restored Klingon Version', 'William Shakespeare',
  '["Restored to the original Klingon by Nick Nicholas and Andrew Strader","Edited by Mark Shoulson","Assistance from Will Martin and d''Armond Speers","Prepared by the Klingon Language Institute"]',
  1996, 2000, 1996, 'original_publication_year',
  'First Pocket Books paperback printing, February 2000', 'Pocket Books, a division of Simon & Schuster Inc.', 'New York',
  '0-671-03578-9',
  '["Hamlet","Klingon language","translation"]',
  '["Shakespeare","Klingon","constructed language","translation","Star Trek","language play"]',
  '[]',
  'Originally published in 1996 by the Klingon Language Institute. Klingon translation copyright 2000 Paramount Pictures. The volume is dedicated to the memory of Gene Roddenberry.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_00000000ecf881f8850d06ff1e3d6b5c","file_000000003dbc81f987545512e298e41d","file_00000000d7b881fdb0aad5a12cbfd2d3","file_00000000513881f5a1e624cc0032625e"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  publisher, publication_place, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0016', 16,
  'The Dots-and-Boxes Game', 'Sophisticated Child''s Play',
  'The Dots-and-Boxes Game: Sophisticated Child''s Play', 'Elwyn Berlekamp', '[]',
  2000, 2000, 2000, 'original_publication_year',
  'A K Peters, Ltd.', 'Natick, Massachusetts', '1-56881-129-2', '00-033185', 'QA269.B39 2000', '519.3--dc21',
  '["Game theory","Dots-and-boxes (Game)"]',
  '["game theory","mathematics","play","strategy","dots and boxes","combinatorial games"]',
  '["Dots-and-Boxes--An Introduction","Strings-and-Coins","Elementary Chain Counting Problems","Advanced Chain Counting","Advanced Chain Counting Problems","Nimber Values for Nimstring Graphs","Elementary Problems with Nimbers","More about Nimstring, Arrays, Mutations, Vines, etc.","Advanced Nimstring Problems","Playing Dots-and-Boxes with Very Close Scores","Dots-and-Boxes Problems with Close Scores","Unsolved Problems","Bibliography","Index"]',
  'The title page is inscribed "To Steve" and signed by Elwyn Berlekamp, dated January 13, 2001. A photographed handwritten game sheet from January 2001 is preserved with the copy.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"special_provenance":"signed_and_personalized","photo_file_ids":["file_000000005a3c822fa9e0097e69922557","file_000000002d5c822f8595efb58a4b94c3","file_00000000c0e881f5841f8903f90fc5aa","file_000000001c2c81f9b6921eed6860acc7","file_000000004ef081f48eac9038ccdc1954"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  publisher, publication_place, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0017', 17,
  'LogoWorks', 'Challenging Programs in Logo',
  'LogoWorks: Challenging Programs in Logo', 'Cynthia Solomon, Margaret Minsky, and Brian Harvey', '[]',
  1986, 1986, 1986, 'original_publication_year',
  'McGraw-Hill, Inc.', 'New York', '0-07-042425-X', '85-14976', 'QA76.73.L63L635 1986', '005.36''2',
  '["LOGO (Computer program language)","Computer programs"]',
  '["Logo","programming","wordplay","stories","games","turtle geometry","music","Atari Logo","constructionism"]',
  '["Wordplay","Stories","Games","Turtle Geometry","Music","Programming Ideas","Appendix: Special Features of Atari Logo","Index"]',
  'Photographed copyright page states that two disks containing the programs were available for Atari Logo.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_00000000927081fd85298e6858616909","file_000000007d4c823093fa1018aa03ff37","file_00000000f12881fdb1ffd2f18bd51507"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json
) VALUES (
  'library-source-0018', 18,
  'Trees of Santa Monica', 'Trees of Santa Monica', 'George T. Hastings',
  '["Revised and rewritten by Grace L. Heintz","Photography by Morgan Sinclaire","Botanical illustrations and cover by Victoria Franklin"]',
  1976, 1976, 1976, 'original_publication_year',
  'Revised and rewritten edition photographed', 'Friends of Santa Monica Library, Committee for Trees of Santa Monica', 'Santa Monica, California',
  '["Trees","Santa Monica","urban landscape"]',
  '["botany","trees","Santa Monica","urban ecology","local history","landscape","Palisades Park"]',
  '[]',
  'Copyright 1976 Friends of Santa Monica Library. The cover design is identified as the Miramar Moreton Bay Fig, a Santa Monica historical landmark.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_000000009cd081fdba42306c3132190a","file_00000000fdf081f8b0ab6e7b25af4e5d","file_00000000d27881fd9d23cc5abaf73be6","file_00000000a7dc81f8b363fb00278658b7"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, lccn,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0019', 19,
  'The Connected Family', 'Bridging the Digital Generation Gap',
  'The Connected Family: Bridging the Digital Generation Gap', 'Seymour Papert',
  '["Foreword by Nicholas Negroponte"]',
  1996, 1996, 1996, 'original_publication_year',
  'First printing 1996, with companion CD-ROM', 'Longstreet Press, Inc.', 'Marietta, Georgia',
  '1-56352-335-3', '96-76500',
  '["families","computers","learning","education"]',
  '["Papert","family","technology","learning","projects","school","future","digital generation gap","Logo"]',
  '["Generations","Technology","Learning","Values","Family","Projects","School","Future","Conclusion","Acknowledgments","Hot Word Index","Resource Guide","CD-ROM Instructions"]',
  'Physical copy photographed with its companion CD-ROM still present.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"physical_extra":"companion_cd_rom_present","photo_file_ids":["file_00000000828081f88dc86208669ff345","file_000000009d3081fd83a9b9ab193728cd","file_000000004c3081fdbb5a1a16dabe511c","file_00000000fa20820d9176cbb5b088cf78"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  printing_label, publisher, publication_place, lccn,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0020', 20,
  'American Favorite Ballads', 'Tunes and Songs as Sung by Pete Seeger',
  'American Favorite Ballads: Tunes and Songs as Sung by Pete Seeger', 'Pete Seeger',
  '["Edited for publication by Irwin Silber and Ethel Raim","Music transcribed and edited by Ethel Raim","Illustrations selected by and from the collection of Moses Asch"]',
  1961, 1961, 1961, 'original_publication_year',
  'Printing history page lists first printing April 1961 through nineteenth printing February 1968',
  'Oak Publications, a division of Embassy Music Sales Corp.', 'New York', 'M 61-1008',
  '["ballads","folk songs","American music"]',
  '["Pete Seeger","folk music","ballads","songbook","American culture","music"]',
  '[]',
  'The photographed printing history lists nineteen printings from April 1961 through February 1968; the exact printing of this physical copy is not established by the supplied page.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_0000000018ec823084e49faeb0f28a8d","file_00000000a7f881fd8c9ac890c10c53d7","file_00000000a6d081fbab55179c0eb7ba01"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0021', 21,
  'Beginning Theory', 'An Introduction to Literary and Cultural Theory',
  'Beginning Theory: An Introduction to Literary and Cultural Theory', 'Peter Barry', '[]',
  1995, 2002, 1995, 'original_publication_year',
  'Second Edition', 'Manchester University Press', 'Manchester, UK / New York, USA',
  '978-0-7190-6268-1',
  '["literary theory","cultural theory"]',
  '["liberal humanism","structuralism","post-structuralism","deconstruction","postmodernism","psychoanalytic criticism","feminist criticism","queer theory","Marxist criticism","new historicism","cultural materialism","postcolonial criticism","stylistics","narratology","ecocriticism"]',
  '["Theory before theory--liberal humanism","Structuralism","Post-structuralism and deconstruction","Postmodernism","Psychoanalytic criticism","Feminist criticism","Lesbian/gay criticism","Marxist criticism","New historicism and cultural materialism","Postcolonial criticism","Stylistics","Narratology","Ecocriticism","Appendices","Further reading","Index"]',
  'First edition published 1995; this second edition first published 2002.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_00000000444482308e37128d021ab697","file_00000000adb081fd904b3ecf625ad8a8","file_000000008a0c81fdb69d99e0e9e0bc6f","file_00000000a92481fd8bf92afe2e7c11b8","file_00000000d80c81fda73d8e33eed68f16","file_00000000821c81fd913b9928a599fe43"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0022', 22,
  'The Young Child as Scientist', 'A Constructivist Approach to Early Childhood Science Education',
  'The Young Child as Scientist: A Constructivist Approach to Early Childhood Science Education',
  'Christine Chaillé and Lory Britain', '[]',
  NULL, 2003, 2003, 'edition_year',
  'Third Edition', 'Pearson Education, Inc.', '0-205-36776-3', '2002066710', 'Q181.C414 2002', '372.3''5--dc21',
  '["Science--Study and teaching","Science--Study and teaching (Elementary)","Science teachers","Constructivism (Education)"]',
  '["constructivism","early childhood","science education","teacher role","learning environment","physics","chemistry","biology","ecology"]',
  '["The Constructivist Perspective","Setting the Stage","Creating a Constructivist Learning Environment","The Role of the Constructivist Teacher","Constructivist Science","How Can I Make It Move? Constructivist Physics","How Can I Make It Change? Constructivist Chemistry","How Does It Fit or How Do I Fit? Constructivist Biology and Ecology","Final Thoughts"]',
  'Photographed copyright page shows copyright years 2003 and 1997 and identifies this as the third edition. The original first-edition publication year is not established from the supplied pages.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_00000000d79881f8ba8c892dc0d1dcda","file_0000000033b88230ae9ae76987baf1b0","file_0000000027cc8230b2667acdd5250af4","file_00000000722481f88e2fe248427fb19a","file_00000000c06c81f5990d9cd9db3c1b5e"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0023', 23,
  'Invent to Learn', 'Making, Tinkering, and Engineering in the Classroom',
  'Invent to Learn: Making, Tinkering, and Engineering in the Classroom',
  'Sylvia Libow Martinez and Gary S. Stager', '[]',
  2013, 2019, 2013, 'original_publication_year',
  'New & Expanded Second Edition', 'Constructing Modern Knowledge Press', 'Torrance, California',
  '978-0-9975543-7-3',
  '["Education--Teaching Methods & Materials--Science & Technology","Education--Computers & Technology","Education--Educational Policy & Reform"]',
  '["maker movement","constructionism","making","tinkering","engineering","projects","physical computing","programming","fabrication","student leadership"]',
  '["An Insanely Brief and Incomplete History of Making","Learning","Thinking About Thinking","What Makes a Good Project?","Teaching","Making Today","The Game Changers: Fabrication","The Game Changers: Physical Computing","The Game Changers: Programming","Stuff","Shaping the Learning Environment","Student Leadership","Make Your Own Maker Day","Do Unto Ourselves","Constructing Modern Knowledge","Making the Case","Resources to Explore"]',
  'First edition published 2013; second edition published 2019. Photographed paperback ISBN 978-0-9975543-7-3; hardcover ISBN 978-0-9975543-8-0 also listed.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_00000000994481fdb8d3b94dfba9ec1a","file_000000004d1481f880f375fff7e6ef19","file_00000000c27c81f5aea113ec0161c716","file_00000000790c81fd9924e987ece8f81a","file_000000000e1481fd9ab862b24774067c","file_0000000072e081fdaea1953785fe4846"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  publisher, publication_place, isbn,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0024', 24,
  'The Invent to Learn Guide to the micro:bit',
  'The Invent to Learn Guide to the micro:bit',
  'Pauline Maas and Peter Heldens', '[]',
  2023, 2023, 2023, 'original_publication_year',
  'Constructing Modern Knowledge Press', 'Torrance, California',
  '978-1-955604-06-2',
  '["micro:bit","physical computing","coding","maker education"]',
  '["micro:bit","MakeCode","Scratch","Python","physical computing","electronics","maker education","projects","constructionism"]',
  '["Introducing the micro:bit","MakeCode Tour","Warm Ups","Getting Started","It''s Alive!","Let''s Get Physical","Super-Duper","micro:bit Resources","The micro:bit Goes to School","Material Gallery","About the Authors"]',
  'Copyright 2023 Pauline Maas and Peter Heldens. Photographed paperback ISBN 978-1-955604-06-2; hardcover ISBN 978-1-955604-07-9 also listed.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false,"photo_file_ids":["file_000000006d8081fd813c685f337bafb2","file_00000000f82081fda2295c9fd6af76be","file_00000000813881f88e922f9e1165c30e"]}'
);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  publisher, isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0025', 25,
  'Computer Environments for Children', 'A Reflection on Theories of Learning and Education',
  'Computer Environments for Children', 'Cynthia Solomon', '[]',
  1986, 1986, 1986, 'original_publication_year',
  'The MIT Press', '978-0-262-69125-3', '86-3018', 'QA20.C65S64 1986', '372.13''9445',
  '["Mathematics--Computer-assisted instruction","Computer-assisted instruction","Mathematics--Study and teaching (Elementary)"]',
  '["Cynthia Solomon","computer environments","children","learning theory","education","Papert","constructivism","discovery learning","Logo","turtle","geoboard","Apple II"]',
  '["Computers in Education","Suppes: Drill and Practice and Rote Learning","Davis: Socratic Interactions and Discovery Learning","Dwyer: Eclecticism and Heuristic Learning","Papert: Constructivism and Piagetian Learning","Trends in Practice","Computer Educators","Notes","Bibliography","Index"]',
  'Copyright 1986 Massachusetts Institute of Technology. Cataloging page states this was originally presented as the author''s Harvard University thesis in 1985. Owner''s identifying marker for this final catalog item: the photographed setup with geoboard/manipulatives, turtle, and Apple ][.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-25","external_lookup":false,"owner_identified_visual_marker":"geoboard, turtle, and Apple ][","photo_file_ids":["file_00000000a13c8230988613ecf7b79a4a","file_000000006edc81fda9cdb91f3663c56e","file_00000000dc5c81f78e4e14dd0ae221c0","file_00000000a5708230bb1aa3ff82e2c94f"]}'
);

-- Verification target after remote apply:
-- SELECT COUNT(*) AS count FROM library_sources; -- expected: 25
