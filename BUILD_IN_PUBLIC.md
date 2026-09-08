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
3. choose one bounded contribution;
4. implement it in the most appropriate repository location;
5. add or run a tiny test or observable success criterion when practical;
6. write the detailed daily note under `research/daily-build/`;
7. prepend a concise public entry to `src/buildLog.ts`;
8. make a conservative version judgment.

Version numbers are earned by implemented and tested capability, not by calendar cadence.

## No false polish

Building in public means publishing the state of the work, including provisional architecture, failures, reversals, and open questions. The public site should not imply that experimental components are finished.

## Research boundary

Public build notes may summarize architecture and learning. Raw learner conversations, private Discord content, personal identifiers, private WorldSpecs, and research data are not published merely because the platform is built in public.

Synthetic Turtle self-play, if introduced, must remain explicitly labeled as synthetic machine-generated research data and must not be blended into human learner evidence.

## Operational expectation

When code and documentation diverge, treat that as a defect. The website, repository documentation, and running platform should describe the same current architecture as closely as practical.

---

## Build log

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
