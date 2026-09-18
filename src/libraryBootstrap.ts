import type { Env } from "./index";

type DB = NonNullable<Env["DB"]>;

const SCHEMA = `
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
  chronology_basis TEXT NOT NULL DEFAULT 'unknown',
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
  physical_copy_status TEXT NOT NULL DEFAULT 'currently_owned',
  digital_copy_status TEXT NOT NULL DEFAULT 'unknown',
  digital_copy_url TEXT,
  digital_copy_type TEXT,
  digital_copy_verified_at TEXT,
  verification_status TEXT NOT NULL DEFAULT 'physical_copy_photographed',
  metadata_provenance_json TEXT NOT NULL DEFAULT '{}',
  collection_visibility TEXT NOT NULL DEFAULT 'private',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_library_sources_chronology ON library_sources(chronology_year, author_display, title);
CREATE INDEX IF NOT EXISTS idx_library_sources_digital ON library_sources(digital_copy_status, physical_copy_status);
CREATE INDEX IF NOT EXISTS idx_library_sources_visibility ON library_sources(collection_visibility, chronology_year);
CREATE VIEW IF NOT EXISTS library_sources_chronological AS
SELECT entry_number,id,chronology_year,chronology_basis,author_display,title,subtitle,
original_publication_year,edition_year,coverage_start_year,coverage_end_year,
physical_copy_status,digital_copy_status,digital_copy_url,verification_status,collection_visibility
FROM library_sources
ORDER BY CASE WHEN chronology_year IS NULL THEN 1 ELSE 0 END, chronology_year, author_display, title;
`;

const provenance = JSON.stringify({
  basis: "user_photographed_physical_copy",
  captured_date: "2026-09-17",
  external_lookup: false
});

