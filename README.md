# TurtleBlock AI

**Constructivist AI agents for building, exploring, and iterating computational worlds in Minecraft and beyond.** 🐢🧱

TurtleBlock AI is an open, build-in-public research and development project exploring how AI agents can function as constructivist collaborators inside computational microworlds.

The project grows directly from Bryan P. Sanders' work on Critical Techno Constructivism, STEAMHAMLET, Minecraft as a learning environment, purposeful play, and co-active emergence. The design premise is that learners should not merely receive generated worlds: they should externalize ideas, construct representations, inhabit and test them, reflect on what happens, and revise.

## Core loop

`learner intent → agent dialogue → WorldSpec → construction engine → playable world → observation → reflection → revision`

The goal is not to have AI simply generate finished Minecraft builds. The goal is to create a computational partner that helps learners make ideas constructible, encounter the consequences of those constructions, and iterate.

## WorldSpec v0.1

WorldSpec development is now underway in [`worldspec/`](worldspec/).

It begins with three connected artifacts:

- **Schema** — what a computational world can represent.
- **Lexicon** — the verbs, properties, meanings, constraints, and reflective concepts available to learners and agents.
- **Interaction grammar** — rules for deciding when Turtle should execute, interpret, ask, test, preserve, reflect, or revise.

WorldSpec intentionally distinguishes **direct**, **interpretive**, and **reflective** interactions. A request such as “move the bridge six blocks east” can be executed directly. A request such as “make the courtyard less authoritarian” should expose interpretation rather than silently converting a human value into a fixed architectural recipe.

Current files:

- [`worldspec/schema/worldspec.schema.json`](worldspec/schema/worldspec.schema.json)
- [`worldspec/lexicon/core.yaml`](worldspec/lexicon/core.yaml)
- [`worldspec/grammar/interactions.md`](worldspec/grammar/interactions.md)
- [`worldspec/examples/settlement.yaml`](worldspec/examples/settlement.yaml)

## Design commitments

- Learner as **designer and producer**, not consumer.
- Inquiry before predetermined outcome.
- Play, curiosity, and discovery are legitimate engines of curriculum.
- Manual learner edits are first-class state and should be preserved.
- Meaning includes aesthetic, emotional, cultural, social, narrative, and political dimensions.
- Ambiguity can be pedagogically useful; the agent should not erase it automatically.
- Failure, contradiction, conflict, and surprise can become material for reflection and revision.
- The machine is a collaborator and sounding board, not an authority.
- The artifact remains revisable: build → inhabit → notice → reflect → revise.

## Architecture

Planned layers include:

- **WorldSpec** — an edition-independent declarative representation for intent, form, function, materials, aesthetics, constraints, meaning, reflection, and revision history.
- **Construction Engine** — geometry, palettes, styles, shape grammars, validation, and world-generation logic.
- **Minecraft Java / Paper adapter** — custom server integration for rapid experimentation and programmable world changes.
- **Minecraft Education / Bedrock adapter** — a parallel path for school-oriented deployment and Bedrock scripting.
- **ARCADEMY integration** — a persistent learning portal for projects, identities, conversations, reflection, iteration history, and publishing.
- **Discord integration** — a discourse layer where learners can talk with agents, collaborate, review builds, and trigger revisions.
- **Turtle** — the learner-facing constructivist agent persona; specialized design, critique, testing, and building capabilities may operate behind it.

## Intellectual lineage

The immediate project source material is maintained publicly through STEAMHAMLET at [steamhamlet.com](https://steamhamlet.com), including work on Critical Techno Constructivism, Minecraft, purposeful play, STEAMHAMLET, and co-active emergence.

## Cloudflare deployment

This repository deploys as a Cloudflare Worker with static assets.

### Local development

```bash
npm install
npm run dev
```

### Deploy

```bash
npm run deploy
```

Static site files live in `public/`. The Worker entry point is `src/index.ts`.

API endpoints:

```text
GET /api/health
GET /api/worldspec
```

## Current milestone

Define WorldSpec v0.1 publicly, then implement the first conversational parser and construction adapter so a learner utterance can become a revisable world operation.

## Status

Early-stage and building in public.
