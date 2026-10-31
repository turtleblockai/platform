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

**Can “not that” remain uncertain?**

When a learner rejects something with deictic or partial language — “not that,” “keep this part,” “no, the other one” — how can Turtle bind the refusal to the smallest defensible object using local context while leaving unresolved ambiguity unresolved instead of inventing a broader intent?

This horizon follows the October 31 Refusal Scope Envelope regression (commit `d6c8a78239a645d7a417e010f3cb7a75a261ffd4`). The completed work now preserves an exact refused object and scope; the open question is how Turtle knows which object the learner meant when natural language is incomplete. Interaction Capture already treats deixis as context-dependent, so the next research move should preserve candidate pointers and uncertainty rather than manufacture precision. No deployed deictic-resolution behavior is claimed. The public machine-readable source of truth is `public/data/next-edge.json`.
