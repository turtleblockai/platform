# Persistent Conversational WorldSpec Storage

Every new Turtle conversation creates a persistent WorldSpec instance immediately. The WorldSpec is initiated from the learner's first turn and then edited incrementally through dialogue, world events, manual edits, reflection, and construction.

The conversation is not merely input used to regenerate a WorldSpec. The conversation and WorldSpec are co-evolving records with distinct provenance.

## Canonical model

Each Turtle Lab session has one canonical session record and one current WorldSpec document.

```text
Discord / Turtle Lab thread
        <-> conversation turns
        <-> WorldSpec deltas
        <-> canonical current WorldSpec
        <-> build versions / Minecraft world
```

The raw conversation is append-only evidence. The canonical WorldSpec is editable state. Every edit to the WorldSpec must be traceable to a learner turn, Turtle inference, world observation, manual edit, or explicit system operation.

## Session identity

A session begins when `/turtle` starts a new Turtle Lab or when another approved entry point creates a project.

Suggested identity:

```yaml
session_id: uuid
worldspec_id: uuid
source:
  platform: discord
  guild_id: opaque
  channel_id: opaque
  thread_id: opaque
created_at: timestamp
created_by: opaque-learner-id
status: exploring
```

Discord IDs are integration references, not the conceptual identity of the WorldSpec. A WorldSpec must survive migration from Discord to the web playground, Minecraft, or another environment.

## Storage layers

### 1. Session record

Stores lifecycle and integration pointers.

Suggested D1 table: `turtle_sessions`

- `id`
- `worldspec_id`
- `created_at`
- `updated_at`
- `status`
- `source_platform`
- `source_guild_id`
- `source_channel_id`
- `source_thread_id`
- `creator_id`
- `current_revision`
- `build_authorized`

### 2. Turn/event log

Append-only record of learner, Turtle, and world events.

Suggested D1 table: `turtle_turns`

- `id`
- `session_id`
- `created_at`
- `actor_type` (`learner | turtle | world | system`)
- `raw_text`
- `discord_message_id`
- `reply_to_turn_id`
- `extraction_json`
- `provenance_json`
- `reaction_json`

Raw learner language is retained here even when Turtle cannot normalize it.

### 3. WorldSpec revisions

Every accepted change produces a revision rather than overwriting history invisibly.

Suggested D1 table: `worldspec_revisions`

- `id`
- `worldspec_id`
- `session_id`
- `revision_number`
- `created_at`
- `trigger_turn_id`
- `actor_type`
- `delta_json`
- `snapshot_json`
- `status`

`snapshot_json` represents the full WorldSpec at that revision. `delta_json` represents what changed and why.

### 4. Current WorldSpec

For fast access, store the current canonical snapshot separately or mark the latest revision.

Suggested D1 table: `worldspec_instances`

- `id`
- `created_at`
- `updated_at`
- `current_revision`
- `status`
- `current_snapshot_json`

This makes the WorldSpec a first-class persistent artifact rather than an ephemeral parse result.

## File representation

D1 is appropriate for active conversational state, indexes, provenance, and revisions. WorldSpecs should also be exportable as portable files.

Canonical export form:

```text
worldspecs/<worldspec-id>/
  worldspec.yaml
  history/
    0001.yaml
    0002.yaml
    0003.yaml
  conversation.jsonl
  metadata.yaml
```

These exported files are project artifacts. They need not be committed to the public TurtleBlock AI source repository. Private learner work remains private by default.

A public/example WorldSpec may intentionally be exported into `worldspec/examples/` only when appropriate.

## Incremental editing rule

Turtle does not parse the full conversation from zero on each message unless running an explicit recovery/audit process.

Default behavior:

1. load current WorldSpec revision;
2. preserve the new raw turn;
3. richly extract what the new turn contributes;
4. compare it to current state;
5. create a proposed WorldSpec delta;
6. distinguish learner-explicit changes from Turtle inference;
7. apply changes that are sufficiently grounded and reversible;
8. leave unresolved meanings unresolved;
9. create a new revision;
10. continue the dialogue.

Corrections such as `No, the light is not a building; it is a fire` should revise the relevant concept without destroying unrelated prior work.

## Lossless semantic cells

Known lexicon entries should coexist with open-world concepts.

```yaml
concepts:
  - id: concept-uuid
    original_phrase: "shining light of hope of rebirth"
    normalized:
      - light
      - hope
      - rebirth
    dimensions:
      symbolic: true
      spatial: true
      narrative: true
      affective: true
    learner_definition: null
    turtle_readings:
      - reading: "possible counterpoint to the village's decay"
        status: provisional
    introduced_by_turn: turn-uuid
    last_revised_by_turn: turn-uuid
```

The original phrase remains canonical evidence even as the concept becomes more structured.

## Branching and comparison

A learner may fork a WorldSpec instead of replacing it.

Examples:

- try the village with a literal beacon;
- try the same village with a hidden inhabited cottage;
- preserve both versions for comparison;
- return to an earlier version while keeping later manual edits when possible.

WorldSpec therefore needs revision history plus branch ancestry, not only undo.

## Build authorization

Conversation does not equal construction.

The WorldSpec may become increasingly detailed while `build_authorized` remains false. Turtle should normally ask or receive explicit learner authorization before handing a revision to the construction engine.

## Research and privacy

A persistent WorldSpec is learner/project state, not automatically research data.

Operational storage, learner-project storage, research-candidate data, approved research data, and public examples must remain distinct states with explicit provenance and consent boundaries.

## Immediate implementation target

The next Discord architecture should make `/turtle idea:...` create:

1. a Turtle Lab thread;
2. a `turtle_sessions` row;
3. a `worldspec_instances` row;
4. revision `0001` derived from the opening learner turn;
5. an append-only first turn;
6. a conversational Turtle response;
7. continued listening inside that same thread.

From then on, every meaningful dialogue turn edits the same persistent WorldSpec through traceable revisions.
