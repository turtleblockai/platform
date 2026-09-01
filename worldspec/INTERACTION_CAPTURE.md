# Interaction Capture and Learning Loop

TurtleBlock AI should learn from situated use without collapsing learner reactions into universal rules.

Discord TurtleBot interactions are treated as **episodes of co-construction**. The capture system preserves enough surrounding context to understand what the learner meant, what the agent inferred, what happened in the world, how people reacted, and whether the interaction should influence future behavior.

The goal is not to train TurtleBot to imitate approval. The goal is to accumulate inspectable evidence that can improve WorldSpec interpretation, construction behavior, dialogue, pedagogy, and safety while preserving learner agency.

## Design principle

`interaction → episode → observation → candidate guidance → validation → rule/guardrail`

No single reaction should normally become a rule.

The system should distinguish:

- what the learner explicitly said;
- surrounding conversational context;
- what TurtleBot interpreted;
- what TurtleBot proposed or executed;
- what changed in the Minecraft world;
- what humans did or said in response;
- whether the learner accepted, rejected, revised, ignored, laughed at, explored, or repaired the result;
- what later interactions suggest about the original interpretation.

## Episode boundary

A captured episode begins when a learner utterance materially engages TurtleBot and ends when one of the following occurs:

- the learner accepts or abandons the result;
- a new unrelated design problem begins;
- a reflection or correction resolves the interaction;
- the learner manually changes the resulting artifact and moves on;
- a configurable inactivity threshold closes the episode.

Episodes may contain several conversational turns and several world events.

## Minimum episode record

Each episode should preserve these layers.

### 1. Conversation context

- episode ID;
- anonymous or pseudonymous participant IDs;
- channel/thread ID;
- message IDs and timestamps;
- initiating learner utterance;
- several relevant preceding turns;
- TurtleBot responses;
- learner follow-ups;
- mentions, replies, quoted text, reactions, and edits where available.

Context should be relevance-bounded rather than an indiscriminate transcript dump.

### 2. World context

Capture the state needed to understand the request:

- Minecraft server/world ID;
- player location and orientation when relevant;
- selected or referenced object/region;
- nearby named WorldSpec entities;
- active constraints;
- current WorldSpec revision;
- recent manual edits;
- relevant inventory/entity/environment state;
- world snapshot or diff reference where feasible.

Deictic language such as `this`, `that`, `here`, and `over there` is uninterpretable without this layer.

### 3. Agent interpretation

Store TurtleBot's normalized interpretation separately from the learner's words:

- speech act;
- interaction mode;
- targets;
- relationships;
- functions;
- semantic terms;
- constraints;
- unresolved references;
- assumptions;
- uncertainty/confidence;
- clarification questions;
- proposed WorldSpec patch;
- proposed Construction IR;
- whether execution was immediate, previewed, simulated, or deferred.

Agent inference must never be rewritten into the record as learner fact.

### 4. Agent action

Capture what TurtleBot actually did:

- dialogue response;
- WorldSpec mutation;
- construction plan;
- Minecraft commands/API operations;
- blocks/entities created, changed, moved, or removed;
- failures and partial execution;
- rollback/fork/preview information;
- execution duration and error state where useful.

### 5. Human reaction

Human reaction is multi-channel evidence, not merely emoji sentiment.

Capture:

- Discord emoji reactions;
- textual approval/disapproval;
- clarification;
- explicit correction;
- learner restatement;
- request to undo or redo;
- request for a variant;
- continued exploration;
- abandonment;
- manual Minecraft edits following the agent action;
- comparison between versions;
- reflective comments made later in the episode.

## Reaction taxonomy

A first-pass taxonomy should classify reactions without pretending to know more than the evidence supports.

### Acceptance

The learner explicitly keeps, endorses, or builds upon the result.

Examples:

- `yes`;
- `that's it`;
- adding more detail to the resulting structure;
- continuing the design from the agent-created state.

### Rejection

The learner explicitly rejects or reverses the result.

Examples:

- `no, not like that`;
- undo request;
- immediate removal of the agent-generated structure.

### Correction

The learner reveals that TurtleBot misunderstood intent, reference, meaning, or constraint.

Corrections are particularly valuable because they expose interpretation failures.

### Revision

The learner accepts part of the result but changes another part.

Revision should not be reduced to either success or failure. It is normal constructivist activity.

### Exploration

The learner treats the result as something to inspect, compare, inhabit, test, or think with rather than something to approve.

### Reflection

The learner comments on what happened, how it felt, why it worked, why it failed, or what was learned.

### Social disagreement

Multiple participants express differing goals or interpretations.

The system should preserve disagreement rather than manufacture consensus.

### Ambiguous signal

Emoji-only reactions, jokes, silence, or unclear manual edits may be suggestive but should remain low-confidence evidence unless later context resolves them.

## Emoji handling

Emoji reactions should be captured literally first and interpreted second.

For example:

```yaml
reaction:
  raw: "🔥"
  participant: learner-7
  inferred_signal: positive_engagement
  confidence: low
```

A repeated community convention may eventually raise confidence, but TurtleBlock should not assume that every thumbs-up means pedagogical approval or every laughing reaction means rejection.

## Manual edit capture

Manual Minecraft changes after TurtleBot acts are among the richest signals in the system.

When feasible, associate subsequent player edits with the generated artifact and record a diff:

```yaml
manual_revision:
  actor: learner-7
  source_artifact: wall-23
  removed_blocks: 3
  added_blocks: 8
  changed_materials:
    - stone_bricks -> oak_planks
```

The default interpretation is **learner revision**, not agent error.

TurtleBot should never automatically restore its own version merely because the world diverged from the generated plan.

## Observation record

Episodes may generate one or more observations.

An observation is descriptive and provenance-rich:

```yaml
observation:
  id: obs-204
  episode: ep-991
  pattern: "learner used 'open' to mean increased visibility rather than removing barriers"
  evidence:
    - explicit learner correction
    - subsequent manual edit added windows while retaining wall
  scope:
    learner: learner-7
    world: village-alpha
    semantic_term: open
  confidence: high
  status: observed
```

Observations should initially remain local to the learner, project, or semantic context that produced them.

## Promotion ladder

Behavioral knowledge moves through explicit states.

### Level 0: Raw episode

Uninterpreted interaction evidence.

### Level 1: Observation

A description of what appears to have happened in one or more episodes.

### Level 2: Candidate heuristic

A recurring pattern that may improve future interpretation or action.

Example:

> When learners ask `what if...`, preview or discuss before mutating the world.

### Level 3: Guidance

A validated default behavior with provenance and known exceptions.

Guidance is defeasible. The agent may depart from it when learner context supports doing so.

### Level 4: Rule

A stronger invariant required for coherent operation or agency preservation.

Example:

> Questions and exploratory speech acts do not automatically become destructive world mutations.

### Level 5: Guardrail

A constraint protecting learner agency, privacy, safety, system integrity, or irreversible world state.

Example:

> Manual learner edits must not be silently overwritten by reconciliation.

## Promotion criteria

A candidate should not be promoted merely because it receives positive reactions.

Promotion considers:

- number of independent episodes;
- number of distinct learners or groups;
- contextual similarity;
- explicitness of learner feedback;
- consistency of manual-world behavior;
- evidence from corrections and failures;
- hostile-data tests;
- whether the candidate preserves learner agency;
- known counterexamples;
- reversibility of the proposed behavior;
- risk if the rule is wrong.

High-impact guardrails require stronger evidence and human review than low-risk conversational guidance.

## Provenance requirements

Every learned item should retain:

- source episode IDs;
- learner/project scope;
- date range;
- evidence types;
- confidence;
- counterexamples;
- author/reviewer when promoted manually;
- version introduced;
- superseded/reverted state;
- rationale.

A rule without provenance is technical folklore and should not silently shape learner worlds.

## Scope before generalization

Learned meaning should generalize outward cautiously:

`episode → learner → project/world → classroom/community → platform`

Example:

If one learner says:

> For me, welcoming means tiny doors, narrow streets, and warm light.

TurtleBlock may remember that definition for that learner or project. It must not redefine `welcoming` platform-wide.

## Negative evidence

The system must preserve rejected interpretations and counterexamples.

A useful learner correction should be able to produce something like:

```yaml
semantic_mapping:
  term: open
  candidate: remove_barrier
  rejected_in:
    - ep-991
  preferred_in_episode:
    - increase_visibility
```

This prevents repeated mistakes and helps distinguish ambiguity from deterministic vocabulary.

## Build-and-fly workflow

During early development:

1. TurtleBot operates in Discord and Minecraft.
2. Every meaningful interaction becomes an episode.
3. Episodes are stored as immutable raw evidence plus normalized derived records.
4. A lightweight review process periodically surfaces:
   - repeated corrections;
   - frequent clarification needs;
   - surprising learner definitions;
   - agent actions commonly undone;
   - useful patterns of manual revision;
   - recurring construction failures;
   - emergent interaction forms not represented in WorldSpec.
5. Developers/researchers convert strong patterns into candidate guidance.
6. Candidates are added to tests before being promoted into runtime behavior.
7. WorldSpec, Construction IR, Minecraft adapters, and dialogue behavior evolve from this evidence.

## Architecture

The capture net should sit beside rather than inside the Minecraft adapter:

```text
Discord / Minecraft events
        ↓
Interaction Capture
        ↓
Episode Store
        ↓
Normalizer / WorldSpec Interpreter
        ↓
Observation Extractor
        ↓
Candidate Guidance Registry
        ↓
Human + hostile-test review
        ↓
Guidance / Rule / Guardrail Registry
        ↓
Runtime policy + WorldSpec tests
```

This keeps raw evidence separate from interpretations and prevents runtime policy from rewriting history.

## Suggested first implementation

Do not begin with automated rule generation.

The first production-worthy version should only:

- capture Discord messages/replies/reactions;
- associate them with TurtleBot request/response IDs;
- capture relevant Minecraft world diffs and manual edits;
- persist TurtleBot interpretation and Construction IR separately;
- group related events into episodes;
- generate human-reviewable episode summaries;
- tag obvious reaction types;
- surface recurring correction patterns.

Rule promotion can remain manual until the episode corpus is large enough to expose what automation is actually useful.

## Research value

This corpus is not merely telemetry. It becomes a record of co-active emergence:

- learner intent becoming representation;
- representation becoming construction;
- construction producing experience;
- experience provoking reaction and reflection;
- human and machine subsequently changing one another's next move.

That cycle is exactly the phenomenon TurtleBlock AI is intended to support and study.
