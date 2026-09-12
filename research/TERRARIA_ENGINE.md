# Terraria Engine

**Status:** v0.1 thin orchestration layer · experimental

The first Turtle Terraria engine is intentionally small.

It is **not** a second chatbot, a new model, a simulated classroom, or an autonomous research agent. It is the layer that makes the conditions of an interaction explicit enough to study without collapsing them into the dialogue itself.

## What the engine does

For an interaction, the Terraria engine can identify and preserve:

- which habitat the interaction belongs to;
- which real or synthetic actor types are present;
- the entry condition or interaction mode;
- the canonical Turtle session and WorldSpec involved;
- the ordered event trace;
- privacy and evidence class;
- model/configuration metadata where appropriate;
- links to canonical raw records instead of unnecessary payload duplication;
- supported CTC / Sanders ontology / emergent mappings later in the research pipeline;
- uncaptured residue when existing concepts do not fit.

In shorthand:

```text
conversation engine = what Turtle and a person say / interpret
Terraria engine    = what research condition they are inhabiting while it happens
```

Both can coexist without becoming the same thing.

## Human + Turtle v0.1

The first implemented slice wraps the existing public TRY IT conversation path.

```text
visitor chooses an entry mode
        ↓
explicit Playground research consent
        ↓
/api/terraria/play
        ↓
existing Turtle conversation engine
        ↓
canonical private session + turns + WorldSpec revision
        ↓
screened Playground research submission
        ↓
Human + Turtle Terrarium run/event trace
```

Initial entry modes:

- **Wander with Turtle** — begin with a question, half-thought, contradiction, or unfinished idea;
- **Make a world** — begin with something potentially constructible or inhabitable;
- **Throw in something weird** — introduce a perturbation deliberately rather than working toward a predetermined outcome.

These are **entry conditions**, not learner types, curricular tracks, personality classifications, or assessment labels.

## Canonical-record rule

The Terraria engine should not create a second copy of everything merely because an interaction is researchable.

For public TRY IT:

- raw learner/Turtle dialogue remains canonical in `turtle_turns`;
- evolving state remains canonical in `worldspec_revisions`;
- consented Playground research intake remains canonical in the Playground research-data pipeline;
- `terraria_runs` records the habitat episode;
- `terraria_events` records the ordered research trace and points conceptually back to the canonical records.

The v0.1 bridge therefore stores Terrarium event context without duplicating raw dialogue text.

## Research boundary

A Terrarium trace does not convert participation into evidence of learning.

```text
consented play ≠ public artifact
consented play ≠ approved dataset item
consented play ≠ demonstrated learning
human turn ≠ Turtle interpretation
Terrarium event ≠ raw dialogue copy
```

Later analysis may ask learning questions only under the appropriate research, evidence, and consent conditions.

## Other habitats

### Recursive Turtle

A future engine path may create bounded synthetic runs with Builder / Reflector or other roles. Every such trace remains `synthetic_self_play`, has no production authority, and never counts as human-learning evidence.

### Human Tamagotchi

The Human Tamagotchi habitat is mostly defined by absence: Turtle is not continuously participating. A future engine path may hold candidate `turtleAsk` events generated elsewhere and preserve the independent gate that determines whether an actual human ever sees one.

The engine must never simulate the human response.

## Interaction engine versus attention engine

The Terraria engine records a habitat and its events. It does not grant interruption authority.

Selective Attention and TurtleAsk remain separate contracts:

```text
Terraria engine knows an ask exists
        ≠
attention policy says it may surface now
        ≠
human owes Turtle a response
```

## Current implementation

The v0.1 Human + Turtle slice currently consists of:

- `public/assets/terraria-try.js` — playful TRY IT entry modes and request provenance;
- `src/entry.ts` — `/api/terraria/play`, which delegates dialogue to the existing conversation engine and conditionally writes the Terrarium trace;
- `scripts/validate-terraria-try.mjs` — deterministic contract check;
- migration-0007 Terraria tables and research-object architecture;
- the existing private Turtle session / turn / WorldSpec persistence and Playground research screening pipeline.

If the bound D1 database does not yet contain the relevant Terraria tables, the runtime must report that the Terrarium trace was not stored rather than claiming success.

## Why this is useful

The engine makes it possible to study **conditions and movement** instead of only transcripts:

- Do different entry conditions produce different inquiry trajectories?
- When does a build-oriented conversation become reflective rather than merely additive?
- Does deliberately strange perturbation create new Possible Possibles?
- When does a person correct Turtle versus follow its interpretation?
- Which CTC domains become visible through the movement of an interaction?
- What fails to fit the existing ontology?
- Eventually, what conditions precede a worthwhile TurtleAsk?

The engine should grow only when a new research distinction earns representation.

## v0.1 principle

> **Do not build a giant Terraria machine first. Make the habitat boundary observable, let people play, and allow the evidence to tell us what the engine needs next.**
