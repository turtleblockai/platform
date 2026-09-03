# Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy

**Public academic name:** the Dr. Bryan P. Sanders TurtleBlock AI research ontology

**Status:** active foundational research ontology; additive, versioned, and provenance-preserving

## Purpose

The `Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy` is the canonical research ontology connecting Dr. Bryan P. Sanders' doctoral research, subsequent published writing and presentations, authored educational tools, the Turtle Charter, WorldSpec, and the developing behavior of TurtleBlock AI.

The ontology is not an AI-generated replacement for the original scholarship. It preserves source terminology and provenance, then adds later Sanders-authored concepts and TurtleBlock AI mappings as explicitly subsequent layers.

## Why the dissertation coding matters now

The ontology begins with the document-analysis work in *Toward a Unified Computer Learning Theory: Critical Techno Constructivism* (Sanders, 2019). In that study, Sanders selected excerpts from John Dewey, Paulo Freire, and Seymour Papert, imported those excerpts into Dedoose, and applied a code system derived from the literature review. The study also recorded code frequencies and significant code co-occurrences.

That research tagging is useful computational structure now.

Instead of treating the dissertation as a long PDF that an LLM must reread from scratch, TurtleBlock AI can preserve the original codes as a scholarly retrieval vocabulary, connect passages and later concepts to them, and use those relationships to retrieve bounded, relevant research context.

The important boundary is:

```text
2019 Dedoose coding = original research-analysis layer
later Sanders writing = longitudinal extension layer
authored tools = operational framework layer
Turtle Charter + WorldSpec = executable implementation layer
```

The later layers may connect to the Dedoose codes, but they do not silently redefine them.

## Foundational Dedoose code set

The initial foundational layer preserves the dissertation's original 17 Dedoose codes **exactly as written**:

1. Abstractions
2. Banking Model
3. Connectivism
4. Constructivism
5. Discovery Learning
6. Engagement
7. Freedom and Individuality
8. Institutional Change
9. Isolated Curricula
10. Observations on Life Itself
11. Oppression
12. Pedagogy
13. Predetermined Outcomes
14. Problem Posing Education
15. Shared Democracy
16. Social Impact
17. Theory

These labels are immutable at the source layer.

## Dissertation structure preserved in D1

The D1 research ontology now has explicit representation for:

- ontology versions
- scholarly sources
- the exact 17 Dedoose codes
- theoretical precepts converted into excerpting codes
- per-source tag counts and totals
- significant code relationships/co-occurrences
- source passages and retrieval text
- later Sanders-authored concepts
- authored operational tools
- explicit later mappings toward Charter, WorldSpec, and Turtle behavior

This makes the ontology inspectable rather than hiding all intellectual structure inside embeddings or model prompts.

## Authored operational framework

A second important layer comes from Sanders' *Tenets of Critical Techno Constructivism with Suggestions for Operationalizing the Theory*. This is treated as an **authored operational framework**, not merely a list of concepts.

Its seven tenets are preserved as **Tenet → Question → Action**:

1. **Personal Inquiry** — Did the student develop the learning task?
2. **Compelling Problem or Question** — Did the student arrive at an answer that led to more questions or problems?
3. **Technology as Tool to Think With** — Did the student use technology in the thinking process?
4. **Formative Demonstration of Learning** — Did the student demonstrate learning throughout the process?
5. **Reflection as Learning** — Did the student demonstrate a reflective approach in the formation of knowledge?
6. **Social and Cultural Critique** — Did the student demonstrate a critical awareness of larger established modes and forms of thought that shape thought?
7. **Sharing and Collaborating** — Did the student actively seek collaborators while acquiring knowledge, testing theories, and creating a shareable artifact?

The associated action guidance is stored in D1 so Turtle can eventually retrieve not only *what concept is relevant*, but *what Sanders-authored pedagogical move operationalizes it*.

## Longitudinal research extensions

The ontology also records later Sanders-authored concepts as distinct source-backed entities. Examples include:

- **Learner as Designer and Producer**
- **Tune Into and Tap Into Learner Meaning-Making**
- **Co-construct the Curriculum**
- **Possible Possibles**
- **Make, Walk Around In, and Change the Story**
- **Machine Responses as Material for Evaluation**
- **The Room Learns as It Receives Input**
- **Invisible Ideas Become Visible and Manipulable**
- **Co-active Emergence**

