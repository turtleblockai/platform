-- Dr. Bryan P. Sanders TurtleBlock AI research ontology v0.2
-- Extends the immutable 2019 Dedoose source layer with authored operational tools,
-- later published research, and explicit mappings toward TurtleBlock AI.
-- Source-layer labels remain unchanged. Later relationships are additive.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS ontology_tools (
  id TEXT PRIMARY KEY,
  ontology_version_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  tool_key TEXT NOT NULL,
  title TEXT NOT NULL,
  tool_type TEXT NOT NULL,
  description TEXT,
  source_ref TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','provisional','deprecated')),
  provenance_json TEXT,
  UNIQUE(ontology_version_id, tool_key),
  FOREIGN KEY (ontology_version_id) REFERENCES ontology_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES ontology_sources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ontology_tool_steps (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  label TEXT NOT NULL,
  question_text TEXT,
  action_text TEXT,
  source_ref TEXT,
  provenance_json TEXT,
  UNIQUE(tool_id, ordinal),
  FOREIGN KEY (tool_id) REFERENCES ontology_tools(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ontology_tool_concepts (
  tool_id TEXT NOT NULL,
  tool_step_id TEXT,
  concept_id TEXT NOT NULL,
  mapping_type TEXT NOT NULL DEFAULT 'supports',
  relationship_layer TEXT NOT NULL DEFAULT 'later_interpretation' CHECK (relationship_layer IN ('source','later_interpretation')),
  notes TEXT,
  PRIMARY KEY (tool_id, tool_step_id, concept_id, mapping_type),
  FOREIGN KEY (tool_id) REFERENCES ontology_tools(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_step_id) REFERENCES ontology_tool_steps(id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES ontology_concepts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ontology_tools_version ON ontology_tools(ontology_version_id, tool_type);
CREATE INDEX IF NOT EXISTS idx_ontology_tool_steps_tool ON ontology_tool_steps(tool_id, ordinal);
CREATE INDEX IF NOT EXISTS idx_ontology_tool_concepts_concept ON ontology_tool_concepts(concept_id, mapping_type);

-- Later Sanders sources. These extend the ontology without rewriting the 2019 source layer.
INSERT OR IGNORE INTO ontology_sources
(id,ontology_version_id,source_type,title,author,publication_year,canonical_citation,url,provenance_json) VALUES
('src-sanders-2016-steamhamlet','sanders-ontology-v0.1','other','STEAMHAMLET: A Transformative Situated Inquiry','Bryan P. Sanders',2016,'Sanders, B. P. (2016). STEAMHAMLET: A Transformative Situated Inquiry. Presentation.',NULL,'{"role":"research_development_lineage","source_layer":"later_sanders_work"}'),
('src-sanders-2018-new-learning-theory','sanders-ontology-v0.1','other','Towards a New Learning Theory for Digital Learning Environments','Bryan Sanders',2018,'Sanders, B. (2018). Towards a New Learning Theory for Digital Learning Environments. Loyola Marymount University Graduate Student Summit.',NULL,'{"role":"doctoral_research_presentation","source_layer":"later_sanders_work"}'),
('src-sanders-2019-operationalizing-ctc','sanders-ontology-v0.1','other','Tenets of Critical Techno Constructivism with Suggestions for Operationalizing the Theory','Bryan P. Sanders',2019,'Sanders, B. P. (2019). Tenets of Critical Techno Constructivism with Suggestions for Operationalizing the Theory.',NULL,'{"role":"authored_operational_framework","source_layer":"later_sanders_work"}'),
('src-sanders-2021-possible-possibles','sanders-ontology-v0.1','publication','Possible Possibles','Bryan Sanders',2021,'Sanders, B. (2021). Possible Possibles. Tynker Blog.','https://www.tynker.com/blog/articles/ideas-and-tips/possible-possibles/','{"role":"published_lineage","source_layer":"later_sanders_work"}'),
('src-sanders-2021-minecraft-school','sanders-ontology-v0.1','publication','Could Minecraft Be a School?','Bryan P. Sanders',2021,'Sanders, B. P. (2021). Could Minecraft Be a School? In Game-based Learning Across the Disciplines. Springer.','https://doi.org/10.1007/978-3-030-75142-5_17','{"role":"published_lineage","source_layer":"later_sanders_work"}'),
('src-sanders-2022-purposeful-play','sanders-ontology-v0.1','publication','Purposeful Play – Educating with Minecraft','Bryan P. Sanders',2022,'Sanders, B. P. (2022). Purposeful Play – Educating with Minecraft. Minecraft Education.','https://education.minecraft.net/en-us/blog/purposeful-play','{"role":"published_lineage","source_layer":"later_sanders_work"}'),
('src-sanders-2023-logo','sanders-ontology-v0.1','publication','The First Thing I Did With A Computer','Bryan P. Sanders',2023,'Sanders, B. P. (2023). The First Thing I Did With A Computer. In Twenty Things To Do With A Computer Forward 50. CMK Press.',NULL,'{"role":"published_lineage","source_layer":"later_sanders_work"}'),
('src-sanders-2023-ai','sanders-ontology-v0.1','publication','Engaging with AI — A Radical Shift for the Future, Today','Bryan Sanders',2023,'Sanders, B. (2023). A Radical Shift for the Future, Today: It’s already yesterday. California English, 29(2).',NULL,'{"role":"published_lineage","source_layer":"later_sanders_work"}'),
('src-sanders-2051-steamhamlet','sanders-ontology-v0.1','publication','STEAMHAMLET Is School 2051','Bryan P. Sanders',2023,'Sanders, B. P. Vignette: STEAMHAMLET Is School 2051. In Artificial Intelligence, Human Agency and the Educational Leader. Springer.',NULL,'{"role":"published_lineage","source_layer":"later_sanders_work"}'),
('src-sanders-2025-coactive','sanders-ontology-v0.1','publication','GPT and Me, An Honest Reevaluation: The Dawn of Co-active Emergence','Bryan P. Sanders',2025,'Sanders, B. P. (2025). GPT and Me, An Honest Reevaluation: The Dawn of Co-active Emergence. Impacting Education, 10(1), 96–100.','https://doi.org/10.5195/ie.2025.479','{"role":"published_lineage","source_layer":"later_sanders_work"}');

-- Authored operational framework: the seven Critical Techno Constructivism tenets.
INSERT OR IGNORE INTO ontology_tools
(id,ontology_version_id,source_id,tool_key,title,tool_type,description,source_ref,provenance_json) VALUES
('tool-ctc-operational-framework','sanders-ontology-v0.1','src-sanders-2019-operationalizing-ctc','critical_techno_constructivism_operational_framework','Critical Techno Constructivism: Tenets, Questions, and Actions','authored_operational_framework','Seven tenets operationalized as a diagnostic question plus an educator action.','Tenets of Critical Techno Constructivism with Suggestions for Operationalizing the Theory','{"authored_by":"Dr. Bryan P. Sanders","source_exact_structure":true,"relationship_to_dedoose":"later_operationalization"}');

INSERT OR IGNORE INTO ontology_tool_steps
(id,tool_id,ordinal,label,question_text,action_text,source_ref,provenance_json) VALUES
('ctc-step-01','tool-ctc-operational-framework',1,'Personal Inquiry','Did the student develop the learning task?','Engage in open dialogue with students with the explicit purpose of developing together new assignments or topics of study. Work with students to define audience, purpose, resources, tools, and goals of the learning task. Think big with students about possible uses and aims of their work beyond the classroom and the confines of school. Encourage students to follow through and develop to its end what they pose as a problem to solve.','Operationalizing CTC tool','{"source_exact":true}'),
('ctc-step-02','tool-ctc-operational-framework',2,'Compelling Problem or Question','Did the student arrive at an answer that led to more questions or problems?','Coach students as they work to keep a log of their progress, handwritten, typed, audio or video recorded, for the purpose of tracking ideas as they occur. Encourage students to spot potential new paths or questions to chase as they work. Develop with students some methodologies for addressing conflict and dissonance in their work and studies and possible applications.','Operationalizing CTC tool','{"source_exact":true}'),
('ctc-step-03','tool-ctc-operational-framework',3,'Technology as Tool to Think With','Did the student use technology in the thinking process?','Choose technology wisely with students. Remember that analog tools may provide instant freedom in expression. Demonstrate how to think with the computer. Use machine learning, graphical statistics, programming language, and concordances or natural language processing. Make certain the computer remains an object-to-think-with, not a replacement of paper or a push-button terminal.','Operationalizing CTC tool','{"source_exact":true}'),
('ctc-step-04','tool-ctc-operational-framework',4,'Formative Demonstration of Learning','Did the student demonstrate learning throughout the process?','Develop guidelines, rubrics, and expectations of outcomes with students. Adjust these as necessary throughout the process of their work, sometimes abandoning them when students find them restrictive. Consult with students about progress and engage in conversations less as an evaluator and more as an interested peer. Sparingly make suggestions so that students retain ownership.','Operationalizing CTC tool','{"source_exact":true}'),
('ctc-step-05','tool-ctc-operational-framework',5,'Reflection as Learning','Did the student demonstrate a reflective approach in the formation of knowledge?','Explicitly teach the skills of mindfulness in short lessons. Engage wholeheartedly in the process of looking for student interest and joy in their work. Emphasize to students the importance of caring about their own interest levels. Engage in reflective questions that are genuine. Avoid leading statements about what you would do as this not-so-subtly shows teacher judgment.','Operationalizing CTC tool','{"source_exact":true}'),
('ctc-step-06','tool-ctc-operational-framework',6,'Social and Cultural Critique','Did the student demonstrate a critical awareness of the larger established modes and forms of thought that shape thought?','If an understanding of larger social constructs does not yet show in their work, make a weighed decision to point them out. Building consciousness more authentically through self-realization is the most powerful, however, students will need coaching and guiding. Avoid moralizing or hijacking student work with your own politics, values, or experiences. Make mention of historical events, people, or concepts that students might consider for study on their own.','Operationalizing CTC tool','{"source_exact":true}'),
('ctc-step-07','tool-ctc-operational-framework',7,'Sharing and Collaborating','Did the student actively seek out collaborators in the process of acquiring knowledge, testing theories, and creating a shareable artifact?','Demonstrate methods, procedures, and styles of communicating with people. Seek out experts and amateurs as guest speakers or consultants. Show the crossover of work done in school and out of school. Practice presentation skills. Create space and time in class to talk together about student progress. Explicitly teach and coach how to communicate respectfully with operationalized critique. Engage with students to develop multiple venues and audiences for sharing.','Operationalizing CTC tool','{"source_exact":true}');

-- Later concepts derived from Sanders-authored works. These are not retroactively claimed as 2019 Dedoose codes.
INSERT OR IGNORE INTO ontology_concepts
(id,ontology_version_id,canonical_label,concept_key,layer,concept_type,source_id,source_ref,source_exact,description,provenance_json) VALUES
('concept-learner-designer-producer','sanders-ontology-v0.1','Learner as Designer and Producer','learner_as_designer_and_producer','published_lineage','design_principle','src-sanders-2018-new-learning-theory','2018 LMU talk; 2019 CTC presentations',1,'Position the learner as designer and producer rather than consumer.','{"later_sanders_concept":true}'),
('concept-tune-into-meaning-making','sanders-ontology-v0.1','Tune Into and Tap Into Learner Meaning-Making','tune_into_learner_meaning_making','published_lineage','dialogic_principle','src-sanders-2018-new-learning-theory','2018 LMU talk',1,'Educators ask what learners are saying, doing, and thinking and bring that meaning-making into the learning environment.','{"later_sanders_concept":true}'),
('concept-co-construct-curriculum','sanders-ontology-v0.1','Co-construct the Curriculum','co_construct_the_curriculum','published_lineage','design_principle','src-sanders-2016-steamhamlet','STEAMHAMLET: A Transformative Situated Inquiry',1,'Respond to the people in the room and co-construct curriculum rather than imposing it entirely in advance.','{"later_sanders_concept":true}'),
('concept-possible-possibles','sanders-ontology-v0.1','Possible Possibles','possible_possibles','published_lineage','learning_environment_principle','src-sanders-2021-possible-possibles','Possible Possibles',1,'High-ceiling, multiple-entry-point collaborative environments for practice, dreaming, building, iteration, and remix.','{"later_sanders_concept":true}'),
('concept-story-walk-change','sanders-ontology-v0.1','Make, Walk Around In, and Change the Story','make_walk_change_story','published_lineage','learning_environment_principle','src-sanders-2022-purposeful-play','Purposeful Play – Educating with Minecraft',1,'Learners create a story in motion that can be made, inhabited, and changed.','{"later_sanders_concept":true}'),
('concept-machine-output-material','sanders-ontology-v0.1','Machine Responses as Material for Evaluation','machine_responses_as_material','published_lineage','critical_ai_principle','src-sanders-2023-ai','California English 29(2)',1,'Machine responses become material learners critically engage with and evaluate.','{"later_sanders_concept":true}'),
('concept-room-learns-input','sanders-ontology-v0.1','The Room Learns as It Receives Input','room_learns_as_it_receives_input','published_lineage','adaptive_environment_principle','src-sanders-2051-steamhamlet','STEAMHAMLET Is School 2051',1,'A shared computational environment changes through participant input and conversation.','{"later_sanders_concept":true}'),
('concept-visible-ideas','sanders-ontology-v0.1','Invisible Ideas Become Visible and Manipulable','invisible_ideas_become_visible','published_lineage','representation_principle','src-sanders-2051-steamhamlet','STEAMHAMLET Is School 2051',0,'Ideas move from mental space into visible, editable, juxtaposed objects in a shared environment.','{"later_sanders_concept":true,"paraphrase":true}'),
('concept-coactive-emergence','sanders-ontology-v0.1','Co-active Emergence','co_active_emergence','published_lineage','theoretical_construct','src-sanders-2025-coactive','Impacting Education 10(1)',1,'Purposeful human and machine intelligence interact dynamically in the development of ideas and solutions.','{"later_sanders_concept":true}');

-- Map the operational framework to original dissertation concepts without changing original labels.
INSERT OR IGNORE INTO ontology_tool_concepts (tool_id,tool_step_id,concept_id,mapping_type,relationship_layer,notes) VALUES
('tool-ctc-operational-framework','ctc-step-01','code-problem-posing','operationalizes','later_interpretation','Personal Inquiry operationalizes problem posing through learner-developed tasks.'),
('tool-ctc-operational-framework','ctc-step-01','code-freedom-individuality','supports','later_interpretation','Learner-defined purpose and goals preserve individual agency.'),
('tool-ctc-operational-framework','ctc-step-02','code-discovery-learning','operationalizes','later_interpretation','Answers are expected to open additional paths and questions.'),
('tool-ctc-operational-framework','ctc-step-02','code-engagement','supports','later_interpretation','Learners track and pursue emergent questions.'),
('tool-ctc-operational-framework','ctc-step-03','code-constructivism','operationalizes','later_interpretation','Technology participates in active construction of meaning.'),
('tool-ctc-operational-framework','ctc-step-03','code-abstractions','supports','later_interpretation','Computational tools help learners think with representations and patterns.'),
('tool-ctc-operational-framework','ctc-step-04','code-predetermined-outcomes','counters','later_interpretation','Criteria may be revised or abandoned when they constrain learner work.'),
('tool-ctc-operational-framework','ctc-step-04','code-pedagogy','operationalizes','later_interpretation','Teacher shifts toward interested peer and formative dialogue.'),
('tool-ctc-operational-framework','ctc-step-05','code-observations-life','supports','later_interpretation','Reflection attends to experience, interest, and formation of knowledge.'),
('tool-ctc-operational-framework','ctc-step-05','code-engagement','supports','later_interpretation','Interest and joy are treated as meaningful evidence.'),
('tool-ctc-operational-framework','ctc-step-06','code-oppression','operationalizes','later_interpretation','Learners examine larger social structures without teacher moralizing.'),
('tool-ctc-operational-framework','ctc-step-06','code-social-impact','supports','later_interpretation','Work is situated in larger social and cultural consequences.'),
('tool-ctc-operational-framework','ctc-step-07','code-shared-democracy','operationalizes','later_interpretation','Knowledge is tested and artifacts are developed through collaboration.'),
('tool-ctc-operational-framework','ctc-step-07','code-connectivism','supports','later_interpretation','Learners seek people, expertise, audiences, and networks.');

-- Longitudinal relationships: later Sanders work grows from the dissertation ontology.
INSERT OR IGNORE INTO ontology_relationships
(id,ontology_version_id,subject_concept_id,predicate,object_concept_id,relationship_layer,status,source_id,source_ref,notes,provenance_json) VALUES
('rel-learner-designer-constructivism','sanders-ontology-v0.1','concept-learner-designer-producer','extends','code-constructivism','later_interpretation','active','src-sanders-2018-new-learning-theory','2018 LMU talk','Design and production make active knowledge construction operational.','{"curated_mapping":true}'),
('rel-learner-designer-freedom','sanders-ontology-v0.1','concept-learner-designer-producer','extends','code-freedom-individuality','later_interpretation','active','src-sanders-2018-new-learning-theory','2018 LMU talk',NULL,'{"curated_mapping":true}'),
('rel-meaning-problemposing','sanders-ontology-v0.1','concept-tune-into-meaning-making','extends','code-problem-posing','later_interpretation','active','src-sanders-2018-new-learning-theory','2018 LMU talk','Dialogue begins from learner meaning rather than a predetermined data set.','{"curated_mapping":true}'),
('rel-coconstruct-democracy','sanders-ontology-v0.1','concept-co-construct-curriculum','extends','code-shared-democracy','later_interpretation','active','src-sanders-2016-steamhamlet','Transformative Situated Inquiry',NULL,'{"curated_mapping":true}'),
('rel-possibles-discovery','sanders-ontology-v0.1','concept-possible-possibles','extends','code-discovery-learning','later_interpretation','active','src-sanders-2021-possible-possibles','Possible Possibles',NULL,'{"curated_mapping":true}'),
('rel-story-engagement','sanders-ontology-v0.1','concept-story-walk-change','extends','code-engagement','later_interpretation','active','src-sanders-2022-purposeful-play','Purposeful Play',NULL,'{"curated_mapping":true}'),
('rel-machine-material-theory','sanders-ontology-v0.1','concept-machine-output-material','extends','code-theory','later_interpretation','active','src-sanders-2023-ai','California English 29(2)','AI output becomes material for human critical thought rather than an endpoint.','{"curated_mapping":true}'),
('rel-room-connectivism','sanders-ontology-v0.1','concept-room-learns-input','extends','code-connectivism','later_interpretation','active','src-sanders-2051-steamhamlet','STEAMHAMLET Is School 2051',NULL,'{"curated_mapping":true}'),
('rel-visible-abstractions','sanders-ontology-v0.1','concept-visible-ideas','extends','code-abstractions','later_interpretation','active','src-sanders-2051-steamhamlet','STEAMHAMLET Is School 2051','Mental ideas become editable representations.','{"curated_mapping":true}'),
('rel-coactive-connectivism','sanders-ontology-v0.1','concept-coactive-emergence','extends','code-connectivism','later_interpretation','active','src-sanders-2025-coactive','Impacting Education 10(1)',NULL,'{"curated_mapping":true}'),
('rel-coactive-constructivism','sanders-ontology-v0.1','concept-coactive-emergence','extends','code-constructivism','later_interpretation','active','src-sanders-2025-coactive','Impacting Education 10(1)',NULL,'{"curated_mapping":true}');

-- Selected Sanders-authored passages for bounded retrieval. These are deliberately concise.
INSERT OR IGNORE INTO ontology_source_passages
(id,ontology_version_id,source_id,source_ref,passage_text,passage_role,retrieval_text,provenance_json) VALUES
('passage-2016-coconstruct','sanders-ontology-v0.1','src-sanders-2016-steamhamlet','slide 2','Why don’t we respond to the people in the room and co-construct the curriculum?','quotation','co-construct curriculum respond people room learner voice dialogue','{"source_exact":true}'),
('passage-2018-meaning','sanders-ontology-v0.1','src-sanders-2018-new-learning-theory','oral presentation p. 4','Our job is to tune into and tap into their meaning-making.','quotation','learner meaning meaning-making listen dialogue interpret student voice','{"source_exact":true}'),
('passage-2021-possibles','sanders-ontology-v0.1','src-sanders-2021-possible-possibles','Possible Possibles','We need a high ceiling, multiple entry points, a communication system, and a collaborative workspace. We need a place to practice, dream, and build.','quotation','high ceiling multiple entry points collaborative workspace practice dream build','{"source_exact":true}'),
('passage-2022-story','sanders-ontology-v0.1','src-sanders-2022-purposeful-play','Purposeful Play','It’s a story in motion, a story in progress. A story they can make, walk around in, and change.','quotation','story motion make inhabit walk around change minecraft world revision','{"source_exact":true}'),
('passage-2023-ai-material','sanders-ontology-v0.1','src-sanders-2023-ai','California English p. 29','critical thinking depends upon our ability to view these machine responses as material for students to engage with and evaluate.','quotation','AI machine responses material critical thinking engage evaluate','{"source_exact":true}'),
('passage-2051-room','sanders-ontology-v0.1','src-sanders-2051-steamhamlet','STEAMHAMLET Is School 2051','The room learns as it receives input.','quotation','adaptive room environment learns receives input conversation persistent state','{"source_exact":true}'),
('passage-2025-coactive','sanders-ontology-v0.1','src-sanders-2025-coactive','Impacting Education 10(1)','human intelligence and machine intelligence converge on purpose','quotation','co-active emergence human machine intelligence purpose collaboration dialogue','{"source_exact":true}');

INSERT OR IGNORE INTO ontology_passages_fts (passage_id,retrieval_text) VALUES
('passage-2016-coconstruct','co-construct curriculum respond people room learner voice dialogue'),
('passage-2018-meaning','learner meaning meaning-making listen dialogue interpret student voice'),
('passage-2021-possibles','high ceiling multiple entry points collaborative workspace practice dream build'),
('passage-2022-story','story motion make inhabit walk around change minecraft world revision'),
('passage-2023-ai-material','AI machine responses material critical thinking engage evaluate'),
('passage-2051-room','adaptive room environment learns receives input conversation persistent state'),
('passage-2025-coactive','co-active emergence human machine intelligence purpose collaboration dialogue');
