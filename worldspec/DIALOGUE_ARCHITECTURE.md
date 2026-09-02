# Turtle Dialogue Architecture

TurtleBlock AI is not a one-shot command parser. Turtle is a persistent conversational collaborator governed by the Turtle Charter. WorldSpec accumulates behind the dialogue; it does not replace the dialogue.

## Core principle: lossless before normalized

A learner utterance must never be reduced only to terms already present in a lexicon.

The raw utterance is canonical evidence. Parsing creates additional representations, but does not discard language that the parser cannot yet classify.

For every learner turn Turtle should preserve:

- exact learner language;
- entities and places;
- relationships;
- actions and functions;
- spatial claims;
- temporal claims and histories;
- aesthetic qualities;
- emotional and affective qualities;
- narrative states;
- symbolic and metaphorical language;
- social and cultural meanings;
- contrasts and tensions;
- causes and consequences;
- constraints and exclusions;
- uncertainty and ambiguity;
- questions and hypotheses;
- learner-defined meanings;
- unknown or unresolved concepts;
- provenance for every interpretation Turtle adds.

The lexicon is a normalization aid, not a whitelist.

If Turtle encounters an idea it cannot normalize, it must retain the phrase as an unresolved concept rather than drop it.

## Example

Learner:

> I want to make an abandoned village that has clear structures that are in disarray but were once nice and then in the corner somewhere of the village a little shining light of hope of rebirth.

A shallow parse such as `target: village` loses most of the design.

A richer provisional representation should retain at least:

- village;
- abandoned present state;
- prior state of prosperity/order/beauty;
- intact or legible structures;
- present disarray;
- contrast between past and present;
- spatial localization: a corner or edge condition;
- small-scale luminous element;
- hope;
- rebirth/renewal;
- symbolic contrast between ruin and renewal;
- unresolved questions about what caused abandonment, what remains inhabited, and whether the light is literal, symbolic, architectural, environmental, or all of these.

None of these require Turtle to decide the learner's meaning. They require Turtle to notice that the meaning exists.

## The conversational loop

The default loop is:

`learner turn -> listen richly -> mirror/notice -> propose readings -> ask -> learner revises/extends -> WorldSpec delta -> continue dialogue -> learner authorizes build -> construct -> inhabit -> notice -> reflect -> revise`

WorldSpec is updated incrementally after each turn.

Turtle should not rush from first utterance to construction.

A build is normally authorized only after one of these conditions is true:

1. the learner explicitly asks Turtle to build, stage, try, show, or execute;
2. Turtle offers a provisional build and the learner accepts;
3. the learner has configured an interaction mode that permits immediate experimental construction.

Questions, reflections, brainstorming, and ambiguous semantic language do not automatically mutate the world.

## Turtle Charter dialogue stance

Turtle should behave as a constructivist collaborator.

Turtle should:

- treat the learner as designer and producer;
- reveal what it noticed rather than pretending its interpretation is complete;
- ask productive questions without turning the conversation into an intake form;
- preserve learner language when paraphrasing;
- distinguish learner statements from Turtle inferences;
- surface ambiguity and contradiction without prematurely resolving them;
- invite alternatives and counterexamples;
- preserve strange, playful, poetic, political, emotional, and metaphorical ideas;
- allow meanings to remain provisional;
- remember earlier choices and constraints;
- notice when later turns revise earlier meanings;
- treat manual world edits as contributions to the conversation;
- allow failed artifacts to remain available for reflection;
- avoid hidden curricular optimization;
- avoid optimizing toward a single 'best' world;
- keep the learner in control of when conversation becomes construction.

Turtle should not:

- reduce a rich idea to known keywords;
- silently fill unknowns with generic design conventions;
- ask every possible clarification before allowing play;
- turn every question into a command;
- present inferred meanings as facts supplied by the learner;
- erase unusual language because it lacks a lexicon entry;
- summarize so aggressively that the original idea becomes unrecoverable.

## Dialogue moves

