-- TurtleBlockAI Library Sources: entry 24
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
  'library-source-0024', 24,
  'The Invent to Learn Guide to the micro:bit',
  NULL,
  'The Invent to Learn Guide to the micro:bit',
  'Pauline Maas; Peter Heldens',
  '[{"name":"Pauline Maas","role":"author"},{"name":"Peter Heldens","role":"author"},{"name":"Gary Stager","role":"editor"},{"name":"Sylvia Libow Martinez","role":"editor"},{"name":"Lindsay Balfour","role":"cover and layout"},{"name":"Angelique Krijnen","role":"illustrations"}]',
  2023, 2023, 2023, 'original_publication_year',
  NULL,
  NULL,
  'Constructing Modern Knowledge Press',
  NULL,
  'Torrance, California, USA',
  '9781955604062',
  NULL,
  NULL,
  NULL,
  '["micro:bit","computer science education","physical computing","coding education","maker education","educational technology"]',
  '["micro:bit","MakeCode","Scratch","Python","physical computing","maker education","constructionism","tinkering","engineering","coding","programming","electronics","sensors","radio communication","NeoPixels","wearable computing","classroom projects","project-based learning","learning theories","lesson planning"]',
  '[
    {"section":"Front matter","items":[["Preface",1],["Introducing the micro:bit",2],["MakeCode Tour",3]]},
    {"section":"Warm Ups","page":4,"items":[["Start with a Heart",5],["Name Badge",7],["Make an Animation",10],["Lucky Number",12],["Your First Game",14],["What''s the Temperature?",16],["Shake it Up",18],["micro:bit Tips",20],["What''s New V2?",21]]},
    {"section":"Getting Started","page":24,"items":[["Unicorn Greeting Card",25],["Jingle Bells",30],["Turkey Trot",36],["Fruit Piano",42],["Hack Your Game",47],["Radio Communication",50],["Distance Detector",55],["Saving & Sharing Your Code",62]]},
    {"section":"It''s Alive!","page":66,"items":[["The Bionic Doll",67],["Monster Box",72],["Fortune Teller",79],["Space Game",85],["Doctor Shaky",95],["A Spooky Game in Scratch",104],["Scratch Teacher Tips",111]]},
    {"section":"Let''s Get Physical","items":[["Halloween",null],["Art Machine",null],["Smart Toothbrush",null],["Extend MakeCode with Your Own Functions",null],["Nightlight",null],["Race Car Game Controller in Scratch",null]]},
    {"section":"Super-Duper","items":[["Wearable Computing",null],["Talking micro:bit in Python",null],["Remote Control Car",null],["Programming NeoPixels",null],["Refrigerator Data",null],["Bottle Rocket",null]]},
    {"section":"micro:bit Resources","items":[["Further Adventures with the micro:bit",null],["micro:bit Coding Options",null],["Resources & Books",null],["micro:bit Power Possibilities",null]]},
    {"section":"The micro:bit Goes to School","page":205,"items":[["Supported by Learning Theories",null],["Lesson Planning Resources",null],["Planning micro:bit Projects",null],["Stream MakeCode Lessons",null],["Manage Student Projects with Classroom",null],["Why This Book Matters",null]]},
    {"section":"Material Gallery","page":228},
    {"section":"About the Authors","page":225},
    {"section":"Also From CMK Press","page":227}
  ]',
  'Copyright page states © 2023 Pauline Maas and Peter Heldens. Published by Constructing Modern Knowledge Press, Torrance, CA USA. Editors: Gary Stager and Sylvia Libow Martinez. Cover and layout: Lindsay Balfour. Illustrations: Angelique Krijnen. Paperback ISBN shown as 978-1-955604-06-2; hardcover ISBN 978-1-955604-07-9. The photographed table of contents was transcribed where legible; page numbers that could not be read confidently were intentionally stored as null rather than inferred. The book presents micro:bit projects spanning MakeCode, Scratch, Python, physical computing, sensors, radio, NeoPixels, wearables, classroom project planning, and learning theory.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0024-01',
  'library-source-0024',
  1,
  'paperback',
  '9781955604062',
  'Photographed physical copy of The Invent to Learn Guide to the micro:bit by Pauline Maas and Peter Heldens.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
