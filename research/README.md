# TurtleBlock AI Research Infrastructure

This directory documents how TurtleBlock AI becomes a transparent, reviewable, provenance-aware research environment without treating every interaction as automatically approved training data.

## Documents

- [DATA_PIPELINE.md](./DATA_PIPELINE.md) — raw → screened → redacted → candidate → reviewed → approved/rejected
- [CLOUDFLARE_D1_SETUP.md](./CLOUDFLARE_D1_SETUP.md) — D1 activation and migration workflow
- [TURTLE_TERRARIA.md](./TURTLE_TERRARIA.md) — multiple research habitats, CTC-domain openness, and exhaustive tagging doctrine
- [`daily-build/`](./daily-build/) — daily source hunts, deliberation, implementation notes, and ingestion-ready tag manifests

## Current architecture

D1 is bound to the Worker as `DB`. Repository migrations define the research schema; the live database only gains a table or capability once the corresponding migrations have actually been applied remotely.

The research architecture now has several deliberately distinct layers:

```text
private operational interaction
  ≠ approved research/training dataset
  ≠ synthetic self-play
  ≠ public artifact
  ≠ scholarly source
```

Those layers may be related, but their provenance and evidence status must not collapse.

## Longitudinal Sanders ontology

Migrations `0003`–`0006` preserve and extend the Dr. Bryan P. Sanders TurtleBlock AI research ontology:

- immutable original dissertation Dedoose terminology;
- theoretical-precept mappings and source metrics;
- later Sanders-authored concepts and sources;
- the seven authored CTC Tenet → Question → Action steps;
- pedagogical/research experiments;
- publications, artifacts, source lineage, and retrieval views.

## Turtle Terraria + universal research objects

Migration `0007_turtle_terraria_and_exhaustive_tagging.sql` adds the cross-platform observation layer:

- `research_objects` — universal registry for anything worth mining later;
- `research_object_ontology_tags` — links objects to the Sanders ontology;
- `ctc_domains` and `research_object_ctc_tags` — the seven established operational domains plus object-level mappings;
- `research_tags` / `research_object_tags` — provisional and emergent descriptive vocabulary;
- `ctc_uncaptured_observations` / `ctc_candidate_domains` — explicit room for important evidence that does not fit the current seven domains;
- `terraria_habitats`, runs, participants, events, artifacts, and observations;
- auto-build runs, events, repository changes, and tests;
- registration triggers and tag-coverage audit views.

Migration `0008_seed_terraria_and_autobuild_tags.sql` makes the first Terraria / auto-build cycle queryable as structured research history rather than only prose.

## Exhaustive tagging principle

The goal is not to classify each object once. It is to preserve as many justified relationships as possible while keeping their provenance visible.

```text
something happens
→ preserve it
→ identify who/what produced it
→ map supported CTC domains
→ map supported Sanders ontology concepts
→ add useful emergent tags
→ preserve anything the categories fail to capture
→ relate it to the surrounding recursive cycle
```

A question, correction, rejection, failed test, synthetic critique, human reflection, WorldSpec revision, and final artifact are different research objects even when they belong to the same episode.

## Research boundary

The public Playground and Terraria can create researchable traces without making those traces automatically eligible for training or public release.

```text
public Playground submission != approved dataset row
synthetic Turtle self-play != human learner evidence
private conversation != public Terraria artifact
```

Only explicitly reviewed and approved redacted records belong in future curated research/evaluation/training exports. Synthetic self-play remains separately labeled and may be used for regression or architecture research, never as evidence that a human learned something.
