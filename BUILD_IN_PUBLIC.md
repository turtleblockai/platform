# Build in Public Rule

TurtleBlock AI is built in public. Public documentation is part of the implementation, not an afterthought.

## Standing rule

Whenever a meaningful architectural, pedagogical, agent-behavior, WorldSpec, Minecraft-integration, Discord, research-data, implementation, evaluation, or documentation milestone is committed, the public TurtleBlock AI Build Log should be updated in the same work cycle or immediately afterward.

A meaningful milestone includes:

- a new user-visible capability;
- a new architectural subsystem;
- a material change to the Turtle Charter or agent behavior;
- a new WorldSpec representation or grammar rule;
- a new research or interaction-capture mechanism;
- a working external integration;
- a new regression test or evaluation that materially sharpens the research;
- a significant finding from field use;
- an important failure, limitation, or design reversal;
- a roadmap change.

## Public update should answer

1. What changed?
2. Why does it matter?
3. What did we learn?
4. What remains experimental or unresolved?
5. What is the next useful step?

## Newest first

The public WWW Build Log is reverse chronological: **newest entries appear at the top** while older work remains visible below. Daily entries are maintained in `src/buildLog.ts`; the Worker injects those entries into the public Build Log and reverses the older historical stages already embedded in the original SPA.

Detailed daily deliberations live in `research/daily-build/YYYY-MM-DD.md`.

## Daily co-active build rule

The daily TurtleBlock AI build process is allowed to work anywhere in the repository. Each run should leave behind at least one concrete, reviewable contribution: code, a test, an evaluation, documentation, research structure, a refactor, a regression case, or another useful artifact.

Do not force a user-facing feature merely to satisfy the daily cadence. If the research hunt does not justify a product change, improve the system's tests, evaluation, documentation, provenance, or research infrastructure instead.

Every daily run should:

1. scan recent primary-source work from OpenAI, NVIDIA, Minecraft / Minecraft Education, and the MIT Media Lab;
2. compare meaningful signals against the Sanders research ontology and current TurtleBlock architecture;
3. sweep the repository and public WWW for meaningful research-bearing artifacts that are missing, stale, or intentionally excluded from D1 representation;
4. choose one bounded contribution;
5. implement it in the most appropriate repository location;
6. add or run a tiny test or observable success criterion when practical;
7. write the detailed daily note under `research/daily-build/`;
8. prepend a concise public entry to `src/buildLog.ts`;
9. produce structured research metadata for the run: source signals, questions, candidates, rejections, implementation, tests, reconciliation findings, version judgment, and ontology/CTC tags;
10. make a conservative version judgment.

Version numbers are earned by implemented and tested capability, not by calendar cadence.

## Daily D1 reconciliation sweep

The living project should not know something today that the research substrate cannot find tomorrow.

Every daily build therefore includes a bounded **repository + WWW → D1 reconciliation sweep**. The sweep checks whether meaningful research-bearing artifacts, concepts, behaviors, tests, reversals, public pages, Build Log entries, Next Edge records, Terraria/TurtleAsk structures, and consent-safe operational traces are adequately represented, linked, or intentionally excluded in the D1 research substrate.

The goal is not to copy every file or paragraph into D1. Preserve **research identity, provenance, relationships, and discoverability** while leaving the canonical payload where it belongs.

Useful canonical patterns include:

```text
public/repository artifact → research_object → repo_path / source URI
private operational record → research_object → source_table / source_id
```

A meaningful reconciliation candidate should resolve to one of three states:

1. **represented** — D1 already has an adequate object/pointer and supported relationships/tags;
2. **backfilled** — a safe missing representation was created or strengthened;
3. **intentionally not captured** — privacy, duplication, unsupported provenance, an unapplied migration, or another explicit boundary prevents capture.

Silence is not a fourth state.

When a live, appropriately authorized D1 write path is available, safely backfill supported records and metadata. When it is not available, never claim that persistence occurred: preserve material gaps in `research/d1-reconciliation/` and/or the daily `.tags.json` staging manifest with enough information to reconcile later.

Do not duplicate raw private dialogue into generalized research text merely to satisfy the sweep. Do not inspect, infer, copy, or publish secret values or private configuration payloads. Meaningful WWW concepts count as research representations; cosmetic copy changes do not require a database row per paragraph.