const rows = [
  {
    id:"library-source-0001", entry:1, title:"The Process of Education", canonical:"The Process of Education",
    author:"Jerome S. Bruner", original:1960, edition:null, chronology:1960, basis:"original_publication_year",
    editionLabel:null, printing:"Eighth Printing", publisher:null, imprint:null, place:null, isbn:null, lccn:"60-15235", lc:null, dewey:null,
    subjects:["education","learning theory","pedagogy"],
    tags:["Bruner","Woods Hole Conference","interdisciplinary curriculum","psychology","mathematics","science education","educational reform"],
    contents:[],
    notes:"Copyright page shows 1960 copyright by the President and Fellows of Harvard College; distributed in Great Britain by Oxford University Press, London. A photographed conference page identifies Jerome S. Bruner as Director of the Woods Hole Conference, Harvard University, Psychology, among 34 interdisciplinary participants."
  },
  {
    id:"library-source-0002", entry:2, title:"Inventing Kindergarten", canonical:"Inventing Kindergarten",
    author:"Norman Brosterman", original:1997, edition:1997, chronology:1997, basis:"original_publication_year",
    editionLabel:null, printing:null, publisher:"Harry N. Abrams, Incorporated", imprint:null, place:"New York", isbn:"0-8109-3526-0", lccn:"96-27191", lc:"LB1199.B76 1997", dewey:null,
    subjects:["Kindergarten--History--19th century","Kindergarten--History--20th century","Kindergarten--Methods and manuals","Froebel, Friedrich, 1782-1852","Architecture, Modern--20th century","Art, Abstract--History--20th century"],
    tags:["Froebel","kindergarten","play","design","manipulatives","educational history","learning environments","art","architecture"],
    contents:[], notes:"Cataloging page states that the book includes bibliographical references and index."
  },
  {
    id:"library-source-0003", entry:3, title:"The Relevance of Education", canonical:"The Relevance of Education",
    author:"Jerome S. Bruner", original:1971, edition:1973, chronology:1971, basis:"original_publication_year",
    editionLabel:"Norton Library edition with a new preface", printing:null, publisher:"W. W. Norton & Company, Inc.", imprint:null, place:null, isbn:"0-393-00690-5", lccn:"73-941", lc:"LB1051.B74 1973", dewey:"370.15",
    subjects:["Educational psychology","Child study"], tags:["Bruner","educational psychology","child development","cognition","culture","education","learning theory"], contents:[],
    notes:"Copyright page shows copyright 1973, 1971 by Jerome S. Bruner and first publication in the Norton Library in 1973."
  },
  {
    id:"library-source-0004", entry:4, title:"Teach Yourself Esperanto", subtitle:"A Complete Course for Beginners", canonical:"Teach Yourself Esperanto",
    author:"John Cresswell and John Hartley", contributors:["Revised by J. H. Sullivan"], original:1957, edition:1992, chronology:1957, basis:"original_publication_year",
    editionLabel:"Third edition", printing:null, publisher:"NTC Publishing Group", imprint:null, place:null, isbn:null, lccn:"92-80873", lc:null, dewey:null,
    subjects:["Esperanto","language learning"], tags:["Esperanto","constructed language","language learning","linguistics","communication","self-directed learning"], contents:[],
    notes:"Publication page states this edition was first published in 1992 by NTC Publishing Group; originally published by Hodder and Stoughton Ltd.; copyrights shown for 1987, 1968, and 1957 by John Cresswell and John Hartley."
  },
  {
    id:"library-source-0005", entry:5, title:"Teach Yourself Linguistics", canonical:"General Linguistics",
    author:"Jean Aitchison", original:1972, edition:1992, chronology:1972, basis:"original_publication_year",
    editionLabel:"Fourth edition", printing:null, publisher:"Hodder Headline Plc / NTC Publishing Group", imprint:null, place:"UK / US", isbn:null, lccn:"92-80881", lc:null, dewey:"410.7",
    subjects:["Linguistics"], tags:["linguistics","language","syntax","semantics","phonology","phonetics","sociolinguistics","psycholinguistics","language acquisition","self-directed learning"], contents:[],
    notes:"First printed under the title General Linguistics in 1972; second edition 1978; third edition 1987; fourth edition 1992. UK publication 1992; US publication 1993."
  },
  {
    id:"library-source-0006", entry:6, title:"The New Well-Tempered Sentence", subtitle:"A Punctuation Handbook for the Innocent, the Eager, and the Doomed", canonical:"The Well-Tempered Sentence",
    author:"Karen Elizabeth Gordon", original:1983, edition:1993, chronology:1983, basis:"original_publication_year",
    editionLabel:"Expanded and revised", printing:null, publisher:null, imprint:"Ticknor & Fields", place:"New York", isbn:"0-395-62883-0", lccn:"93-18454", lc:"PE1450.G65 1993", dewey:"428.2",
    subjects:["English language--Punctuation"], tags:["punctuation","grammar","writing","English language","style","rhetoric","writing instruction","humor"], contents:[],
    notes:"1993 edition is identified as a revised edition of The Well-Tempered Sentence (1983) and includes an index."
  },
  {
    id:"library-source-0007", entry:7, title:"Democracy and Education", canonical:"Democracy and Education",
    author:"John Dewey", contributors:["Introduction by Sidney Hook"], original:1916, edition:1985, chronology:1916, basis:"original_publication_year",
    editionLabel:"The Middle Works, 1899-1924, Volume 9; first paperback printing 1985", printing:null, publisher:"Southern Illinois University", imprint:null, place:null, isbn:"0-8093-0933-5", lccn:"76-7231", lc:"LB875.D34 1976", dewey:"370.1'092'4",
    subjects:["Education--Philosophy"], tags:["Dewey","democracy","education","philosophy of education","experience","thinking","curriculum","play","work","social learning","progressive education"],
    contents:["Education as a Necessity of Life","Education as a Social Function","Education as Direction","Education as Growth","Preparation, Unfolding, and Formal Discipline","Education as Conservative and Progressive","The Democratic Conception in Education","Aims in Education","Natural Development and Social Efficiency as Aims","Interest and Discipline","Experience and Thinking","Thinking in Education","The Nature of Method","The Nature of Subject Matter","Play and Work in the Curriculum","The Significance of Geography and History","Science in the Course of Study","Educational Values","Labor and Leisure","Intellectual and Practical Studies","Physical and Social Studies: Naturalism and Humanism","The Individual and the World","Vocational Aspects of Education","Philosophy of Education","Theories of Knowledge","Theories of Morals"],
    notes:"Original work year 1916. Collected edition first published July 1980; photographed copy states first paperback printing 1985."
  },
  {
    id:"library-source-0008", entry:8, title:"The Children’s Machine", subtitle:"Rethinking School in the Age of the Computer", canonical:"The Children’s Machine",
    author:"Seymour Papert", original:1993, edition:1993, chronology:1993, basis:"original_publication_year",
    editionLabel:null, printing:null, publisher:"BasicBooks, a division of HarperCollins Publishers, Inc.", imprint:null, place:null, isbn:"0-465-01830-0", lccn:"91-59012", lc:"LB1028.5.P325 1992", dewey:"371.3'34",
    subjects:["Computer assisted instruction","Education--Data processing"], tags:["Papert","constructionism","computers","Logo","learning","school reform","epistemology","cybernetics","teachers","educational technology","AI","computer culture"],
    contents:["Yearners and Schoolers","Personal Thinking","School: Change and Resistance to Change","Teachers","A Word for Learning","An Anthology of Learning Stories","Instructionism versus Constructionism","Computerists","Cybernetics","What Can Be Done?","Sources of Information","Bibliography"],
    notes:"Jacket biography identifies work with Jean Piaget, arrival at MIT in 1964, the LEGO Chair for Learning Research, co-direction of the Artificial Intelligence Laboratory with Marvin Minsky, founding membership in the Media Laboratory, direction of the Epistemology and Learning Group, and pioneering work on Logo."
  },
  {
    id:"library-source-0009", entry:9, title:"To Be or Not", subtitle:"An E-Prime Anthology", canonical:"To Be or Not: An E-Prime Anthology",
    author:"D. David Bourland, Jr. and Paul Dennithorne Johnston, editors", contributors:["Foreword by Steve Allen"], original:1991, edition:1991, chronology:1991, basis:"original_publication_year",
    editionLabel:null, printing:"Third printing 1993", publisher:"International Society for General Semantics", imprint:null, place:"San Francisco", isbn:"0-918970-38-5", lccn:"91-29865", lc:"PE1404.T59 1991", dewey:"808'.04207",
    subjects:["English language--Composition and exercises--Study and teaching","English language--Rhetoric--Study and teaching","English language--Semantics","English language--Reform","English language--Verb"],
    tags:["E-Prime","general semantics","semantics","epistemology","critical thinking","rhetoric","writing","grammar","language reform","non-Aristotelian language"],
    contents:["E-Prime in Action","Epistemological Foundations of E-Prime","Further Applications of E-Prime"],
    notes:"First printing 1991, second printing 1992, third printing 1993. Dedicated to the memory of Alfred Korzybski. Includes bibliographical references."
  },
  {
    id:"library-source-0010", entry:10, title:"Drive Yourself Sane", subtitle:"Using the Uncommon Sense of General Semantics", canonical:"Drive Yourself Sane: Using the Uncommon Sense of General Semantics",
    author:"Susan Presby Kodish and Bruce I. Kodish", contributors:["Foreword by Albert Ellis"], original:null, edition:2001, chronology:2001, basis:"edition_year",
    editionLabel:"Revised Second Edition", printing:null, publisher:"Extensional Publishing", imprint:null, place:"Pasadena, California", isbn:"0-9700664-6-5", lccn:"00-104837", lc:"BF 441", dewey:"153.4",
    subjects:["General Semantics","Thinking Skills","Communication","Applied Psychology","Practical Philosophy"],
    tags:["general semantics","critical thinking","epistemology","language","abstraction","perception","inference","communication","mapping","E-Prime","Korzybski","metacognition"],
    contents:["Introductions","Glass Doors and Unicorns","Uncommon Sense","Endless Complexities","The Process of Abstracting","Mapping Structures","The Structural Differential","Non-Verbal Awareness","Verbal Awareness","The Structure of Language","Self-Reflexive Mapping","The Extensional Orientation","Getting Extensional","Time-Binding","Et Cetera","On Alfred Korzybski","On General Semantics Organizations","Glossary","Notes","References","Index"],
    notes:"Photographed pages establish the revised second edition copyright year as 2001; no earlier original-work year was established from the supplied pages."
  },
  {
    id:"library-source-0011", entry:11, title:"Evergreen Review Reader 1957-1966", canonical:"Evergreen Review Reader 1957-1966",
    author:"Barney Rosset, editor", contributors:["Associate editors: Dick Seaver, Fred Jordan, Donald Allen","Special editor: Mike Topp"], original:null, edition:null, chronology:1957, basis:"coverage_start_year",
    coverageStart:1957, coverageEnd:1966, editionLabel:null, printing:null, publisher:null, imprint:null, place:null, isbn:null, lccn:null, lc:null, dewey:null,
    subjects:["literature","literary magazine anthology"], tags:["literature","counterculture","Beat literature","experimental writing","translation","poetry","fiction","literary magazines","postwar American culture","censorship and free expression","Evergreen Review"],
    contents:["1957","1958","1959","1960","1961","1962","1963","1964","1965","1966"],
    notes:"The photographed contents organize selections by original magazine year from 1957 through 1966. Publication year of this collected reader was not established from the supplied photographs."
  }
] as const;

