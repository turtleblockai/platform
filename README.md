<p align="center">
  <img src="./docs/assets/turtleblock-workbench.svg" alt="The TurtleBlock AI workbench" width="100%" />
</p>

<p align="center">
  <strong>Research infrastructure for people and computational agents to build, inhabit, question, compare, and revise worlds together.</strong><br/>
  🐢🧱 <a href="https://turtleblockai.com">turtleblockai.com</a> ·
  <a href="https://turtleblockai.com/try/">try Turtle</a> ·
  <a href="https://turtleblockai.com/research/">research</a> ·
  <a href="https://turtleblockai.com/research/library/">research library</a> ·
  <a href="https://turtleblockai.com/build/">build log</a>
</p>

---

# Welcome to the workbench 🔧

This repository is the **working machinery** of TurtleBlock AI: Cloudflare Worker code, public assets, WorldSpec, Turtle behavior, research infrastructure, D1 migrations, ontology layers, Turtle Terraria habitats, hostile cases, deterministic validators, daily build traces, and the public record of what changed and why.

The project asks a deliberately different AI question:

> **What if the machine helped people make ideas visible enough to build, enter, compare, disagree with, and revise—without quietly taking ownership of purpose, judgment, or meaning?**

The learner remains the **designer and producer**.

```text
human purpose
     ↓
conversation
     ↓
provisional machine interpretation
     ↓
WorldSpec
     ↓
construction / simulation / playable artifact
     ↓
experience + consequence
     ↓
reflection / disagreement / revision
     ↺
```

That loop grows from a longer Sanders research lineage spanning constructivism, constructionism, Critical Techno Constructivism, Minecraft learning environments, Purposeful Play, STEAMHAMLET, Engaging with AI, Co-active Emergence, and persistent computing environments.

The current package version remains **v0.1.0**. Version numbers are earned by implemented and tested capability, not by elapsed time or documentation volume.

---

## 🗺️ Repository map

| Area | What lives there |
|---|---|
| 🌎 [`worldspec/`](./worldspec/) | WorldSpec architecture, Turtle Charter, schemas, hostile cases, and inspectable human↔machine representation contracts |
| 🐢 [`src/`](./src/) | Worker APIs, Turtle behavior, runtime logic, D1 access, Build Log compatibility, and application code |
| 🔬 [`research/`](./research/) | Turtle Terraria, TurtleAsk, Next Edge, daily research cycles, perturbation contracts, branch-comparison work, provenance, and research-development notes |
| 🧠 [Sanders Research Ontology](./worldspec/Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy.md) | Immutable dissertation source layer plus later Sanders-authored concepts and TurtleBlock mappings |
| 🗃️ [`migrations/`](./migrations/) | D1 schema and data evolution: learner/research capture, ontology, Terraria, TurtleAsk, library catalog, physical-copy provenance, and publication state |
| 🌐 [`public/`](./public/) | Asset-first public WWW, Turtle Terraria, Research, Research Library, Terms, static chrome, and public data such as Next Edge |
| 🧪 [`scripts/`](./scripts/) | Deterministic validators, coverage audits, Discord helpers, and small operational checks |
| 📜 [`BUILD_IN_PUBLIC.md`](./BUILD_IN_PUBLIC.md) | Standing doctrine for public research/build traces, exhaustive tagging, and architecture/documentation coherence |
| 🔭 [`public/data/next-edge.json`](./public/data/next-edge.json) | The current future-facing research question, Possible Possibles, provenance, mappings, and unresolved residue |

---

## Turtle Lab became Turtle Terraria 🔬

The canonical transition is:

```text
Turtle Lab
   ↓ expanded into
Turtle Terraria
```

**Turtle Lab** began as the public artifact / experiment layer.

As the research grew beyond one kind of interaction, it became **Turtle Terraria**: an umbrella for bounded habitats whose inhabitants, permissions, evidence classes, and research questions remain distinguishable.

The canonical public route is **`/terraria/`**. The old Lab path remains only as compatibility infrastructure where still needed.

### Habitat 1 — Human + Turtle

