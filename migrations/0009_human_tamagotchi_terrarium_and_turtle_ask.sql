-- Human Tamagotchi Terrarium + turtleAsk v0.1
-- Adds a third Turtle Terraria habitat and a provenance-preserving boundary-event model.
-- This is theoretical research architecture. It does not authorize proactive production messaging.

PRAGMA foreign_keys = ON;

-- -----------------------------------------------------------------------------
-- THIRD HABITAT
-- -----------------------------------------------------------------------------
INSERT OR IGNORE INTO terraria_habitats
(id,habitat_key,name,description,actor_configuration_json,human_evidence_allowed,synthetic_by_definition,status,created_at,provenance_json) VALUES
('habitat-human-tamagotchi','human_tamagotchi','Human Tamagotchi Terrarium','A human-only social habitat represented playfully as virtual human Tamagotchi presences. Humans mostly interact with humans. Turtle may cross into the habitat only through a provenance-preserving turtleAsk boundary event subject to separate consent and attention rules. The virtual human representation never simulates or answers for an actual person.','{"actors":["human"],"driver":"human_social_life","turtle_entry":"turtleAsk_only","simulated_human_answers":false,"availability_inference":false,"emotion_inference":false}',1,0,'experimental','2026-09-12T06:55:00Z','{"human_direction":true,"theoretical":true,"co_active_emergence":true,"production_messaging_authority":"none"}');

-- -----------------------------------------------------------------------------
-- LATER OPERATIONAL CONCEPTS
-- These extend the ontology additively; they do not alter the immutable dissertation layer.
-- -----------------------------------------------------------------------------
INSERT OR IGNORE INTO ontology_concepts
(id,ontology_version_id,canonical_label,concept_key,layer,concept_type,source_id,source_ref,source_exact,description,status,provenance_json) VALUES
('concept-human-tamagotchi-terrarium','sanders-ontology-v0.1','Human Tamagotchi Terrarium','human_tamagotchi_terrarium','operational_turtle','research_environment','src-sanders-2026-turtle-terraria','Turtle Terraria third-habitat design, 2026',0,'A human-only Terraria habitat in which real people are represented playfully as non-simulated virtual presences and may receive a bounded TurtleAsk from another habitat without becoming continuously available to Turtle.','provisional','{"later_sanders_concept":true,"human_direction":true,"theoretical":true,"simulated_human":false}'),
('concept-turtle-ask','sanders-ontology-v0.1','TurtleAsk','turtle_ask','operational_turtle','interaction_boundary_event','src-sanders-2026-turtle-terraria','TurtleAsk design, 2026',0,'A provenance-preserving boundary event in which Turtle deliberately seeks human perturbation because continued machine-only inquiry appears less valuable than inviting human difference. Ask formation is separate from surfacing authority.','provisional','{"later_sanders_concept":true,"human_direction":true,"theoretical":true,"production_authority":"none"}'),
('concept-inquiry-saturation','sanders-ontology-v0.1','Inquiry Saturation','inquiry_saturation','operational_turtle','research_signal','src-sanders-2026-turtle-terraria','TurtleAsk design, 2026',0,'A provisional machine-observable condition in which successive bounded inquiry steps increasingly repeat assumptions, possibilities, interpretations, or unresolved contradictions. May be playfully labeled boredom without asserting subjective machine emotion.','provisional','{"later_sanders_concept":true,"human_direction":true,"theoretical":true,"subjective_emotion_claim":false}'),
('concept-human-perturbation','sanders-ontology-v0.1','Human Perturbation','human_perturbation','operational_turtle','coactive_event','src-sanders-2026-turtle-terraria','TurtleAsk design, 2026',0,'A human-authored contribution deliberately invited to introduce difference into a Turtle inquiry trajectory. The contribution may be relevant, sideways, playful, contradictory, unrelated, delayed, refused, or absent.','provisional','{"later_sanders_concept":true,"human_authorship_preserved":true,"theoretical":true}');