export async function bootstrapLibrarySources(db: DB) {
  await db.exec(SCHEMA);

  const sql = `INSERT OR IGNORE INTO library_sources (
    id,entry_number,title,subtitle,canonical_work_title,author_display,contributors_json,
    original_publication_year,edition_year,chronology_year,chronology_basis,
    coverage_start_year,coverage_end_year,edition_label,printing_label,publisher,imprint,
    publication_place,isbn,lccn,lc_classification,dewey_classification,subjects_json,
    tags_json,contents_json,notes,metadata_provenance_json
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const statements = rows.map((r: any) => db.prepare(sql).bind(
    r.id, r.entry, r.title, r.subtitle ?? null, r.canonical, r.author,
    JSON.stringify(r.contributors ?? []), r.original ?? null, r.edition ?? null,
    r.chronology ?? null, r.basis, r.coverageStart ?? null, r.coverageEnd ?? null,
    r.editionLabel ?? null, r.printing ?? null, r.publisher ?? null, r.imprint ?? null,
    r.place ?? null, r.isbn ?? null, r.lccn ?? null, r.lc ?? null, r.dewey ?? null,
    JSON.stringify(r.subjects ?? []), JSON.stringify(r.tags ?? []), JSON.stringify(r.contents ?? []),
    r.notes ?? null, provenance
  ));

  await db.batch(statements);
  const count = await db.prepare("SELECT COUNT(*) AS count FROM library_sources").first<{count:number}>();
  const sample = await db.prepare("SELECT entry_number,title,author_display,chronology_year,digital_copy_status FROM library_sources ORDER BY entry_number LIMIT 20").all();
  return { count: Number(count?.count || 0), rows: sample.results };
}