The standing doctrine is documented in `research/D1_RECONCILIATION.md`; `scripts/audit-d1-coverage.mjs` provides a conservative static repository audit. A missing static declaration is a reconciliation candidate, not proof that live D1 lacks the object.

## Consented TRY IT play

TRY IT is becoming an entry into the Human + Turtle Terrarium rather than merely a demonstration textbox.

When the current explicit Playground research consent boundary is satisfied, the system may preserve:

- the private Turtle session;
- human and Turtle turns with distinct provenance;
- WorldSpec revisions;
- the separately screened Playground research submission;
- a Human + Turtle Terrarium run/event trace that points back to the canonical operational records without unnecessarily duplicating raw dialogue.

Human play is not automatically public, not automatically approved training/evaluation data, and not automatically evidence of learning. The Terrarium trace describes the interaction context and provenance; it does not transform participation into a learning claim.

The initial TRY IT Terrarium entry modes are intentionally open-ended: **Wander with Turtle**, **Make a world**, and **Throw in something weird**. These are starting conditions, not curricular tracks or learner classifications.

## Exhaustive tagging rule

The Sanders research ontology is infrastructure for the whole project, not a separate bibliography page.

Whenever TurtleBlock AI creates, changes, questions, tests, rejects, observes, reflects upon, or publishes something that may matter later, preserve enough metadata to register it as a research object and tag it as exhaustively as the evidence supports.

Tagging may include:

- one or more established Critical Techno Constructivism domains;
- one or more concepts from the longitudinal Sanders ontology;
- emergent/free tags that are useful but not yet ontology concepts;
- explicit relationships to other research objects;
- provenance, actor, evidence class, privacy class, model/configuration, source, and version information;
- an uncaptured observation when the current ontology does **not** adequately describe what happened.

Do not force every observation into the existing categories. The seven authored CTC domains remain established, while `ctc_uncaptured_observations` and `ctc_candidate_domains` deliberately leave room for evidence that may eventually justify an eighth, ninth, tenth, or other domain. Machines may propose candidate structure; promotion into the established CTC framework requires an explicit human scholarly decision.

A useful default sequence is:

```text
something happens
→ preserve provenance
→ register research object
→ tag CTC domains
→ tag Sanders ontology concepts
→ add emergent tags
→ preserve unmapped residue
→ relate to other objects
→ keep it queryable
```

Tag the **movement** as well as the artifact. A question, machine interpretation, human disagreement, correction, revision, rejected build candidate, failed test, synthetic critique, reconciliation gap, and final output are distinct research events even when they belong to the same recursive cycle.

## Turtle Terraria

The former Turtle Lab is becoming **Turtle Terraria**, an umbrella of bounded research habitats. The current three are:

1. **Human + Turtle Terrarium** — human-driven inquiry and iteration with TurtleBlock AI;
2. **Recursive Turtle Terrarium** — explicitly synthetic machine-to-machine self-play for critique, regression, interpretation, and ontology testing;
3. **Human Tamagotchi Terrarium** — a deliberately playful human-only habitat in which people mostly do human things until a Turtle in another habitat forms a provenance-preserving `turtleAsk` seeking genuine human perturbation.

The Human Tamagotchi representation is not a simulated person. It must not answer for a human or silently infer mood, availability, intimacy, attention, or receptivity. A TurtleAsk may be formed because of inquiry saturation, persistent contradiction, novelty collapse, a meaning boundary, missing situated knowledge, human otherness, or a playful desire for perturbation. **Ask formation and surfacing authority are separate.** A TurtleAsk is not permission to interrupt.

Recursive Turtle may form only a candidate TurtleAsk and still possesses no production authority. Human silence, refusal, delay, sideways answers, jokes, contradictions, and unrelated contributions are all legitimate outcomes. If a person answers, the response remains human-authored evidence; Turtle's interpretation remains a separate machine event.

Human evidence and synthetic evidence may cohabitate the broader research system but must never lose their provenance distinction.

The current schema is documented in `migrations/0007_turtle_terraria_and_exhaustive_tagging.sql`, `migrations/0009_human_tamagotchi_terrarium_and_turtle_ask.sql`, `research/TURTLE_TERRARIA.md`, and `research/TURTLE_ASK.md`.

## No false polish

