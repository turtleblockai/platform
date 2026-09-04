-- Dr. Bryan P. Sanders TurtleBlock AI research ontology v0.3
-- Adds first-class pedagogical/research experiments and broadens the authored source registry.
-- Historical experiments are preserved with evidence status and date precision so later
-- conceptual mappings do not masquerade as terminology used at the time.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pedagogical_experiments (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  experiment_key TEXT NOT NULL,
  title TEXT NOT NULL,
  start_year INTEGER,
  end_year INTEGER,
  date_label TEXT,
  date_precision TEXT NOT NULL DEFAULT 'approximate' CHECK (date_precision IN ('exact','year','range','approximate','unknown')),
  experiment_type TEXT NOT NULL,
  description TEXT NOT NULL,
  disciplines_json TEXT,
  technologies_json TEXT,
  learner_actions_json TEXT,
  representation_type TEXT,
  social_structure TEXT,
  recursive_cycle_json TEXT,
  evidence_status TEXT NOT NULL DEFAULT 'documented' CHECK (evidence_status IN ('documented','author_reported','partially_documented','source_needed')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','provisional','archived')),
  provenance_json TEXT NOT NULL,
  UNIQUE(ontology_version_id, experiment_key),
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedagogical_experiment_sources (
  experiment_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'documents',
  source_ref TEXT,
  notes TEXT,
  PRIMARY KEY (experiment_id, source_id, relationship_type),
  FOREIGN KEY (experiment_id) REFERENCES pedagogical_experiments(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedagogical_experiment_concepts (
  experiment_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  mapping_type TEXT NOT NULL DEFAULT 'retrospective_mapping',
  relationship_layer TEXT NOT NULL DEFAULT 'later_interpretation' CHECK (relationship_layer IN ('source','later_interpretation')),
  notes TEXT,
  provenance_json TEXT,
  PRIMARY KEY (experiment_id, concept_id, mapping_type),
  FOREIGN KEY (experiment_id) REFERENCES pedagogical_experiments(id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES ontology_concepts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pedagogical_experiments_years ON pedagogical_experiments(start_year, end_year);
CREATE INDEX IF NOT EXISTS idx_pedagogical_experiments_type ON pedagogical_experiments(experiment_type, evidence_status);
CREATE INDEX IF NOT EXISTS idx_pedagogical_experiment_sources_source ON pedagogical_experiment_sources(source_id);
CREATE INDEX IF NOT EXISTS idx_pedagogical_experiment_concepts_concept ON pedagogical_experiment_concepts(concept_id, mapping_type);

-- Broaden the authored source registry. Existing 0003/0004 rows are preserved by INSERT OR IGNORE.
INSERT OR IGNORE INTO ontology_sources
(id,ontology_version_id,source_type,title,author,publication_year,canonical_citation,url,provenance_json) VALUES
('src-sanders-2017-vle','sanders-ontology-v0.1','other','Virtual Learning Environments','Bryan P. Sanders',2017,'Sanders, B. P. (2017). Virtual Learning Environments. Authored research-development artifact.',NULL,'{"role":"research_development_lineage","source_layer":"later_sanders_work","artifact_status":"author_source"}'),
('src-sanders-2019-dissertation-presentation','sanders-ontology-v0.1','other','Critical Techno Constructivism / Dissertation Presentation','Bryan P. Sanders',2019,'Sanders, B. P. (2019). Dissertation presentation on Critical Techno Constructivism.',NULL,'{"role":"doctoral_research_presentation","source_layer":"later_sanders_work","artifact_status":"author_source"}'),
('src-sanders-2020-aect-ctc','sanders-ontology-v0.1','other','Critical Techno Constructivism','Bryan P. Sanders',2020,'Sanders, B. P. (2020). Critical Techno Constructivism. AECT research/presentation artifact.',NULL,'{"role":"conference_research_lineage","source_layer":"later_sanders_work","artifact_status":"author_source"}'),
('src-sanders-2023-logo-aect','sanders-ontology-v0.1','other','Logo / Constructionist Computing AECT Proposal','Bryan P. Sanders',2023,'Sanders, B. P. (2023). Logo / constructionist computing proposal for AECT.',NULL,'{"role":"conference_proposal","source_layer":"later_sanders_work","artifact_status":"author_source"}'),
('src-sanders-2023-gpt-builder','sanders-ontology-v0.1','operational','Early Custom GPT and GPT-Building-GPT Experiments','Bryan P. Sanders',2023,'Sanders, B. P. (2023-2024). Early custom GPT design experiments and GPT-building-GPT research-development notes.',NULL,'{"role":"agent_design_experiment","source_layer":"research_development","evidence":"author_project_history"}'),
('src-sanders-2024-gpt-design-database','sanders-ontology-v0.1','operational','Structured GPT Design Database','Bryan P. Sanders',2024,'Sanders, B. P. (2024). Structured database experiments representing the how of GPT design as tables, rows, fields, constraints, examples, and relationships.',NULL,'{"role":"agent_design_as_structured_data","source_layer":"research_development","evidence":"author_project_history"}'),
('src-sanders-2024-ingestion-systems','sanders-ontology-v0.1','operational','Public Document Ingestion and Research Database Systems','Bryan P. Sanders',2024,'Sanders, B. P. (2024-2026). Public-document ingestion, normalization, entity, relationship, timeline, provenance, and retrieval systems.',NULL,'{"role":"persistent_research_systems","source_layer":"research_development","evidence":"author_project_history"}'),
('src-sanders-2026-sunshine-machine','sanders-ontology-v0.1','operational','Sunshine Machine','Bryan P. Sanders',2026,'Sanders, B. P. (2026). Sunshine Machine: persistent computing environment research-development model.',NULL,'{"role":"persistent_computing_environment","source_layer":"research_development","principle":"No prompting. Just participation."}'),
('src-sanders-2022-reeducation','sanders-ontology-v0.1','operational','RE/EDUCATION Focused Research and Practice Environment','Bryan P. Sanders',2022,'Sanders, B. P. (2022-present). RE/EDUCATION educational practice and research-development environment.','https://reeducationllc.com','{"role":"focused_practice_environment","source_layer":"research_development"}'),
('src-sanders-2026-turtleblock','sanders-ontology-v0.1','operational','TurtleBlock AI','Bryan P. Sanders',2026,'Sanders, B. P. (2026). TurtleBlock AI research and development platform.','https://turtleblockai.com','{"role":"current_implementation","source_layer":"operational_turtle"}'),
('src-sanders-create-boldly-candidate','sanders-ontology-v0.1','other','Create Boldly / California Teachers Summit artifact — source to be recovered','Bryan P. Sanders',NULL,NULL,NULL,'{"role":"source_candidate","source_layer":"career_lineage","status":"source_needed","note":"Exact publication artifact and citation not yet recovered; do not treat as verified publication."}');

-- Later concepts needed to describe the recovered longitudinal work. These are explicit later mappings.
INSERT OR IGNORE INTO ontology_concepts
(id,ontology_version_id,canonical_label,concept_key,layer,concept_type,source_id,source_ref,source_exact,description,status,provenance_json) VALUES
('concept-recursive-learning-loop','sanders-ontology-v0.1','Recursive Learning Loop','recursive_learning_loop','published_lineage','design_principle','src-sanders-2026-turtleblock','TurtleBlock AI longitudinal synthesis',0,'Representation becomes experience; experience becomes reflection; reflection returns to revision and another round of making.','active','{"later_sanders_concept":true,"retrospective_synthesis":true}'),
('concept-agent-design-as-data','sanders-ontology-v0.1','Agent Design as Structured Data','agent_design_as_structured_data','operational_turtle','representation_principle','src-sanders-2024-gpt-design-database','Structured GPT design database',0,'Agent instructions, sources, examples, constraints, categories, and relationships can themselves be represented as inspectable and revisable structured data.','active','{"later_sanders_concept":true,"research_development":true}'),
('concept-persistent-computing-environment','sanders-ontology-v0.1','Persistent Computing Environment','persistent_computing_environment','operational_turtle','environment_principle','src-sanders-2026-sunshine-machine','Sunshine Machine',0,'An intentionally organized environment carries history, structure, provenance, and relationships forward so participation can replace repeated blank-slate prompting.','active','{"later_sanders_concept":true,"research_development":true}'),
('concept-provenance-aware-retrieval','sanders-ontology-v0.1','Provenance-Aware Retrieval','provenance_aware_retrieval','operational_turtle','research_infrastructure_principle','src-sanders-2024-ingestion-systems','Public-document ingestion systems',0,'Retrieved evidence remains distinguishable from machine interpretation, researcher interpretation, learner language, and later revision.','active','{"later_sanders_concept":true,"research_development":true}'),
('concept-prompts-to-environments','sanders-ontology-v0.1','From Prompt Design to Environment Design','from_prompt_design_to_environment_design','operational_turtle','research_development_principle','src-sanders-2026-sunshine-machine','Sunshine Machine / TurtleBlock AI synthesis',0,'The design problem shifts from repeatedly composing prompts to constructing persistent environments in which useful dialogue and inquiry can continue.','active','{"later_sanders_concept":true,"research_development":true}');

-- First-class experiments from the recovered career/research chronology.
INSERT OR IGNORE INTO pedagogical_experiments
(id,ontology_version_id,experiment_key,title,start_year,end_year,date_label,date_precision,experiment_type,description,disciplines_json,technologies_json,learner_actions_json,representation_type,social_structure,recursive_cycle_json,evidence_status,status,provenance_json) VALUES
('exp-1995-music-literature','sanders-ontology-v0.1','music_literature_summer_enrichment','Music + Literature Summer Enrichment',1995,1995,'1995','year','interdisciplinary_teaching','Early interdisciplinary summer enrichment deliberately mixing music and literature as a constructed learning experience.','["music","literature"]','[]','["interpret","compare","combine","create"]','interdisciplinary_mashup','collaborative_classroom','["encounter","interpret","combine","share","reconsider"]','author_reported','provisional','{"source":"author_first_person_account","retroactive_turtleblock_mapping":false}'),
('exp-1995-2022-experimental-classroom','sanders-ontology-v0.1','experimental_classroom','The Experimental Classroom',1995,2022,'1995-2022','range','longitudinal_practice','Broad experimental teaching practice spanning literature, writing, music, databases, web and media production, theater, performance, culture, games, computation, and student-created work.','["literature","writing","music","media","theater","culture","games","computing"]','["databases","web","media_tools","computers"]','["design","produce","interpret","perform","test","reflect","revise","share"]','multiple','collaborative_classroom','["represent","act","observe","reflect","revise"]','partially_documented','active','{"source":"author_career_archive_plus_published_artifacts","retroactive_synthesis":true}'),
('exp-literary-fantasy-database','sanders-ontology-v0.1','literary_character_fantasy_database','Literary-Character Fantasy-League Database and Embodied Play',NULL,NULL,'date to be recovered','unknown','database_simulation','Learners curated literary characters as structured data, developed interpretations and predictions, then moved into physical/embodied play where database predictions, textual understanding, chance, performance, and judgment could interact.','["literature","database_design","performance","games"]','["database"]','["curate","classify","interpret","predict","play","observe","reinterpret"]','structured_character_database','collaborative_simulation','["text","interpretation","database","prediction","embodied_play","observation","reinterpretation"]','author_reported','provisional','{"source":"author_first_person_account","date_status":"needs_recovery","retroactive_turtleblock_mapping":false}'),
('exp-hot-tub-fever','sanders-ontology-v0.1','hot_tub_fever','Hot Tub Fever',2014,2018,'mid-2010s; exact run to be recovered','approximate','recursive_performance','Recurring interdisciplinary theater experiment developed through at least three formal versions, one major large-scale event, and numerous smaller drafts and iterations.','["literature","literary_theory","music","theater","culture","humor","performance"]','["media","performance_technology"]','["write","remix","rehearse","perform","observe","revise"]','performance_and_script','ensemble','["draft","rehearsal","performance","observation","reinterpretation","new_draft"]','partially_documented','active','{"source":"author_first_person_account_plus_2015_public_event_record","date_range":"approximate_pending_archive_review"}'),
('exp-steamhamlet','sanders-ontology-v0.1','steamhamlet','STEAMHAMLET',2016,NULL,'2016-present','range','persistent_learning_environment','Research-development program for a shared multidisciplinary room of possibilities where ideas and informational objects can become visible, manipulable, discussable, and revisable.','["STEAM","literature","arts","computing","design"]','["mixed_reality","computing","shared_displays","conversational_systems"]','["inquire","construct","manipulate","collaborate","reflect","revise"]','shared_computational_environment','collaborative_environment','["idea","representation","interaction","reflection","revision","new_representation"]','documented','active','{"source":"Sanders-authored STEAMHAMLET artifacts and publications"}'),
('exp-minecraft-purposeful-play','sanders-ontology-v0.1','minecraft_purposeful_play','Minecraft as Persistent Learning Environment / Purposeful Play',2021,2022,'2021-2022 published lineage','range','constructionist_world','Minecraft-centered inquiry in which learners build, inhabit, encounter consequences, ask questions, collaborate, and change the story rather than consume a predetermined worksheet.','["game_based_learning","constructionism","inquiry"]','["Minecraft"]','["build","inhabit","question","collaborate","reflect","rebuild"]','inhabitable_world','collaborative_world','["build","experience","dialogue","reflection","change"]','documented','active','{"source":"Could Minecraft Be a School? and Purposeful Play"}'),
('exp-gpt-builder','sanders-ontology-v0.1','gpt_building_gpt','GPT Designed to Help Build Better GPTs',2023,2024,'2023-2024','range','agent_design','Early custom-GPT experimentation became deliberately recursive when a specialized GPT was built to help design and improve other GPTs.','["AI","agent_design","knowledge_representation"]','["ChatGPT","custom_GPTs"]','["design","test","evaluate","revise","reuse"]','conversational_agent','human_machine_collaboration','["build_agent","use_agent","study_behavior","structure_what_worked","build_next_agent"]','author_reported','active','{"source":"author_project_history","platform_period":"early custom GPT launch"}'),
('exp-gpt-design-database','sanders-ontology-v0.1','gpt_design_database','Structured Database for the How of Building GPTs',2024,2024,'2024','year','knowledge_representation','Agent design itself was represented as structured data: tables, rows, fields, instructions, sources, examples, constraints, categories, and reusable relationships.','["AI","database_design","knowledge_representation"]','["relational_data","custom_GPTs"]','["model","classify","compare","reuse","revise"]','relational_agent_design_model','human_machine_collaboration','["design","represent","inspect","compare","revise","reuse"]','author_reported','active','{"source":"author_project_history"}'),
('exp-ingestion-research-systems','sanders-ontology-v0.1','public_document_ingestion_systems','Public-Document Ingestion and Persistent Research Databases',2024,2026,'2024-2026','range','research_infrastructure','Large collections of public documents and government records were progressively ingested, normalized, linked, and organized into canonical records, entities, relationships, timelines, source layers, and provenance-aware retrieval systems.','["civic_research","information_science","database_design","AI"]','["document_ingestion","relational_databases","retrieval","LLMs"]','["ingest","normalize","link","retrieve","question","audit","revise"]','provenance_aware_research_database','researcher_machine_collaboration','["documents","ingestion","structured_records","retrieval","dialogue","new_questions","more_records"]','documented','active','{"source":"author_project_repositories_and_workflows","municipal_names_intentionally_not_required_for_ontology"}'),
('exp-sunshine-machine','sanders-ontology-v0.1','sunshine_machine','Sunshine Machine',2025,2026,'2025-2026','range','persistent_computing_environment','Persistent computing environment model organized around intentional corpora: ingest, tag, sort, relate, retrieve, question, and revise. The design shifts from blank-slate prompting toward participation in an already structured environment.','["AI","information_architecture","research","knowledge_representation"]','["LLMs","databases","retrieval"]','["participate","retrieve","question","relate","revise"]','persistent_computing_environment','human_machine_collaboration','["ingest","tag","sort","relate","retrieve","question","revise"]','documented','active','{"source":"Sunshine Machine research-development work","principle":"No prompting. Just participation."}'),
('exp-coactive-writing','sanders-ontology-v0.1','coactive_emergence_writing','Iterative Generative Writing Toward Co-active Emergence',2023,2025,'2023-2025','range','human_machine_dialogue','Sustained human-machine writing in which model responses became material for evaluation, disagreement, revision, new questions, and further dialogue; the process itself helped expose and theorize co-active emergence.','["writing","AI","educational_research","theory"]','["generative_AI","LLMs"]','["write","evaluate","disagree","reframe","question","revise"]','dialogic_text','human_machine_collaboration','["human_idea","machine_response","human_evaluation","revision","new_dialogue","emerging_concept"]','documented','active','{"source":"Engaging with AI and GPT and Me / Co-active Emergence lineage"}'),
('exp-reeducation-focused-practice','sanders-ontology-v0.1','reeducation_focused_practice','RE/EDUCATION Focused Research and Practice',2022,NULL,'2022-present','range','research_practice_environment','A deliberately smaller and more focused educational setting where long-running questions about construction, inquiry, technology, dialogue, and learner agency can be designed, tried, observed, and revised with tighter feedback loops.','["education","research","design","technology"]','["multiple"]','["design","teach","observe","reflect","revise"]','practice_research_environment','small_scale_learning_environment','["practice","observation","theory","design","practice_again"]','documented','active','{"source":"RE/EDUCATION practice and author project history"}'),
('exp-turtleblock-field-tests','sanders-ontology-v0.1','turtleblock_field_tests','TurtleBlock AI Field Tests',2026,NULL,'2026-present','range','research_platform','Conversational field tests preserve learner language, develop persistent WorldSpecs, prepare Minecraft construction, record revisions, and study the recursive movement among dialogue, representation, construction, experience, and reflection.','["AI","Minecraft","constructionism","educational_research"]','["LLMs","Cloudflare_D1","WorldSpec","Minecraft"]','["describe","dialogue","build","inhabit","notice","reflect","revise"]','persistent_worldspec','human_machine_world_collaboration','["learner_language","dialogue","WorldSpec","construction","inhabitation","reflection","revision"]','documented','active','{"source":"TurtleBlock AI repository and field-test record"}');

-- Tie experiments to source records where the source is presently known.
INSERT OR IGNORE INTO pedagogical_experiment_sources
(experiment_id,source_id,relationship_type,source_ref,notes) VALUES
('exp-steamhamlet','src-sanders-2016-steamhamlet','documents','STEAMHAMLET: A Transformative Situated Inquiry','Early documented STEAMHAMLET research-development artifact.'),
('exp-steamhamlet','src-sanders-2051-steamhamlet','extends','STEAMHAMLET Is School 2051','Published vignette extends the environment concept.'),
('exp-minecraft-purposeful-play','src-sanders-2021-minecraft-school','documents','Could Minecraft Be a School?','Published chapter.'),
('exp-minecraft-purposeful-play','src-sanders-2022-purposeful-play','documents','Purposeful Play – Educating with Minecraft','Published practice article.'),
('exp-gpt-builder','src-sanders-2023-gpt-builder','documents','Early custom GPT project history','Operational research-development source.'),
('exp-gpt-design-database','src-sanders-2024-gpt-design-database','documents','Structured GPT design database','Operational research-development source.'),
('exp-ingestion-research-systems','src-sanders-2024-ingestion-systems','documents','Public-document ingestion systems','Operational research-development source.'),
('exp-sunshine-machine','src-sanders-2026-sunshine-machine','documents','Sunshine Machine','Operational research-development source.'),
('exp-coactive-writing','src-sanders-2023-ai','precedes','Engaging with AI','Published AI-engagement lineage.'),
('exp-coactive-writing','src-sanders-2025-coactive','documents','GPT and Me / Co-active Emergence','Published theoretical articulation.'),
('exp-reeducation-focused-practice','src-sanders-2022-reeducation','documents','RE/EDUCATION','Current focused practice environment.'),
('exp-turtleblock-field-tests','src-sanders-2026-turtleblock','documents','TurtleBlock AI','Current implementation.'),
('exp-1995-2022-experimental-classroom','src-sanders-2017-vle','documents','Virtual Learning Environments','Surviving authored artifact from the broader experimental-practice period.'),
('exp-1995-2022-experimental-classroom','src-sanders-2018-new-learning-theory','documents','Towards a New Learning Theory for Digital Learning Environments','Formal articulation emerging from prior practice.'),
('exp-1995-2022-experimental-classroom','src-sanders-2019-dissertation-presentation','documents','Dissertation presentation','Formal research articulation.'),
('exp-1995-2022-experimental-classroom','src-sanders-2020-aect-ctc','extends','AECT Critical Techno Constructivism artifact','Post-dissertation continuation.');

-- Retrospective mappings are explicitly labeled as such.
INSERT OR IGNORE INTO pedagogical_experiment_concepts
(experiment_id,concept_id,mapping_type,relationship_layer,notes,provenance_json) VALUES
('exp-literary-fantasy-database','code-constructivism','retrospective_mapping','later_interpretation','Structured representation and embodied play are retrospectively related to active construction of meaning.','{"not_claimed_as_historical_vocabulary":true}'),
('exp-literary-fantasy-database','code-discovery-learning','retrospective_mapping','later_interpretation','Predictions and enacted outcomes created opportunities for discovery and revision.','{"not_claimed_as_historical_vocabulary":true}'),
('exp-literary-fantasy-database','concept-recursive-learning-loop','retrospective_mapping','later_interpretation','Representation informed experience; experience could challenge the representation.','{"not_claimed_as_historical_vocabulary":true}'),
('exp-hot-tub-fever','concept-recursive-learning-loop','retrospective_mapping','later_interpretation','Multiple formal and informal versions make recursion visible as method.','{"not_claimed_as_historical_vocabulary":true}'),
('exp-steamhamlet','concept-room-learns-input','source_and_later_mapping','later_interpretation','STEAMHAMLET explicitly imagines an environment that changes through input.','{"source_supported":true}'),
('exp-steamhamlet','concept-visible-ideas','source_and_later_mapping','later_interpretation','Ideas become visible and manipulable in a shared environment.','{"source_supported":true}'),
('exp-minecraft-purposeful-play','concept-story-walk-change','source_mapping','source','Published Minecraft work explicitly treats the story/world as something learners make, inhabit, and change.','{"source_supported":true}'),
('exp-gpt-builder','concept-recursive-learning-loop','retrospective_mapping','later_interpretation','Agent output becomes input into design of the next agent.','{"research_development":true}'),
('exp-gpt-design-database','concept-agent-design-as-data','source_mapping','source','This experiment is the source context for representing agent design as structured data.','{"research_development":true}'),
('exp-ingestion-research-systems','concept-provenance-aware-retrieval','source_mapping','source','The systems explicitly separate sources, entities, relationships, retrieval, evidence, and interpretation.','{"research_development":true}'),
('exp-sunshine-machine','concept-persistent-computing-environment','source_mapping','source','Sunshine Machine is a direct source context for the persistent-computing-environment formulation.','{"research_development":true}'),
('exp-sunshine-machine','concept-prompts-to-environments','source_mapping','source','The project explicitly shifts the design problem from prompting to environment-building.','{"research_development":true}'),
('exp-coactive-writing','concept-coactive-emergence','source_mapping','source','The recursive writing process and resulting publication articulate co-active emergence.','{"source_supported":true}'),
('exp-reeducation-focused-practice','concept-recursive-learning-loop','retrospective_mapping','later_interpretation','Focused practice uses tighter cycles of design, observation, theory, and revision.','{"research_development":true}'),
('exp-turtleblock-field-tests','concept-recursive-learning-loop','source_mapping','source','TurtleBlock operationalizes dialogue, WorldSpec, construction, reflection, and revision as a persistent cycle.','{"research_development":true}'),
('exp-turtleblock-field-tests','concept-persistent-computing-environment','source_mapping','source','Persistent sessions and WorldSpecs instantiate the broader persistent-environment research direction.','{"research_development":true}');
