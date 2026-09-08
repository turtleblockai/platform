# 2026-09-08 — Next Edge addendum

## Human direction

After reviewing the repaired WWW, Bryan proposed a sharper Build Log distinction:

- completed work should be recorded as completed and committed;
- the public horizon should be a single **Next Edge** above the historical log;
- Next Edge should always look one move beyond the newest completed build;
- the horizon should be fed by the widest useful TurtleBlock AI ecology rather than a conventional backlog;
- candidate possibilities should include serious, obvious, wacky, theoretically strange, technically small, and currently unfathomable possibilities;
- one explicit **X factor** should remain open so the ontology and planning system do not pretend the future is already fully categorized.

Bryan described the desired quality as the kind of question that produces: *if I did not have to go to bed, this is probably what I would work on next.*

This direction is preserved as human-authored research/design input rather than being retrospectively attributed to the automated build process.

## Conceptual result

The project now distinguishes:

```text
NEXT EDGE — one living open question
↓
LATEST COMMITTED BUILD — what was actually done
↓
OLDER COMMITTED BUILDS — retained history
```

The Next Edge is not a roadmap promise or unfinished build item. It is a research horizon.

A new doctrine document, `research/NEXT_EDGE.md`, defines candidate inputs, provenance, authority boundaries, possible possibles, and the X-factor rule.

A new machine-readable public artifact, `public/data/next-edge.json`, carries the current horizon separately from historical Build Log entries.

The direct-asset WWW runtime now reads that artifact and renders the Next Edge above completed milestones. Historical `Current edge` / `Next` cards embedded in the older SPA are no longer treated as permanent roadmap entries.

## Candidate input ecology

When available and appropriately authorized, a future edge synthesizer may consult:

- repository state and committed changes;
- D1 research objects, CTC/ontology mappings, uncaptured observations, Terraria traces, auto-build records, and failures;
- R2 artifact metadata and evidence objects;
- runtime/environment metadata only, never secret values;
- project documents and research materials available to the active TurtleBlock AI context;
- the Sanders research ontology;
- consent-safe learner/world observations;
- external daily research signals;
- contradictions between code, documentation, public WWW behavior, and human experience;
- rejected candidates and unresolved questions;
- one deliberately unclassifiable X factor.

## Current Next Edge

**Make the edge of curiosity observable.**

> Can TurtleBlock AI continuously synthesize one irresistible next question from the whole ecology of the project without turning curiosity into a backlog or letting the machine mistake a suggestion for authority?

The X factor is intentionally recorded as:

`whoooo knooooowwwssssssssssss`

## WWW repair follow-up

The Turtle Terraria right-side navigation rail was already declared sticky, but it can be taller than the desktop viewport. A sticky element taller than its available viewport cannot behave like the intended fixed research console. The Terraria page now constrains the desktop rail to the viewport and gives the rail its own internal overflow when needed:

```text
position: sticky
max-height: calc(100vh - 56px)
overflow-y: auto
```

Mobile behavior remains unchanged and non-sticky.

## Research interpretation

This episode extends the project's distinction between **artifact history** and **inquiry horizon**. The Build Log answers *what changed?* Next Edge answers *what is tugging now?*

The distinction also protects provenance. A machine-generated possibility is not a completed feature, a research finding, a human decision, or a roadmap commitment. It is a candidate question whose origin and selection can be inspected.

## Version judgment

No product version bump. This is research-process, public-interface, and provenance architecture.
