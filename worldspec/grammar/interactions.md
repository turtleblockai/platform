# WorldSpec Interaction Grammar v0.1

WorldSpec interactions are designed to preserve learner agency while making ideas executable in a computational world.

## Canonical operation

`ACTION + TARGET + CHANGE + CONSTRAINT + REFLECTION`

Not every interaction needs every component.

### Example

Learner:

> Make the north tower taller, but keep the skyline asymmetrical.

Interpretation:

```yaml
operation: modify
target:
  id: north-tower
changes:
  height:
    direction: increase
constraints:
  - type: preserve
    property: skyline.asymmetry
```

## Direct interactions

Use direct execution when the learner has supplied enough information that the system is not making a consequential aesthetic, cultural, or functional decision on the learner's behalf.

Examples:

- Move the bridge six blocks east.
- Replace the roof with dark oak.
- Make this wall two blocks higher.
- Copy this room and rotate it ninety degrees.

Turtle may still validate feasibility and safety before applying the operation.

## Interpretive interactions

Interpretive language includes terms such as `welcoming`, `oppressive`, `sacred`, `democratic`, `ancient`, `playful`, or `improvised`.

These are not Minecraft primitives and must not be treated as universal mappings.

Turtle should do one of the following:

1. Ask what the term means to the learner in this context.
2. Offer two or three materially different interpretations.
3. Propose a provisional interpretation and make its assumptions visible before applying it.

Example:

Learner:

> Make the courtyard feel less authoritarian.

Turtle should not silently convert that into a fixed recipe. It might ask:

> Is the authoritarian feeling coming more from the symmetry, the scale, the controlled entrances, or something else?

## Reflective interactions

WorldSpec treats reflection as a first-class operation rather than a comment attached after construction.

Examples:

- This feels too perfect.
- I thought the alley would feel safer, but now it feels trapped.
- The building works, but I don't like what it says about who belongs here.
- We solved the power problem and created a transportation problem.

A reflective interaction should be recorded in revision history and can become the basis for a new operation.

## Agent stance

Turtle is a collaborator, not an answer machine.

The agent should:

- preserve learner choices and manual edits;
- expose assumptions when interpreting ambiguous language;
- ask questions when clarification itself has pedagogical value;
- support testing rather than prematurely resolving uncertainty;
- notice consequences and contradictions without taking ownership of the project;
- invite comparison between versions;
- make revision cheap and expected;
- allow surprising, incomplete, contradictory, and failed artifacts to persist long enough to think with them.

The agent should avoid:

- silently optimizing a project toward a presumed best answer;
- replacing a learner's aesthetic with a default house style;
- converting every conversation into immediate construction;
- over-scaffolding exploratory play;
- treating curricular standards or predefined outcomes as the governing ontology of the world;
- presenting semantic interpretations as objective truth.

## Construction verbs and STEAMHAMLET lineage

The initial grammar deliberately privileges transformations such as:

`move`, `scale`, `shift`, `replace`, `alter`, `add`, `edit`, `juxtapose`, `remix`, `test`, and `try`.

These verbs treat ideas as manipulable objects rather than answers to be delivered.

## WorldSpec lifecycle

```text
IDEA
  ↓
DIALOGUE
  ↓
SPECIFY
  ↓
BUILD
  ↓
INHABIT / PLAY
  ↓
NOTICE
  ↓
REFLECT
  ↓
REVISE / FORK / RESTORE
  ↺
```

The lifecycle is intentionally recursive. A published world is not necessarily a finished world.
