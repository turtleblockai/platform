# TurtleBlock AI

**Constructivist AI agents for building, exploring, and iterating computational worlds in Minecraft and beyond.** 🐢🧱

TurtleBlock AI is an open, build-in-public research and development project exploring how AI agents can function as constructivist collaborators inside computational microworlds. The project is inspired by Papert-style constructionism: learners externalize ideas, build representations, test them in-world, reflect on what happens, and revise.

## Core idea

The basic loop is:

`student intent → agent dialogue → WorldSpec → construction engine → playable world → reflection → revision`

The goal is not to have AI simply generate finished Minecraft builds. The goal is to create a computational partner that helps learners make ideas constructible, encounter the consequences of those constructions, and iterate.

## Architecture

Planned layers include:

- **WorldSpec** — an edition-independent declarative representation for form, function, materials, aesthetics, constraints, and meaning.
- **Construction Engine** — geometry, palettes, styles, shape grammars, validation, and world-generation logic.
- **Minecraft Java / Paper adapter** — custom server integration for rapid experimentation and programmable world changes.
- **Minecraft Education / Bedrock adapter** — a parallel path for school-oriented deployment and Bedrock scripting.
- **ARCADEMY integration** — a persistent learning portal for projects, identities, conversations, reflection, iteration history, and publishing.
- **Discord integration** — a discourse layer where learners can talk with agents, collaborate, review builds, and trigger revisions.
- **Turtle** — the learner-facing constructivist agent persona; specialized design, critique, testing, and building capabilities may operate behind it.

## Cloudflare deployment

This repository is currently scaffolded as a Cloudflare Worker with static assets.

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

A health endpoint is available at:

```text
/api/health
```

## Current milestone

Establish the public platform skeleton, deploy `turtleblockai.com`, then begin the first `WorldSpec` schema and Minecraft bridge experiments.

## Status

Early-stage and building in public.