INSERT OR IGNORE INTO ontology_relationships
(id,ontology_version_id,subject_concept_id,predicate,object_concept_id,relationship_layer,status,source_id,source_ref,notes,provenance_json) VALUES
('rel-human-tamagotchi-terraria','sanders-ontology-v0.1','concept-human-tamagotchi-terrarium','extends','concept-turtle-terraria','later_interpretation','provisional','src-sanders-2026-turtle-terraria','Third-habitat design','Adds a human-only habitat that is not continuously co-present with Turtle.','{"human_direction":true,"theoretical":true}'),
('rel-turtle-ask-coactive','sanders-ontology-v0.1','concept-turtle-ask','operationalizes','concept-coactive-emergence','later_interpretation','provisional','src-sanders-2026-turtle-terraria','TurtleAsk design','Initiative may move from machine inquiry back toward a human while authority and provenance remain distinct.','{"human_direction":true,"theoretical":true}'),
('rel-turtle-ask-saturation','sanders-ontology-v0.1','concept-inquiry-saturation','may_trigger','concept-turtle-ask','later_interpretation','provisional','src-sanders-2026-turtle-terraria','TurtleAsk design','Inquiry saturation is one possible reason for forming a TurtleAsk but is neither necessary nor sufficient by itself.','{"human_direction":true,"theoretical":true}'),
('rel-turtle-ask-perturbation','sanders-ontology-v0.1','concept-turtle-ask','invites','concept-human-perturbation','later_interpretation','provisional','src-sanders-2026-turtle-terraria','TurtleAsk design','A TurtleAsk seeks human difference rather than merely outsourcing machine work.','{"human_direction":true,"theoretical":true}'),
('rel-human-perturbation-recursion','sanders-ontology-v0.1','concept-human-perturbation','extends','concept-recursive-learning-loop','later_interpretation','provisional','src-sanders-2026-turtle-terraria','TurtleAsk design','A human perturbation may reopen and redirect a bounded recursive inquiry trajectory.','{"human_direction":true,"theoretical":true}'),
('rel-turtle-ask-provenance','sanders-ontology-v0.1','concept-turtle-ask','requires','concept-cohabitation-provenance','later_interpretation','provisional','src-sanders-2026-turtle-terraria','TurtleAsk design','Source habitat, preceding trace, formation reason, surfacing decision, human response, and later Turtle interpretation must remain distinguishable when practical.','{"human_direction":true,"theoretical":true}');