Human-driven inquiry. Turtle may question, interpret, retrieve, compare, construct, and notice.

Human purpose, correction, judgment, reflection, disagreement, and values remain human-authored.

### Habitat 2 — Recursive Turtle

Explicitly synthetic Builder/Reflector or other bounded self-play for critique, hostile cases, regression, representation testing, and ontology questions.

```text
synthetic Builder Turtle
        ↓
proposal
        ↓
synthetic Reflector Turtle
        ↓
critique + Charter / ontology / regression checks
        ↓
revision
        ↓
human gate
```

Synthetic self-play is labeled `synthetic_self_play`.

It is **not human-learning evidence**.

It has **no autonomous production authority**.

### Habitat 3 — Human Tamagotchi

Humans mostly do human things elsewhere. A deliberately playful virtual-human/Tamagotchi representation may point toward an actual person, but it is **not a simulated human** and cannot answer for one.

The cross-habitat research mechanism is [**TurtleAsk**](./research/TURTLE_ASK.md):

```text
Turtle inquiry
      ↓
repetition / contradiction / uncertainty / missing human otherness
      ↓
candidate TurtleAsk
      ↓
separate consent + attention gate
      ↓
human may answer / ignore / defer / refuse / answer sideways
      ↓
human response keeps human provenance
      ↓
Turtle interpretation
      ↓
inquiry may change
```

“Turtle gets bored” is intentionally preserved as playful language. **Inquiry Saturation** is the provisional technical construct beneath it; the project does not need to claim machine consciousness to study when machine-only inquiry stops producing useful difference.

---

## WorldSpec: meaning before geometry 🌎

WorldSpec is an emerging representation system for turning learner language into something computationally inspectable **without pretending the machine already knows what the learner means**.

Some requests are direct:

```text
"move the bridge six blocks east"
```

Some are not:

```text
"make the courtyard less authoritarian"
```

The second request should not silently become a universal geometry recipe.

A central rule is:

> **lossless before normalized**

Original learner language should survive classification. Poetic, symbolic, cultural, political, emotional, spatial, narrative, contradictory, ambiguous, and gloriously weird meaning does not vanish because a schema lacks a field.

```text
learner language
      ↓
Turtle interpretation v1
      ↓
human keeps / changes / questions
      ↓
WorldSpec revision
      ↓
construction
      ↓
world observation
      ↓
reflection
      ↓
revision ↺
```

Human correction must never be rewritten as though Turtle had understood correctly from the beginning.

---

## Turtle Charter: agency is architecture 📜🐢

The [Turtle Charter](./worldspec/TURTLE_CHARTER.md) is the behavioral constitution for the learner-facing agent.

Turtle may contribute:

`questions` · `possibilities` · `interpretations` · `comparisons` · `prototypes` · `technical help` · `consequences` · `uncertainty`

The human retains:

`purpose` · `meaning` · `judgment` · `values` · `authorship` · `disagreement` · `reflection` · `the right to change their mind`

Current operating commitments include:

- inquiry before predetermined outcomes;
- reversible proposals over silent assumptions;
- disagreement is data;
- manual human edits are authored state;
- interesting failure may remain visible;
- memory supports continuity, not destiny;
- noticing is not permission to interrupt;
- remembered purpose is not permanent authority to reactivate or nudge;
- quieting, refusal, redirection, and revoked delegation must change machine authority;
- Turtle may say **“I don't know yet.”**

---

## The research contracts have moved beyond “good replies”

The project now contains several provisional, deterministic contracts for harder human–machine boundaries.

### Selective Attention

**Noticing is not permission to interrupt.**

World events, retention, salience, surfacing, interruption, and importance remain separate states. Learner-authored watchpoints may authorize bounded interruption; system relevance alone may not.

### Plural Foreground

**A shared world does not imply shared attention.**

Different collaborators may keep different foregrounds. Turtle must not average them into a fake consensus or silently manufacture group priorities.

### Human Perturbation Translation

**A human contribution must survive Turtle interpretation without being laundered into Turtle's voice.**

Canonical human source, machine interpretation, unresolved language, refusal, silence, and later revisions remain distinct.