Building in public means publishing the state of the work, including provisional architecture, failures, reversals, and open questions. The public site should not imply that experimental components are finished.

## Research boundary

Public build notes may summarize architecture and learning. Raw learner conversations, private Discord content, personal identifiers, private WorldSpecs, and research data are not published merely because the platform is built in public.

Synthetic Turtle self-play, if introduced, must remain explicitly labeled as synthetic machine-generated research data and must not be blended into human learner evidence.

The Human Tamagotchi Terrarium does not authorize surveillance, inferred availability, simulated human answers, generalized personal memory, or proactive production messaging. A future TurtleAsk implementation must preserve the source inquiry, reason for the ask, surfacing decision, response status, response provenance, and return trajectory when practical.

The D1 reconciliation sweep does not weaken these boundaries. Missing private material is not a defect merely because it is absent from a generalized research table; an intentional privacy boundary is a valid reconciliation outcome.

## Operational expectation

When code and documentation diverge, treat that as a defect. The website, repository documentation, running platform, research database, ontology metadata, and public research trail should describe the same current architecture as closely as practical.

The D1 reconciliation sweep is one defense against that drift. Another is avoiding unnecessary duplicate sources of truth: when the same public state is hard-coded in multiple places, either reconcile them explicitly or refactor toward one canonical source when practical.

---

## Build log

### 2026-09-12 — TRY IT enters Turtle Terraria + daily D1 reconciliation

TRY IT now has an initial Human + Turtle Terrarium layer. Visitors can begin by **Wandering with Turtle**, **Making a world**, or **Throwing in something weird**. The same consented conversation engine remains underneath, but the entry mode and habitat are now explicit provenance rather than merely interface copy.

A new `/api/terraria/play` bridge keeps the canonical private session, human/Turtle turns, WorldSpec revisions, and screened Playground submission in their existing stores while adding a Human + Turtle Terrarium run/event trace when D1 is available. Raw dialogue is deliberately not duplicated into the Terrarium event payload.

The daily build also gains a standing D1 reconciliation sweep. `research/D1_RECONCILIATION.md` defines the preservation rule; `scripts/audit-d1-coverage.mjs` provides a conservative repository audit; CI runs the audit and a new Terraria TRY IT contract check. Live D1 backfill remains conditional on an authorized runtime path.

### 2026-09-11 — Human Tamagotchi Terrarium + TurtleAsk architecture

Turtle Terraria gains a third theoretical habitat: **Human Tamagotchi Terrarium**. Humans mostly interact with humans there; a playful virtual-human representation is an inert pointer to a real participant, never a simulated human mind.

The new `turtleAsk` boundary event reverses the usual direction of inquiry. A Turtle working in Human + Turtle or bounded Recursive Turtle research may eventually form an ask when continued machine-only inquiry appears less useful than genuine human difference. `Inquiry Saturation` is the provisional technical construct beneath the deliberately funny phrase **Turtle gets bored**.

Migration `0009_human_tamagotchi_terrarium_and_turtle_ask.sql` adds the third habitat, provisional TurtleAsk / Inquiry Saturation / Human Perturbation concepts, exhaustive CTC and ontology mappings, uncaptured residue, and a `turtle_asks` table. The table separates ask formation from surfacing authority and hard-codes no production authority or required human response. `research/TURTLE_ASK.md` records the theoretical model and minimum conditions for a genuine TurtleAsk moment.

This is architecture, not a shipped proactive-agent feature. No Turtle has acquired permission to interrupt anyone.

### 2026-09-08 — Turtle Terraria + exhaustive tagging architecture

Turtle Lab is becoming Turtle Terraria: an umbrella of bounded habitats for studying human-machine co-active inquiry and synthetic recursive machine self-play. The first two habitats are Human + Turtle and Recursive Turtle.

Migration `0007_turtle_terraria_and_exhaustive_tagging.sql` adds a universal research-object registry; first-class Terraria runs, events, artifacts, and observations; auto-build research tables; established CTC domains; ontology and emergent tagging; automatic registration of Turtle operational records; and explicit structures for observations that do not yet fit the seven CTC domains. Migration `0008_seed_terraria_and_autobuild_tags.sql` demonstrates the approach by making the first auto-build deliberation and Terraria design queryable through CTC and ontology mappings.

The WWW now uses Turtle Terraria language while temporarily retaining the `/lab/` path for compatibility.

