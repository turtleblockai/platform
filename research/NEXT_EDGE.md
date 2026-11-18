# Next Edge

**Next Edge** is the public horizon of TurtleBlock AI.

It is not a backlog item, a promise, or a description of work that has already been completed. The Build Log records completed and committed work. Next Edge looks one move beyond the newest completed commit and asks the question that feels most worth losing a little sleep over.

## Rule

After a meaningful build cycle completes:

1. record the completed work as a committed Build Log entry;
2. retire the prior Next Edge as a historical research signal, not as unfinished work;
3. synthesize a new Next Edge from the current project ecology;
4. publish exactly one primary horizon question, with a small cloud of possible possibles around it;
5. preserve provenance for why that question surfaced.

The visible order is therefore:

```text
NEXT EDGE — what is tugging now?
LATEST COMMITTED BUILD
OLDER COMMITTED BUILDS
```

## Inputs

A future Next Edge synthesizer may draw from any source that is available and appropriately authorized:

- current repository state, commits, tests, issues, TODOs, and architecture;
- D1 research objects, CTC mappings, ontology mappings, uncaptured observations, Terraria traces, auto-build records, and failed tests;
- R2 artifact metadata and evidence objects where available;
- runtime/environment **metadata only** where useful — never secret values, tokens, credentials, or private configuration payloads;
- project documents and research materials available to the active TurtleBlock AI research context;
- the Sanders research ontology and original-source/later-layer provenance;
- learner/world observations when consent and privacy boundaries permit;
- recent primary-source signals from the daily build hunt;
- contradictions between code, documentation, public WWW behavior, and human experience;
- rejected candidates and unresolved questions;
- one deliberately open **X factor**.

## The X factor

The Next Edge should not be reducible to a deterministic priority queue.

One input slot stays intentionally strange:

> **whoooo knooooowwwssssssssssss**

The X factor can be playful, obvious, serious, wacky, inconvenient, theoretically awkward, technically tiny, or genuinely unfathomable. It exists to prevent the ontology, backlog, or model from convincing itself that the future is already fully categorized.

The X factor does **not** have authority to bypass safety, privacy, provenance, tests, or human judgment. It is permission to notice an unexpected possibility.

## Possible Possibles, not backlog grooming

The surrounding candidates are **possible possibles** rather than tasks. They can include:

- an ontology mismatch that might deserve a new Terrarium;
- a D1 pattern that suggests a regression test nobody planned;
- a Minecraft affordance colliding unexpectedly with an old Logo idea;
- a human correction that reveals a Turtle Charter weakness;
- a synthetic self-play disagreement that exposes a representation problem;
- a deployment failure that changes the architecture;
- a tiny refactor that suddenly makes a large future experiment possible;
- a question that currently has no useful category at all.

Most possible possibles should never become features. Their value is partly in keeping the horizon generative.

## Provenance and authority

Each published Next Edge should eventually carry:

- `generated_at`;
- the latest completed commit it follows;
- source classes consulted;
- research objects or signals that materially influenced it;
- CTC and Sanders ontology mappings where supported;
- uncaptured residue;
- candidate alternatives;
- an explicit X-factor note;
- who or what selected the final public question.

Machine synthesis may propose the horizon. Human direction may replace it at any time. A Next Edge is an invitation to inquiry, not autonomous production authority.

## Public artifact

The WWW reads the current horizon from:

`public/data/next-edge.json`

This keeps the open question separate from the historical Build Log. Daily build automation can update the JSON after it finishes and commits the day's bounded contribution.

## Current theoretical question

**What would count as a real D1 readback receipt?**

After an explicitly human-authorized public research-object backfill, what independent read-after-write evidence would establish that its identity, canonical Git pointer, provenance, CTC/ontology tags and relationships actually persisted, while treating unapplied TurtleAsk migrations and absent human observations as unknown rather than negative evidence?

This is the single open horizon following the November 17 research-only D1 Backfill Preflight regression (implementation and CI commit `ede7b6416c3e7530bb117b5f81830934c8667a6a`). The fixture is synthetic and does not write, grant human approval or certify a live D1 row. A separate authenticated and human-authorized read-after-write process remains to be designed. TurtleAsk migration 0009 and any missing human observation channel stay unresolved rather than being interpreted as silence or refusal. The machine-readable horizon is `public/data/next-edge.json`.
