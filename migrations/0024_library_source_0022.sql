-- TurtleBlockAI Library Sources: entry 22
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
  'library-source-0022', 22,
  'The Young Child as Scientist',
  'A Constructivist Approach to Early Childhood Science Education',
  'The Young Child as Scientist: A Constructivist Approach to Early Childhood Science Education',
  'Christine Chaillé; Lory Britain',
  '[{"name":"Christine Chaillé","role":"author"},{"name":"Lory Britain","role":"author"},{"name":"Traci Mueller","role":"series editor"},{"name":"Erica Tromblay","role":"series editorial assistant"},{"name":"Elizabeth Fogarty","role":"marketing manager"},{"name":"Beth Houston","role":"editorial-production administrator"},{"name":"Walsh & Associates, Inc.","role":"editorial-production service"},{"name":"Linda Cox","role":"composition and prepress buyer"},{"name":"JoAnne Sweeney","role":"manufacturing buyer"},{"name":"Kristina Mose-Libon","role":"cover administrator"},{"name":"Publishers'' Design and Production Services, Inc.","role":"electronic composition"}]',
  NULL, 2003, 2003, 'third_edition_year',
  'Third edition',
  'Photographed number line: 10 9 8 7 6 5 4 / 06 05 04',
  'Pearson Education, Inc.',
  'Allyn & Bacon',
  'Boston, Massachusetts',
  '0205367763',
  '2002066710',
  'Q181.C414 2002',
  '372.3''5-dc21',
  '["Science--Study and teaching","Science--Study and teaching (Elementary)","Science teachers","Constructivism (Education)","Early childhood science education"]',
  '["constructivism","early childhood","science education","theory building","constructivist curriculum","constructivist teacher","classroom environment","physics","chemistry","biology","ecology","children''s questions","documentation","teacher as theory builder","Christine Chaille","Lory Britain"]',
  '[
    {"section":"Front matter","items":["Preface"]},
    {"part":"Part I","title":"The Constructivist Perspective","page":1},
    {"chapter":1,"title":"The Child as Theory Builder","page":3,"items":[["Children as Theory Builders",5],["General Implications",10],["What This Means: Rethinking What We Do in Classrooms",13],["Our Definition of Science",14],["Constructivism and Science Education",15],["Other Approaches to Science Education",16]]},
    {"chapter":2,"title":"A Constructivist Curriculum Model for Science","page":19,"items":[["The Curriculum Model",20],["Questions to Generate Experimentation",22],["How This Curriculum Model Is Different",24],["What Sorts of Questions Are Children Asking?",27]]},
    {"part":"Part II","title":"Setting the Stage","page":29},
    {"chapter":3,"title":"Creating a Constructivist Learning Environment","page":31,"items":[["The Physical Environment",32],["The Social Context",39]]},
    {"chapter":4,"title":"The Role of the Constructivist Teacher","page":47,"items":[["The Teacher as Presenter",48],["The Teacher as Observer",51],["The Teacher as Question Asker and Problem Poser",56],["The Teacher as Environment Organizer",60],["The Teacher as Public Relations Manager",60],["The Teacher as Documenter of Children''s Learning",61],["The Teacher as Contributor to the Classroom Culture",62],["The Teacher as Theory Builder",63]]},
    {"part":"Part III","title":"Constructivist Science","page":65},
    {"chapter":5,"title":"How Can I Make It Move?: Constructivist Physics","page":67,"items":[["Theoretical Background",68],["Sample Activities",90]]},
    {"chapter":6,"title":"How Can I Make It Change?: Constructivist Chemistry","page":99,"items":[["Early Childhood Chemistry as Transformation",99],["Sources of Ideas",109],["Across the Curriculum",111],["Sample Activities",112]]},
    {"chapter":7,"title":"How Does It Fit or How Do I Fit?: Constructivist Biology and Ecology","page":125,"items":[["A Constructivist Approach",125],["Categories of Biology and Ecology",129]]},
    {"part":"Part IV","title":"Final Thoughts","page":143},
    {"chapter":8,"title":"The Teacher as Theory Builder","page":145,"items":[["Questions Teachers Have About Putting Constructivism into Practice",145],["The Teacher as Theory Builder",152],["So Is This Really Science?",160]]},
    {"section":"Appendix","title":"Materials for a Constructivist Classroom","page":165},
    {"section":"References","page":167},
    {"section":"Index","page":171}
  ]',
  'Third edition. Copyright page states Copyright © 2003, 1997 Pearson Education, Inc. The Library of Congress cataloging block identifies Christine Chaillé and Lory Britain and gives the title as The young child as scientist: a constructivist approach to early childhood science education -- 3rd ed. The photographed copy lists ISBN 0-205-36776-3, LCCN 2002066710, LC classification Q181.C414 2002, and Dewey 372.3/5-dc21. The visible number line is preserved exactly rather than interpreted as a specific printing. Contents are transcribed only from the photographed contents pages; chapter 7 may contain additional subheadings beyond the visible portion not captured here.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0022-01',
  'library-source-0022',
  1,
  'paperback',
  '0205367763',
  'Photographed physical copy of The Young Child as Scientist, third edition.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
