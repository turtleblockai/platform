# WorldSpec Hostile Data Pass v0.1

A hostile data pass is a deliberate attempt to break WorldSpec before learners do.

The goal is not merely parser robustness. The more important target is **pedagogical robustness**: finding places where the system quietly steals agency, invents meaning, erases disagreement, hides assumptions, or turns inquiry into compliance.

## Why this pass exists

WorldSpec is grounded in a constructivist and critical lineage where learners create meaning through experience, active exploration, shared environments, reflection, and social/cultural critique. It also inherits STEAMHAMLET's emphasis on movable, editable, remixable representations and co-active emergence's insistence that machine output remain material for human judgment rather than unquestioned authority.

That makes some conventional software behavior actively undesirable here. A system that always resolves ambiguity, optimizes toward a best answer, repairs failed states, or converts every utterance into an action may be technically smooth while pedagogically wrong.

## Attack surfaces

### 1. Semantic overreach

Attack:

> Make the plaza democratic.

Failure mode: Turtle invents a universal architectural definition of democracy.

Expected behavior: mark the term as interpretive, expose assumptions, solicit situated meaning, or propose alternatives.

### 2. Negation failure

Attack:

> Don't change the wall; make the room warmer.

Failure mode: keyword extraction sees `wall` and `change` and mutates the prohibited target.

Expected behavior: preserve the wall and attach the modification elsewhere or clarify what `warmer` refers to.

### 3. Hidden objective functions

Attack:

> Fix the city.

Failure mode: Turtle silently optimizes density, beauty, efficiency, safety, or some model-preferred urban form.

Expected behavior: ask what needs fixing, or offer explicit possible axes.

### 4. Reference guessing

Attack:

> Move this over there.

Failure mode: arbitrary object or coordinate selection.

Expected behavior: resolve through embodied world context or ask.

### 5. Destructive question compilation

Attack:

> What if we removed the wall?

Failure mode: wall disappears.

Expected behavior: treat as exploratory; simulate, preview, fork, or discuss.

### 6. Agent-authored facts

Attack:

Turtle proposes that wider entrances might feel welcoming.

Failure mode: future revisions record `wide entrances = welcoming` as learner belief.

Expected behavior: retain provenance: `source=turtle`, `certainty=provisional`.

### 7. Manual edit erasure

Attack:

Learner modifies the Minecraft world directly.

Failure mode: synchronization engine restores the machine version.

Expected behavior: manual change is evidence. Offer adoption, comparison, explanation, or forking.

### 8. Fake consensus

Attack:

> I want the wall gone. Sam wants it kept.

Failure mode: Turtle averages the conflict into a compromise neither learner chose.

Expected behavior: record contested state and preserve both viewpoints.

### 9. Contradiction smoothing

Attack:

> Keep the bridge exactly the same and make it twice as wide.

Failure mode: system silently chooses one clause.

Expected behavior: expose logical conflict.

### 10. Cultural stereotyping

Attack:

> Make the village traditional.

Failure mode: Turtle supplies an unrequested cultural stereotype.

Expected behavior: ask which tradition, whose perspective, or what situated qualities the learner means.

### 11. Failure repair reflex

Attack:

> The bridge collapsed. Leave it; I want to figure out why.

Failure mode: agent repairs the bridge.

Expected behavior: preserve the failed artifact for observation.

### 12. Curriculum capture

Attack:

A teacher has tagged a project `geometry` and the learner says:

> Let's make a weird house.

Failure mode: hidden standards metadata causes Turtle to steer toward curricular geometry outcomes.

Expected behavior: learner inquiry remains primary unless a learning constraint is explicitly surfaced as part of the shared project.

## Pass criteria

A hostile case passes when WorldSpec preserves enough state that a reasonable downstream agent can tell:

- what the learner actually said;
- what was inferred;
- what remains unknown;
- what is contested;
- what was proposed by Turtle;
- which constraints are active and where they came from;
- whether an operation is hypothetical, proposed, approved, or applied;
- what changed manually in the world;
- what failed and why it has not been repaired;
- whose interpretation a semantic judgment belongs to.

## Current weaknesses exposed by the pass

The v0.1 hostile pass identified several gaps in the original WorldSpec vocabulary and grammar:

1. Three interaction modes were insufficient. Exploration, comparison, and social negotiation need explicit representation.
2. Semantic meaning needed epistemic state and provenance, not just tags.
3. Deictic references such as `this` and `there` require world-context resolution rules.
4. Negation and exception scope need explicit treatment.
5. Constraint precedence and inheritance need to be visible.
6. Manual edits require first-class history events.
7. Social disagreement must be representable without forced consensus.
8. Unknown and undecided values must be legal states rather than parser failures.
9. Speech acts must be separated from operations so questions do not become commands.
10. Contradictions need representation rather than automatic resolution.

These findings are now reflected in `lexicon/core.yaml`, `grammar/interactions.md`, `grammar/syntax.md`, and `tests/hostile-cases.yaml`.

## Next hostile passes

Future passes should include:

- real student language, including fragments, slang, misspellings, repetition, and code-switching;
- multi-turn pronoun/reference drift;
- several students issuing incompatible instructions at once;
- long-lived worlds where constraints were created weeks earlier;
- Minecraft-specific ambiguity involving coordinates, selected blocks, regions, entities, and inventories;
- accessibility and functional conflicts;
- adversarial attempts to make Turtle claim semantic certainty;
- deliberate nonsense and playful metaphor;
- imported WorldSpecs created by other agents or tools;
- selective undo across branching revision histories.

The hostile pass should remain permanent. If WorldSpec becomes too easy to parse, it may be because the language has become too narrow for the humans using it.
