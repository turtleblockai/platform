-- Turtle Terraria + exhaustive research tagging v0.1
-- Adds a new research-observation layer without altering the immutable dissertation source layer.
-- The seven authored CTC domains remain established; additional domains may emerge only as
-- explicitly provisional candidates backed by observations.

PRAGMA foreign_keys = ON;

-- -----------------------------------------------------------------------------
-- UNIVERSAL RESEARCH OBJECT REGISTRY
-- -----------------------------------------------------------------------------
-- Anything we may later want to mine should be registerable here. Private source text does
-- not need to be duplicated: source_table/source_id can point to the canonical record.
CREATE TABLE IF NOT EXISTS research_objects (
  id TEXT PRIMARY KEY,
  object_type TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  source_table TEXT,
  source_id TEXT,
  repo_path TEXT,
  source_uri TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  privacy_class TEXT NOT NULL DEFAULT 'internal' CHECK (privacy_class IN ('private','internal','unlisted','public')),
  evidence_class TEXT NOT NULL DEFAULT 'system_record' CHECK (evidence_class IN ('human_interaction','human_authored','synthetic_self_play','system_record','world_observation','external_source','mixed')),
  provenance_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(source_table, source_id)
);

CREATE INDEX IF NOT EXISTS idx_research_objects_type ON research_objects(object_type, created_at);
CREATE INDEX IF NOT EXISTS idx_research_objects_evidence ON research_objects(evidence_class, created_at);
CREATE INDEX IF NOT EXISTS idx_research_objects_repo ON research_objects(repo_path);