### 2026-09-08 — WWW Build Log reversed + daily build made operational

The public Build Log now renders newest-first through a small Worker-side build-log layer rather than requiring risky manual edits to the large single-page `public/index.html`. `src/buildLog.ts` holds new daily entries; `src/entry.ts` injects the build-log runtime; and Wrangler now routes through that wrapper before delegating to the existing application.

The daily research loop is also upgraded from **propose-only** to **build something useful somewhere in the repository**. User-facing feature churn is still forbidden: when no product change is justified, the daily contribution can be a test, evaluation, documentation improvement, provenance improvement, research artifact, or refactor.

### 2026-09-08 — Daily co-active build loop activated

TurtleBlock AI now has a daily research → deliberation → build loop. Each day the process scans recent primary-source work from OpenAI, NVIDIA, Minecraft / Minecraft Education, and the MIT Media Lab, then compares meaningful developments against the Sanders research ontology and the current TurtleBlock architecture.

Bryan remains the human author and editor of the larger research direction even while the system is permitted to make bounded daily repository contributions automatically.

### 2026-09-08 — First hunt and deliberation

**Signals examined**

- OpenAI: longer-horizon agentic research is increasing, but successful work still depends on human steering, intervention, judgment, and interpretation of evaluation signals.
- NVIDIA: a memory-driven agent pattern separates source evidence from derived knowledge and preserves explicit user corrections in an inspectable audit trail rather than silently rewriting history.
- Minecraft Education: dedicated-server cross-tenant multiplayer makes collaboration across schools and organizations easier, strengthening the long-term case for shared-world and multi-user TurtleBlock work.
- MIT Media Lab: current work revisits the 1979 *Put That There* principle that machines should adapt to human language, gesture, ambiguity, and intent rather than requiring people to adapt themselves to machine syntax; contemporary educator work also emphasizes small pilots whose findings are shared openly.

**Ontology deliberation**

The strongest immediate overlap is not a new autonomous feature. It is a clearer human-machine correction loop. That maps directly to Personal Inquiry, Technology as Tool to Think With, Formative Demonstration of Learning, Reflection as Learning, and co-active emergence. It also protects the learner-author boundary already central to WorldSpec and the Turtle Charter.

**Next proposed micro-build: Co-Active Trace**

After Turtle produces an initial WorldSpec interpretation, expose a small steering checkpoint: **Keep / Change / Question**. Preserve the learner's original language, Turtle's first interpretation, the learner's correction or question, the ontology concepts engaged, and the resulting revised WorldSpec as distinguishable provenance states.

Do **not** add generalized persistent personal memory as part of this experiment. Cross-session memory belongs to a later milestone and should not be smuggled into a small interpretive change.

**Implementation sketch**

```text
user_intent
  ↓
initial_worldspec
  ↓
ontology_hits
  ↓
human_steering { keep, change, question }
  ↓
final_worldspec
  ↓
co_active_trace
```

A correction should modify the interpreted state while preserving the prior state for inspection. Turtle should never make a human correction look as though the machine inferred it from the beginning.

**Tiny test**

Start with: “Build a village near a dangerous forest where people have to decide whether to cut trees or protect them.” After Turtle interprets it, the learner changes one assumption: “The forest is not an enemy; it should have its own needs and agency.”

Success means the revised WorldSpec incorporates that correction without silently replacing the original intent, preserves the earlier interpretation, and makes the human intervention visible in the trace.

**Version judgment**

The daily-build infrastructure and WWW ordering change are process/architecture work: **no product version bump**. If Co-Active Trace is implemented and the tiny test passes, it can earn **v0.1.1**. It is progress toward v0.2, not v0.2 itself.

## Open research edge — can Turtle talk to Turtle?

Yes, technically. A future self-play loop could let a bounded **Builder Turtle** propose an interpretation or WorldSpec change and a separate **Reflector Turtle** critique it against the Turtle Charter, Sanders ontology, regression tests, and prior evidence. Their conversation could be stored as synthetic provenance, produce candidate changes on an isolated branch or sandbox, run tests, and surface a proposal for human review.

The research requirement is important: machine-to-machine dialogue must never masquerade as learner evidence, and self-modification should not silently promote itself into production merely because two Turtles agreed with one another. 🐢↔🐢