These are connected to the original dissertation taxonomy through explicit `later_interpretation` relationships. They are never presented as if they had been original Dedoose labels.

## Provenance rule

Original research terminology is immutable at the source layer. TurtleBlock AI may add relationships, retrieval tags, operational mappings, WorldSpec relevance, Charter relevance, or later theoretical extensions, but it must not silently rename or overwrite an original code.

Example:

```text
Problem Posing Education
  source_layer: Sanders dissertation / original Dedoose code

Personal Inquiry
  source_layer: Sanders-authored CTC operational framework

Turtle behavior
  later_mapping:
    - ask generative questions
    - preserve unresolved learner questions
    - continue inquiry instead of forcing closure
```

The chain is inspectable. Each step says where it came from.

## Ontology layers

### 1. Original research-analysis ontology

The dissertation code set, theoretical-precept mappings, excerpt frequencies, co-occurrences, and source passages.

### 2. Authored operational frameworks

Sanders-authored tools, heuristics, questions, actions, protocols, and design principles that make theory usable in educational practice.

### 3. Published research lineage

Concepts developed or extended in Sanders' later work, including digital learning environments, STEAMHAMLET, Minecraft as a learning environment, Possible Possibles, Purposeful Play, Engaging with AI, Logo, and co-active emergence.

### 4. Turtle Charter mappings

Relationships between the research ontology and Turtle's behavioral constitution: learner agency, inquiry, dialogue, authorship, uncertainty, disagreement, reflection, reversibility, and human judgment.

### 5. WorldSpec mappings

Relationships between the research ontology and inspectable computational representation: learner language, explicit meaning, provisional interpretation, unresolved meaning, constraints, provenance, revision, and inhabitable construction.

### 6. Operational Turtle mappings

How research concepts and authored tools influence retrieval, conversation, questions, proposed WorldSpec deltas, deterministic validation, reflection, and later Minecraft interaction.

## Database representation

The ontology remains structurally distinct from private learner conversations and research-submission records. Current D1 structures include:

```text
ontology_versions
ontology_sources
ontology_concepts
ontology_precepts
ontology_precept_codes
ontology_source_metrics
ontology_relationships
ontology_source_passages
ontology_passages_fts
ontology_tools
ontology_tool_steps
ontology_tool_concepts
```

The database preserves source attribution, version history, relationship type, source references, and whether a relationship is original-to-source or a later TurtleBlock AI interpretation.

## Retrieval principle

The entire corpus should not be injected into every Turtle turn.

- The Turtle Charter remains trusted behavioral instruction.
- WorldSpec rules remain trusted system architecture.
- The research ontology provides structured retrieval vocabulary and conceptual lineage.
- Sanders' writings and authored tools are retrieved selectively when relevant.
- Learner and project history are retrieved selectively for continuity.

The Dedoose tags therefore become useful again in a new computational context: they help narrow retrieval, connect ideas across decades of work, and expose why a Turtle behavior or WorldSpec design choice has a scholarly lineage.

This allows Turtle to explain not only **what** it is doing, but, when appropriate, **why the system was designed that way**, with traceable scholarly provenance.

## Intellectual lineage

```text
Dewey / Freire / Papert
        ↓
Sanders dissertation document analysis + Dedoose coding
        ↓
Critical Techno Constructivism
        ↓
Sanders-authored operational tools
        ↓
STEAMHAMLET / digital learning environments / Logo / Minecraft / Purposeful Play
        ↓
Engaging with AI / Co-active Emergence
        ↓
Turtle Charter + WorldSpec
        ↓
TurtleBlock AI
```

## Current research question made executable

TurtleBlock AI now asks whether a decades-long learner-centered educational research program can become inspectable software without flattening the scholarship that produced it.

The desired result is not an AI that vaguely imitates Sanders' writing. It is a system that can retrieve and distinguish:

- an original Dedoose code,
- a dissertation finding or precept,
- a later Sanders-authored concept,
- an operational pedagogical tool,
- a TurtleBlock interpretation,
- and a learner's own present meaning.

That distinction is the ontology.

This file is the canonical naming, provenance, and architectural document for the Dr. Bryan P. Sanders TurtleBlock AI research ontology.
