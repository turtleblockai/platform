# D1 Reconciliation Sweep

**Status:** standing research-preservation process

TurtleBlock AI should not allow its public repository, WWW, Build Log, research notes, tests, migrations, experiments, or consented play traces to grow faster than the research database can remember what exists.

The daily build therefore includes a **D1 reconciliation sweep**.

## Purpose

The sweep asks a deliberately boring but important question:

> What exists in the living project that is not yet represented, linked, or intentionally excluded in the D1 research substrate?

The goal is not to copy every byte into D1. The goal is to avoid losing **research identity, provenance, relationships, and discoverability** as the project changes.

A source artifact may remain canonical in Git, the WWW, a Turtle session table, a WorldSpec revision, or another store while D1 preserves a research-object pointer and the metadata needed to find and interpret it later.

## Daily sweep surfaces

Review, at minimum:

- `BUILD_IN_PUBLIC.md`;
- `research/`, including daily-build notes and tag manifests;
- `worldspec/`, including the Turtle Charter, schemas, hostile cases, and the Sanders ontology documentation;
- `src/` when code or behavior changes have research significance;
- `scripts/` when an evaluation or deterministic contract changes;
- `migrations/`;
- `.github/workflows/` when automation changes research behavior;
- `public/` and the public routes at `turtleblockai.com`;
- `src/buildLog.ts`;
- `public/data/next-edge.json`;
- consented TRY IT / Turtle conversation traces when D1 is active;
- Terraria runs, events, artifacts, observations, TurtleAsk records, and related operational traces when their tables are active.

## Reconcile; do not indiscriminately duplicate

The preferred pattern is:

```text
canonical artifact or event
        ↓
research_object identity
        ↓
source pointer / repo path / source table
        ↓
CTC + Sanders ontology + emergent tags
        ↓
relationships
        ↓
uncaptured residue
```

Raw private dialogue should stay in its canonical operational table rather than being copied into public or generalized research text fields merely to satisfy the sweep.

Public repository artifacts may usually be represented by `repo_path` and source URI. Private operational records should normally be represented by `source_table` + `source_id`, with privacy and evidence class preserved.

## Three outcomes for every meaningful candidate

A sweep candidate should end in one of three states:

1. **represented** — already has an adequate D1 research object and supporting relationships/tags;
2. **backfilled** — a missing representation was safely created or strengthened;
3. **intentionally not captured** — there is a documented reason not to ingest or link it, such as privacy, irrelevance, duplication, unsupported provenance, or a still-unapplied migration.

Silence is not a fourth state.

## When live D1 is available

When an appropriately authorized D1 path is available:

- compare current project surfaces against `research_objects` and the relevant operational tables;
- backfill safe public/system artifacts that are missing;
- preserve canonical source pointers rather than copying payloads unnecessarily;
- attach supported CTC, Sanders ontology, emergent, relationship, privacy, actor, evidence, model/configuration, and version metadata;
- record unresolved gaps and uncaptured observations;
- never inspect, infer, copy, or publish secret values while reconciling environment-backed behavior.

## When live D1 is not available

Do not pretend persistence occurred.

Instead:

- produce or update a reconciliation staging record under `research/d1-reconciliation/` when a material gap is found;
- preserve enough information to perform a later backfill safely;
- identify the intended table/object type and canonical source pointer;
- distinguish an unapplied migration from a missing conceptual record;
- report only meaningful gaps rather than generating churn for unchanged files.

Daily-build `.tags.json` remains a valid lossless staging mechanism for the bounded build cycle; the reconciliation sweep is broader because it checks whether older or adjacent project artifacts have fallen outside that cycle.

## WWW rule

Public pages are part of the research artifact, not merely marketing copy.

When a public page introduces a meaningful concept, architecture, behavior, experimental boundary, research claim, interaction mode, or reversal, the sweep should verify that the underlying concept/event is represented in D1 or in a lossless staging record.

Do not create a database row for every paragraph or cosmetic text change. Capture the **research-bearing object or change** and link the public representation to it.

## TRY IT / consented play

TRY IT is a live research surface.

When a person explicitly consents to the current Playground research boundary, the system may preserve:

- the private Turtle session;
- human and Turtle turns with distinct provenance;
- WorldSpec revisions;
- the screened Playground research submission;
- a Human + Turtle Terrarium run/event trace describing the interaction context without unnecessarily duplicating raw dialogue.

Human play is not automatically public, not automatically an approved dataset item, and not automatically evidence of learning. Consent to research capture does not erase those distinctions.

## Capture-batch closure still applies

The reconciliation sweep is not permission for metadata infinite regress.

Treat the daily sweep as a bounded capture batch. Reconciliation metadata becomes a primary research object only when the reconciliation itself matters intellectually — for example, a recurring class of missing artifacts reveals a design failure, a privacy boundary blocks capture, or two representations materially disagree.

## Daily-build reporting

The daily build should report reconciliation only when something meaningful happened:

- a gap was found;
- a safe backfill was completed;
- a migration/schema mismatch was discovered;
- a public page materially diverged from D1/repository research state;
- a privacy or provenance boundary prevented capture;
- the sweep itself changed project architecture.

A clean sweep may be recorded tersely.

## Guiding principle

**Do not let the project know something in public today that the research substrate cannot find tomorrow.**
