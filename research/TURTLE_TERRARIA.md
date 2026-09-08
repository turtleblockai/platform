# Turtle Terraria

**Status:** emerging TurtleBlock AI research environment

Turtle Terraria is the umbrella term for bounded habitats in which people, computational agents, representations, artifacts, worlds, questions, and observations can cohabitate long enough for change to become visible and researchable.

The term deliberately shifts emphasis away from a generic "lab." A terrarium is an environment with inhabitants, boundaries, conditions, interactions, traces, and consequences. TurtleBlock AI can therefore study not only a finished output but what happens among participants over time.

## Initial habitats

### 1. Human + Turtle Terrarium

A person drives inquiry. Turtle may contribute questions, interpretations, comparisons, possible consequences, technical assistance, retrieval, and construction. The person retains purpose, meaning, judgment, correction, reflection, disagreement, and the right to revise.

Core trace:

```text
human intention
  → Turtle interpretation
  → shared representation / WorldSpec
  → construction or other artifact
  → experience / observation
  → human reflection or correction
  → revision
  → new question
```

This habitat may produce human-learning evidence when the research and consent boundaries permit it.

### 2. Recursive Turtle Terrarium

Synthetic Turtle roles work with one another inside a bounded self-play environment. A Builder Turtle may propose; a Reflector Turtle may question assumptions, inspect provenance, apply the Turtle Charter and research ontology, generate hostile cases, and request revision.

Core trace:

```text
synthetic problem
  → Builder Turtle proposal
  → Reflector Turtle critique
  → revision
  → deterministic / regression test
  → synthetic research trace
  → human review gate
```

All machine-to-machine traces are `synthetic_self_play`. They are never counted as evidence of human learning and possess no authority to promote their own changes directly into production.

## Cohabitation without provenance collapse

The habitats are allowed to mix many kinds of material while refusing to pretend they all came from the same place.

```text
human intention ≠ Turtle interpretation
human reflection ≠ machine critique
synthetic self-play ≠ learner evidence
research source ≠ later ontology mapping
WorldSpec state ≠ the meaning of the learner
```

Cohabitation is the feature. Provenance collapse is the failure mode.

## CTC structure

The seven Sanders-authored Critical Techno Constructivism domains remain the established operational framework:

1. Personal Inquiry
2. Compelling Problem or Question
3. Technology as Tool to Think With
4. Formative Demonstration of Learning
5. Reflection as Learning
6. Social and Cultural Critique
7. Sharing and Collaborating

Turtle Terraria is designed to record evidence across those domains rather than merely attach a single summary tag to a session.

## Room for an eighth, ninth, or tenth domain

The seven domains are not to be casually rewritten by the machine. At the same time, the research architecture should not assume in advance that every future observation must fit them.

When something important appears not to fit:

1. preserve the observation;
2. explicitly mark why the current seven seem insufficient;
3. leave it in the `ctc_uncaptured_observations` pool;
4. allow related observations to accumulate;
5. optionally form a provisional candidate domain;
6. require an explicit human scholarly decision before promoting that candidate into the established CTC domain set.

The purpose is to make the **unknown unknown** queryable without manufacturing a new theory every time the parser feels confused. 🐢

## Exhaustive tagging doctrine

The research ontology should function throughout the platform rather than as an isolated bibliography database.

Anything that may later matter becomes a `research_object` or is linked to one:

- learner sessions and turns;
- Turtle turns;
- WorldSpec revisions;
- questions;
- corrections;
- reflections;
- Terraria runs, events, artifacts, and observations;
- synthetic Builder/Reflector exchanges;
- publications and source passages;
- external research signals;
- daily auto-build runs and deliberations;
- rejected build candidates;
- repository changes;
- tests and failures;
- public Build Log entries;
- later Minecraft/world observations.

Each object may receive **multiple overlapping layers of tags**:

### Sanders ontology tags

Links to `ontology_concepts`. These preserve the longitudinal research graph from the original dissertation Dedoose codes through later published and operational concepts.

### CTC domain tags

Links to the seven established operational domains. These describe how an object participates in CTC, with rationale and evidence rather than a bare label.

### Emergent/free tags

Provisional descriptive language that is useful before it belongs in the formal ontology.

### Uncaptured observations

A deliberate place for significant material that current categories fail to represent.

## Tag the movement, not merely the artifact

An exhaustive ontology should capture transitions:

```text
question → interpretation → disagreement → correction → revision
```

not merely the final revision.

A machine misunderstanding followed by a human correction is different data from an interpretation the human accepted immediately. A failed auto-build candidate is different data from a selected contribution. A synthetic critique that catches a problem is different data from a human noticing the same problem. All can be connected; none should be collapsed.

## Auto-build as a research participant

The daily auto-build process is itself part of the research history and should be mineable later. Migration `0007_turtle_terraria_and_exhaustive_tagging.sql` therefore provides first-class structures for:

- auto-build runs;
- source signals;
- ontology mappings;
- questions;
- candidates and rejections;
- selected contribution;
- implementation events;
- repository changes;
- tests;
- version judgments;
- public notes;
- human overrides.

This makes it possible to ask questions later such as:

- Which CTC domains most often influence actual code changes?
- Which dissertation codes recur in rejected versus accepted ideas?
- Does the auto-build increasingly favor learner agency or technical infrastructure?
- Which external research sources generate useful changes rather than noise?
- What kinds of machine assumptions are most frequently corrected by people?
- What recurring observations fail to fit the current seven CTC domains?

## Database principle

The database is not merely storage behind the website. It is the research substrate of TurtleBlock AI.

The intended direction is:

```text
something happens
  → preserve provenance
  → register research object
  → attach CTC mappings
  → attach ontology mappings
  → attach emergent tags
  → preserve uncaptured residue
  → relate it to other objects
  → make it queryable later
```

The system should prefer **over-preserving relationships and provenance** to prematurely reducing an event to one canonical interpretation.

## SQL implementation

See:

- `migrations/0007_turtle_terraria_and_exhaustive_tagging.sql`
- `worldspec/Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy.md`
- `research/daily-build/`

Migration 0007 adds the universal `research_objects` registry, ontology/CTC/emergent tagging tables, open CTC candidate-domain structures, two initial Terraria habitats, auto-build research tables, automatic registration triggers for operational Turtle records, and audit views that expose objects still needing tags.
