# WorldSpec

WorldSpec is TurtleBlock AI's edition-independent language for turning learner intent into revisable computational worlds.

It is not a lesson-plan format and it is not a list of Minecraft commands. It is a representation layer between human ideas, agent dialogue, and world-building engines.

## Core loop

`learner intent → dialogue → WorldSpec → build → inhabit → observe → reflect → revise`

The first design principles are grounded in Bryan P. Sanders' STEAMHAMLET, Critical Techno Constructivism, Minecraft, and co-active emergence writings:

- The learner is a **designer and producer**, not a consumer.
- Predetermined outcomes should not dominate the interaction.
- Inquiry should emerge from play, curiosity, conflict, observation, and construction.
- Ideas should become manipulable representations that can be changed, shifted, scaled, juxtaposed, remixed, tested, and tried.
- The system should preserve room for multiple entry points and unexpected outcomes.
- Dialogue is not merely a command parser; it is a place for clarification, critique, reflection, and co-construction.
- The machine should function as a collaborator and sounding board, not as an authority that silently decides what the learner means.
- The world is both artifact and thinking space: learners make something, experience it, receive feedback, and return to revise it.
- Social, cultural, aesthetic, and political meanings are legitimate parts of a WorldSpec, not decorations added after the technical work.
- Errors and failed constructions are productive states that should remain inspectable and revisable.

## Layers

WorldSpec v0.1 separates five concerns:

1. **Intent** — what the learner is trying to explore, make, change, or test.
2. **World model** — objects, places, relationships, materials, functions, and constraints.
3. **Meaning** — aesthetic, emotional, cultural, social, narrative, and political qualities.
4. **Operations** — the verbs by which learners and agents transform representations.
5. **History** — revisions, reflections, provenance, and forks.

## Interaction model

A WorldSpec interaction should usually take one of three forms:

- **Direct**: the learner gives a sufficiently concrete construction instruction.
- **Interpretive**: the learner uses a semantic or aesthetic idea that can map to multiple designs; Turtle proposes an interpretation or asks a clarifying question.
- **Reflective**: the learner evaluates what happened in the world, and the system records that reflection before the next revision.

This distinction is intentional. TurtleBlock AI should not quietly turn every ambiguous human idea into a finished structure.

## Files

- `schema/worldspec.schema.json` — machine-readable v0.1 schema
- `lexicon/core.yaml` — first construction and interaction vocabulary
- `grammar/interactions.md` — interaction grammar and agent behavior rules
- `examples/settlement.yaml` — example WorldSpec instance

## Status

WorldSpec is experimental and building in public. The vocabulary and schema are expected to change through use with learners and through implementation against Minecraft Java/Paper and Minecraft Education/Bedrock.
