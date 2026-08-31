# WorldSpec Syntax v0.1

WorldSpec syntax is a bridge between natural learner language and a declarative, revisable world representation. It is intentionally more expressive than a command language and more constrained than free conversation.

## Design rule

A WorldSpec statement should preserve the difference between:

- what the learner explicitly said;
- what the system inferred;
- what is currently true in the world;
- what is being proposed;
- what remains unresolved.

## Canonical abstract syntax

```text
STATEMENT := SPEECH_ACT [ACTION] [TARGET] [CHANGE] [RELATION] [CONSTRAINT*] [MEANING*] [EPISTEMIC] [RATIONALE] [REFLECTION]
```

The minimal executable operation is:

```text
ACTION TARGET
```

Example:

```text
move bridge
```

A more complete operation is:

```text
modify north-tower height +2 preserve skyline.asymmetry
```

## Natural-language mapping

Learner:

> Make the north tower taller, but keep the skyline asymmetrical.

Normalized syntax:

```text
REQUEST MODIFY target=north-tower height+=unspecified
CONSTRAINT PRESERVE skyline.asymmetry
```

Structured form:

```yaml
speech_act: request
operation:
  action: modify
  target: north-tower
  changes:
    height:
      direction: increase
      magnitude: unspecified
constraints:
  - type: preserve
    property: skyline.asymmetry
source:
  actor: learner
```

## Proposal versus execution

The same syntax can carry different statuses:

```text
PROPOSE MODIFY courtyard meaning.welcoming += provisional
```

versus:

```text
APPLY MODIFY wall height += 2_blocks
```

Status is not cosmetic. `proposed`, `clarify`, `approved`, and `applied` must remain distinguishable.

## Direct syntax

```text
REQUEST MOVE bridge east 6_blocks
REQUEST REPLACE roof material=dark_oak
REQUEST SCALE wall height +2_blocks
REQUEST DUPLICATE room ROTATE 90_degrees
```

## Interpretive syntax

Interpretive terms require provenance and epistemic state:

```text
REQUEST MODIFY courtyard meaning.authoritarian -= unspecified
INTERPRETATION term=authoritarian state=ambiguous source=learner
```

Turtle may respond with candidate mappings:

```text
PROPOSE interpretation-1:
  entrance.control -= moderate
  symmetry -= slight

PROPOSE interpretation-2:
  monumental_scale -= moderate
  sightline_surveillance -= moderate
```

No candidate is a truth claim.

## Learner-defined semantics

```text
DEFINE welcoming := [small_doors, warm_light, narrow_streets]
SCOPE project=current
SOURCE learner
```

Once defined, subsequent uses of `welcoming` in that project resolve through the learner definition unless explicitly revised.

## Exploratory syntax

Questions do not become commands by default:

```text
EXPLORE hypothetical:
  road route=around_hill
```

or:

```text
COMPARE current_world WITH hypothetical(no_wall)
```

## Reflection syntax

```text
REFLECT observation="the alley feels trapped"
REFLECT expectation="safer"
REFLECT consequence="reduced escape routes"
NEXT_MOVE undecided
```

Reflection can exist without an immediate construction operation.

## Comparison syntax

```text
COMPARE revision=v3 WITH revision=v5 ON [access, openness, travel_distance]
```

The result should describe differences and tradeoffs, not automatically select a winner.

## Social syntax

```text
OWN tower-1 actor=learner-a
SHARE plaza actors=[learner-a, learner-b]
CONTEST wall.keep actors=[learner-a, learner-b]
FORK revision=v8 actor=learner-a
```

Social state must preserve disagreement and provenance.

## Constraint syntax

```text
CONSTRAINT PRESERVE target=tower-1 strength=hard
CONSTRAINT PREFER material=stone strength=preference
CONSTRAINT AVOID route=through_garden strength=soft
CONSTRAINT REQUIRE accessibility.reachable=true strength=hard
```

Conditional constraints:

```text
CONSTRAINT REQUIRE lighting IF occupancy=night
CONSTRAINT PRESERVE bridge UNTIL test=completed
CONSTRAINT ALLOW remove_wall UNLESS owner=collaborator
```

## Negation

Learner:

> Don't remove the bridge; remove the road beside it.

Normalized:

```text
CONSTRAINT PRESERVE bridge
REQUEST REMOVE road WHERE relation=beside(bridge)
```

Never treat a negated property as requested state.

## Deixis / situated reference

Learner:

> Move this over there.

Possible resolution record:

```yaml
reference:
  this:
    state: inferred
    candidates: [selected-object-42]
    evidence: [selected-object]
  there:
    state: inferred
    coordinates: [120, 64, -18]
    evidence: [cursor-target]
```

If either reference remains ambiguous, operation status becomes `clarify`.

## Contradiction

Learner:

> Keep the bridge exactly the same but make it twice as wide.

Normalized representation should preserve both claims:

```text
CONSTRAINT PRESERVE bridge exact=true
REQUEST SCALE bridge width x2
CONFLICT logical
STATUS clarify
```

Do not silently choose one.

## Unknown values

Unknown is valid syntax:

```text
height += unknown
material = undecided
entrance_count = provisional
```

WorldSpec should not invent specificity merely to satisfy a schema.

## Provenance

Every consequential node should be able to answer:

```text
WHO said this?
WHAT was explicitly stated?
WHAT was inferred?
WHEN did it enter the spec?
WHICH revision depends on it?
```

Recommended fields:

```yaml
provenance:
  actor: learner | collaborator | turtle | platform
  source: utterance | manual-edit | world-observation | rule | import
  certainty: known | assumed | inferred | ambiguous | contested | unknown | provisional
  timestamp: ISO-8601
  source_revision: optional
```

## Compilation boundary

Only operations with resolved target, acceptable constraint state, and appropriate approval status should cross the adapter boundary into Minecraft.

```text
conversation
  ↓
parse
  ↓
WorldSpec proposal
  ↓
clarify / approve / test
  ↓
validated operation
  ↓
Minecraft adapter
```

The syntax therefore describes thinking states as well as build states.
