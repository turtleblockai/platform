# Build in Public Rule

TurtleBlock AI is built in public. Public documentation is part of the implementation, not an afterthought.

## Standing rule

Whenever a meaningful architectural, pedagogical, agent-behavior, WorldSpec, Minecraft-integration, Discord, research-data, or implementation milestone is committed, the public TurtleBlock AI site should be updated in the same work cycle or immediately afterward.

A meaningful milestone includes:

- a new user-visible capability;
- a new architectural subsystem;
- a material change to the Turtle Charter or agent behavior;
- a new WorldSpec representation or grammar rule;
- a new research or interaction-capture mechanism;
- a working external integration;
- a significant finding from field use;
- an important failure, limitation, or design reversal;
- a roadmap change.

## Public update should answer

1. What changed?
2. Why does it matter?
3. What did we learn?
4. What remains experimental or unresolved?
5. What is the next useful step?

## No false polish

Building in public means publishing the state of the work, including provisional architecture, failures, reversals, and open questions. The public site should not imply that experimental components are finished.

## Research boundary

Public build notes may summarize architecture and learning. Raw learner conversations, private Discord content, personal identifiers, private WorldSpecs, and research data are not published merely because the platform is built in public.

## Operational expectation

When code and documentation diverge, treat that as a defect. The website, repository documentation, and running platform should describe the same current architecture as closely as practical.

---

## Build log

### 2026-09-08 — Daily co-active build loop activated

TurtleBlock AI now has a daily research → deliberation → proposed-build loop. Each day the process scans recent primary-source work from OpenAI, NVIDIA, Minecraft / Minecraft Education, and the MIT Media Lab, then compares meaningful developments against the Sanders research ontology and the current TurtleBlock architecture.

The loop may propose at most one small, reviewable improvement to the Try It model, Turtle behavior, WorldSpec, evaluation, interface, or documentation. A new external feature does not automatically justify a TurtleBlock feature. A daily run may explicitly conclude that no build is justified.

Version numbers are earned by implemented and tested capability, not by calendar cadence. Bryan remains the human editor and approver: the machine hunts, compares, proposes, and tests; the human retains judgment over what becomes TurtleBlock AI.

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

Activating the daily research/build process is documentation and process work: **no version bump**. If Co-Active Trace is implemented and the tiny test passes, it earns **v0.1.1**. It is progress toward v0.2, not v0.2 itself.

**Public-note draft**

> Today TurtleBlock AI started its daily co-active build loop. The first hunt did not tell us to bolt on a shiny new feature. It told us something more useful: the machine should expose where the human changed its mind. The next tiny experiment is a Co-Active Trace — a visible record of intent, interpretation, human steering, and revised WorldSpec. Small turtle step; important epistemological footprint. 🐢
