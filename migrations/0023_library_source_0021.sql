-- TurtleBlockAI Library Sources: entry 21
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
  'library-source-0021', 21,
  'Beginning Theory',
  'An Introduction to Literary and Cultural Theory',
  'Beginning Theory: An Introduction to Literary and Cultural Theory',
  'Peter Barry',
  '[{"name":"Peter Barry","role":"author; series editor"},{"name":"Helen Carr","role":"series editor"}]',
  1995, 2002, 1995, 'original_publication_year',
  'Second edition',
  'Second edition first published 2002; photographed number line: 13 12 11 10 09 08 07 / 12 11 10 9 8 7 6',
  'Manchester University Press',
  'Beginnings series',
  'Manchester, UK; New York, USA',
  '9780719062681',
  NULL,
  NULL,
  NULL,
  '["Literary theory","Cultural theory","Literary criticism","Critical theory","English studies","Structuralism","Post-structuralism","Postmodernism","Psychoanalytic criticism","Feminist criticism","Lesbian/gay criticism","Queer theory","Marxist criticism","New historicism","Cultural materialism","Postcolonial criticism","Stylistics","Narratology","Ecocriticism"]',
  '["Peter Barry","literary theory","cultural theory","critical theory","liberal humanism","structuralism","Saussure","post-structuralism","deconstruction","postmodernism","psychoanalysis","Freud","Lacan","feminist criticism","queer theory","Marxism","Althusser","new historicism","Foucault","cultural materialism","postcolonialism","stylistics","narratology","Aristotle","Vladimir Propp","Gerard Genette","ecocriticism","green studies","Manchester University Press","Beginnings series"]',
  '[
    {"section":"Front matter","items":["Acknowledgements","Preface to the second edition","Introduction","About this book","Approaching theory","Stop and think: reviewing your study of literature to date","My own stock-taking"]},
    {"chapter":1,"title":"Theory before theory - liberal humanism","items":["The history of English studies","Stop and think","Ten tenets of liberal humanism","Literary theorising from Aristotle to Leavis - some key moments","Liberal humanism in practice","The transition to theory","Some recurrent ideas in critical theory","Selected reading"]},
    {"chapter":2,"title":"Structuralism","items":["Structuralist chickens and liberal humanist eggs","Signs of the fathers - Saussure","Stop and think","The scope of structuralism","What structuralist critics do","Structuralist criticism: examples","Stop and think","Stop and think","Selected reading"]},
    {"chapter":3,"title":"Post-structuralism and deconstruction","items":["Some theoretical differences between structuralism and post-structuralism","Post-structuralism - life on a decentred planet","Stop and think","Structuralism and post-structuralism - some practical differences","What post-structuralist critics do","Deconstruction: an example","Selected reading"]},
    {"chapter":4,"title":"Postmodernism","items":["What is postmodernism? What was modernism?","Landmarks in postmodernism: Habermas, Lyotard and Baudrillard","Stop and think","What postmodernist critics do","Postmodernist criticism: an example","Selected reading"]},
    {"chapter":5,"title":"Psychoanalytic criticism","items":["Introduction","How Freudian interpretation works","Stop and think","Freud and evidence","What Freudian psychoanalytic critics do","Freudian psychoanalytic criticism: examples","Lacan","What Lacanian critics do","Lacanian criticism: an example","Selected reading"]},
    {"chapter":6,"title":"Feminist criticism","items":["Feminism and feminist criticism","Feminist criticism and the role of theory","Feminist criticism and language","Feminist criticism and psychoanalysis","Stop and think","What feminist critics do","Feminist criticism: an example","Selected reading"]},
    {"chapter":7,"title":"Lesbian/gay criticism","items":["Lesbian and gay theory","Lesbian feminism","Queer theory","What lesbian/gay critics do","Stop and think","Lesbian/gay criticism: an example","Selected reading"]},
    {"chapter":8,"title":"Marxist criticism","items":["Beginnings and basics of Marxism","Marxist literary criticism: general","Leninist Marxist criticism","Engelsian Marxist criticism","The present: the influence of Althusser","Stop and think","What Marxist critics do","Marxist criticism: an example","Selected reading"]},
    {"chapter":9,"title":"New historicism and cultural materialism","items":["New historicism","New and old historicisms - some differences","New historicism and Foucault","Advantages and disadvantages of new historicism","Stop and think","What new historicists do","New historicism: an example","Cultural materialism","How is cultural materialism different from new historicism?","Stop and think","What cultural materialist critics do","Cultural materialism: an example","Selected reading"]},
    {"chapter":10,"title":"Postcolonial criticism","items":["Background","Postcolonial reading","Stop and think","What postcolonial critics do","Postcolonialist criticism: an example","Selected reading"]},
    {"chapter":11,"title":"Stylistics","items":["Stylistics: a theory or a practice?","A brief historical account: from rhetoric, to philology, to linguistics, to stylistics, to new stylistics","How does stylistics differ from standard close reading?","The ambitions of stylistics","Stop and think","What stylistic critics do","Stylistics: examples","Note","Selected reading"]},
    {"chapter":12,"title":"Narratology","items":["Telling stories","Aristotle","Vladimir Propp","Gerard Genette","Is the basic narrative mode mimetic or diegetic?","How is the narrative focalised?","Who is telling the story?","How is time handled in the story?","How is the story packaged?","How are speech and thought represented?","Joined-up narratology","Stop and think","What narratologists do","Narratology: an example","Selected reading"]},
    {"chapter":13,"title":"Ecocriticism","items":["Ecocriticism or green studies?","Culture and nature","Turning criticism inside out","Stop and think","What ecocritics do","Ecocriticism: an example","Selected reading"]},
    {"section":"Appendices","items":["Edgar Allan Poe, The oval portrait","Dylan Thomas, A refusal to mourn","William Cowper, The castaway"]},
    {"section":"Further reading","items":["Where do we go from here? Further reading","General guides","Reference books","General readers","Applying critical theory: twelve early examples","Against theory","Index"]}
  ]',
  'Copyright Peter Barry 1995, 2002. First edition published 1995 by Manchester University Press and reprinted nine times. This edition first published in 2002 by Manchester University Press. ISBN printed as 978 0 7190 6268 1 paperback. The photographed copy belongs to the Beginnings series, whose series editors are Peter Barry and Helen Carr. The imprint page states exclusive USA distribution by Palgrave and exclusive Canadian distribution by UBC Press. The two-part number line visible in the photographed copy is preserved verbatim rather than interpreted as a specific impression date.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0021-01',
  'library-source-0021',
  1,
  'paperback',
  '9780719062681',
  'Photographed physical copy of Beginning Theory: An Introduction to Literary and Cultural Theory, second edition. The copy shows ordinary shelf/edge wear and was photographed with a protective plastic sleeve beneath/around it.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
