# Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy

**Public academic name:** the Dr. Bryan P. Sanders TurtleBlock AI research ontology

**Status:** foundational research ontology; additive and versioned

## Purpose

The `Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy` is the canonical research ontology connecting Dr. Bryan P. Sanders' doctoral research, subsequent published writing, the Turtle Charter, WorldSpec, and the developing behavior of TurtleBlock AI.

The ontology is not an AI-generated replacement for the original scholarship. It preserves the terminology and provenance of the source research and adds later TurtleBlock AI mappings as a separate interpretive layer.

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

These codes originate in *Toward a Unified Computer Learning Theory: Critical Techno Constructivism* (Sanders, 2019), where theoretical precepts were converted into excerpting codes and applied to selected passages from John Dewey, Paulo Freire, and Seymour Papert.

## Provenance rule

Original research terminology is immutable at the source layer. TurtleBlock AI may add relationships, retrieval tags, operational mappings, WorldSpec relevance, Charter relevance, or later theoretical extensions, but it must not silently rename or overwrite an original code.

Example:

```text
Problem Posing Education
  source_layer: Sanders dissertation / original Dedoose code
  turtleblock_mapping:
    - learner-generated questions
    - inquiry continuation
    - generative Turtle dialogue
    - unresolved WorldSpec questions
```

The TurtleBlock mapping is explicitly subsequent interpretation; it is not represented as the original 2019 code definition.

## Ontology layers

### 1. Original research ontology

The dissertation code set, theoretical-precept mappings, excerpt frequencies, co-occurrences, and source passages.

### 2. Published research lineage

Concepts developed or extended in Sanders' later work, including Minecraft as a learning environment, purposeful play, STEAMHAMLET, Engaging with AI, and co-active emergence.

### 3. Turtle Charter mappings

Relationships between the research ontology and Turtle's behavioral constitution: learner agency, inquiry, dialogue, authorship, uncertainty, disagreement, reflection, reversibility, and human judgment.

### 4. WorldSpec mappings

Relationships between the research ontology and inspectable computational representation: learner language, explicit meaning, provisional interpretation, unresolved meaning, constraints, provenance, revision, and inhabitable construction.

### 5. Operational Turtle mappings

How research concepts influence retrieval, conversation, questions, proposed WorldSpec deltas, deterministic validation, reflection, and later Minecraft interaction.

## Intended database representation

The ontology should remain structurally distinct from private learner conversations and research-submission records. A later D1 migration should support entities such as:

```text
ontology_sources
ontology_concepts
ontology_source_passages
ontology_relationships
ontology_mappings
ontology_versions
```

The database should preserve source attribution, version history, relationship type, confidence/status, and whether a relationship is original-to-source or a later TurtleBlock AI interpretation.

## Retrieval principle

The entire corpus should not be injected into every Turtle turn.

- The Turtle Charter remains trusted behavioral instruction.
- WorldSpec rules remain trusted system architecture.
- The research ontology provides structured retrieval vocabulary and conceptual lineage.
- Sanders' writings are retrieved selectively when relevant.
- Learner and project history are retrieved selectively for continuity.

This allows Turtle to explain not only **what** it is doing, but, when appropriate, **why the system was designed that way**, with traceable scholarly provenance.

## Intellectual lineage

```text
Dewey / Freire / Papert
        ↓
Sanders dissertation document analysis + Dedoose coding
        ↓
Critical Techno Constructivism
        ↓
Minecraft / Purposeful Play / STEAMHAMLET
        ↓
Engaging with AI / Co-active Emergence
        ↓
Turtle Charter + WorldSpec
        ↓
TurtleBlock AI
```

This file is the canonical naming and provenance document for that research ontology.