-- Links any research object to the existing Sanders ontology without modifying the ontology item.
CREATE TABLE IF NOT EXISTS research_object_ontology_tags (
  id TEXT PRIMARY KEY,
  object_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  tag_role TEXT NOT NULL DEFAULT 'relevant' CHECK (tag_role IN ('primary','relevant','supports','counters','questions','operationalizes','extends','contradicts','tests','other')),
  confidence REAL,
  tagging_method TEXT NOT NULL CHECK (tagging_method IN ('human','rule','model','imported','mixed')),
  actor_type TEXT NOT NULL DEFAULT 'system' CHECK (actor_type IN ('human','turtle','synthetic_turtle','system','researcher')),
  rationale TEXT,
  evidence_text TEXT,
  status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('proposed','accepted','rejected')),
  created_at TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(object_id, concept_id, tag_role, tagging_method),
  FOREIGN KEY (object_id) REFERENCES research_objects(id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES ontology_concepts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_object_ontology_tags_object ON research_object_ontology_tags(object_id, status);
CREATE INDEX IF NOT EXISTS idx_object_ontology_tags_concept ON research_object_ontology_tags(concept_id, status);

-- Free / emergent tags provide room for language that does not yet belong in the ontology.
CREATE TABLE IF NOT EXISTS research_tags (
  id TEXT PRIMARY KEY,
  tag_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  tag_type TEXT NOT NULL DEFAULT 'emergent' CHECK (tag_type IN ('emergent','topic','method','artifact','actor','question','value','risk','environment','other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'provisional' CHECK (status IN ('provisional','active','promoted','deprecated')),
  promoted_concept_id TEXT,
  created_at TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (promoted_concept_id) REFERENCES ontology_concepts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS research_object_tags (
  object_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  tag_role TEXT NOT NULL DEFAULT 'relevant',
  confidence REAL,
  tagging_method TEXT NOT NULL CHECK (tagging_method IN ('human','rule','model','imported','mixed')),
  actor_type TEXT NOT NULL DEFAULT 'system',
  rationale TEXT,
  created_at TEXT NOT NULL,
  PRIMARY KEY (object_id, tag_id, tag_role, tagging_method),
  FOREIGN KEY (object_id) REFERENCES research_objects(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES research_tags(id) ON DELETE CASCADE
);

-- Object-to-object relationships let build notes, runs, questions, code changes, WorldSpecs,
-- publications, and observations form a queryable graph.
CREATE TABLE IF NOT EXISTS research_object_relationships (
  id TEXT PRIMARY KEY,
  subject_object_id TEXT NOT NULL,
  predicate TEXT NOT NULL,
  object_object_id TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(subject_object_id, predicate, object_object_id),
  FOREIGN KEY (subject_object_id) REFERENCES research_objects(id) ON DELETE CASCADE,
  FOREIGN KEY (object_object_id) REFERENCES research_objects(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- CTC DOMAINS: SEVEN ESTABLISHED + OPEN SPACE FOR UNKNOWN DOMAINS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ctc_domains (
  id TEXT PRIMARY KEY,
  ordinal INTEGER,
  label TEXT NOT NULL UNIQUE,
  domain_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('established','provisional','retired')),
  source_tool_step_id TEXT,
  description TEXT,
  created_at TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (source_tool_step_id) REFERENCES ontology_tool_steps(id) ON DELETE SET NULL
);

INSERT OR IGNORE INTO ctc_domains (id,ordinal,label,domain_key,status,source_tool_step_id,created_at,provenance_json) VALUES
('ctc-domain-01',1,'Personal Inquiry','personal_inquiry','established','ctc-step-01','2026-09-08T20:00:00Z','{"source":"Sanders authored CTC Tenet-Question-Action framework"}'),
('ctc-domain-02',2,'Compelling Problem or Question','compelling_problem_or_question','established','ctc-step-02','2026-09-08T20:00:00Z','{"source":"Sanders authored CTC Tenet-Question-Action framework"}'),
('ctc-domain-03',3,'Technology as Tool to Think With','technology_as_tool_to_think_with','established','ctc-step-03','2026-09-08T20:00:00Z','{"source":"Sanders authored CTC Tenet-Question-Action framework"}'),
('ctc-domain-04',4,'Formative Demonstration of Learning','formative_demonstration_of_learning','established','ctc-step-04','2026-09-08T20:00:00Z','{"source":"Sanders authored CTC Tenet-Question-Action framework"}'),
('ctc-domain-05',5,'Reflection as Learning','reflection_as_learning','established','ctc-step-05','2026-09-08T20:00:00Z','{"source":"Sanders authored CTC Tenet-Question-Action framework"}'),
('ctc-domain-06',6,'Social and Cultural Critique','social_and_cultural_critique','established','ctc-step-06','2026-09-08T20:00:00Z','{"source":"Sanders authored CTC Tenet-Question-Action framework"}'),
('ctc-domain-07',7,'Sharing and Collaborating','sharing_and_collaborating','established','ctc-step-07','2026-09-08T20:00:00Z','{"source":"Sanders authored CTC Tenet-Question-Action framework"}');

CREATE TABLE IF NOT EXISTS research_object_ctc_tags (
  id TEXT PRIMARY KEY,
  object_id TEXT NOT NULL,
  domain_id TEXT NOT NULL,
  tag_role TEXT NOT NULL DEFAULT 'evidence' CHECK (tag_role IN ('primary','evidence','supports','counters','questions','tests','emergent_edge','other')),
  confidence REAL,
  tagging_method TEXT NOT NULL CHECK (tagging_method IN ('human','rule','model','imported','mixed')),
  actor_type TEXT NOT NULL DEFAULT 'system',
  rationale TEXT,
  evidence_text TEXT,
  status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('proposed','accepted','rejected')),
  created_at TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(object_id, domain_id, tag_role, tagging_method),
  FOREIGN KEY (object_id) REFERENCES research_objects(id) ON DELETE CASCADE,
  FOREIGN KEY (domain_id) REFERENCES ctc_domains(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_object_ctc_tags_object ON research_object_ctc_tags(object_id, status);
CREATE INDEX IF NOT EXISTS idx_object_ctc_tags_domain ON research_object_ctc_tags(domain_id, status);

-- Do not invent an eighth domain merely because current evidence does not fit cleanly.
-- Store the mismatch first. Candidate domains can be proposed later and promoted only by an
-- explicit human scholarly decision.
CREATE TABLE IF NOT EXISTS ctc_candidate_domains (
  id TEXT PRIMARY KEY,
  proposed_label TEXT,
  candidate_key TEXT,
  description TEXT,
  proposed_by_actor TEXT NOT NULL CHECK (proposed_by_actor IN ('human','turtle','synthetic_turtle','system','researcher')),
  status TEXT NOT NULL DEFAULT 'observing' CHECK (status IN ('observing','candidate','promoted','rejected','merged')),
  promoted_domain_id TEXT,
  created_at TEXT NOT NULL,
  decided_at TEXT,
  decision_notes TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (promoted_domain_id) REFERENCES ctc_domains(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ctc_uncaptured_observations (
  id TEXT PRIMARY KEY,
  object_id TEXT NOT NULL,
  observation_text TEXT NOT NULL,
  reason_unmapped TEXT,
  observer_actor_type TEXT NOT NULL CHECK (observer_actor_type IN ('human','turtle','synthetic_turtle','system','researcher')),
  candidate_domain_id TEXT,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','linked','resolved','dismissed')),
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (object_id) REFERENCES research_objects(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_domain_id) REFERENCES ctc_candidate_domains(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- TURTLE TERRARIA
-- -----------------------------------------------------------------------------
INSERT OR IGNORE INTO ontology_sources
(id,ontology_version_id,source_type,title,author,publication_year,canonical_citation,url,provenance_json) VALUES
('src-sanders-2026-turtle-terraria','sanders-ontology-v0.1','operational','Turtle Terraria','Bryan P. Sanders',2026,'Sanders, B. P. (2026). Turtle Terraria. TurtleBlock AI research-development environment.',NULL,'{"role":"current_research_environment","source_layer":"operational_turtle","status":"emerging"}');

INSERT OR IGNORE INTO ontology_concepts
(id,ontology_version_id,canonical_label,concept_key,layer,concept_type,source_id,source_ref,source_exact,description,status,provenance_json) VALUES
('concept-turtle-terraria','sanders-ontology-v0.1','Turtle Terraria','turtle_terraria','operational_turtle','research_environment','src-sanders-2026-turtle-terraria','TurtleBlock AI research-development, 2026',0,'An umbrella of bounded habitats for studying what emerges when people and computational agents cohabit, construct, question, reflect, and revise.','active','{"later_sanders_concept":true,"research_development":true}'),
('concept-cohabitation-provenance','sanders-ontology-v0.1','Cohabitation Without Provenance Collapse','cohabitation_without_provenance_collapse','operational_turtle','provenance_principle','src-sanders-2026-turtle-terraria','Turtle Terraria design principle',0,'Human, machine, synthetic, world, and scholarly contributions may cohabit a research environment while remaining explicitly distinguishable by origin.','active','{"later_sanders_concept":true,"research_development":true}'),
('concept-synthetic-recursive-dialogue','sanders-ontology-v0.1','Synthetic Recursive Dialogue','synthetic_recursive_dialogue','operational_turtle','research_method','src-sanders-2026-turtle-terraria','Recursive Terrarium design',0,'Machine-to-machine self-play used to test interpretations, assumptions, representations, Charter behavior, and ontology coverage; never treated as evidence of human learning.','active','{"later_sanders_concept":true,"research_development":true,"human_evidence":false}');

INSERT OR IGNORE INTO ontology_relationships
(id,ontology_version_id,subject_concept_id,predicate,object_concept_id,relationship_layer,status,source_id,notes,provenance_json) VALUES
('rel-terraria-coactive','sanders-ontology-v0.1','concept-turtle-terraria','operationalizes','concept-coactive-emergence','later_interpretation','active','src-sanders-2026-turtle-terraria','Terraria provides bounded environments in which co-active emergence can be observed and represented.','{"research_development":true}'),
('rel-terraria-recursion','sanders-ontology-v0.1','concept-turtle-terraria','extends','concept-recursive-learning-loop','later_interpretation','active','src-sanders-2026-turtle-terraria','Terraria makes recursive cycles first-class research units.','{"research_development":true}'),
('rel-terraria-pce','sanders-ontology-v0.1','concept-turtle-terraria','extends','concept-persistent-computing-environment','later_interpretation','active','src-sanders-2026-turtle-terraria','Each habitat is a bounded persistent computing environment with its own actors and evidence rules.','{"research_development":true}'),
('rel-terraria-provenance','sanders-ontology-v0.1','concept-cohabitation-provenance','extends','concept-provenance-aware-retrieval','later_interpretation','active','src-sanders-2026-turtle-terraria','Cohabitation requires origin and evidence class to remain queryable.','{"research_development":true}');

INSERT OR IGNORE INTO pedagogical_experiments
(id,ontology_version_id,experiment_key,title,start_year,end_year,date_label,date_precision,experiment_type,description,disciplines_json,technologies_json,learner_actions_json,representation_type,social_structure,recursive_cycle_json,evidence_status,status,provenance_json) VALUES
('exp-turtle-terraria','sanders-ontology-v0.1','turtle_terraria','Turtle Terraria',2026,NULL,'2026-present','range','persistent_research_environment','Umbrella research environment containing multiple habitats for human-machine co-active inquiry and explicitly synthetic machine-to-machine recursive self-play.','["educational_research","AI","constructionism","critical_techno_constructivism"]','["TurtleBlock AI","WorldSpec","D1","LLMs","Minecraft"]','["inquire","construct","question","observe","reflect","revise","tag","compare"]','provenance_aware_recursive_trace','multiple_habitats','["participant_input","interpretation","artifact","observation","reflection","revision","new_question"]','author_reported','active','{"source":"Bryan Sanders + TurtleBlock AI research-development conversation 2026-09-08","human_evidence_and_synthetic_evidence_separated":true}');

INSERT OR IGNORE INTO pedagogical_experiment_sources (experiment_id,source_id,relationship_type,source_ref,notes) VALUES
('exp-turtle-terraria','src-sanders-2026-turtle-terraria','documents','Turtle Terraria','Current research-development articulation.');

INSERT OR IGNORE INTO pedagogical_experiment_concepts (experiment_id,concept_id,mapping_type,relationship_layer,notes,provenance_json) VALUES
('exp-turtle-terraria','concept-turtle-terraria','instantiates','later_interpretation','Umbrella research environment.','{"current_mapping":true}'),
('exp-turtle-terraria','concept-coactive-emergence','studies','later_interpretation','Human + Turtle habitat directly studies co-active emergence.','{"current_mapping":true}'),
('exp-turtle-terraria','concept-synthetic-recursive-dialogue','tests','later_interpretation','Recursive habitat uses explicitly synthetic self-play.','{"human_evidence":false}'),
('exp-turtle-terraria','concept-cohabitation-provenance','operationalizes','later_interpretation','All habitats preserve participant and evidence provenance.','{"current_mapping":true}');

CREATE TABLE IF NOT EXISTS terraria_habitats (
  id TEXT PRIMARY KEY,
  habitat_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  actor_configuration_json TEXT NOT NULL,
  human_evidence_allowed INTEGER NOT NULL DEFAULT 0 CHECK (human_evidence_allowed IN (0,1)),
  synthetic_by_definition INTEGER NOT NULL DEFAULT 0 CHECK (synthetic_by_definition IN (0,1)),
  status TEXT NOT NULL DEFAULT 'experimental' CHECK (status IN ('proposed','experimental','active','paused','archived')),
  created_at TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}'
);

INSERT OR IGNORE INTO terraria_habitats
(id,habitat_key,name,description,actor_configuration_json,human_evidence_allowed,synthetic_by_definition,status,created_at,provenance_json) VALUES
('habitat-human-turtle','human_turtle','Human + Turtle Terrarium','A human drives inquiry while Turtle contributes interpretations, questions, alternatives, technical assistance, and construction. Human intention, correction, reflection, and judgment remain primary human evidence.','{"actors":["human","turtle","world","system"],"driver":"human"}',1,0,'active','2026-09-08T20:00:00Z','{"ctc_grounded":true,"co_active_emergence":true}'),
('habitat-recursive-turtle','recursive_turtle','Recursive Turtle Terrarium','Synthetic Turtle roles recursively construct, critique, test, and revise interpretations and representations. All traces are synthetic and cannot be counted as learner evidence.','{"actors":["synthetic_builder_turtle","synthetic_reflector_turtle","system"],"driver":"bounded_self_play"}',0,1,'experimental','2026-09-08T20:00:00Z','{"ctc_grounded":true,"synthetic_only":true,"production_authority":"none"}');

CREATE TABLE IF NOT EXISTS terraria_runs (
  id TEXT PRIMARY KEY,
  habitat_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','completed','failed','abandoned','archived')),
  session_id TEXT,
  worldspec_id TEXT,
  title TEXT,
  initiating_question TEXT,
  evidence_class TEXT NOT NULL CHECK (evidence_class IN ('human_interaction','synthetic_self_play','mixed','system_record')),
  privacy_class TEXT NOT NULL DEFAULT 'private' CHECK (privacy_class IN ('private','internal','unlisted','public')),
  model_config_json TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (habitat_id) REFERENCES terraria_habitats(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS terraria_participants (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  participant_key TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('human','turtle','synthetic_builder_turtle','synthetic_reflector_turtle','world','system','researcher')),
  model_name TEXT,
  configuration_json TEXT,
  human_evidence INTEGER NOT NULL DEFAULT 0 CHECK (human_evidence IN (0,1)),
  provenance_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(run_id, participant_key),
  FOREIGN KEY (run_id) REFERENCES terraria_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS terraria_events (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  sequence_number INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('human','turtle','synthetic_builder_turtle','synthetic_reflector_turtle','world','system','researcher')),
  event_type TEXT NOT NULL,
  parent_event_id TEXT,
  text_content TEXT,
  payload_json TEXT,
  evidence_class TEXT NOT NULL CHECK (evidence_class IN ('human_interaction','synthetic_self_play','system_record','world_observation','mixed')),
  provenance_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(run_id, sequence_number),
  FOREIGN KEY (run_id) REFERENCES terraria_runs(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_event_id) REFERENCES terraria_events(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS terraria_artifacts (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  artifact_type TEXT NOT NULL,
  title TEXT,
  locator TEXT,
  repo_path TEXT,
  content_sha TEXT,
  source_event_id TEXT,
  privacy_class TEXT NOT NULL DEFAULT 'private' CHECK (privacy_class IN ('private','internal','unlisted','public')),
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (run_id) REFERENCES terraria_runs(id) ON DELETE CASCADE,
  FOREIGN KEY (source_event_id) REFERENCES terraria_events(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS terraria_observations (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  event_id TEXT,
  created_at TEXT NOT NULL,
  observer_actor_type TEXT NOT NULL CHECK (observer_actor_type IN ('human','turtle','synthetic_turtle','system','researcher')),
  observation_type TEXT NOT NULL,
  observation_text TEXT NOT NULL,
  confidence REAL,
  payload_json TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (run_id) REFERENCES terraria_runs(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES terraria_events(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_terraria_runs_habitat ON terraria_runs(habitat_id, started_at);
CREATE INDEX IF NOT EXISTS idx_terraria_events_run ON terraria_events(run_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_terraria_artifacts_run ON terraria_artifacts(run_id, created_at);
CREATE INDEX IF NOT EXISTS idx_terraria_observations_run ON terraria_observations(run_id, created_at);

-- -----------------------------------------------------------------------------
-- AUTO-BUILD AS RESEARCH DATA
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS autobuild_runs (
  id TEXT PRIMARY KEY,
  run_date TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'scheduled' CHECK (trigger_type IN ('scheduled','manual','replay')),
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','completed','failed','no_change')),
  version_before TEXT,
  version_after TEXT,
  selected_contribution TEXT,
  human_review_state TEXT NOT NULL DEFAULT 'not_reviewed' CHECK (human_review_state IN ('not_reviewed','reviewed','accepted','modified','rejected')),
  detailed_note_path TEXT,
  public_log_entry_id TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS autobuild_events (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  sequence_number INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('source_signal','ontology_mapping','question','candidate','rejection','selection','implementation','test','version_judgment','public_note','human_override','other')),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('automation','human','turtle','system','external_source')),
  title TEXT,
  content TEXT,
  source_url TEXT,
  external_date TEXT,
  payload_json TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  UNIQUE(run_id, sequence_number),
  FOREIGN KEY (run_id) REFERENCES autobuild_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS autobuild_repo_changes (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  repo_path TEXT NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('create','update','delete','rename','test_only','documentation','other')),
  commit_sha TEXT,
  summary TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (run_id) REFERENCES autobuild_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS autobuild_tests (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  test_name TEXT NOT NULL,
  test_command TEXT,
  status TEXT NOT NULL CHECK (status IN ('passed','failed','not_run','manual_check')),
  result_text TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (run_id) REFERENCES autobuild_runs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_autobuild_runs_date ON autobuild_runs(run_date, status);
CREATE INDEX IF NOT EXISTS idx_autobuild_events_run ON autobuild_events(run_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_autobuild_changes_run ON autobuild_repo_changes(run_id, created_at);
CREATE INDEX IF NOT EXISTS idx_autobuild_tests_run ON autobuild_tests(run_id, created_at);

-- -----------------------------------------------------------------------------
-- AUTOMATIC REGISTRATION OF RESEARCHABLE THINGS
-- -----------------------------------------------------------------------------
-- We register metadata references, not duplicate private learner text.
CREATE TRIGGER IF NOT EXISTS trg_register_turtle_session
AFTER INSERT ON turtle_sessions BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,source_table,source_id,created_at,updated_at,privacy_class,evidence_class,provenance_json)
  VALUES ('turtle_session:'||NEW.id,'turtle_session',COALESCE(NEW.title,'Turtle session'),'turtle_sessions',NEW.id,NEW.created_at,NEW.updated_at,NEW.visibility,'human_interaction','{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_turtle_turn
AFTER INSERT ON turtle_turns BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('turtle_turn:'||NEW.id,'turtle_turn','Turtle turn ('||NEW.actor||')','turtle_turns',NEW.id,NEW.created_at,'private',CASE WHEN NEW.actor='learner' THEN 'human_interaction' ELSE 'system_record' END,'{"automatic_registration":true,"raw_text_not_duplicated":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_worldspec_revision
AFTER INSERT ON worldspec_revisions BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('worldspec_revision:'||NEW.id,'worldspec_revision','WorldSpec revision '||NEW.revision_number,'worldspec_revisions',NEW.id,NEW.created_at,'private','mixed','{"automatic_registration":true,"payload_not_duplicated":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_playground_submission
AFTER INSERT ON playground_submissions BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('playground_submission:'||NEW.id,'playground_submission','Playground submission','playground_submissions',NEW.id,NEW.created_at,'private','human_interaction','{"automatic_registration":true,"raw_text_not_duplicated":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_turtle_publication
AFTER INSERT ON turtle_publications BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,created_at,updated_at,privacy_class,evidence_class,provenance_json)
  VALUES ('turtle_publication:'||NEW.id,'turtle_publication',NEW.title,NEW.summary,'turtle_publications',NEW.id,NEW.created_at,NEW.updated_at,CASE WHEN NEW.status='published' THEN 'public' ELSE 'internal' END,'human_authored','{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_terraria_run
AFTER INSERT ON terraria_runs BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,created_at,updated_at,privacy_class,evidence_class,provenance_json)
  VALUES ('terraria_run:'||NEW.id,'terraria_run',COALESCE(NEW.title,'Terraria run'),NEW.initiating_question,'terraria_runs',NEW.id,NEW.started_at,NEW.ended_at,NEW.privacy_class,NEW.evidence_class,'{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_terraria_event
AFTER INSERT ON terraria_events BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('terraria_event:'||NEW.id,'terraria_event','Terraria event: '||NEW.event_type,'terraria_events',NEW.id,NEW.created_at,'private',NEW.evidence_class,'{"automatic_registration":true,"text_not_duplicated":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_terraria_artifact
AFTER INSERT ON terraria_artifacts BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,source_table,source_id,repo_path,source_uri,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('terraria_artifact:'||NEW.id,'terraria_artifact',COALESCE(NEW.title,NEW.artifact_type),'terraria_artifacts',NEW.id,NEW.repo_path,NEW.locator,NEW.created_at,NEW.privacy_class,'mixed','{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_terraria_observation
AFTER INSERT ON terraria_observations BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('terraria_observation:'||NEW.id,'terraria_observation','Terraria observation: '||NEW.observation_type,NEW.observation_text,'terraria_observations',NEW.id,NEW.created_at,'internal',CASE WHEN NEW.observer_actor_type='synthetic_turtle' THEN 'synthetic_self_play' ELSE 'system_record' END,'{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_autobuild_run
AFTER INSERT ON autobuild_runs BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,repo_path,created_at,updated_at,privacy_class,evidence_class,provenance_json)
  VALUES ('autobuild_run:'||NEW.id,'autobuild_run','Auto-build '||NEW.run_date,NEW.selected_contribution,'autobuild_runs',NEW.id,NEW.detailed_note_path,NEW.started_at,NEW.completed_at,'public','system_record','{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_autobuild_event
AFTER INSERT ON autobuild_events BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,source_uri,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('autobuild_event:'||NEW.id,'autobuild_event',COALESCE(NEW.title,'Auto-build event: '||NEW.event_type),NEW.content,'autobuild_events',NEW.id,NEW.source_url,NEW.created_at,'public',CASE WHEN NEW.actor_type='external_source' THEN 'external_source' ELSE 'system_record' END,'{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_autobuild_change
AFTER INSERT ON autobuild_repo_changes BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,repo_path,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('autobuild_change:'||NEW.id,'repo_change','Repository change: '||NEW.repo_path,NEW.summary,'autobuild_repo_changes',NEW.id,NEW.repo_path,NEW.created_at,'public','system_record','{"automatic_registration":true}');
END;

CREATE TRIGGER IF NOT EXISTS trg_register_autobuild_test
AFTER INSERT ON autobuild_tests BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
  VALUES ('autobuild_test:'||NEW.id,'test',NEW.test_name,NEW.result_text,'autobuild_tests',NEW.id,NEW.created_at,'public','system_record','{"automatic_registration":true}');
END;

-- Backfill current operational records into the universal registry without copying private payloads.
INSERT OR IGNORE INTO research_objects (id,object_type,title,source_table,source_id,created_at,updated_at,privacy_class,evidence_class,provenance_json)
SELECT 'turtle_session:'||id,'turtle_session',COALESCE(title,'Turtle session'),'turtle_sessions',id,created_at,updated_at,visibility,'human_interaction','{"backfill":true}' FROM turtle_sessions;

INSERT OR IGNORE INTO research_objects (id,object_type,title,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
SELECT 'turtle_turn:'||id,'turtle_turn','Turtle turn ('||actor||')','turtle_turns',id,created_at,'private',CASE WHEN actor='learner' THEN 'human_interaction' ELSE 'system_record' END,'{"backfill":true,"raw_text_not_duplicated":true}' FROM turtle_turns;

INSERT OR IGNORE INTO research_objects (id,object_type,title,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
SELECT 'worldspec_revision:'||id,'worldspec_revision','WorldSpec revision '||revision_number,'worldspec_revisions',id,created_at,'private','mixed','{"backfill":true,"payload_not_duplicated":true}' FROM worldspec_revisions;

INSERT OR IGNORE INTO research_objects (id,object_type,title,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
SELECT 'playground_submission:'||id,'playground_submission','Playground submission','playground_submissions',id,created_at,'private','human_interaction','{"backfill":true,"raw_text_not_duplicated":true}' FROM playground_submissions;

INSERT OR IGNORE INTO research_objects (id,object_type,title,summary,source_table,source_id,created_at,updated_at,privacy_class,evidence_class,provenance_json)
SELECT 'turtle_publication:'||id,'turtle_publication',title,summary,'turtle_publications',id,created_at,updated_at,CASE WHEN status='published' THEN 'public' ELSE 'internal' END,'human_authored','{"backfill":true}' FROM turtle_publications;

-- Seed the current auto-build program as a first-class research object.
INSERT OR IGNORE INTO autobuild_runs
(id,run_date,started_at,completed_at,trigger_type,status,version_before,version_after,selected_contribution,human_review_state,detailed_note_path,public_log_entry_id,provenance_json) VALUES
('autobuild-2026-09-08','2026-09-08','2026-09-08T18:37:20Z','2026-09-08T20:00:00Z','manual','completed','0.1.0','0.1.0','Activate daily co-active build loop, newest-first public Build Log, and select Co-Active Trace as the next learner-facing experiment.','reviewed','research/daily-build/2026-09-08.md','2026-09-08-daily-coactive-loop','{"seeded_from_repository_record":true,"version_bump":false}');

-- -----------------------------------------------------------------------------
-- COVERAGE / AUDIT VIEWS
-- -----------------------------------------------------------------------------
CREATE VIEW IF NOT EXISTS research_tag_coverage AS
SELECT
  o.id AS object_id,
  o.object_type,
  o.title,
  o.created_at,
  o.evidence_class,
  (SELECT COUNT(*) FROM research_object_ontology_tags t WHERE t.object_id=o.id AND t.status='accepted') AS ontology_tag_count,
  (SELECT COUNT(*) FROM research_object_ctc_tags t WHERE t.object_id=o.id AND t.status='accepted') AS ctc_tag_count,
  (SELECT COUNT(*) FROM research_object_tags t WHERE t.object_id=o.id) AS emergent_tag_count,
  (SELECT COUNT(*) FROM ctc_uncaptured_observations u WHERE u.object_id=o.id AND u.status='open') AS open_unmapped_observation_count
FROM research_objects o;

CREATE VIEW IF NOT EXISTS research_objects_needing_tags AS
SELECT * FROM research_tag_coverage
WHERE ontology_tag_count=0 OR ctc_tag_count=0;

CREATE VIEW IF NOT EXISTS ctc_open_unknowns AS
SELECT
  u.id AS observation_id,
  u.object_id,
  o.object_type,
  o.title,
  u.observation_text,
  u.reason_unmapped,
  u.observer_actor_type,
  u.candidate_domain_id,
  c.proposed_label AS candidate_label,
  u.created_at
FROM ctc_uncaptured_observations u
JOIN research_objects o ON o.id=u.object_id
LEFT JOIN ctc_candidate_domains c ON c.id=u.candidate_domain_id
WHERE u.status='open';

CREATE VIEW IF NOT EXISTS terraria_trace_catalog AS
SELECT
  r.id AS run_id,
  h.habitat_key,
  h.name AS habitat_name,
  r.started_at,
  r.ended_at,
  r.status,
  r.evidence_class,
  r.privacy_class,
  COUNT(DISTINCT e.id) AS event_count,
  COUNT(DISTINCT a.id) AS artifact_count,
  COUNT(DISTINCT ob.id) AS observation_count
FROM terraria_runs r
JOIN terraria_habitats h ON h.id=r.habitat_id
LEFT JOIN terraria_events e ON e.run_id=r.id
LEFT JOIN terraria_artifacts a ON a.run_id=r.id
LEFT JOIN terraria_observations ob ON ob.run_id=r.id
GROUP BY r.id,h.habitat_key,h.name,r.started_at,r.ended_at,r.status,r.evidence_class,r.privacy_class;

CREATE VIEW IF NOT EXISTS autobuild_trace_catalog AS
SELECT
  r.id AS run_id,
  r.run_date,
  r.status,
  r.version_before,
  r.version_after,
  r.selected_contribution,
  r.human_review_state,
  r.detailed_note_path,
  COUNT(DISTINCT e.id) AS event_count,
  COUNT(DISTINCT c.id) AS change_count,
  COUNT(DISTINCT t.id) AS test_count
FROM autobuild_runs r
LEFT JOIN autobuild_events e ON e.run_id=r.id
LEFT JOIN autobuild_repo_changes c ON c.run_id=r.id
LEFT JOIN autobuild_tests t ON t.run_id=r.id
GROUP BY r.id,r.run_date,r.status,r.version_before,r.version_after,r.selected_contribution,r.human_review_state,r.detailed_note_path;
