# TurtleBlock AI Daily Build — 2026-09-08 Terraria Addendum

This addendum records the human-directed second recursion of the first daily build cycle.

## Human intervention

After the first hunt proposed a future Turtle-to-Turtle review loop, Bryan Sanders reframed the concept from a generic **Turtle Lab** into **Turtle Terraria**: an umbrella research environment with multiple bounded habitats whose inhabitants and evidence types may cohabitate without provenance collapse.

The first two habitats are:

1. **Human + Turtle Terrarium** — human-driven inquiry and iteration with TurtleBlock AI;
2. **Recursive Turtle Terrarium** — explicitly synthetic machine-to-machine self-play for critique, regression, interpretation, and ontology testing.

This is itself an example of the Co-Active Trace problem identified earlier in the day: the machine's initial proposal remained material for human interpretation; the human changed the conceptual frame; the system architecture was then revised accordingly. The human intervention should therefore remain visible rather than being retroactively presented as though the machine proposed Turtle Terraria from the beginning.

## CTC expansion question

The seven authored CTC operational domains remain established:

1. Personal Inquiry
2. Compelling Problem or Question
3. Technology as Tool to Think With
4. Formative Demonstration of Learning
5. Reflection as Learning
6. Social and Cultural Critique
7. Sharing and Collaborating

The new architecture deliberately refuses to assume that those seven exhaust every future observation. Migration `0007_turtle_terraria_and_exhaustive_tagging.sql` adds `ctc_uncaptured_observations` and `ctc_candidate_domains` so observations that do not fit can accumulate before any proposed eighth, ninth, tenth, or later domain is considered.

Machine systems may propose a candidate domain. Promotion into the established CTC framework requires explicit human scholarly judgment.

## Database contribution

### Migration 0007

`migrations/0007_turtle_terraria_and_exhaustive_tagging.sql` adds:

- universal `research_objects` registry;
- object-to-Sanders-ontology tags;
- established CTC domains and object-to-CTC tags;
- emergent/free tags;
- relationships among research objects;
- uncaptured observations and candidate CTC domains;
- `terraria_habitats`, runs, participants, events, artifacts, and observations;
- `autobuild_runs`, events, repo changes, and tests;
- automatic registration triggers for Turtle sessions, Turtle turns, WorldSpec revisions, Playground submissions, publications, Terraria records, and auto-build records;
- coverage views showing objects that still need ontology/CTC tags.

The migration seeds the Human + Turtle and Recursive Turtle habitats and adds later operational ontology concepts for Turtle Terraria, provenance-preserving cohabitation, and synthetic recursive dialogue. These are explicitly later TurtleBlock research-development concepts, not retroactive dissertation codes.

### Migration 0008

`migrations/0008_seed_terraria_and_autobuild_tags.sql` demonstrates that the auto-build itself is researchable. The first hunt's source signals, deliberation, candidate rejection, Co-Active Trace selection, human Terraria redirection, repository changes, CTC mappings, and ontology mappings are represented as structured records.

## Exhaustive tagging doctrine

The user directed that the ontology be used throughout TurtleBlock AI rather than remain an isolated research database. The working rule is now:

```text
something happens
→ preserve provenance
→ register research object
→ map every supported CTC domain
→ map every supported Sanders ontology concept
→ add emergent tags
→ preserve what does not fit
→ connect it to the surrounding recursive cycle
→ keep it queryable
```

Tagging is deliberately many-to-many. A change can participate in multiple CTC domains and multiple ontology concepts simultaneously.

## Avoiding infinite metadata regress

"Tag everything" creates a potential recursion problem if every tag must itself become another object requiring another tag. Turtle Terraria resolves this with **capture-batch closure**.

A daily build, Human + Turtle session, Recursive Turtle run, or other bounded episode is a capture batch. Meaningful events and artifacts inside it are primary research objects. Tags and relationships are metadata unless the tagging act itself becomes analytically meaningful — for example, when a human rejects a machine tag or two taggers disagree.

## WWW change

The website now displays **Turtle Terraria** in place of Turtle Lab and introduces the two initial habitats. The existing `/lab/` path is temporarily retained for compatibility; naming and architecture can later move to `/terraria/` without losing historical links.

## Structured tag manifest

`research/daily-build/2026-09-08.tags.json` preserves an ingestion-ready representation of this cycle's objects, CTC mappings, ontology mappings, emergent tags, relationships, and currently uncaptured observations.

Two uncaptured observations are intentionally left open:

1. synthetic machine-to-machine recursive activity may be an application/research method around CTC rather than a learner-centered CTC domain;
2. cohabitation-without-provenance-collapse cuts across the seven domains and may remain a cross-cutting design principle instead of becoming a new domain.

No eighth CTC domain is proposed yet.

## Version judgment

This is a substantial research/database architecture expansion but not yet a new learner-facing tested product capability. **Remain at v0.1.0.**

The next important implementation gap is to connect live Turtle/Terraria events to semantic ontology tagging at write time, rather than merely registering them for later tagging. The `research_objects_needing_tags` view is intentionally designed to expose that gap instead of hiding it.