### Branch Experience Comparison

**Two built worlds can disagree without becoming a leaderboard.**

WorldSpec branches can preserve separate histories, human-authored criteria, world-evidence pointers, and reflections without forcing a winner, canonical branch, or automatic merge.

### Cross-Branch Perturbation

**A branch can lend another branch a question without swallowing it.**

A traceable question, observation, or constraint may cross branches without erasing source/target lineage or pretending transfer proves that either branch corrected the other.

### Persistent Perturbation

The current [Next Edge](./public/data/next-edge.json) asks:

> **When does persistence become persistent perturbation?**

A long-running environment may become directive through the accumulation of individually reasonable nudges. The reciprocal research question is whether the learner can **perturb the machine back** by quieting, redirecting, or revoking initiative in ways that actually change machine permissions rather than becoming another personalization signal.

---

## Research ontology: don't flatten the scholarship 🧠

The project preserves a formal **Dr. Bryan P. Sanders TurtleBlock AI Research Ontology**.

The provenance boundary matters:

```text
2019 dissertation Dedoose coding
        ≠
later Sanders-authored concepts
        ≠
authored operational CTC tools
        ≠
physical/intellectual library sources
        ≠
TurtleBlock interpretations
        ≠
learner meaning right now
```

They may be related. They should not be silently collapsed.

The original dissertation Dedoose code layer remains immutable. Later concepts such as **Possible Possibles**, **Machine Responses as Material for Evaluation**, **Invisible Ideas Become Visible and Manipulable**, **Purposeful Play**, **STEAMHAMLET**, and **Co-active Emergence** are represented as later source-backed layers.

Provisional operational concepts such as **TurtleAsk**, **Human Tamagotchi Terrarium**, **Inquiry Saturation**, **Human Perturbation**, **Selective Attention**, and **Persistent Perturbation** are layered later with explicit status and provenance; they do not rewrite the dissertation source layer.

The seven established Critical Techno Constructivism operational domains remain:

1. Personal Inquiry
2. Compelling Problem or Question
3. Technology as Tool to Think With
4. Formative Demonstration of Learning
5. Reflection as Learning
6. Social and Cultural Critique
7. Sharing and Collaborating

If an observation matters and does not fit, the system preserves **uncaptured residue** instead of force-fitting it. A machine may propose candidate structure; only human scholarly judgment can promote a new CTC domain.

---

## Research Library: the shelf is now queryable 📚

