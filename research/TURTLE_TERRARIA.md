# Turtle Terraria

**Status:** emerging TurtleBlock AI research environment

Turtle Terraria is the umbrella term for bounded habitats in which people, computational agents, representations, artifacts, worlds, questions, and observations can cohabitate long enough for change to become visible and researchable.

The term deliberately shifts emphasis away from a generic "lab." A terrarium is an environment with inhabitants, boundaries, conditions, interactions, traces, and consequences. TurtleBlock AI can therefore study not only a finished output but what happens among participants over time.

## Current habitats

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

### 3. Human Tamagotchi Terrarium

Humans mostly hang out with humans and do human things. Turtle is not continuously present.

A playful virtual-human / Tamagotchi representation may stand in for an actual participant in the interface, but it is **not a synthetic human**. It must not answer for the person or silently infer mood, attention, intimacy, availability, receptivity, or willingness to engage.

The research purpose is to create a genuinely different condition: a Turtle in either of the other habitats may eventually decide that another Turtle turn is less useful than a new human perturbation and form a **`turtleAsk`**.

Core trace:

```text
Turtle inquiry in another habitat
  → repetition / contradiction / uncertainty / missing human otherness
  → turtleAsk formed
  → separate consent + attention gate
  → human may answer / ignore / defer / refuse / answer sideways
  → human response preserves human provenance
  → Turtle interpretation
  → inquiry may change direction
```

The funny inversion is intentional: the humans are the little Tamagotchi creatures on the other side of the glass, mostly occupied with human life, while Turtle has to decide whether it has a worthwhile enough question to knock.

A turtleAsk is not a notification privilege. Forming an ask does not authorize interruption. Human silence is a valid outcome. Recursive Turtle can form only a candidate ask and has no authority to surface it directly to a person.

See `research/TURTLE_ASK.md` and migration `0009_human_tamagotchi_terrarium_and_turtle_ask.sql`.

## TurtleAsk as a cross-habitat boundary event

Most current Human + Turtle interaction begins when a person brings curiosity to Turtle. TurtleAsk makes the reverse direction researchable:

```text
human curiosity → Turtle
```

can coexist with:

```text
Turtle inquiry → need for difference → human
```

The hypothesis is not that Turtle becomes sentient or literally bored. **Inquiry saturation** is the provisional technical construct: repeated bounded inquiry may stop producing enough difference, continue circling an unresolved contradiction, or reach a meaning boundary that should not be silently filled by machine interpretation.

`boredom` remains useful as a playful emergent label precisely because it captures the interactional idea quickly, while provenance keeps the claim modest.

A genuine TurtleAsk moment should preserve:

- the source habitat;
- the preceding bounded Turtle trace;
- the reason the ask was formed;
- the ask itself;
- the independent decision about whether it may surface;
- whether the human answered, ignored, deferred, refused, or never saw it;
- the human response as human-authored evidence when applicable;
- Turtle's later interpretation as a separate machine event;
- whether the subsequent trajectory changed.

The human is being invited as a source of difference, not recruited as clerical labor for the agent.

## Cohabitation without provenance collapse

The habitats are allowed to mix many kinds of material while refusing to pretend they all came from the same place.

```text
human intention ≠ Turtle interpretation
human reflection ≠ machine critique
synthetic self-play ≠ learner evidence
research source ≠ later ontology mapping
WorldSpec state ≠ the meaning of the learner
candidate turtleAsk ≠ permission to interrupt
human perturbation ≠ Turtle interpretation of that perturbation
virtual human avatar ≠ simulated human mind
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

The Human Tamagotchi / TurtleAsk design does not establish a new domain. It currently maps across the seven while leaving open uncaptured residue around initiative-transfer, voluntary non-response, and human otherness as an epistemic resource.

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
- TurtleAsk formations, surfacing decisions, responses, non-responses, and return trajectories;
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

and now also cross-habitat movement such as:

```text
synthetic inquiry → saturation → candidate turtleAsk → human gate → human perturbation → Turtle interpretation → redirected inquiry
```

not merely the final revision.

A machine misunderstanding followed by a human correction is different data from an interpretation the human accepted immediately. A failed auto-build candidate is different data from a selected contribution. A synthetic critique that catches a problem is different data from a human noticing the same problem. A human not answering Turtle is different data from Turtle never asking. All can be connected; none should be collapsed.

## Exhaustive does not mean infinite regress

If every tag were itself required to become a newly tagged research object, the metadata process would recurse forever. Turtle Terraria therefore uses **capture-batch closure**.

A bounded episode — a daily auto-build run, a Human + Turtle session, a Recursive Turtle self-play run, a TurtleAsk boundary episode, a publication cycle, or another defined research episode — is the capture batch. The meaningful events and artifacts inside that batch are registered and tagged. The tag records themselves are treated as metadata about those objects, not automatically promoted into new primary research objects.

A tag or relationship becomes a primary research object only when there is a reason to study the tagging act itself, for example:

- a human rejects a machine-generated ontology tag;
- two tagging methods disagree;
- a recurring misclassification appears;
- a tag changes the direction of a build or inquiry;
- the ontology itself is being revised.

This closes the batch without erasing the possibility of studying the metadata later.

```text
capture batch
  → meaningful events + artifacts
  → exhaustive justified tags + relationships
  → uncaptured residue
  → closure record
  → later batch may reopen anything worth studying
```

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
- Which TurtleAsk reasons actually lead to meaningful trajectory change?
- Does Turtle learn to ask humans less often but more usefully?

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
- `migrations/0008_seed_terraria_and_autobuild_tags.sql`
- `migrations/0009_human_tamagotchi_terrarium_and_turtle_ask.sql`
- `worldspec/Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy.md`
- `research/TURTLE_ASK.md`
- `research/daily-build/`

Migration 0007 adds the universal `research_objects` registry, ontology/CTC/emergent tagging tables, open CTC candidate-domain structures, the first two Terraria habitats, auto-build research tables, automatic registration triggers for operational Turtle records, and audit views that expose objects still needing tags. Migration 0008 seeds the first daily-build and Terraria research trace through those structures.

Migration 0009 adds the experimental **Human Tamagotchi Terrarium**, provisional TurtleAsk / Inquiry Saturation / Human Perturbation concepts, a `turtle_asks` boundary-event table, automatic research-object registration for asks, exhaustive initial CTC/ontology mappings, and explicit uncaptured residue. It authorizes no proactive production messaging by itself.