-- -----------------------------------------------------------------------------
-- TURTLEASK BOUNDARY EVENTS
-- Formation of an ask and permission to surface it are intentionally separate.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS turtle_asks (
  id TEXT PRIMARY KEY,
  source_habitat_id TEXT NOT NULL,
  source_run_id TEXT,
  source_event_id TEXT,
  initiator_actor_type TEXT NOT NULL CHECK (initiator_actor_type IN ('turtle','synthetic_builder_turtle','synthetic_reflector_turtle','system')),
  target_habitat_id TEXT NOT NULL DEFAULT 'habitat-human-tamagotchi',
  formed_at TEXT NOT NULL,
  reason_class TEXT NOT NULL CHECK (reason_class IN ('inquiry_saturation','persistent_contradiction','novelty_collapse','meaning_boundary','missing_situated_knowledge','human_otherness','playful_perturbation','other')),
  reason_text TEXT NOT NULL,
  ask_text TEXT NOT NULL,
  ask_mode TEXT NOT NULL DEFAULT 'perturbation' CHECK (ask_mode IN ('perturbation','question','critique','story','constraint','contradiction','surprise','other')),
  formation_evidence_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'formed' CHECK (status IN ('formed','eligible_to_surface','surfaced','answered','ignored','deferred','refused','expired','withdrawn')),
  surfacing_authority TEXT NOT NULL DEFAULT 'none' CHECK (surfacing_authority IN ('none','human_preapproved_rule','human_now','system_policy_with_human_authorization')),
  surfaced_at TEXT,
  response_object_id TEXT,
  responded_at TEXT,
  return_trace_object_id TEXT,
  privacy_class TEXT NOT NULL DEFAULT 'internal' CHECK (privacy_class IN ('private','internal','unlisted','public')),
  interruption_authority INTEGER NOT NULL DEFAULT 0 CHECK (interruption_authority IN (0,1)),
  production_authority INTEGER NOT NULL DEFAULT 0 CHECK (production_authority = 0),
  human_response_required INTEGER NOT NULL DEFAULT 0 CHECK (human_response_required = 0),
  provenance_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (source_habitat_id) REFERENCES terraria_habitats(id) ON DELETE RESTRICT,
  FOREIGN KEY (target_habitat_id) REFERENCES terraria_habitats(id) ON DELETE RESTRICT,
  FOREIGN KEY (source_run_id) REFERENCES terraria_runs(id) ON DELETE SET NULL,
  FOREIGN KEY (source_event_id) REFERENCES terraria_events(id) ON DELETE SET NULL,
  FOREIGN KEY (response_object_id) REFERENCES research_objects(id) ON DELETE SET NULL,
  FOREIGN KEY (return_trace_object_id) REFERENCES research_objects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_turtle_asks_source ON turtle_asks(source_habitat_id, formed_at);
CREATE INDEX IF NOT EXISTS idx_turtle_asks_status ON turtle_asks(status, formed_at);
CREATE INDEX IF NOT EXISTS idx_turtle_asks_reason ON turtle_asks(reason_class, formed_at);

-- Automatically register TurtleAsk records as research objects so later analysis can compare
-- formed, surfaced, answered, ignored, and trajectory-changing asks without flattening them.
CREATE TRIGGER IF NOT EXISTS register_turtle_ask_research_object
AFTER INSERT ON turtle_asks
BEGIN
  INSERT OR IGNORE INTO research_objects
  (id,object_type,title,summary,source_table,source_id,created_at,privacy_class,evidence_class,provenance_json)
  VALUES
  ('turtle_ask:' || NEW.id,
   'turtle_ask',
   'TurtleAsk: ' || NEW.reason_class,
   NEW.ask_text,
   'turtle_asks',
   NEW.id,
   NEW.formed_at,
   NEW.privacy_class,
   CASE
     WHEN NEW.initiator_actor_type IN ('synthetic_builder_turtle','synthetic_reflector_turtle') THEN 'synthetic_self_play'
     ELSE 'system_record'
   END,
   json_object(
     'source_habitat_id', NEW.source_habitat_id,
     'target_habitat_id', NEW.target_habitat_id,
     'initiator_actor_type', NEW.initiator_actor_type,
     'reason_class', NEW.reason_class,
     'surfacing_authority', NEW.surfacing_authority,
     'interruption_authority', NEW.interruption_authority,
     'production_authority', NEW.production_authority,
     'human_response_required', NEW.human_response_required
   ));
END;

-- -----------------------------------------------------------------------------
-- RESEARCH ARTIFACT REGISTRATION + EMERGENT TAGS
-- -----------------------------------------------------------------------------
INSERT OR IGNORE INTO research_objects
(id,object_type,title,summary,repo_path,source_uri,created_at,privacy_class,evidence_class,provenance_json) VALUES
('repo_file:research/TURTLE_ASK.md','repository_artifact','TurtleAsk and the Human Tamagotchi Terrarium','Defines the theoretical third habitat, inquiry saturation, human perturbation, genuine TurtleAsk criteria, provenance boundaries, and the reversal from human-initiated to Turtle-initiated co-active inquiry.','research/TURTLE_ASK.md','https://github.com/turtleblockai/platform/blob/main/research/TURTLE_ASK.md','2026-09-12T06:55:00Z','public','human_authored','{"authorship":"human-directed co-active development","source_layer":"operational_turtle","theoretical":true}'),
('repo_file:migrations/0009_human_tamagotchi_terrarium_and_turtle_ask.sql','repository_artifact','Human Tamagotchi Terrarium + TurtleAsk schema','Adds the third Terraria habitat, provisional operational concepts, and a bounded TurtleAsk boundary-event table that separates ask formation from surfacing authority.','migrations/0009_human_tamagotchi_terrarium_and_turtle_ask.sql','https://github.com/turtleblockai/platform/blob/main/migrations/0009_human_tamagotchi_terrarium_and_turtle_ask.sql','2026-09-12T06:55:00Z','public','human_authored','{"authorship":"human-directed co-active development","schema_version":"terraria-0.2","theoretical":true}');

INSERT OR IGNORE INTO research_tags
(id,tag_key,label,tag_type,description,status,created_at,provenance_json) VALUES
('tag-boredom-playful','machine_boredom_playful','Turtle gets bored','emergent','Playful human-facing label for some forms of inquiry saturation. Does not assert subjective machine emotion.','provisional','2026-09-12T06:55:00Z','{"subjective_emotion_claim":false,"human_direction":true}'),
('tag-turtle-initiative','turtle_initiative','Turtle initiative','emergent','Machine-side initiative to reopen inquiry toward a human without acquiring human authority or interruption privilege.','provisional','2026-09-12T06:55:00Z','{"human_direction":true}'),
('tag-human-otherness','human_otherness','Human otherness','emergent','The possibility that a human participant contributes difference not reducible to another turn along the current machine trajectory.','provisional','2026-09-12T06:55:00Z','{"human_direction":true}'),
('tag-reverse-inquiry','reverse_inquiry','Reverse Inquiry','emergent','A reversal in which Turtle rather than the human initiates a bounded request for a new human contribution.','provisional','2026-09-12T06:55:00Z','{"human_direction":true}');

INSERT OR IGNORE INTO research_object_tags
(object_id,tag_id,tag_role,confidence,tagging_method,actor_type,rationale,created_at) VALUES
('repo_file:research/TURTLE_ASK.md','tag-boredom-playful','relevant',1.0,'human','researcher','The design deliberately preserves boredom as a playful label while defining inquiry saturation more precisely.','2026-09-12T06:55:00Z'),
('repo_file:research/TURTLE_ASK.md','tag-turtle-initiative','primary',1.0,'human','researcher','The design studies machine initiative without transferring authority.','2026-09-12T06:55:00Z'),
('repo_file:research/TURTLE_ASK.md','tag-human-otherness','primary',1.0,'human','researcher','The central hypothesis is that another human mind may introduce useful difference after machine-only inquiry saturates.','2026-09-12T06:55:00Z'),
('repo_file:research/TURTLE_ASK.md','tag-reverse-inquiry','primary',1.0,'human','researcher','TurtleAsk reverses the usual human-initiated direction of inquiry.','2026-09-12T06:55:00Z');

-- Broad CTC design mappings. These describe the research architecture, not learner attainment.
INSERT OR IGNORE INTO research_object_ctc_tags
(id,object_id,domain_id,tag_role,confidence,tagging_method,actor_type,rationale,status,created_at,provenance_json) VALUES
('tag-turtleask-ctc01','repo_file:research/TURTLE_ASK.md','ctc-domain-01','questions',0.85,'human','researcher','The design tests whether inquiry initiative can shift toward Turtle while preserving distinguishable human purpose and authorship.','accepted','2026-09-12T06:55:00Z','{"scope":"research_design_not_learner_assessment"}'),
('tag-turtleask-ctc02','repo_file:research/TURTLE_ASK.md','ctc-domain-02','primary',1.0,'human','researcher','A persistent unresolved question, contradiction, or saturation state may motivate a TurtleAsk.','accepted','2026-09-12T06:55:00Z','{"scope":"research_design_not_learner_assessment"}'),
('tag-turtleask-ctc03','repo_file:research/TURTLE_ASK.md','ctc-domain-03','primary',1.0,'human','researcher','Machine-generated possibilities become material the system can inspect and decide not to merely continue generating.','accepted','2026-09-12T06:55:00Z','{"scope":"research_design_not_learner_assessment"}'),
('tag-turtleask-ctc04','repo_file:research/TURTLE_ASK.md','ctc-domain-04','supports',0.8,'human','researcher','Pre/post perturbation traces may make a change in the inquiry visible without equating machine trajectory change with human learning.','accepted','2026-09-12T06:55:00Z','{"scope":"research_design_not_learner_assessment"}'),
('tag-turtleask-ctc05','repo_file:research/TURTLE_ASK.md','ctc-domain-05','primary',1.0,'human','researcher','A TurtleAsk should emerge from explicit inspection of repetition, contradiction, uncertainty, or the limits of machine-only continuation.','accepted','2026-09-12T06:55:00Z','{"scope":"research_design_not_learner_assessment"}'),
('tag-turtleask-ctc06','repo_file:research/TURTLE_ASK.md','ctc-domain-06','supports',0.95,'human','researcher','Meaning boundaries involving power, values, culture, positionality, and situated knowledge are explicit reasons to seek human difference rather than machine substitution.','accepted','2026-09-12T06:55:00Z','{"scope":"research_design_not_learner_assessment"}'),
('tag-turtleask-ctc07','repo_file:research/TURTLE_ASK.md','ctc-domain-07','primary',1.0,'human','researcher','The third habitat studies a machine reopening inquiry to another participant and preserving what happens next as co-active collaboration.','accepted','2026-09-12T06:55:00Z','{"scope":"research_design_not_learner_assessment"}');

INSERT OR IGNORE INTO research_object_ontology_tags
(id,object_id,concept_id,tag_role,confidence,tagging_method,actor_type,rationale,status,created_at,provenance_json) VALUES
('tag-turtleask-concept-self','repo_file:research/TURTLE_ASK.md','concept-turtle-ask','primary',1.0,'human','researcher','The document defines TurtleAsk as a boundary event.','accepted','2026-09-12T06:55:00Z','{"later_operational_mapping":true}'),
('tag-turtleask-concept-habitat','repo_file:research/TURTLE_ASK.md','concept-human-tamagotchi-terrarium','primary',1.0,'human','researcher','The document defines the third Human Tamagotchi habitat.','accepted','2026-09-12T06:55:00Z','{"later_operational_mapping":true}'),
('tag-turtleask-concept-saturation','repo_file:research/TURTLE_ASK.md','concept-inquiry-saturation','primary',1.0,'human','researcher','Inquiry saturation is the precise provisional construct underneath the playful boredom metaphor.','accepted','2026-09-12T06:55:00Z','{"later_operational_mapping":true}'),
('tag-turtleask-concept-perturbation','repo_file:research/TURTLE_ASK.md','concept-human-perturbation','primary',1.0,'human','researcher','The ask seeks human difference rather than automatic task completion.','accepted','2026-09-12T06:55:00Z','{"later_operational_mapping":true}'),
('tag-turtleask-concept-coactive','repo_file:research/TURTLE_ASK.md','concept-coactive-emergence','extends',1.0,'human','researcher','The design tests whether co-active emergence can include initiative moving from Turtle back toward human input.','accepted','2026-09-12T06:55:00Z','{"later_operational_mapping":true}'),
('tag-turtleask-concept-provenance','repo_file:research/TURTLE_ASK.md','concept-cohabitation-provenance','operationalizes',1.0,'human','researcher','Source trace, ask, surfacing decision, human response, and Turtle interpretation remain separate evidence events.','accepted','2026-09-12T06:55:00Z','{"later_operational_mapping":true}');

-- Preserve open residue rather than manufacturing a new CTC domain.
INSERT OR IGNORE INTO ctc_uncaptured_observations
(id,object_id,observation_text,reason_unmapped,observer_actor_type,created_at,status,provenance_json) VALUES
('uncaptured-turtleask-01','repo_file:research/TURTLE_ASK.md','The intellectually important unit may be the transition in initiative itself: machine-only inquiry recognizes a limit and seeks human otherness.','The seven CTC domains can describe inquiry, reflection, technology, critique, and collaboration, but may not fully distinguish initiative-transfer as its own analytic phenomenon.','researcher','2026-09-12T06:55:00Z','open','{"do_not_promote_domain_automatically":true}'),
('uncaptured-turtleask-02','repo_file:research/TURTLE_ASK.md','A non-response to Turtle may be meaningful without constituting learner disengagement, refusal, or negative evidence.','Existing domains do not clearly specify how voluntary human silence toward machine initiative should be interpreted.','researcher','2026-09-12T06:55:00Z','open','{"do_not_promote_domain_automatically":true}'),
('uncaptured-turtleask-03','repo_file:research/TURTLE_ASK.md','Human otherness is being treated as an epistemic resource rather than merely an interaction channel.','This may cut across collaboration, personal inquiry, critique, and reflection rather than fit one established domain cleanly.','researcher','2026-09-12T06:55:00Z','open','{"do_not_promote_domain_automatically":true}');