The public **[TurtleBlock AI Research Library](https://turtleblockai.com/research/library/)** is now backed by D1 and treated as a research subspace rather than a decorative bibliography.

The current catalog contains **25 source records** recovered from the photographed physical collection and cataloging sessions.

The schema preserves distinctions among:

- original-work year and edition year;
- chronology basis;
- physical ownership and physical-copy multiplicity;
- bibliographic source facts;
- digital-copy status;
- special notes and artifact provenance;
- researcher-authored connections;
- public/private publication state.

The current migration line extends through **`0029_publish_library_catalog.sql`**.

The governing principle is:

> **Record stays. Object is optional.**

A physical object can leave the shelf later without erasing its verified place in the intellectual history of the project.

The library also makes odd but meaningful artifacts researchable. A signed copy, inserted game sheet, duplicate edition, or special note can be preserved as provenance rather than flattened into a title/author row.

---

## D1 is a research substrate, not merely app storage 🗃️

The database increasingly carries distinct but connected layers for:

- consent-aware Playground submissions;
- persistent Turtle sessions and turns;
- WorldSpec revisions;
- publications and research events;
- the Sanders ontology and source passages;
- authored tools and longitudinal lineage;
- Turtle Terraria habitats, runs, participants, events, artifacts, and observations;
- exhaustive CTC / ontology / emergent tagging;
- uncaptured observations and provisional candidate domains;
- auto-build source signals, candidates, rejections, implementation events, tests, and version judgments;
- TurtleAsk and cross-habitat boundaries;
- the physical/intellectual Research Library.

The design goal is not “one database to rule them all.”

It is:

> **Let many kinds of evidence coexist without losing who made them, what they authorize, what they mean, or what remains unknown.**

---

## Build in public: completed work and open questions are different things 🛠️

The daily build loop is intentionally bounded:

```text
HUNT
  ↓
DELIBERATE
  ↓
BUILD ONE THING
  ↓
TEST
  ↓
REGISTER RESEARCH OBJECTS
  ↓
CTC + ONTOLOGY + EMERGENT TAGS
  ↓
PRESERVE WHAT DIDN'T FIT
  ↓
BUILD LOG
  ↓
NEXT EDGE
```

Detailed cycles live in [`research/daily-build/`](./research/daily-build/).

The public **Build Log** records **completed, committed work**.

A completed entry may also carry a **“Wait a minute…”** companion when a meaningful recurrence, contradiction, or connection becomes visible and can be tied to evidence.

The separate [`public/data/next-edge.json`](./public/data/next-edge.json) carries **one future-facing question**, alternate Possible Possibles, provenance, CTC/ontology mappings, uncaptured residue, and an X-factor so the future does not become ordinary backlog grooming.

Current standing X-factor tradition:

> **whoooo knooooowwwssssssssssss**

Human-authored interventions may enter the project ecology without being rewritten as machine-generated conclusions.

---

## Runtime shape

The current deployment intentionally separates stable public assets from dynamic Worker behavior.

```text
public WWW assets
      +
Cloudflare Worker APIs
      +
D1 research / project state
      +
versioned repository research artifacts
```

The public site is primarily **asset-first**. API calls and dynamic operations run through the Worker.

That distinction is deliberate after a build-in-public failure made an important provenance point visible:

```text
committed ≠ mechanically tested ≠ deployed ≠ publicly experienced
```

Successful infrastructure status is not the same thing as a successful human experience of the site.

---

## Run the workbench locally

```bash
npm install
npm run dev
```

Core checks:

```bash
npm run typecheck
npm run validate:next-edge
npm run validate:learner-verification
npm run validate:world-evidence
npm run validate:selective-attention
npm run validate:plural-foreground
npm run validate:human-perturbation
npm run validate:branch-experience
npm run validate:cross-branch-perturbation
npm run validate:build-log-connections
npm run validate:terraria-try
npm run audit:d1-coverage
```

The Cloudflare Worker entry point is **`src/entry.ts`**.

Static public assets live in **`public/`**.

Deployment configuration lives in **`wrangler.jsonc`**.

Environment configuration may contribute runtime metadata, but secrets and private configuration values do not belong in public research traces or documentation.

---

## Current public surfaces

- [Home](https://turtleblockai.com/)
- [Try It](https://turtleblockai.com/try/)
- [About](https://turtleblockai.com/about/)
- [WorldSpec](https://turtleblockai.com/worldspec/)
- [Turtle Charter](https://turtleblockai.com/charter/)
- [Research](https://turtleblockai.com/research/)
- [Research Library](https://turtleblockai.com/research/library/)
- [Build Log](https://turtleblockai.com/build/)
- [Turtle Terraria](https://turtleblockai.com/terraria/)
- [STEAMHAMLET](https://turtleblockai.com/steamhamlet/)
- [RE/EDUCATION](https://turtleblockai.com/reeducation/)
- [Privacy](https://turtleblockai.com/privacy/)
- [Terms](https://turtleblockai.com/terms/)
- [Disclaimer](https://turtleblockai.com/disclaimer/)

---

## A few ways to participate

You can:

- inspect WorldSpec and find meaning it cannot preserve yet;
- invent a hostile case;
- make a strange world request;
- argue with a research assumption;
- find a provenance collapse;
- propose a Possible Possible;
- compare two branches without demanding a winner;
- tell Turtle to back off and help us study whether it actually does;
- add a source or artifact with careful provenance;
- build something that proves Turtle wrong;
- answer a future TurtleAsk completely sideways;
- ignore a future TurtleAsk because humans remain allowed to be busy being humans.

No prompt-engineering merit badge required.

---

<p align="center">
  <strong>Make something visible. Enter it. Notice. Revise. Repeat. ↺</strong><br/>
  🐢🧱🔬
</p>
