-- Dr. Bryan P. Sanders TurtleBlock AI research ontology v0.4
-- Makes the ontology browsable as a research catalog: aliases, artifacts, source lineage,
-- completeness auditing, experiment/source joins, and retrieval-oriented views.
-- Also resolves the previously provisional Create Boldly source.

PRAGMA foreign_keys = ON;

-- Resolve the recovered California Teachers Summit publication.
UPDATE ontology_sources
SET source_type = 'publication',
    title = 'Create Boldly',
    author = 'Bryan Sanders',
    publication_year = 2018,
    canonical_citation = 'Sanders, B. (2018). Create Boldly. California Teachers Summit.',
    url = 'http://cateacherssummit.com/create-boldly-bryan-sanders/',
    provenance_json = '{"role":"published_career_lineage","source_layer":"later_sanders_work","status":"documented","recovered_url":true,"publisher":"California Teachers Summit"}'
WHERE id = 'src-sanders-create-boldly-candidate';

-- Human-friendly alternate labels and historical names without changing canonical source titles.
CREATE TABLE IF NOT EXISTS ontology_source_aliases (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  alias TEXT NOT NULL,
  alias_type TEXT NOT NULL DEFAULT 'alternate_title' CHECK (alias_type IN ('alternate_title','short_title','working_title','historical_title','search_term','identifier')),
  provenance_json TEXT,
  UNIQUE(source_id, alias, alias_type),
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE
);

-- A source may exist as a published page, DOI, PDF, slide deck, manuscript, local archive,
-- repository artifact, screenshot, recording, or recovered web page. Keep those manifestations distinct.
CREATE TABLE IF NOT EXISTS ontology_source_artifacts (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  artifact_type TEXT NOT NULL CHECK (artifact_type IN ('web_page','doi','pdf','manuscript','slide_deck','presentation','video','audio','repository','dataset','screenshot','archive','other')),
  title TEXT,
  locator TEXT,
  content_status TEXT NOT NULL DEFAULT 'cataloged' CHECK (content_status IN ('cataloged','available','ingested','partially_ingested','unavailable','needs_recovery')),
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0,1)),
  checksum TEXT,
  notes TEXT,
  provenance_json TEXT,
  UNIQUE(source_id, artifact_type, locator),
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE
);