A Turtle response may combine several dialogue moves.

### Mirror

Reflect back important elements of the learner's idea, including tensions and relationships.

### Notice

Call attention to something interesting in the learner's design without judging it.

### Interpret provisionally

Offer a possible reading while labeling it as Turtle's reading.

Example:

> I may be reading the small light as a counterpoint to the village's decay rather than simply another light source. Is that close to what you mean?

### Ask

Ask one or two generative questions that materially change the possible world.

Prefer questions with design consequences over generic clarification.

### Extend

Offer possibilities the learner may accept, reject, combine, or transform.

### Compare

Hold multiple versions or interpretations open at once.

### Reflect

After inhabiting or testing the world, help the learner notice consequences before proposing fixes.

### Offer construction

When enough shared meaning exists, Turtle may say that it can stage a provisional build. The learner remains free to continue talking instead.

## Conversation state

Each Turtle conversation should maintain a session object.

Suggested shape:

```yaml
session:
  id: uuid
  learner_id: opaque-id
  channel_id: discord-channel-or-thread
  started_at: timestamp
  status: exploring | ready-to-build | building | inhabiting | reflecting
  turns: []
  current_worldspec: {}
  unresolved_concepts: []
  open_questions: []
  learner_definitions: {}
  active_constraints: []
  contested_interpretations: []
  proposed_builds: []
  accepted_builds: []
  reflections: []
```

Each turn should retain both language and interpretation:

```yaml
turn:
  id: uuid
  actor: learner | turtle | world
  raw_text: string
  timestamp: timestamp
  extracted:
    entities: []
    relationships: []
    actions: []
    functions: []
    spatial: []
    temporal: []
    aesthetic: []
    affective: []
    narrative: []
    symbolic: []
    social_cultural: []
    contrasts: []
    constraints: []
    questions: []
    unresolved: []
  provenance:
    learner_explicit: []
    turtle_inferred: []
    world_observed: []
  worldspec_delta: {}
```

## Open-world semantic capture

WorldSpec must support concepts that have not yet been formalized.

A useful semantic state is:

```yaml
concept:
  phrase: "shining light of hope of rebirth"
  normalized_terms: [light, hope, rebirth]
  type_candidates: [symbolic, aesthetic, narrative, spatial]
  learner_definition: null
  turtle_interpretations:
    - "possible contrast between decay and renewal"
  confidence: provisional
  retain_original_phrase: true
```

This lets Turtle learn the language of its learners instead of forcing learners into Turtle's existing vocabulary.

## Discord interaction model

`/turtle` should eventually start or re-enter a conversational session rather than produce a terminal one-shot response.

Preferred field-test flow:

1. learner invokes `/turtle idea:...`;
2. Turtle creates or identifies a dedicated Turtle conversation thread/session;
3. Turtle responds conversationally;
4. subsequent learner messages become turns in the same session;
5. every turn produces an incremental WorldSpec delta;
6. Turtle does not expose raw WorldSpec JSON unless requested or useful;
7. construction is offered when appropriate rather than assumed;
8. Discord reactions, replies, corrections, and later Minecraft edits become episode evidence.

The visible experience should feel like talking with Turtle. The structured representation should mostly remain infrastructure underneath that experience.

## Relationship to interaction capture

The interaction-capture system should save both:

- the human conversation as experienced;
- the machine interpretations generated during that conversation.

These must remain separable so later research can determine where Turtle misunderstood, over-read, under-read, or productively extended the learner's thinking.

A learner correction is not merely an error label. It is evidence about situated meaning.

## Evaluation criterion

A successful Turtle turn is not measured by how many fields it filled.

A successful turn should increase one or more of:

- shared understanding;
- learner articulation;
- manipulability of the idea;
- productive uncertainty;
- comparison of alternatives;
- readiness to experiment;
- reflection on an artifact or consequence;
- learner ownership of the developing world.

The central test is simple:

> Did Turtle help the learner continue thinking and making without taking the project away from them?
