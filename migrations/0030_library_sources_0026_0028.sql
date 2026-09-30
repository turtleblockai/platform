-- TurtleBlockAI Library intake: entries 0026-0028
-- Source basis: Commander-provided photographs, 2026-09-29.
-- No external bibliographic lookup used.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, canonical_work_title, author_display, contributors_json,
  chronology_year, chronology_basis, subjects_json, tags_json, contents_json,
  notes, metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0026', 26,
  'Hamlet', 'Hamlet', 'William Shakespeare',
  '["Edited by Jeff Dolven","Illustrated by Kevin Stanton"]',
  NULL, 'unknown',
  '["Hamlet","Shakespeare","literature","drama"]',
  '["Shakespeare","Hamlet","literature","drama","illustrated edition","textual interpretation","STEAMHAMLET"]',
  '[]',
  'Photographed cover identifies the volume as Signature Shakespeare: Hamlet, edited by Jeff Dolven and illustrated by Kevin Stanton. Publication year, publisher, ISBN, and edition history were not established from the supplied cover photograph.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-29","external_lookup":false,"photo_file_ids":["file_00000000ce4c8230b223d5ea5bfdb583"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0026-01','library-source-0026','artifact','Illustrated Signature Shakespeare edition',
 'The photographed cover foregrounds three roles at once: William Shakespeare as author, Jeff Dolven as editor, and Kevin Stanton as illustrator. This makes the physical edition itself part of the interpretation rather than merely a neutral container for the text.',
 'mixed','user_photograph_plus_cataloging_interpretation',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0026-02','library-source-0026','intellectual_connection','Hamlet cluster',
 'This copy creates a visible Hamlet cluster inside the collection alongside The Klingon Hamlet and Janet H. Murray''s Hamlet on the Holodeck: canonical drama, constructed-language transformation, and digital-narrative theory all orbit the same source play.',
 'interpretive','cataloging_interpretation_grounded_in_collection',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, lccn, lc_classification,
  dewey_classification, subjects_json, tags_json, contents_json, notes,
  metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0027', 27,
  'Lifelong Kindergarten',
  'Cultivating Creativity through Projects, Passion, Peers, and Play',
  'Lifelong Kindergarten', 'Mitchel Resnick',
  '["Foreword by Sir Ken Robinson"]',
  2017, 2018, 2017, 'original_publication_year',
  'First MIT Press paperback edition, 2018',
  'MIT Press', 'Cambridge, Massachusetts',
  '9780262536134', '2017015741', 'LB1590.5 .R47 2017', '370.15/7--dc23',
  '["Creative ability--Study and teaching","Critical thinking--Study and teaching","Maker movement in education","Technology--Study and teaching","LEGO Mindstorms toys","Scratch (Computer program language)"]',
  '["Mitchel Resnick","lifelong kindergarten","creativity","projects","passion","peers","play","maker movement","critical thinking","LEGO Mindstorms","Scratch","MIT Media Lab","constructionism"]',
  '[]',
  'Copyright page states copyright 2017 Mitchel Resnick and First MIT Press paperback edition, 2018. The cataloging data gives Cambridge, MA: MIT Press [2017], notes bibliographical references, and lists hardcover ISBN 9780262037297 in addition to the photographed paperback ISBN 9780262536134.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-29","external_lookup":false,"photo_file_ids":["file_000000000eac823089876c02b5176ab8","file_00000000529c8230a5e5c66b87e80446"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0027-01','library-source-0027','historical_context','2017 work / 2018 MIT Press paperback',
 'The photographed copyright page distinguishes the 2017 work from the first MIT Press paperback edition issued in 2018, preserving the same work-versus-edition chronology used elsewhere in the library.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0027-02','library-source-0027','intellectual_connection','Projects, Passion, Peers, and Play',
 'The subtitle explicitly organizes creativity around Projects, Passion, Peers, and Play. In the TurtleBlockAI collection this becomes a compact bridge among making, learner agency, social learning, and purposeful play.',
 'mixed','photographed_subtitle_plus_cataloging_interpretation',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0027-03','library-source-0027','intellectual_connection','Maker / Scratch / LEGO branch',
 'The photographed Library of Congress subjects explicitly connect the book to the maker movement in education, LEGO Mindstorms, Scratch, technology, creativity, and critical thinking. This places it naturally beside Papert, Invent to Learn, and the micro:bit material already in the collection.',
 'mixed','photographed_cataloging_data_plus_cataloging_interpretation',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, publisher, publication_place, isbn, subjects_json, tags_json,
  contents_json, notes, metadata_provenance_json, collection_visibility
) VALUES (
  'library-source-0028', 28,
  'Hamlet on the Holodeck',
  'The Future of Narrative in Cyberspace',
  'Hamlet on the Holodeck: The Future of Narrative in Cyberspace',
  'Janet H. Murray', '[]',
  1997, 2017, 1997, 'original_publication_year',
  'Updated edition',
  NULL, NULL, '978-0-262-53348-5',
  '["digital narrative","cyberspace","storytelling","interactive media","cyberdrama"]',
  '["Janet Murray","Hamlet","holodeck","narrative","cyberspace","immersion","agency","transformation","procedural authorship","multiform plot","cyberdrama","digital media","STEAMHAMLET"]',
  '["Preface to the 2016 Updated Edition: The Future of Narrative","Revisited","Acknowledgments","Introduction: A Book Lover Longs for Cyberdrama","Part I: A New Medium for Storytelling","1 Lord Burleigh''s Kiss","2016 Update","2 Harbingers of the Holodeck","2016 Update","3 From Additive to Expressive Form: Beyond Multimedia","2016 Update","Part II: The Aesthetics of the Medium","4 Immersion","2016 Update","5 Agency","2016 Update","6 Transformation","2016 Update","Part III: Procedural Authorship","7 The Cyberbard and the Multiform Plot","2016 Update","8 Eliza''s Daughters","2016 Update","Part IV: New Beauty, New Truth","9 Digital TV and the Emerging Formats of Cyberdrama","2016 Update","10 Hamlet on the Holodeck?","2016 Update","Notes","Bibliography","Index"]',
  'Copyright page states the work was originally published by The Free Press, a division of Simon & Schuster Inc., in 1997 and that the updated edition is copyright 2017 by Janet Horowitz Murray. The photographed contents label the revision layer as the 2016 Updated Edition and place a 2016 Update after the major chapters. Publisher of this particular updated edition was not established from the supplied pages.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-29","external_lookup":false,"photo_file_ids":["file_0000000032ec823094fda2887e820931","file_00000000ac1c82308af80cacf8709830","file_00000000f8888230a6653131dc256384","file_00000000f07882308a6b773c5e0f9c28"]}',
  'public'
);

INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0028-01','library-source-0028','historical_context','1997 original / 2017 updated edition',
 'The photographed copyright page preserves the 1997 original publication and the 2017 updated edition, while the contents describe the revision layer as the 2016 Updated Edition.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0028-02','library-source-0028','cataloging_insight','An update architecture inside the book',
 'The contents repeatedly place a “2016 Update” after earlier chapters. The physical book therefore preserves the original argument and its later revision side by side rather than silently replacing the earlier version.',
 'mixed','photographed_contents_plus_cataloging_interpretation',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0028-03','library-source-0028','intellectual_connection','Immersion, agency, transformation, procedural authorship',
 'The photographed contents foreground Immersion, Agency, Transformation, Procedural Authorship, the Multiform Plot, and Cyberdrama. Those terms create a strong bridge to TurtleBlockAI questions about inhabitable worlds, learner agency, computational representation, and narrative environments.',
 'mixed','photographed_contents_plus_cataloging_interpretation',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0028-04','library-source-0028','intellectual_connection','Hamlet moves into cyberspace',
 'Placed beside the Signature Shakespeare Hamlet and The Klingon Hamlet, this book extends the collection''s Hamlet thread into interactive and computational narrative. That cluster is especially resonant with STEAMHAMLET.',
 'interpretive','cataloging_interpretation_grounded_in_collection',40,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Expected after apply:
-- SELECT COUNT(*) FROM library_sources; -- 28
-- SELECT COUNT(*) FROM library_special_notes; -- 74
-- SELECT COUNT(*) FROM library_sources WHERE collection_visibility='public'; -- 28
