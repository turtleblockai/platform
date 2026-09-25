-- TurtleBlockAI Library special-notes layer
-- Preserves the "cool notes", artifact/provenance details, intellectual connections,
-- and cataloging observations developed during the physical-library intake.
-- Source basis: Commander-provided photographs and the cataloging conversation only.
-- No outside bibliographic lookup was used for these notes.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS library_special_notes (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  note_type TEXT NOT NULL
    CHECK (note_type IN (
      'artifact',
      'provenance',
      'historical_context',
      'intellectual_connection',
      'visual_detail',
      'collection_note',
      'cataloging_insight'
    )),
  label TEXT,
  note_text TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'photographed_or_session_grounded'
    CHECK (verification_status IN (
      'photographed_or_session_grounded',
      'user_clarified',
      'interpretive',
      'mixed'
    )),
  evidence_basis TEXT NOT NULL DEFAULT 'user_photographs_and_cataloging_session',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES library_sources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_library_special_notes_source
  ON library_special_notes(source_id, sort_order, id);

CREATE INDEX IF NOT EXISTS idx_library_special_notes_type
  ON library_special_notes(note_type, source_id);

-- 0001 Bruner, The Process of Education
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0001-01','library-source-0001','historical_context','Woods Hole Conference',
 'A photographed conference page identifies Jerome S. Bruner as Director of the Woods Hole Conference and shows an interdisciplinary roster of 34 participants spanning psychology, mathematics, biology, physics, education, history, cinematography, classics, medicine, foundations, and industry.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0001-02','library-source-0001','intellectual_connection','Interdisciplinary curriculum',
 'The photographed Woods Hole material makes this more than a generic education title: it documents curriculum reform emerging from a deliberately cross-disciplinary group, which is why the book was tagged for interdisciplinary curriculum, science education, and educational reform.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_material',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0002 Brosterman, Inventing Kindergarten
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0002-01','library-source-0002','intellectual_connection','Froebel, play, design, and manipulatives',
 'The cataloging subjects explicitly connect the book to Friedrich Froebel, kindergarten methods, abstract art, and modern architecture. In the TurtleBlockAI library it functions as a bridge among play, designed learning environments, manipulatives, art, and educational history.',
 'mixed','photographed_cataloging_data_plus_cataloging_interpretation',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0002-02','library-source-0002','collection_note','Objects and environments',
 'This source was flagged as especially useful for thinking about how physical objects and designed spaces can become part of a learning system rather than merely classroom decoration.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_subjects',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0003 Bruner, The Relevance of Education
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0003-01','library-source-0003','historical_context','1971 work / 1973 Norton Library edition',
 'The photographed copyright page preserves both 1971 and 1973, with the Norton Library edition first published in 1973 and advertised on the cover as including a new preface.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0003-02','library-source-0003','intellectual_connection','Bruner learning-theory line',
 'Cataloged alongside The Process of Education as a second Bruner node emphasizing educational psychology, child study, cognition, culture, and the continuing relevance of education.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_cataloging_data',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0004 Cresswell and Hartley, Teach Yourself Esperanto
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0004-01','library-source-0004','historical_context','Long revision history',
 'The photographed publication page shows copyrights in 1957, 1968, and 1987, with this third edition published in 1992 and revised by J. H. Sullivan.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0004-02','library-source-0004','intellectual_connection','Constructed-language branch',
 'This book established a constructed-language branch in the library: Esperanto, language learning, communication, and self-directed learning. It later sits naturally beside The Klingon Hamlet as a very different constructed-language artifact.',
 'interpretive','cataloging_interpretation_grounded_in_collection',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0005 Aitchison, Teach Yourself Linguistics
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0005-01','library-source-0005','historical_context','Title and edition evolution',
 'The photographed publication page states that the work was first printed as General Linguistics in 1972, followed by editions in 1978, 1987, and 1992; the fourth edition carries the Teach Yourself Linguistics title.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0005-02','library-source-0005','intellectual_connection','Language-system foundation',
 'Tagged as a broad language-system source spanning syntax, semantics, phonology, phonetics, sociolinguistics, psycholinguistics, and language acquisition.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_material',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0006 Gordon, The New Well-Tempered Sentence
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0006-01','library-source-0006','historical_context','Original and revised forms',
 'The photographed cataloging page identifies this 1993 expanded and revised book as a revision of The Well-Tempered Sentence, first published in 1983.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0006-02','library-source-0006','intellectual_connection','Playful language mechanics',
 'Cataloged not just as punctuation reference but as a language-and-style source: grammar, rhetoric, writing instruction, and humor all meet in the same object.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_material',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0007 Dewey, Democracy and Education
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0007-01','library-source-0007','historical_context','1916 work preserved through later scholarly edition',
 'The intellectual chronology is anchored to 1916, while the photographed physical copy is The Middle Works, 1899-1924, Volume 9, first published in the collected edition in 1980 and first issued in paperback in 1985.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0007-02','library-source-0007','intellectual_connection','Play, work, experience, and thinking',
 'The photographed contents make several TurtleBlockAI-relevant chapters explicit: Experience and Thinking, Thinking in Education, Play and Work in the Curriculum, Education as a Social Function, and The Democratic Conception in Education.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0007-03','library-source-0007','collection_note','Chronology rule exemplar',
 'This book became the clearest example for separating original work year from edition year and physical-copy year so the library can preserve intellectual chronology without losing the history of the object actually owned.',
 'interpretive','cataloging_session_design_decision',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0008 Papert, The Children''s Machine
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0008-01','library-source-0008','provenance','Papert biographical jacket material',
 'The photographed jacket identifies Papert as having worked with Jean Piaget, coming to MIT in 1964, holding the LEGO Chair for Learning Research, co-directing the Artificial Intelligence Laboratory with Marvin Minsky, helping found the Media Laboratory, directing the Epistemology and Learning Group, and pioneering Logo.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0008-02','library-source-0008','intellectual_connection','Hub book / citation graph',
 'The photographed bibliography visibly connects this book to Freire, Illich, Latour, Lave, McCulloch, Mindstorms, Piaget, Resnick, Suppes, Turkle, Wiener, and others. During cataloging it was identified as a hub book and motivated a future source-relationship / citation-graph layer.',
 'mixed','photographed_bibliography_plus_cataloging_interpretation',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0008-03','library-source-0008','historical_context','1993 Logo ecosystem snapshot',
 'The photographed Sources of Information pages preserve a historical directory of Logo organizations and software sources, including the Logo Foundation, Council for Logo in Mathematics Education, MIT Epistemology and Learning Group, LEGO Dacta, Logo Computer Systems, Paradigm Software, and Terrapin Software. These details are historical, not asserted to be current.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0009 To Be or Not
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0009-01','library-source-0009','intellectual_connection','E-Prime and critical thinking',
 'The anthology explicitly includes D. David Bourland Jr.''s “To Be or Not To Be: E-Prime as a Tool for Critical Thinking,” making the language-choice / epistemology / critical-thinking relationship unusually direct.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0009-02','library-source-0009','historical_context','General semantics lineage',
 'The volume is dedicated to Alfred Korzybski and includes sections titled E-Prime in Action, Epistemological Foundations of E-Prime, and Further Applications of E-Prime.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0009-03','library-source-0009','collection_note','Robert Anton Wilson appearance',
 'The photographed contents include Robert Anton Wilson''s “Toward Understanding E-Prime,” one of the more distinctive contributor connections in this anthology.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0010 Drive Yourself Sane
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0010-01','library-source-0010','intellectual_connection','Facts, inferences, and mapping',
 'The photographed contents distinguish observations, descriptions, “facts,” inferences, degrees of probability, mapping, abstraction, and self-reflexive mapping. During cataloging this was recognized as a useful conceptual model for keeping source facts separate from inference and interpretation.',
 'mixed','photographed_contents_plus_cataloging_interpretation',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0010-02','library-source-0010','intellectual_connection','Direct bridge to E-Prime',
 'Chapter 13 explicitly includes English without “Ises” (E-Prime), connecting this book directly to the preceding E-Prime anthology while placing E-Prime inside the wider framework of general semantics.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0010-03','library-source-0010','collection_note','Anti-hallucination architecture inspiration',
 'The cataloging session used this book''s facts-versus-inferences distinction as inspiration for provenance-aware library fields that separate photographed facts, inference, external verification, and unknowns.',
 'interpretive','cataloging_session_design_decision',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0011 Evergreen Review Reader
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0011-01','library-source-0011','collection_note','Curated cultural node',
 'This was cataloged as a cultural node rather than merely a single-author book: a ten-year container of literature, poetry, translation, experimental writing, Beat culture, and postwar counterculture.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0011-02','library-source-0011','historical_context','Year-by-year structure, 1957-1966',
 'The photographed contents organize the anthology chronologically from 1957 through 1966 and include contributors such as Beckett, Kerouac, Ferlinghetti, Ginsberg, O''Hara, Williams, Burroughs, Neruda, Borges, Brautigan, and many others.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0011-03','library-source-0011','cataloging_insight','Anthology relationship type',
 'This source prompted the cataloging idea that anthology_contains_work should eventually be represented as an explicit relationship type because the physical object contains many distinct intellectual works.',
 'interpretive','cataloging_session_design_decision',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0012 The F Word
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0012-01','library-source-0012','historical_context','Lexicographic lineage',
 'The photographed copyright page states that the book is based on the Random House Historical Dictionary of American Slang, making it a specialized lexicographic artifact rather than simply a novelty title.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0012-02','library-source-0012','intellectual_connection','Taboo language as semantics',
 'Its cataloging subjects explicitly join semantics, etymology, obscene words, usage, slang, and language history; in the library it extends the language branch into taboo language and lexicography.',
 'mixed','photographed_cataloging_data_plus_cataloging_interpretation',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0013 Mindstorms
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0013-01','library-source-0013','visual_detail','LOGO Turtle and turtle-drawn geometry',
 'The photographed copy includes a frontispiece captioned “LOGO Turtle” and photographed figures showing turtle-drawn geometric sequences.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0013-02','library-source-0013','artifact','Two distinct physical copies',
 'The collection contains two photographed physical copies of Mindstorms. One is a paperback with a University Bookstore, Iowa State University sticker; the other is a former Mount de Sales Library hardcover with library and school-system ownership markings. The two objects are preserved separately in library_physical_copies.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0013-03','library-source-0013','intellectual_connection','Papert core node',
 'The photographed contents center computer cultures, mathophobia, turtle geometry, microworlds, powerful ideas, Piaget, AI, and images of a learning society, making this one of the strongest constructionist core nodes in the library.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0014 The Klingon Hamlet
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0014-01','library-source-0014','historical_context','Klingon Shakespeare Restoration Project',
 'The title and copyright pages identify the book as part of the Klingon Shakespeare Restoration Project, sponsored by the Klingon Language Institute, with restoration by Nick Nicholas and Andrew Strader and editing by Mark Shoulson.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0014-02','library-source-0014','artifact','Gene Roddenberry dedication',
 'The photographed dedication thanks Paramount Pictures for commissioning the creation of the Klingon language and dedicates the volume to the memory of Gene Roddenberry.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0014-03','library-source-0014','intellectual_connection','Constructed language meets STEAMHAMLET',
 'This source was tagged as a rare bridge among Shakespeare, constructed language, translation, language play, Star Trek, and STEAMHAMLET.',
 'interpretive','cataloging_interpretation_grounded_in_collection',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0015 The Dots-and-Boxes Game
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0015-01','library-source-0015','artifact','Inscribed and signed physical copy',
 'The photographed title page bears a handwritten “To Steve” inscription, a visible signature placed above the printed author name Elwyn Berlekamp, and the date January 13, 2001. The signature is recorded as visible but is not independently authenticated.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0015-02','library-source-0015','artifact','Berlekamp-versus-Steve game sheet',
 'The copy contains a loose handwritten January 2001 Dots-and-Boxes game sheet labeled “Simultaneous Exhibition,” noting 36 dots. The user clarified that it records a game between author Elwyn Berlekamp and Steve, the original owner to whom the book is inscribed.',
 'user_clarified','user_photographs_plus_user_clarification',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0015-03','library-source-0015','collection_note','Artifact value beyond bibliography',
 'This item is preserved as both an intellectual source on combinatorial game theory and a provenance-rich physical artifact because the inscription and enclosed game sheet materially connect the book to play between the author and its original owner.',
 'interpretive','cataloging_interpretation_grounded_in_artifact_provenance',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0016 The Playful Brain
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0016-01','library-source-0016','cataloging_insight','Cover-only intake kept deliberately incomplete',
 'Only the front cover was captured during intake. The library deliberately preserves unknown publication year, edition, publisher, ISBN, classifications, and contents rather than filling them from memory or outside sources.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0016-02','library-source-0016','intellectual_connection','Play and neuroscience branch',
 'Even at cover-only intake, the title and subtitle establish a distinct play / brain / neuroscience / behavior / learning branch that can later connect to the library''s broader play-and-learning lineage.',
 'interpretive','cataloging_interpretation_grounded_in_cover',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0017 LogoWorks
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0017-01','library-source-0017','historical_context','Atari Logo program ecosystem',
 'The photographed copyright page states that two disks containing all programs in the book were available ready to run in Atari Logo.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0017-02','library-source-0017','intellectual_connection','Creative programming across domains',
 'The contents move from wordplay and stories to games, turtle geometry, music, and programming ideas, documenting Logo as a medium for language, narrative, mathematics, sound, animation, and computational thinking rather than a single-subject tool.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0017-03','library-source-0017','collection_note','Solomon-Minsky-Harvey node',
 'The authorship itself creates a notable Logo-history node linking Cynthia Solomon, Margaret Minsky, and Brian Harvey in one practical programming volume.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0018 Trees of Santa Monica
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0018-01','library-source-0018','visual_detail','Miramar Moreton Bay Fig cover',
 'The credits identify Victoria Franklin''s cover design as based on the Miramar Moreton Bay Fig, explicitly described in the book as a Santa Monica Historical Landmark.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0018-02','library-source-0018','historical_context','Local-history object',
 'Published by the Friends of Santa Monica Library Committee for Trees of Santa Monica, the photographed copy includes a Palisades Park frontispiece, a map of Santa Monica, local tree sites, a street index, and a photographic supplement.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0018-03','library-source-0018','intellectual_connection','Place-based knowledge',
 'This source extends the library beyond education theory into place-based knowledge: botany, urban forestry, local history, civic landscape, and the built/natural environment.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_material',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0019 The Connected Family
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0019-01','library-source-0019','artifact','Companion CD-ROM still present',
 'The photographed physical copy retains its companion CD-ROM in the publisher sleeve. The presence of the original media is recorded separately in the physical-copy ephemera data.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0019-02','library-source-0019','historical_context','1996 digital-generation artifact',
 'The cover frames the book around “bridging the digital generation gap,” while the contents move through generations, technology, learning, values, family, projects, school, and future; it therefore preserves a 1996 snapshot of family computing discourse.',
 'mixed','photographed_cover_and_contents_plus_cataloging_interpretation',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0020 American Favorite Ballads
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0020-01','library-source-0020','historical_context','Nineteenth printing',
 'The photographed printing history runs from the first printing in April 1961 through the nineteenth printing in February 1968; the cataloged physical copy is treated as the nineteenth printing based on that complete sequence.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0020-02','library-source-0020','artifact','Well-used protected copy',
 'The photographed physical copy shows substantial edge and spine wear and is being kept in a clear protective sleeve, making the wear itself part of the object''s provenance record.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0020-03','library-source-0020','intellectual_connection','Oral tradition and cultural memory',
 'The songbook broadens the library into folk music, ballads, oral tradition, American popular culture, and the transmission of knowledge through songs rather than prose texts.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0021 Beginning Theory
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0021-01','library-source-0021','collection_note','Critical-theory map',
 'The photographed contents provide an unusually compact map of major literary and cultural theories: liberal humanism, structuralism, post-structuralism, deconstruction, postmodernism, psychoanalysis, feminism, lesbian/gay and queer theory, Marxism, new historicism, cultural materialism, postcolonialism, stylistics, narratology, and ecocriticism.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0021-02','library-source-0021','intellectual_connection','Theory as a navigational source',
 'Rather than representing one theoretical school, this book functions in the library as a navigation layer among competing interpretive frameworks and their characteristic questions and practices.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0022 The Young Child as Scientist
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0022-01','library-source-0022','intellectual_connection','Child as theory builder',
 'The photographed contents explicitly frame the child as a theory builder and organize science learning around a constructivist curriculum model, children''s questions, experimentation, and the learning environment.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0022-02','library-source-0022','intellectual_connection','Teacher as theory builder',
 'The teacher is repeatedly framed as presenter, observer, question asker, problem poser, environment organizer, documenter of children''s learning, contributor to classroom culture, and theory builder.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0022-03','library-source-0022','collection_note','Constructivist practice bridge',
 'This book was cataloged as a particularly practical bridge from constructivist learning theory into classroom environment, teacher practice, physics, chemistry, biology, and ecology.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0023 Invent to Learn
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0023-01','library-source-0023','artifact','Dedication to Seymour Papert',
 'The photographed dedication reads: “To Seymour Papert - Thank you for your vision, friendship, and for having the audacity to believe we can all do better by children.”',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0023-02','library-source-0023','intellectual_connection','Maker movement and Papert lineage',
 'The contents explicitly include “Seymour Papert: The Father of the Maker Movement,” followed by constructivism and constructionism, making, tinkering, engineering, powerful ideas, fabrication, physical computing, programming, makerspaces, and student leadership.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0023-03','library-source-0023','collection_note','Constructionism becomes contemporary making',
 'In the library this source acts as a bridge from Papert-era constructionism into contemporary maker education, fabrication, microcontrollers, 3D printing, coding, STEAM/STEM, equity, and project-based learning.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0024 Invent to Learn Guide to the micro:bit
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0024-01','library-source-0024','intellectual_connection','Maker theory becomes concrete projects',
 'The contents move from micro:bit warm-ups through MakeCode, Scratch, Python, sensors, radio communication, NeoPixels, wearables, remote control, and classroom project planning, making this a hands-on implementation node in the maker/constructionist branch.',
 'interpretive','cataloging_interpretation_grounded_in_photographed_contents',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0024-02','library-source-0024','historical_context','CMK Press lineage',
 'The photographed copyright page identifies Constructing Modern Knowledge Press, with Gary Stager and Sylvia Libow Martinez as editors, linking this guide directly to the Invent to Learn / maker-education lineage already represented in entry 23.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 0025 Computer Environments for Children
INSERT OR REPLACE INTO library_special_notes VALUES
('lsn-0025-01','library-source-0025','historical_context','Harvard thesis to MIT Press',
 'The photographed cataloging page states that the book was originally presented as Cynthia Solomon''s doctoral thesis at Harvard University in 1985 and was published by The MIT Press in 1986.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0025-02','library-source-0025','historical_context','BYTE magazine lineage',
 'The copyright page states that the discussion on pages 148-160 is based on material originally published in BYTE magazine in August 1982.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0025-03','library-source-0025','intellectual_connection','Contrasting theories of computer-supported learning',
 'The table of contents deliberately contrasts Suppes on drill and practice / rote learning, Davis on Socratic interaction / discovery learning, Dwyer on eclecticism / heuristic learning, and Papert on constructivism / Piagetian learning before turning to trends in practice and computer educators.',
 'photographed_or_session_grounded','user_photographs_and_cataloging_session',30,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lsn-0025-04','library-source-0025','visual_detail','GeoBoard + turtle + Apple ][ marker',
 'The final photographed item was memorably identified in the cataloging session by its cover image of children working with a geoboard/manipulatives beside a turtle and an Apple ][-era computer. This visual marker became the checksum for recognizing the lost 12-25 catalog segment.',
 'mixed','user_photograph_plus_cataloging_session_context',40,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

CREATE VIEW IF NOT EXISTS library_sources_special_notes_summary AS
SELECT
  s.entry_number,
  s.id AS source_id,
  s.author_display,
  s.title,
  COUNT(n.id) AS special_note_count
FROM library_sources s
LEFT JOIN library_special_notes n ON n.source_id = s.id
GROUP BY s.entry_number, s.id, s.author_display, s.title
ORDER BY s.entry_number;

-- Verification targets after remote apply:
-- SELECT COUNT(*) FROM library_special_notes;              -- expected: 65
-- SELECT COUNT(DISTINCT source_id) FROM library_special_notes; -- expected: 25
-- SELECT entry_number, title, special_note_count
--   FROM library_sources_special_notes_summary ORDER BY entry_number;
