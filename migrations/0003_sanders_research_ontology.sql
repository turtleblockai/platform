-- Dr. Bryan P. Sanders TurtleBlock AI research ontology v0.1
-- Canonical machine name: Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy
-- Original dissertation terminology is preserved as immutable source-layer data.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS ontology_versions (
  id TEXT PRIMARY KEY,
  ontology_key TEXT NOT NULL,
  public_name TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','active','superseded','archived')),
  created_at TEXT NOT NULL,
  notes TEXT,
  UNIQUE(ontology_key, version)
);

CREATE TABLE IF NOT EXISTS ontology_sources (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('dissertation','seminal_work','publication','charter','worldspec','operational','other')),
  title TEXT NOT NULL,
  author TEXT,
  publication_year INTEGER,
  canonical_citation TEXT,
  url TEXT,
  provenance_json TEXT,
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ontology_sources_version ON ontology_sources(ontology_version_id, source_type);

CREATE TABLE IF NOT EXISTS ontology_concepts (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  canonical_label TEXT NOT NULL,
  concept_key TEXT NOT NULL,
  layer TEXT NOT NULL CHECK (layer IN ('original_dedoose','published_lineage','turtle_charter','worldspec','operational_turtle')),
  concept_type TEXT NOT NULL,
  source_id TEXT,
  source_ref TEXT,
  source_exact INTEGER NOT NULL DEFAULT 0 CHECK (source_exact IN (0,1)),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','provisional','deprecated')),
  provenance_json TEXT,
  UNIQUE(ontology_version_id, concept_key),
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ontology_concepts_label ON ontology_concepts(canonical_label);
CREATE INDEX IF NOT EXISTS idx_ontology_concepts_layer ON ontology_concepts(ontology_version_id, layer);

CREATE TABLE IF NOT EXISTS ontology_precepts (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  precept_text TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_ref TEXT,
  provenance_json TEXT,
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ontology_precept_codes (
  precept_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  PRIMARY KEY (precept_id, concept_id),
  FOREIGN KEY (precept_id) REFERENCES ontology_precepts(id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES ontology_concepts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ontology_source_metrics (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  source_id TEXT,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('tag_count','code_cooccurrence_instances','other')),
  metric_value INTEGER NOT NULL,
  source_ref TEXT,
  provenance_json TEXT,
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES ontology_concepts(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ontology_metrics_concept ON ontology_source_metrics(concept_id, metric_type);

CREATE TABLE IF NOT EXISTS ontology_relationships (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  subject_concept_id TEXT NOT NULL,
  predicate TEXT NOT NULL,
  object_concept_id TEXT NOT NULL,
  relationship_layer TEXT NOT NULL CHECK (relationship_layer IN ('source','later_interpretation')),
  numeric_weight REAL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','provisional','deprecated')),
  source_id TEXT,
  source_ref TEXT,
  notes TEXT,
  provenance_json TEXT,
  UNIQUE(ontology_version_id, subject_concept_id, predicate, object_concept_id, relationship_layer),
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_concept_id) REFERENCES ontology_concepts(id) ON DELETE CASCADE,
  FOREIGN KEY (object_concept_id) REFERENCES ontology_concepts(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ontology_relationships_subject ON ontology_relationships(subject_concept_id, predicate);
CREATE INDEX IF NOT EXISTS idx_ontology_relationships_object ON ontology_relationships(object_concept_id, predicate);

CREATE TABLE IF NOT EXISTS ontology_source_passages (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_ref TEXT,
  passage_text TEXT NOT NULL,
  passage_role TEXT NOT NULL DEFAULT 'evidence' CHECK (passage_role IN ('evidence','definition','example','quotation','annotation')),
  retrieval_text TEXT,
  provenance_json TEXT,
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE
);

CREATE VIRTUAL TABLE IF NOT EXISTS ontology_passages_fts USING fts5(
  passage_id UNINDEXED,
  retrieval_text,
  content=''
);

-- Foundation: ontology version and source corpus.
INSERT OR IGNORE INTO ontology_versions (id,ontology_key,public_name,version,status,created_at,notes) VALUES
('sanders-ontology-v0.1','Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy','the Dr. Bryan P. Sanders TurtleBlock AI research ontology','0.1','active','2026-09-02T00:00:00Z','Foundational source layer seeded from Sanders 2019 dissertation Dedoose taxonomy. Later TurtleBlock mappings remain additive.');

INSERT OR IGNORE INTO ontology_sources (id,ontology_version_id,source_type,title,author,publication_year,canonical_citation,url,provenance_json) VALUES
('src-sanders-2019','sanders-ontology-v0.1','dissertation','Toward a Unified Computer Learning Theory: Critical Techno Constructivism','Bryan Philip Sanders',2019,'Sanders, B. P. (2019). Toward a Unified Computer Learning Theory: Critical Techno Constructivism. Loyola Marymount University.','https://digitalcommons.lmu.edu/etd/901/','{"role":"foundational_methodology_and_codebook","source_layer":"original"}'),
('src-dewey-1916','sanders-ontology-v0.1','seminal_work','Democracy and Education','John Dewey',1916,'Dewey, J. (1916). Democracy and Education.',NULL,'{"role":"seminal_work_in_document_analysis"}'),
('src-freire-1970','sanders-ontology-v0.1','seminal_work','Pedagogy of the Oppressed','Paulo Freire',1970,'Freire, P. (1970). Pedagogy of the Oppressed.',NULL,'{"role":"seminal_work_in_document_analysis"}'),
('src-papert-1980','sanders-ontology-v0.1','seminal_work','Mindstorms: Children, Computers, and Powerful Ideas','Seymour Papert',1980,'Papert, S. (1980). Mindstorms: Children, Computers, and Powerful Ideas.',NULL,'{"role":"seminal_work_in_document_analysis"}');

-- Exact 17-code Dedoose taxonomy. Labels are intentionally immutable at this layer.
INSERT OR IGNORE INTO ontology_concepts (id,ontology_version_id,canonical_label,concept_key,layer,concept_type,source_id,source_ref,source_exact,description,provenance_json) VALUES
('code-abstractions','sanders-ontology-v0.1','Abstractions','abstractions','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-banking-model','sanders-ontology-v0.1','Banking Model','banking_model','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-connectivism','sanders-ontology-v0.1','Connectivism','connectivism','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-constructivism','sanders-ontology-v0.1','Constructivism','constructivism','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-discovery-learning','sanders-ontology-v0.1','Discovery Learning','discovery_learning','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-engagement','sanders-ontology-v0.1','Engagement','engagement','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-freedom-individuality','sanders-ontology-v0.1','Freedom and Individuality','freedom_and_individuality','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-institutional-change','sanders-ontology-v0.1','Institutional Change','institutional_change','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-isolated-curricula','sanders-ontology-v0.1','Isolated Curricula','isolated_curricula','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-observations-life','sanders-ontology-v0.1','Observations on Life Itself','observations_on_life_itself','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-oppression','sanders-ontology-v0.1','Oppression','oppression','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-pedagogy','sanders-ontology-v0.1','Pedagogy','pedagogy','original_dedoose','dedoose_code','src-sanders-2019','Chapter 3; Appendix A Table 7',1,'Added with Theory to accommodate discussion from Chapter 2 regarding the relationship between pedagogy and theory.','{"original_term":true,"added_after_precept_conversion":true}'),
('code-predetermined-outcomes','sanders-ontology-v0.1','Predetermined Outcomes','predetermined_outcomes','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-problem-posing','sanders-ontology-v0.1','Problem Posing Education','problem_posing_education','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-shared-democracy','sanders-ontology-v0.1','Shared Democracy','shared_democracy','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-social-impact','sanders-ontology-v0.1','Social Impact','social_impact','original_dedoose','dedoose_code','src-sanders-2019','Table 2; Appendix A Table 7',1,NULL,'{"original_term":true}'),
('code-theory','sanders-ontology-v0.1','Theory','theory','original_dedoose','dedoose_code','src-sanders-2019','Chapter 3; Appendix A Table 7',1,'Added with Pedagogy to accommodate discussion from Chapter 2 regarding the relationship between pedagogy and theory.','{"original_term":true,"added_after_precept_conversion":true}');

-- Table 2: conversion of extant-theory precepts to excerpting codes.
INSERT OR IGNORE INTO ontology_precepts (id,ontology_version_id,precept_text,source_id,source_ref,provenance_json) VALUES
('precept-01','sanders-ontology-v0.1','The learner responds properly to the presented stimulus.','src-sanders-2019','Table 2','{"source_exact":true}'),
('precept-02','sanders-ontology-v0.1','The learner processes and applies patterns of presented information.','src-sanders-2019','Table 2','{"source_exact":true}'),
('precept-03','sanders-ontology-v0.1','The learner creates meaning and interpretation through experience with a body of information.','src-sanders-2019','Table 2','{"source_exact":true}'),
('precept-04','sanders-ontology-v0.1','The learner discovers solutions in an active exploration of a problem to solve.','src-sanders-2019','Table 2','{"source_exact":true}'),
('precept-05','sanders-ontology-v0.1','The learner discovers solutions and creates meaning in a shared environment.','src-sanders-2019','Table 2','{"source_exact":true}'),
('precept-06','sanders-ontology-v0.1','The learner uses reflection as a tool to process presented information as well as personal interpretations.','src-sanders-2019','Table 2','{"source_exact":true}'),
('precept-07','sanders-ontology-v0.1','The learner applies social and cultural critique to all learned and individually developed interpretations.','src-sanders-2019','Table 2','{"source_exact":true}');

INSERT OR IGNORE INTO ontology_precept_codes (precept_id,concept_id) VALUES
('precept-01','code-banking-model'),('precept-01','code-isolated-curricula'),
('precept-02','code-predetermined-outcomes'),
('precept-03','code-constructivism'),('precept-03','code-engagement'),
('precept-04','code-discovery-learning'),('precept-04','code-freedom-individuality'),
('precept-05','code-shared-democracy'),('precept-05','code-connectivism'),('precept-05','code-problem-posing'),
('precept-06','code-abstractions'),('precept-06','code-observations-life'),
('precept-07','code-institutional-change'),('precept-07','code-oppression'),('precept-07','code-social-impact');

-- Appendix A Table 7: per-work Dedoose tag counts and totals.
INSERT OR IGNORE INTO ontology_source_metrics (id,ontology_version_id,concept_id,source_id,metric_type,metric_value,source_ref) VALUES
('m-ab-dewey','sanders-ontology-v0.1','code-abstractions','src-dewey-1916','tag_count',5,'Appendix A Table 7'),('m-ab-freire','sanders-ontology-v0.1','code-abstractions','src-freire-1970','tag_count',5,'Appendix A Table 7'),('m-ab-papert','sanders-ontology-v0.1','code-abstractions','src-papert-1980','tag_count',4,'Appendix A Table 7'),('m-ab-total','sanders-ontology-v0.1','code-abstractions',NULL,'tag_count',14,'Appendix A Table 7'),
('m-bm-dewey','sanders-ontology-v0.1','code-banking-model','src-dewey-1916','tag_count',23,'Appendix A Table 7'),('m-bm-freire','sanders-ontology-v0.1','code-banking-model','src-freire-1970','tag_count',14,'Appendix A Table 7'),('m-bm-papert','sanders-ontology-v0.1','code-banking-model','src-papert-1980','tag_count',15,'Appendix A Table 7'),('m-bm-total','sanders-ontology-v0.1','code-banking-model',NULL,'tag_count',52,'Appendix A Table 7'),
('m-co-dewey','sanders-ontology-v0.1','code-connectivism','src-dewey-1916','tag_count',1,'Appendix A Table 7'),('m-co-freire','sanders-ontology-v0.1','code-connectivism','src-freire-1970','tag_count',0,'Appendix A Table 7'),('m-co-papert','sanders-ontology-v0.1','code-connectivism','src-papert-1980','tag_count',3,'Appendix A Table 7'),('m-co-total','sanders-ontology-v0.1','code-connectivism',NULL,'tag_count',4,'Appendix A Table 7'),
('m-cv-dewey','sanders-ontology-v0.1','code-constructivism','src-dewey-1916','tag_count',22,'Appendix A Table 7'),('m-cv-freire','sanders-ontology-v0.1','code-constructivism','src-freire-1970','tag_count',9,'Appendix A Table 7'),('m-cv-papert','sanders-ontology-v0.1','code-constructivism','src-papert-1980','tag_count',17,'Appendix A Table 7'),('m-cv-total','sanders-ontology-v0.1','code-constructivism',NULL,'tag_count',48,'Appendix A Table 7'),
('m-dl-dewey','sanders-ontology-v0.1','code-discovery-learning','src-dewey-1916','tag_count',2,'Appendix A Table 7'),('m-dl-freire','sanders-ontology-v0.1','code-discovery-learning','src-freire-1970','tag_count',5,'Appendix A Table 7'),('m-dl-papert','sanders-ontology-v0.1','code-discovery-learning','src-papert-1980','tag_count',15,'Appendix A Table 7'),('m-dl-total','sanders-ontology-v0.1','code-discovery-learning',NULL,'tag_count',22,'Appendix A Table 7'),
('m-en-dewey','sanders-ontology-v0.1','code-engagement','src-dewey-1916','tag_count',16,'Appendix A Table 7'),('m-en-freire','sanders-ontology-v0.1','code-engagement','src-freire-1970','tag_count',6,'Appendix A Table 7'),('m-en-papert','sanders-ontology-v0.1','code-engagement','src-papert-1980','tag_count',24,'Appendix A Table 7'),('m-en-total','sanders-ontology-v0.1','code-engagement',NULL,'tag_count',46,'Appendix A Table 7'),
('m-fi-dewey','sanders-ontology-v0.1','code-freedom-individuality','src-dewey-1916','tag_count',0,'Appendix A Table 7'),('m-fi-freire','sanders-ontology-v0.1','code-freedom-individuality','src-freire-1970','tag_count',10,'Appendix A Table 7'),('m-fi-papert','sanders-ontology-v0.1','code-freedom-individuality','src-papert-1980','tag_count',11,'Appendix A Table 7'),('m-fi-total','sanders-ontology-v0.1','code-freedom-individuality',NULL,'tag_count',21,'Appendix A Table 7'),
('m-ic-dewey','sanders-ontology-v0.1','code-institutional-change','src-dewey-1916','tag_count',18,'Appendix A Table 7'),('m-ic-freire','sanders-ontology-v0.1','code-institutional-change','src-freire-1970','tag_count',7,'Appendix A Table 7'),('m-ic-papert','sanders-ontology-v0.1','code-institutional-change','src-papert-1980','tag_count',26,'Appendix A Table 7'),('m-ic-total','sanders-ontology-v0.1','code-institutional-change',NULL,'tag_count',51,'Appendix A Table 7'),
('m-iq-dewey','sanders-ontology-v0.1','code-isolated-curricula','src-dewey-1916','tag_count',4,'Appendix A Table 7'),('m-iq-freire','sanders-ontology-v0.1','code-isolated-curricula','src-freire-1970','tag_count',9,'Appendix A Table 7'),('m-iq-papert','sanders-ontology-v0.1','code-isolated-curricula','src-papert-1980','tag_count',10,'Appendix A Table 7'),('m-iq-total','sanders-ontology-v0.1','code-isolated-curricula',NULL,'tag_count',23,'Appendix A Table 7'),
('m-ol-dewey','sanders-ontology-v0.1','code-observations-life','src-dewey-1916','tag_count',1,'Appendix A Table 7'),('m-ol-freire','sanders-ontology-v0.1','code-observations-life','src-freire-1970','tag_count',3,'Appendix A Table 7'),('m-ol-papert','sanders-ontology-v0.1','code-observations-life','src-papert-1980','tag_count',1,'Appendix A Table 7'),('m-ol-total','sanders-ontology-v0.1','code-observations-life',NULL,'tag_count',5,'Appendix A Table 7'),
('m-op-dewey','sanders-ontology-v0.1','code-oppression','src-dewey-1916','tag_count',0,'Appendix A Table 7'),('m-op-freire','sanders-ontology-v0.1','code-oppression','src-freire-1970','tag_count',19,'Appendix A Table 7'),('m-op-papert','sanders-ontology-v0.1','code-oppression','src-papert-1980','tag_count',3,'Appendix A Table 7'),('m-op-total','sanders-ontology-v0.1','code-oppression',NULL,'tag_count',22,'Appendix A Table 7'),
('m-pe-dewey','sanders-ontology-v0.1','code-pedagogy','src-dewey-1916','tag_count',15,'Appendix A Table 7'),('m-pe-freire','sanders-ontology-v0.1','code-pedagogy','src-freire-1970','tag_count',6,'Appendix A Table 7'),('m-pe-papert','sanders-ontology-v0.1','code-pedagogy','src-papert-1980','tag_count',5,'Appendix A Table 7'),('m-pe-total','sanders-ontology-v0.1','code-pedagogy',NULL,'tag_count',26,'Appendix A Table 7'),
('m-po-dewey','sanders-ontology-v0.1','code-predetermined-outcomes','src-dewey-1916','tag_count',13,'Appendix A Table 7'),('m-po-freire','sanders-ontology-v0.1','code-predetermined-outcomes','src-freire-1970','tag_count',5,'Appendix A Table 7'),('m-po-papert','sanders-ontology-v0.1','code-predetermined-outcomes','src-papert-1980','tag_count',20,'Appendix A Table 7'),('m-po-total','sanders-ontology-v0.1','code-predetermined-outcomes',NULL,'tag_count',38,'Appendix A Table 7'),
('m-pp-dewey','sanders-ontology-v0.1','code-problem-posing','src-dewey-1916','tag_count',0,'Appendix A Table 7'),('m-pp-freire','sanders-ontology-v0.1','code-problem-posing','src-freire-1970','tag_count',4,'Appendix A Table 7'),('m-pp-papert','sanders-ontology-v0.1','code-problem-posing','src-papert-1980','tag_count',18,'Appendix A Table 7'),('m-pp-total','sanders-ontology-v0.1','code-problem-posing',NULL,'tag_count',22,'Appendix A Table 7'),
('m-sd-dewey','sanders-ontology-v0.1','code-shared-democracy','src-dewey-1916','tag_count',4,'Appendix A Table 7'),('m-sd-freire','sanders-ontology-v0.1','code-shared-democracy','src-freire-1970','tag_count',6,'Appendix A Table 7'),('m-sd-papert','sanders-ontology-v0.1','code-shared-democracy','src-papert-1980','tag_count',3,'Appendix A Table 7'),('m-sd-total','sanders-ontology-v0.1','code-shared-democracy',NULL,'tag_count',13,'Appendix A Table 7'),
('m-si-dewey','sanders-ontology-v0.1','code-social-impact','src-dewey-1916','tag_count',11,'Appendix A Table 7'),('m-si-freire','sanders-ontology-v0.1','code-social-impact','src-freire-1970','tag_count',19,'Appendix A Table 7'),('m-si-papert','sanders-ontology-v0.1','code-social-impact','src-papert-1980','tag_count',12,'Appendix A Table 7'),('m-si-total','sanders-ontology-v0.1','code-social-impact',NULL,'tag_count',42,'Appendix A Table 7'),
('m-th-dewey','sanders-ontology-v0.1','code-theory','src-dewey-1916','tag_count',13,'Appendix A Table 7'),('m-th-freire','sanders-ontology-v0.1','code-theory','src-freire-1970','tag_count',4,'Appendix A Table 7'),('m-th-papert','sanders-ontology-v0.1','code-theory','src-papert-1980','tag_count',9,'Appendix A Table 7'),('m-th-total','sanders-ontology-v0.1','code-theory',NULL,'tag_count',26,'Appendix A Table 7');

-- Table 5: strongest code-pair co-occurrences. Numeric weight is the recorded instance count.
INSERT OR IGNORE INTO ontology_relationships (id,ontology_version_id,subject_concept_id,predicate,object_concept_id,relationship_layer,numeric_weight,source_id,source_ref,notes,provenance_json) VALUES
('rel-bm-ic','sanders-ontology-v0.1','code-banking-model','co_occurs_with','code-institutional-change','source',16,'src-sanders-2019','Table 5','Significant code-pair co-occurrence.','{"source_exact":true}'),
('rel-bm-po','sanders-ontology-v0.1','code-banking-model','co_occurs_with','code-predetermined-outcomes','source',25,'src-sanders-2019','Table 5','Significant code-pair co-occurrence.','{"source_exact":true}'),
('rel-bm-si','sanders-ontology-v0.1','code-banking-model','co_occurs_with','code-social-impact','source',14,'src-sanders-2019','Table 5','Significant code-pair co-occurrence.','{"source_exact":true}'),
('rel-cv-en','sanders-ontology-v0.1','code-constructivism','co_occurs_with','code-engagement','source',21,'src-sanders-2019','Table 5','Significant code-pair co-occurrence.','{"source_exact":true}'),
('rel-cv-ic','sanders-ontology-v0.1','code-constructivism','co_occurs_with','code-institutional-change','source',17,'src-sanders-2019','Table 5','Significant code-pair co-occurrence.','{"source_exact":true}'),
('rel-en-ic','sanders-ontology-v0.1','code-engagement','co_occurs_with','code-institutional-change','source',23,'src-sanders-2019','Table 5','Significant code-pair co-occurrence.','{"source_exact":true}');

-- Empty by design at v0.1: later scholarship, Charter, WorldSpec and operational
-- mappings are inserted as separate concepts/relationships with relationship_layer='later_interpretation'.
