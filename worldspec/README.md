# WorldSpec

WorldSpec is TurtleBlock AI's edition-independent language for turning learner intent into revisable computational worlds.

It is not a lesson-plan format and it is not a list of Minecraft commands. It is a representation layer between human ideas, agent dialogue, and world-building engines.

## Core loop

`learner intent → dialogue/play/question → representation → build/test/compare → inhabit → observe → reflect/contest → revise`

The first design principles are grounded in Bryan P. Sanders' STEAMHAMLET, Critical Techno Constructivism, Minecraft, and co-active emergence writings:

- The learner is a **designer and producer**, not a consumer.
- Predetermined outcomes should not dominate the interaction.
- Inquiry should emerge from play, curiosity, conflict, observation, and construction.
- Ideas should become manipulable representations that can be changed, shifted, scaled, juxtaposed, remixed, tested, and tried.
- The system should preserve room for multiple entry points and unexpected outcomes.
- Dialogue is not merely a command parser; it is a place for clarification, critique, reflection, negotiation, and co-construction.
- The machine should function as a collaborator and sounding board, not as an authority that silently decides what the learner means.
- The world is both artifact and thinking space: learners make something, experience it, receive feedback, and return to revise it.
- Social, cultural, aesthetic, and political meanings are legitimate parts of a WorldSpec, not decorations added after the technical work.
- Errors and failed constructions are productive states that should remain inspectable and revisable.
- Agent assumptions, learner statements, world observations, and manual edits must remain distinguishable through provenance.

## Layers

WorldSpec v0.1 separates these concerns:

1. **Intent and speech act** — what the learner is trying to explore, ask, make, change, test, compare, or reflect upon.
2. **World model** — objects, places, relationships, materials, functions, and constraints.
3. **Meaning** — aesthetic, emotional, cultural, social, narrative, and political qualities.
4. **Operations** — the verbs by which learners and agents transform representations.
5. **Uncertainty and provenance** — what is known, assumed, inferred, contested, unknown, or provisional, and who supplied it.
6. **Social state** — ownership, collaboration, disagreement, consent, and shared work.
7. **History** — revisions, reflections, manual edits, comparisons, tests, provenance, and forks.

## Interaction model

A WorldSpec interaction can take several forms:

- **Direct** — concrete enough for a validated operation.
- **Interpretive** — semantic or aesthetic language that can map to multiple designs.
- **Reflective** — evaluates what happened in the world.
- **Exploratory** — probes a possibility without committing to a mutation.
- **Comparative** — compares alternatives, versions, consequences, or viewpoints.
- **Social** — negotiates ownership, collaboration, conflict, or collective meaning.

This distinction is intentional. TurtleBlock AI should not quietly turn every ambiguous human idea—or every question—into a finished structure.

## Grammar and syntax

The abstract interaction shape is:

`SPEECH-ACT + ACTION + TARGET + CHANGE + RELATION + CONSTRAINT + MEANING + EPISTEMIC-STATE + REFLECTION`

Not every field is required. Unknown, undecided, contradictory, and provisional values are valid states.

See:

- `grammar/interactions.md` for Turtle's interaction stance and resolution rules.
- `grammar/syntax.md` for normalized syntax, negation, reference, constraints, comparison, social state, and provenance.

## Hostile data pass

WorldSpec includes a permanent adversarial review process intended to catch technically plausible behavior that would be pedagogically wrong.

The first hostile pass tests for:

- semantic overreach;
- negation mistakes;
- arbitrary pronoun/deictic resolution;
- questions accidentally becoming commands;
- hidden optimization objectives;
- agent assumptions being rewritten as learner facts;
- manual edits being erased;
- fake consensus in collaborative worlds;
- contradictions being silently smoothed away;
- cultural stereotyping;
- automatic repair of useful failed artifacts;
- hidden curricular capture.

See `HOSTILE_DATA_PASS.md` and `tests/hostile-cases.yaml`.

## Files

- `schema/worldspec.schema.json` — machine-readable v0.1 schema
- `lexicon/core.yaml` — construction, semantic, inquiry, social, uncertainty, and interaction vocabulary
- `grammar/interactions.md` — interaction grammar and agent behavior rules
- `grammar/syntax.md` — normalized WorldSpec syntax
- `tests/hostile-cases.yaml` — adversarial language and agency-preservation cases
- `HOSTILE_DATA_PASS.md` — rationale, findings, and future attack surfaces
- `examples/settlement.yaml` — example WorldSpec instance

## Status

WorldSpec is experimental and building in public. The vocabulary and schema are expected to change through use with learners and through implementation against Minecraft Java/Paper and Minecraft Education/Bedrock.
