-- TurtleBlockAI Library Sources: entry 23
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
  'library-source-0023', 23,
  'Invent to Learn',
  'Making, Tinkering, and Engineering in the Classroom',
  'Invent to Learn: Making, Tinkering, and Engineering in the Classroom',
  'Sylvia Libow Martinez; Gary S. Stager',
  '[{"name":"Sylvia Libow Martinez","role":"author"},{"name":"Gary S. Stager","role":"author"},{"name":"Carla Sinclair","role":"copy editor, first edition"},{"name":"Yvonne Martinez","role":"illustrator and cover designer"}]',
  2013, 2019, 2013, 'original_publication_year',
  'New & Expanded Second Edition',
  'Second edition published 2019',
  'Constructing Modern Knowledge Press',
  NULL,
  'Torrance, California, USA',
  '9780997554373',
  NULL,
  NULL,
  NULL,
  '["EDUCATION / Teaching Methods & Materials - Science & Technology","EDUCATION / Computers & Technology","EDUCATION / Educational Policy & Reform"]',
  '["maker education","making","tinkering","engineering","constructionism","constructivism","Seymour Papert","maker movement","progressive education","project-based learning","powerful ideas","fabrication","3D printing","CAD","physical computing","microcontrollers","BBC micro:bit","Raspberry Pi","programming","makerspaces","student leadership","STEAM","STEM","equity access inclusion","Reggio Emilia","teacher practice","learning environments"]',
  '[
    {"section":"Front matter","items":[["Preface to the Second Edition","xiii"],["Introduction",1]]},
    {"chapter":1,"title":"An Insanely Brief and Incomplete History of Making","page":11,"items":[["A Kind of History Lesson",12],["Seymour Papert: The Father of the Maker Movement",17],["Progressive Education Stages a Comeback",21],["The Maker Movement Captures Public Imagination",26],["Making Goes (Back) to School",28],["The Future",31]]},
    {"chapter":2,"title":"Learning","page":35,"items":[["Constructivism and Constructionism",35],["Making, Tinkering, and Engineering",36]]},
    {"chapter":3,"title":"Thinking About Thinking","page":45,"items":[["School Thinking",46],["Design Models for the Real World",48],["Design Models for Learning",52],["TMI",54],["Integrating the Arts",56],["The Role of Powerful Ideas in Changing Education",57]]},
    {"chapter":4,"title":"What Makes a Good Project?","page":59,"items":[["The Eight Elements of a Good Project",60],["Why Computers and Digital Technology?",62],["What''s a Good Prompt?",63],["Planning Projects",65],["Making Memories",69]]},
    {"chapter":5,"title":"Teaching","page":71,"items":[["A Teaching Mantra: Less Us, More Them",72],["Doing Constructionism",73],["Teaching Using Iterative Design Cycles",78],["Assessment",83]]},
    {"chapter":6,"title":"Making Today","page":87,"items":[["You Are Better Prepared Than You Think",88],["Using Familiar Materials to Learn in Unfamiliar Ways",90],["Decisions, Decisions",92]]},
    {"chapter":7,"title":"The Game Changers: Fabrication","page":97,"items":[["Fabrication",98],["How Does a 3D Printer Work?",99],["Computer Aided Design (CAD)",105],["Choosing Your Printer",108],["Cutters and other Subtractive Fabrication Tools",110],["Fabrication and Learning",114],["Fabrication Projects",118]]},
    {"chapter":8,"title":"The Game Changers: Physical Computing","page":125,"items":[["Makey Makey",128],["Microcontrollers",129],["Star of the Future? The BBC micro:bit",138],["Physical Computing Kits",142],["Raspberry Pi - a Real Computer",146],["What''s the Difference Between Raspberry Pi (or Other Microcomputers) and Arduino (or Other Microcontrollers)?",148],["Electronics Makes a Comeback",150],["Why Physical Computing for Learning?",155]]},
    {"chapter":9,"title":"The Game Changers: Programming","page":159,"items":[["Programming Projects",161],["Programming in the Curriculum",162],["Choosing a Language",164],["Teaching Programming",177],["Coding as a Liberal Art",180]]},
    {"chapter":10,"title":"Stuff","page":183,"items":[["Basics of Stuff",183],["Purchasing/Acquiring Stuff",188]]},
    {"chapter":11,"title":"Shaping the Learning Environment","page":193,"items":[["Help or Get out of the Way!",194],["Gender Friendly Spaces and Styles",196],["The Inclusive Makerspace",198],["Documentation",199],["Collaboration and Group Work",201],["Taking the Lab out of the FabLab",205],["Creative Space Design and Making Do",207],["Setting Expectations",211],["Is All Making Learning?",213]]},
    {"chapter":12,"title":"Student Leadership","page":215},
    {"chapter":13,"title":"Make Your Own Maker Day","page":219},
    {"chapter":14,"title":"Do Unto Ourselves","page":225,"items":[["Constructing Modern Knowledge",225],["The Learning Environment",226],["The Practice",227],["The Projects",229]]},
    {"chapter":15,"title":"Making the Case","page":233,"items":[["Say This, Not That - Advocacy",239],["Say This, Not That - Rebuttal",244],["Making the Case With Research",246]]},
    {"chapter":16,"title":"Resources to Explore","page":250,"items":[["Making and Learning Essential Reading",255],["Effective Teaching",255],["Projects: Collections and Tutorials",256],["Books for Your Makerspace",256],["Videos Everyone Will Love",258],["Places to Purchase Parts and Supplies",260],["Reviews and Buyer''s Guides",263],["Fabrication",264],["Physical Computing",266],["Electronics Building Kits",271],["Programming",271],["Programming Languages",272],["Filmmaking & Photography",272],["Inventors, Inventing, and Citizen Science",274],["Copyright and Intellectual Property",274],["Reggio Emilia Approach",275],["Seymour Papert",275],["Constructionism",276],["Tinkering & Play Resources",276],["STEM & STEAM",277],["Equity, Access, & Inclusion",278],["Research Groups",278],["Professional Development & Curriculum",279],["Maker Movement",280],["History and Future",280],["Author Websites",281]]},
    {"section":"References","page":283},
    {"section":"Index","page":291},
    {"section":"Also From Constructing Modern Knowledge Press","page":299}
  ]',
  'Copyright page states © 2019 Sylvia Libow Martinez & Gary S. Stager; first edition published 2013 and second edition published 2019. Publisher listed as Constructing Modern Knowledge Press, Torrance, California, USA. Photographed copy is the New & Expanded Second Edition. Paperback ISBN shown as 978-0-9975543-7-3; hardcover ISBN 978-0-9975543-8-0. The dedication page reads: "To Seymour Papert - Thank you for your vision, friendship, and for having the audacity to believe we can all do better by children." Contents transcribed from photographed contents pages only.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0023-01',
  'library-source-0023',
  1,
  'paperback',
  '9780997554373',
  'Photographed physical copy of Invent to Learn: Making, Tinkering, and Engineering in the Classroom, New & Expanded Second Edition.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