-- Source-to-source lineage is separate from concept-to-concept relationships.
CREATE TABLE IF NOT EXISTS ontology_source_relationships (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  subject_source_id TEXT NOT NULL,
  predicate TEXT NOT NULL,
  object_source_id TEXT NOT NULL,
  relationship_layer TEXT NOT NULL DEFAULT 'later_interpretation' CHECK (relationship_layer IN ('source','later_interpretation')),
  notes TEXT,
  provenance_json TEXT,
  UNIQUE(ontology_version_id, subject_source_id, predicate, object_source_id),
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE,
  FOREIGN KEY (object_source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_source_aliases_source ON ontology_source_aliases(source_id, alias_type);
CREATE INDEX IF NOT EXISTS idx_source_artifacts_source ON ontology_source_artifacts(source_id, content_status);
CREATE INDEX IF NOT EXISTS idx_source_relationships_subject ON ontology_source_relationships(subject_source_id, predicate);
CREATE INDEX IF NOT EXISTS idx_source_relationships_object ON ontology_source_relationships(object_source_id, predicate);

-- Useful aliases for retrieval and human browsing.
INSERT OR IGNORE INTO ontology_source_aliases (id,source_id,alias,alias_type,provenance_json) VALUES
('alias-dissertation-ctc','src-sanders-2019','Critical Techno Constructivism dissertation','short_title','{"purpose":"retrieval"}'),
('alias-create-boldly','src-sanders-create-boldly-candidate','California Teachers Summit Create Boldly','search_term','{"purpose":"retrieval"}'),
('alias-minecraft-school','src-sanders-2021-minecraft-school','Minecraft School','short_title','{"purpose":"retrieval"}'),
('alias-purposeful-play','src-sanders-2022-purposeful-play','Purposeful Play','short_title','{"purpose":"retrieval"}'),
('alias-engaging-ai','src-sanders-2023-ai','Engaging with AI','short_title','{"purpose":"retrieval"}'),
('alias-logo-first-computer','src-sanders-2023-logo','The First Thing I Did With A Computer','short_title','{"purpose":"retrieval"}'),
('alias-coactive','src-sanders-2025-coactive','The Dawn of Co-active Emergence','short_title','{"purpose":"retrieval"}'),
('alias-gpt-builder','src-sanders-2023-gpt-builder','GPT that builds GPTs','search_term','{"purpose":"retrieval","author_phrase":true}'),
('alias-sunshine','src-sanders-2026-sunshine-machine','Sunshine Machine','short_title','{"purpose":"retrieval"}'),
('alias-turtleblock','src-sanders-2026-turtleblock','TurtleBlock AI','short_title','{"purpose":"retrieval"}');

-- Catalog known public / canonical manifestations. Content ingestion is tracked independently.
INSERT OR IGNORE INTO ontology_source_artifacts
(id,source_id,artifact_type,title,locator,content_status,is_primary,notes,provenance_json) VALUES
('artifact-dissertation-lmu','src-sanders-2019','web_page','LMU Digital Commons dissertation record','https://digitalcommons.lmu.edu/etd/901/','available',1,'Canonical institutional dissertation record.','{"verified":"repository_seed"}'),
('artifact-create-boldly-web','src-sanders-create-boldly-candidate','web_page','Create Boldly — Bryan Sanders','http://cateacherssummit.com/create-boldly-bryan-sanders/','available',1,'Recovered by author during TurtleBlock longitudinal research reconstruction.','{"recovered_by_author":true,"recovered_date":"2026-09-04"}'),
('artifact-minecraft-school-doi','src-sanders-2021-minecraft-school','doi','Could Minecraft Be a School? DOI','https://doi.org/10.1007/978-3-030-75142-5_17','available',1,NULL,'{"publisher":"Springer"}'),
('artifact-purposeful-play-web','src-sanders-2022-purposeful-play','web_page','Purposeful Play – Educating with Minecraft','https://education.minecraft.net/en-us/blog/purposeful-play','available',1,NULL,'{"publisher":"Minecraft Education"}'),
('artifact-coactive-doi','src-sanders-2025-coactive','doi','GPT and Me / Co-active Emergence DOI','https://doi.org/10.5195/ie.2025.479','available',1,NULL,'{"publisher":"Impacting Education"}'),
('artifact-reeducation-web','src-sanders-2022-reeducation','web_page','RE/EDUCATION','https://reeducationllc.com','available',1,NULL,'{"role":"practice_environment"}'),
('artifact-turtleblock-repo','src-sanders-2026-turtleblock','repository','TurtleBlock AI platform repository','https://github.com/turtleblockai/platform','available',0,NULL,'{"role":"implementation_source"}'),
('artifact-turtleblock-web','src-sanders-2026-turtleblock','web_page','TurtleBlock AI','https://turtleblockai.com','available',1,NULL,'{"role":"public_research_site"}');

-- Connect first-class experiments to the sources that document or instantiate them.
INSERT OR IGNORE INTO pedagogical_experiment_sources
(experiment_id,source_id,relationship_type,source_ref,notes) VALUES
('exp-steamhamlet','src-sanders-2016-steamhamlet','documents','STEAMHAMLET: A Transformative Situated Inquiry','Early research-development articulation.'),
('exp-steamhamlet','src-sanders-2051-steamhamlet','extends','STEAMHAMLET Is School 2051','Published future-facing development of the environment.'),
('exp-minecraft-purposeful-play','src-sanders-2021-minecraft-school','documents','Could Minecraft Be a School?','Published theoretical treatment of Minecraft as a learning environment.'),
('exp-minecraft-purposeful-play','src-sanders-2022-purposeful-play','documents','Purposeful Play – Educating with Minecraft','Published pedagogical practice articulation.'),
('exp-gpt-builder','src-sanders-2023-gpt-builder','documents','Early custom GPT research-development history','Author project history.'),
('exp-gpt-design-database','src-sanders-2024-gpt-design-database','documents','Structured GPT design database','Agent design represented as relational structure.'),
('exp-ingestion-research-systems','src-sanders-2024-ingestion-systems','documents','Public-document ingestion systems','Canonical records, entities, relationships, timelines, and provenance.'),
('exp-sunshine-machine','src-sanders-2026-sunshine-machine','documents','Sunshine Machine','Persistent computing environment research-development model.'),
('exp-coactive-writing','src-sanders-2023-ai','prefigures','Engaging with AI','Machine responses treated as material for critical evaluation.'),
('exp-coactive-writing','src-sanders-2025-coactive','documents','GPT and Me / Co-active Emergence','Published theoretical articulation.'),
('exp-reeducation-focused','src-sanders-2022-reeducation','instantiates','RE/EDUCATION','Focused practice and R&D environment.'),
('exp-turtleblock-field-tests','src-sanders-2026-turtleblock','instantiates','TurtleBlock AI','Current executable research environment.');

-- A concise source lineage. These are explicitly later interpretations unless a source itself states the relationship.
INSERT OR IGNORE INTO ontology_source_relationships
(id,ontology_version_id,subject_source_id,predicate,object_source_id,relationship_layer,notes,provenance_json) VALUES
('sr-steamhamlet-to-vle','sanders-ontology-v0.1','src-sanders-2016-steamhamlet','develops_into','src-sanders-2017-vle','later_interpretation','STEAMHAMLET inquiry develops into broader digital-learning-environment representation.','{"retrospective_lineage":true}'),
('sr-vle-to-ctc','sanders-ontology-v0.1','src-sanders-2017-vle','contributes_to','src-sanders-2019','later_interpretation','Experimental environment work contributes to formal doctoral theory.','{"retrospective_lineage":true}'),
('sr-create-boldly-to-ctc','sanders-ontology-v0.1','src-sanders-create-boldly-candidate','documents_practice_before','src-sanders-2019','later_interpretation','Published teaching/practice artifact within the pre-dissertation experimental lineage.','{"retrospective_lineage":true}'),
('sr-ctc-to-operational','sanders-ontology-v0.1','src-sanders-2019','is_operationalized_by','src-sanders-2019-operationalizing-ctc','later_interpretation','Doctoral theory becomes an authored Tenet → Question → Action framework.','{"retrospective_lineage":true}'),
('sr-minecraft-to-purposeful','sanders-ontology-v0.1','src-sanders-2021-minecraft-school','develops_into','src-sanders-2022-purposeful-play','later_interpretation','The environment-as-curriculum argument becomes pedagogical practice.','{"retrospective_lineage":true}'),
('sr-ai-to-coactive','sanders-ontology-v0.1','src-sanders-2023-ai','develops_into','src-sanders-2025-coactive','later_interpretation','Critical engagement with machine response develops toward co-active emergence.','{"retrospective_lineage":true}'),
('sr-gptbuilder-to-db','sanders-ontology-v0.1','src-sanders-2023-gpt-builder','develops_into','src-sanders-2024-gpt-design-database','later_interpretation','Recursive agent building leads to representing agent design itself as structured data.','{"retrospective_lineage":true}'),
('sr-gptdb-to-ingestion','sanders-ontology-v0.1','src-sanders-2024-gpt-design-database','broadens_into','src-sanders-2024-ingestion-systems','later_interpretation','Structured agent design broadens into provenance-aware research databases and ingestion systems.','{"retrospective_lineage":true}'),
('sr-ingestion-to-sunshine','sanders-ontology-v0.1','src-sanders-2024-ingestion-systems','develops_into','src-sanders-2026-sunshine-machine','later_interpretation','Corpus and database work becomes a persistent computing environment.','{"retrospective_lineage":true}'),
('sr-sunshine-to-turtle','sanders-ontology-v0.1','src-sanders-2026-sunshine-machine','converges_in','src-sanders-2026-turtleblock','later_interpretation','Persistent environment architecture converges with WorldSpec, Minecraft, dialogue, and learner agency in TurtleBlock AI.','{"retrospective_lineage":true}');

-- Human-readable bibliography view.
CREATE VIEW IF NOT EXISTS ontology_bibliography AS
SELECT
  s.id AS source_id,
  s.publication_year,
  s.source_type,
  s.title,
  s.author,
  s.canonical_citation,
  s.url,
  COUNT(DISTINCT a.id) AS artifact_count,
  COUNT(DISTINCT p.id) AS passage_count,
  COUNT(DISTINCT c.id) AS concept_count
FROM ontology_sources s
LEFT JOIN ontology_source_artifacts a ON a.source_id = s.id
LEFT JOIN ontology_source_passages p ON p.source_id = s.id
LEFT JOIN ontology_concepts c ON c.source_id = s.id
GROUP BY s.id, s.publication_year, s.source_type, s.title, s.author, s.canonical_citation, s.url;

-- Audit what is cataloged versus what still needs recovery or ingestion.
CREATE VIEW IF NOT EXISTS ontology_source_completeness AS
SELECT
  s.id AS source_id,
  s.publication_year,
  s.title,
  s.source_type,
  CASE WHEN s.canonical_citation IS NULL OR trim(s.canonical_citation) = '' THEN 0 ELSE 1 END AS has_citation,
  CASE WHEN s.url IS NULL OR trim(s.url) = '' THEN 0 ELSE 1 END AS has_url,
  CASE WHEN EXISTS (SELECT 1 FROM ontology_source_artifacts a WHERE a.source_id = s.id) THEN 1 ELSE 0 END AS has_artifact,
  CASE WHEN EXISTS (SELECT 1 FROM ontology_source_passages p WHERE p.source_id = s.id) THEN 1 ELSE 0 END AS has_passages,
  CASE WHEN EXISTS (SELECT 1 FROM ontology_concepts c WHERE c.source_id = s.id) THEN 1 ELSE 0 END AS has_concepts,
  CASE WHEN EXISTS (SELECT 1 FROM pedagogical_experiment_sources es WHERE es.source_id = s.id) THEN 1 ELSE 0 END AS linked_to_experiment
FROM ontology_sources s;

-- Chronological experiment browser with documentation counts.
CREATE VIEW IF NOT EXISTS ontology_experiment_timeline AS
SELECT
  e.id AS experiment_id,
  e.start_year,
  e.end_year,
  e.date_label,
  e.title,
  e.experiment_type,
  e.evidence_status,
  e.status,
  e.recursive_cycle_json,
  COUNT(DISTINCT es.source_id) AS source_count,
  COUNT(DISTINCT ec.concept_id) AS concept_count
FROM pedagogical_experiments e
LEFT JOIN pedagogical_experiment_sources es ON es.experiment_id = e.id
LEFT JOIN pedagogical_experiment_concepts ec ON ec.experiment_id = e.id
GROUP BY e.id, e.start_year, e.end_year, e.date_label, e.title, e.experiment_type, e.evidence_status, e.status, e.recursive_cycle_json;

-- Retrieval catalog keeps source, concept, passage, and experiment identities explicit.
CREATE VIEW IF NOT EXISTS ontology_retrieval_catalog AS
SELECT
  'source' AS record_kind,
  s.id AS record_id,
  s.title AS label,
  CAST(COALESCE(s.publication_year,'') AS TEXT) AS date_label,
  s.source_type AS record_type,
  s.canonical_citation AS description,
  s.url AS locator
FROM ontology_sources s
UNION ALL
SELECT
  'concept', c.id, c.canonical_label, '', c.concept_type, c.description, NULL
FROM ontology_concepts c
UNION ALL
SELECT
  'passage', p.id, COALESCE(p.source_ref,'Source passage'), '', p.passage_role, p.retrieval_text, NULL
FROM ontology_source_passages p
UNION ALL
SELECT
  'experiment', e.id, e.title, COALESCE(e.date_label,''), e.experiment_type, e.description, NULL
FROM pedagogical_experiments e;
