export interface WaitAMinuteConnection {
  summary: string;
  evidence: string[];
}

export interface BuildLogEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  done?: boolean;
  waitAMinute?: WaitAMinuteConnection;
}

// Newest completed work first. The public asset runtime remains the primary WWW path;
// this Worker-side layer remains as a compatibility path if HTML is ever rendered
// through the Worker. Open inquiry belongs in Next Edge, not in completed entries.
export const BUILD_LOG_ENTRIES: BuildLogEntry[] = [
  {
    id: "2026-09-30-initiative-authority-scope-conflict-validator",
    date: "Sep 30, 2026",
    title: "Scope conflicts get an executable authority test instead of a prose promise",
    body: "The Initiative Authority scope-conflict fixture now has an executable semantic validator. Fourteen cases — three valid and eleven hostile — preserve bounded learner-authored rules, conservative unresolved handling, and explicit learner-selected precedence while rejecting hidden machine tiebreakers and cross-scope authority changes. The validator passed a bounded replay against the canonical fixture. CI wiring remains unresolved, so this entry does not claim the new script runs in the standing workflow. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "The same boundary now appears in Initiative Authority and TurtleAsk: a system can notice, propose, or continue thinking without acquiring permission to override a human constraint. The useful next question is whether temporary restraint itself needs provenance.",
      evidence: ["worldspec/tests/initiative-authority-scope-conflict-cases.json", "scripts/validate-initiative-authority-scope-conflict.mjs", "research/TURTLE_ASK.md", "research/daily-build/2026-09-30.md"]
    }
  },
  {
    id: "2026-09-30-library-catalog-28",
    date: "Sep 30, 2026",
    title: "The research library grows from its first shelf to 28 cataloged sources",
    body: "The photographed-source D1 catalog has continued well beyond its initial eleven records. Repository migrations now carry the library through entry 28, including physical-copy distinctions, artifact and ephemera corrections, special notes, public-catalog visibility, and the latest batch for entries 26–28. The public research API reads the catalog from D1 while keeping catalog facts, interpretive notes, provenance, and verification status distinct. This Build Log entry records the accumulated library work as one research milestone rather than pretending each book is a separate product feature. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "The library is becoming more than a bibliography: it is a provenance-bearing source layer that can eventually connect physical artifacts to research objects without collapsing a photographed source, a catalog record, and an interpretation into the same thing.",
      evidence: ["migrations/0010_library_sources.sql", "migrations/0028_library_special_notes.sql", "migrations/0029_publish_library_catalog.sql", "migrations/0030_library_sources_0026_0028.sql", "src/entry.ts"]
    }
  },
  {
    id: "2026-09-29-initiative-authority-scope-conflict",
    date: "Sep 29, 2026",
    title: "Conflicting learner rules no longer get a secret machine tiebreaker",
    body: "A new Initiative Authority scope-conflict fixture makes project-, branch-, and purpose-scoped learner rules collide on purpose. Fourteen cases preserve an unresolved fail-closed posture or explicit learner-selected precedence while rejecting specificity, recency, relevance, hidden defaults, machine resolution, cross-scope mutation, generalized person scope, broader collection, and production self-modification as silent tiebreakers. The fixture is committed and passed a bounded structural contract check; an executable repository validator remains uncommitted because the connected executable-write path was blocked during this cycle. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "Failing closed protects authority, but invisible restraint can still become opaque machine governance. Discord already showed why provenance needs to be visible, while TurtleAsk separates forming an intention from permission to surface it. The next question is whether doing less itself needs inspectable provenance and human override.",
      evidence: ["worldspec/tests/initiative-authority-scope-conflict-cases.json", "src/discord.ts", "research/TURTLE_ASK.md", "worldspec/schema/initiative-authority-envelope.schema.json"]
    }
  },
  {
    id: "2026-09-28-initiative-authority-session-boundary",
    date: "Sep 28, 2026",
    title: "Scoped learner authority survives a session boundary without becoming personal memory",
    body: "A session-boundary Initiative Authority regression now permits explicit learner-authored authority to carry into a later session only inside the same declared scope and rejects person-wide memory, inferred preferences, scope leakage, silent restoration, remembered-purpose resurrection, relevance override, machine-authored authority, and broader collection. Thirteen cases require carried authority to remain exactly unchanged unless the learner explicitly restores something later. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "Crossing a boundary should not inflate authority: the same rule now appears across TurtleAsk surfacing, cross-branch perturbation, Discord engine provenance, and session carryover.",
      evidence: ["worldspec/tests/initiative-authority-session-boundary-cases.json", "scripts/validate-initiative-authority-session-boundary.mjs", "research/TURTLE_ASK.md"]
    }
  },
  {
    id: "2026-09-28-build-log-d1-coverage-repair",
    date: "Sep 28, 2026",
    title: "The Build Log and D1 reconciliation sweep stop disagreeing about project history",
    body: "The repository-to-D1 coverage matrix was repaired after a meaningful public Build Log item fell outside the reconciliation accounting. The sweep now treats public project history as research identity that needs a D1 representation, canonical pointer, intentional exclusion reason, or explicit unresolved-gap record rather than assuming a successful commit automatically entered the research substrate. Product remains v0.1.0.",
    done: true
  },
  {
    id: "2026-09-27-discord-conversation-provenance",
    date: "Sep 27, 2026",
    title: "Discord Turtle stops hiding when it falls back",
    body: "A human runtime check exposed that Discord was sometimes showing deterministic fallback text as though it were ordinary Turtle conversation. The Discord surface now keeps continuity and provenance underneath while making the visible exchange smaller and more natural: model replies answer the latest turn first, avoid routine WorldSpec narration, and ask at most one worthwhile question; the old UUID-heavy footer is gone; and every response says whether Turtle chat came from the model or fallback. Live checks advanced the same project through revisions r0003 and r0004 while chat stayed in fallback, isolating the failure to model generation rather than project continuity. The safe reason classifier then returned fallback (configuration), confirming the deployed Worker lacked OPENAI_API_KEY. Wrangler now declares that key as a required secret and CI guards against omitting it or committing it as plaintext. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "The awkward chat was also a provenance-collapse bug: model-generated Turtle speech and deterministic fallback speech looked identical. Turtle Terraria already treats provenance separation as architectural, so conversation-engine provenance now becomes visible at the interaction boundary too.",
      evidence: ["src/discord.ts", "src/turtleLLM.ts", "research/TURTLE_TERRARIA.md", "scripts/validate-discord-conversation.mjs"]
    }
  },
  {
    id: "2026-09-27-initiative-authority-regression",
    date: "Sep 27, 2026",
    title: "Revocation gets hostile tests instead of good intentions",
    body: "The Initiative Authority contract now has semantic hostile coverage instead of a fixture-count placeholder. Seventeen deterministic cases cover all seven declared learner actions and reject remembered-purpose authority resurrection, relevance override, machine-authored authority, silent restoration, scope expansion, overbroad explanation, incomplete revocation, stale-purpose retention, and collection expansion. The validator is wired into CI; this tests the contract and does not claim deployed cross-session compliance. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "The same boundary keeps recurring: noticing, asking, transferring, and remembering can create possibilities without acquiring authority to interrupt, apply, or resurface. Initiative Authority adds the negative-direction mirror: explicit human revocation must change future permission rather than become another preference signal.",
      evidence: ["worldspec/schema/selective-attention-envelope.schema.json", "research/TURTLE_ASK.md", "worldspec/schema/cross-branch-perturbation-envelope.schema.json", "worldspec/tests/initiative-authority-envelope-cases.json"]
    }
  },
  {
    id: "2026-09-26-initiative-authority",
    date: "Sep 26, 2026",
    title: "Learner revocation becomes an explicit initiative contract",
    body: "A provisional Initiative Authority Envelope names seven learner-controlled moves: go quiet, reduce initiative, stop resurfacing, retire a purpose, revoke delegated authority, request an explanation, and explicitly restore initiative later. Remembered purpose and inferred relevance cannot silently override those directions. The Sep 26 commit included only a fixture-shape check; semantic hostile enforcement was completed on Sep 27. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "Selective Attention, TurtleAsk, plural foregrounds, and initiative revocation all distinguish machine initiative from authority over human attention. The recurrence looks architectural, while silence, refusal, withdrawal, and explicit revocation remain different human acts.",
      evidence: ["worldspec/TURTLE_CHARTER.md", "worldspec/schema/selective-attention-envelope.schema.json", "research/TURTLE_ASK.md", "worldspec/schema/initiative-authority-envelope.schema.json"]
    }
  },
  {
    id: "2026-09-22-cross-branch-perturbation",
    date: "Sep 22, 2026",
    title: "A branch can lend another branch a question without swallowing it",
    body: "A provisional Cross-Branch Perturbation Envelope now lets a traceable question, observation, or constraint discovered in one WorldSpec branch be proposed to another without merging histories, erasing source lineage, or treating transfer as proof that either branch corrected the other. Fifteen deterministic cases preserve human target-branch authority, optional rejection or rewriting, source and target history, upstream human provenance when applicable, and the boundary against world/metric authority, synthetic execution, generalized personal memory, and production self-modification. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "Selective Attention already separated noticing from interruption. Cross-branch perturbation exposes the same agency boundary in construction: discovering a useful difference is not authority to apply it. The pattern now recurs across attention, TurtleAsk, and WorldSpec revision.",
      evidence: ["worldspec/schema/selective-attention-envelope.schema.json", "research/TURTLE_ASK.md", "worldspec/schema/cross-branch-perturbation-envelope.schema.json"]
    }
  },
  {
    id: "2026-09-18-branch-experience-comparison",
    date: "Sep 18, 2026",
    title: "Two built worlds can disagree without becoming a leaderboard",
    body: "A provisional Branch Experience Comparison Envelope now lets two or more WorldSpec branches carry separate histories, world-evidence pointers, human-authored criteria, and human reflections without forcing a winner, canonical branch, or merge. Twelve deterministic cases accept intentionally plural comparison, explicit human criteria, generative failure, Turtle proposals that remain proposals, and rejection of comparison while rejecting canonical branches, undeclared criteria, mismatched evidence, synthetic judgment, lost human-perturbation source, easy-metric authority, and automatic learning claims. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "TurtleAsk seeks human otherness when machine-only inquiry needs difference. A built alternate branch is not human otherness, but its consequences can become a second kind of perturbation source. That suggests a future cross-branch move: carry a question, constraint, or observation across without merging the branches that produced it.",
      evidence: ["research/TURTLE_ASK.md", "worldspec/schema/world-evidence-envelope.schema.json", "worldspec/schema/branch-experience-comparison-envelope.schema.json"]
    }
  },
  {
    id: "2026-09-17-human-perturbation-translation",
    date: "Sep 17, 2026",
    title: "Human otherness gets a lossless translation contract",
    body: "A provisional Human Perturbation Translation Envelope now tests whether a real human contribution can survive TurtleAsk → Turtle interpretation → WorldSpec change without being laundered into Turtle's voice. Twelve deterministic cases preserve the canonical human source, distinct Turtle interpretation, unresolved language, refusal/silence, parallel branches, and human merge authority while rejecting synthetic-human substitution, equivalence claims, fabricated movement after no response, rewritten source meaning, mismatched provenance, erased ambiguity, and machine-forced canonical merge. This remains research infrastructure rather than live TurtleAsk behavior. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "This edge turns out to be an old TurtleBlock rule crossing a new boundary: Dialogue Architecture already says lossless before normalized. TurtleAsk now makes that same requirement apply when a human perturbation crosses habitats into Turtle interpretation and WorldSpec.",
      evidence: ["worldspec/DIALOGUE_ARCHITECTURE.md", "research/TURTLE_ASK.md", "worldspec/schema/human-perturbation-translation-envelope.schema.json"]
    }
  },
  {
    id: "2026-09-17-physical-library-d1",
    date: "Sep 17, 2026",
    title: "The physical and intellectual library gets a D1 shelf",
    body: "A new private-by-default library_sources catalog now preserves photographed physical sources with original-work year, edition year, chronology basis, physical ownership, digital-copy status, and source-verification provenance kept distinct. Eleven photographed sources were seeded without outside bibliographic lookup, and the live D1 migration was verified at eleven rows. This catalog is live, but its bridge into the universal research-object graph remains intentionally unresolved until the live state of the earlier Terraria/research migrations is verified. Product remains v0.1.0.",
    done: true
  },
  {
    id: "2026-09-16-wait-a-minute-build-log",
    date: "Sep 16, 2026",
    title: "The Build Log can now say: Wait a minute…",
    body: "Completed Build Log entries can now carry an optional evidence-backed Wait a minute… companion when the daily cross-connection pass finds a genuinely useful overlap, contradiction, recurrence, or missing link. The field preserves a concise public summary plus canonical evidence pointers; older entries need no filler, and blank remains the correct state when no meaningful connection is found. A deterministic contract check keeps the field optional, evidence-backed, and synchronized across the canonical Build Log and direct-asset WWW renderer. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "This public companion is the human-readable face of the relationship graph already anticipated by D1: useful object-to-object connections can now become visible without turning the Build Log into a database dump.",
      evidence: ["migrations/0007_turtle_terraria_and_exhaustive_tagging.sql", "src/buildLog.ts"]
    }
  },
  {
    id: "2026-09-16-plural-foreground-regression",
    date: "Sep 16, 2026",
    title: "Plural foregrounds get hostile tests instead of a group-think UI",
    body: "The Plural Foreground Envelope now has an eleven-case deterministic hostile suite and validator. Passing cases preserve different foregrounds, selective disclosure, human-negotiated temporary shared watchpoints, and Turtle proposals that remain proposals. Failing cases reject machine-averaged consensus, Turtle-activated group rules, incomplete consent, delivery to non-consenting participants, synthetic production execution, shared-world-equals-shared-attention assumptions, and collection expansion. CI now runs the contract beside the existing Next Edge, learner verification, world evidence, selective attention, Terraria TRY IT, and D1 reconciliation checks. Product remains v0.1.0.",
    done: true,
    waitAMinute: {
      summary: "TurtleAsk and plural foregrounds are the same deeper problem from opposite directions: TurtleAsk seeks human otherness when machine-only inquiry loses useful difference; plural foregrounds protect that difference after it arrives by refusing to average incompatible human priorities into consensus.",
      evidence: ["research/TURTLE_ASK.md", "worldspec/tests/plural-foreground-envelope-cases.json"]
    }
  },
  {
    id: "2026-09-15-plural-foreground-envelope",
    date: "Sep 15, 2026",
    title: "A shared world can keep more than one foreground",
    body: "A provisional Plural Foreground Envelope v0.1 now represents multiple collaborators' distinct attention states, privacy classes, selective disclosure, and temporary shared attention rules without allowing Turtle or the system to manufacture consensus. The schema preserves private foregrounds, records affected and consenting participants, supports withdrawal, and explicitly disallows machine priority-averaging, surveillance expansion, synthetic production authority, and the assumption that a shared world implies shared attention. This remains research infrastructure rather than live learner-facing behavior. Product remains v0.1.0.",
    done: true
  },
  {
    id: "2026-09-12-d1-reconciliation-terraria-try",
    date: "Sep 12, 2026",
    title: "TRY IT enters Turtle Terraria and the daily build gets a memory-hole sweep",
    body: "TRY IT now offers Wander with Turtle, Make a world, and Throw in something weird as explicit Human + Turtle Terrarium entry modes. Consented exchanges still use the existing private session, separate human/Turtle turn, WorldSpec revision, and screened research-submission pipeline; a new /api/terraria/play bridge additionally records a Human + Turtle Terraria run/event trace without duplicating raw dialogue. A standing D1 reconciliation doctrine and repository coverage audit now make the daily build scan repository and WWW research artifacts for missing, stale, or intentionally excluded D1 representation. Live backfill remains conditional on authorized D1 access. CI validates both the Terraria bridge and reconciliation audit. Product remains v0.1.0.",
    done: true
  },
  {
    id: "2026-09-12-selective-attention-envelope",
    date: "Sep 12, 2026",
    title: "Turtle learns that noticing is not the same as interrupting",
    body: "A provisional Selective Attention Envelope now separates an observable world event from retention, salience, surfacing, interruption, and importance. Learner-authored watchpoints can authorize a bounded interruption; Turtle may propose attention but cannot seize the foreground; deliberate silence is valid behavior; project defaults cannot silently make a learner interruptible; synthetic self-play cannot execute production attention; private events cannot be broadcast publicly; and attention cannot authorize new collection. An eight-case hostile suite passed in GitHub Actions beside the existing TypeScript, Next Edge, Learner Verification, and World Evidence checks. The experiment remains outside live learner behavior and the product stays at v0.1.0.",
    done: true
  },
  {
    id: "2026-09-11-human-tamagotchi-turtle-ask",
    date: "Sep 11, 2026",
    title: "A third Terrarium waits for Turtle to ask a human",
    body: "Turtle Terraria now has a third theoretical habitat: Human Tamagotchi Terrarium. Humans mostly do human things there while an intentionally silly virtual-human representation points to a real person without simulating that person's mind, mood, availability, or willingness to engage. A new TurtleAsk boundary event lets a Turtle form a provenance-preserving request for genuine human perturbation when machine-only inquiry appears saturated, contradictory, repetitive, or bounded by meaning. Ask formation remains separate from surfacing authority; Recursive Turtle can form only a candidate ask; human silence is valid; and no proactive production messaging has been authorized. Migration 0009 and research/TURTLE_ASK.md make the hypothesis inspectable without pretending Turtle literally experiences boredom.",
    done: true
  },
  {
    id: "2026-09-11-world-evidence-envelope",
    date: "Sep 11, 2026",
    title: "The world can report facts without becoming the judge",
    body: "A provisional World Evidence Envelope now separates machine-checkable world events from learner, collaborator, Turtle, and synthetic interpretations and from criterion relations. A six-case hostile suite accepts factual and intentionally plural traces while rejecting a world-authored semantic verdict, synthetic provenance collapse, relation-authorship collapse, and any claim that the world has final authority. GitHub Actions passed the suite beside TypeScript, Next Edge, and Learner Verification checks. The experiment remains outside core WorldSpec and live telemetry, and the product stays at v0.1.0.",
    done: true
  },
  {
    id: "2026-09-10-learner-verification-card",
    date: "Sep 10, 2026",
    title: "Learner Verification becomes a thing we can break before learners depend on it",
    body: "A provisional Learner Verification Card now makes inquiry criteria, authorship, evidence, counterevidence, interpretation, uncertainty, reflection, disagreement, privacy, and reversibility inspectable without wiring a rubric into live WorldSpec. A five-case regression suite accepts learner-authored and intentionally plural traces while rejecting a smuggled Turtle criterion, synthetic evidence mislabeled as human, and machine final authority. GitHub Actions passed the new suite beside TypeScript and Next Edge validation. The experiment remains system-research infrastructure, not evidence of learner learning, and the product stays at v0.1.0.",
    done: true
  },
  {
    id: "2026-09-09-next-edge-validator",
    date: "Sep 9, 2026",
    title: "Next Edge gets a deterministic provenance contract",
    body: "The public research horizon is still generative, playful, and human-revisable, but its structure is no longer allowed to drift silently. A new validator checks that Next Edge preserves one explicit question, alternate possible possibles, an X factor, completed-build provenance, source classes, rationalized Sanders-ontology and CTC mappings, uncaptured residue, privacy/evidence metadata, and the boundary against secret-bearing configuration fields. GitHub Actions now runs the contract beside the TypeScript check; both passed in the first live run. No product version bump.",
    done: true
  },
  {
    id: "2026-09-08-next-edge-horizon",
    date: "Sep 8, 2026",
    title: "Next Edge becomes a living possible-possibles horizon",
    body: "The Build Log now separates completed work from open inquiry. One living Next Edge question stays above the historical log and is carried in public/data/next-edge.json; the newest committed build follows beneath it. The horizon may eventually synthesize repository, D1, R2, project-context, ontology, failure, external-signal, and X-factor inputs while preserving provenance and human authority.",
    done: true
  },
  {
    id: "2026-09-08-www-direct-asset-repair",
    date: "Sep 8, 2026",
    title: "WWW presentation moved back to the stable direct-asset path",
    body: "An incognito human check first exposed that Worker-injected changes were not reaching asset-first pages. Forcing every asset through the Worker then caused a brief production blackout in which standalone Terms and Terraria pages remained visible while SPA routes failed. That experiment was reverted. Menu spacing, route blurbs, Terraria language, and newest-first Build Log behavior now live in direct public assets while Cloudflare keeps its stable asset-first delivery model.",
    done: true
  },
  {
    id: "2026-09-08-turtle-terraria-tagging",
    date: "Sep 8, 2026",
    title: "Turtle Terraria + exhaustive research tagging architecture",
    body: "Turtle Lab became Turtle Terraria: an umbrella for multiple bounded habitats, beginning with Human + Turtle and Recursive Turtle self-play. Migration 0007 adds first-class Terraria runs, events, artifacts, observations, auto-build research records, a universal research-object registry, ontology tags, the seven established CTC domains, emergent tags, and an explicit holding area for observations that may someday justify an eighth, ninth, or later CTC domain. Migration 0008 seeds the first structured traces.",
    done: true
  },
  {
    id: "2026-09-08-daily-coactive-loop",
    date: "Sep 8, 2026",
    title: "Daily co-active build loop activated",
    body: "TurtleBlock AI now runs a daily primary-source hunt across OpenAI, NVIDIA, Minecraft / Minecraft Education, and the MIT Media Lab; maps useful signals against the Sanders research ontology; makes one small repository contribution when justified; records the detailed deliberation; and updates the public research trail.",
    done: true
  }
];

export const NEXT_EDGE_FALLBACK = {
  date: "Sep 30, 2026",
  title: "Can restraint stay temporary?",
  question: "When conflicting learner rules force Turtle to do less, should the temporary hold itself become a provenance-bearing research object so a human can inspect, contest, and replace it without turning restraint into durable precedence?",
  xFactor: "whoooo knooooowwwssssssssssss — what if the important thing to preserve is not the winning rule, but the fact that Turtle deliberately refused to invent one?"
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function waitAMinuteHtml(entry: BuildLogEntry) {
  if (!entry.waitAMinute) return "";
  const evidence = entry.waitAMinute.evidence.map((item) => `<code>${escapeHtml(item)}</code>`).join(" · ");
  return `<aside class="waitaminute"><strong>Wait a minute…</strong><p>${escapeHtml(entry.waitAMinute.summary)}</p><small>Evidence · ${evidence}</small></aside>`;
}

function entryHtml(entry: BuildLogEntry) {
  const doneClass = entry.done ? ' class="done"' : "";
  const marker = entry.done ? "✓ " : "→ ";
  return `<div class="stage" data-build-entry-id="${escapeHtml(entry.id)}"><span class="date">${escapeHtml(entry.date)}</span><strong${doneClass}>${marker}${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.body)}</p>${waitAMinuteHtml(entry)}</div>`;
}

function nextEdgeHtml() {
  return `<div class="stage nextedge" id="next-edge-worker-fallback"><span class="date">Next Edge · ${escapeHtml(NEXT_EDGE_FALLBACK.date)}</span><strong>✦ ${escapeHtml(NEXT_EDGE_FALLBACK.title)}</strong><p>${escapeHtml(NEXT_EDGE_FALLBACK.question)}</p><div class="edgex">X factor · ${escapeHtml(NEXT_EDGE_FALLBACK.xFactor)}</div></div>`;
}

export function injectBuildLogRuntime(html: string) {
  if (html.includes('id="build-log-runtime"')) return html;

  const dailyEntriesHtml = BUILD_LOG_ENTRIES.map(entryHtml).join("");
  const edgeHtml = nextEdgeHtml();
  const script = `<script id="build-log-runtime">(()=>{
    const dailyEntries=${JSON.stringify(dailyEntriesHtml)};
    const nextEdge=${JSON.stringify(edgeHtml)};
    const reorder=(source)=>{
      const tpl=document.createElement('template');
      tpl.innerHTML=source;
      const stages=[...tpl.content.querySelectorAll('.stage')];
      if(!stages.length)return source;
      const dated=[];
      for(const stage of stages){
        const label=(stage.querySelector('.date')?.textContent||'').trim();
        stage.remove();
        if(label!=='Current edge'&&label!=='Next')dated.push(stage);
      }
      const frag=document.createDocumentFragment();
      const edge=document.createElement('template');
      edge.innerHTML=nextEdge;
      frag.append(...[...edge.content.childNodes]);
      const daily=document.createElement('template');
      daily.innerHTML=dailyEntries;
      frag.append(...[...daily.content.childNodes]);
      for(const stage of dated.reverse())frag.append(stage);
      const anchor=tpl.content.querySelector('.pills');
      if(anchor)anchor.before(frag);else tpl.content.append(frag);
      const lede=tpl.content.querySelector('.lede');
      if(lede)lede.textContent='One living Next Edge question stays open at the top. Completed and committed milestones follow newest first; older work remains visible below.';
      return tpl.innerHTML;
    };
    const install=()=>{
      try{
        if(typeof pages==='undefined'||!pages.build)return;
        const original=pages.build;
        pages.build=()=>reorder(original());
        const route=location.pathname.replace(/^\\/+|\\/+$/g,'')||'home';
        if(route==='build'&&typeof go==='function')go('build',false);
      }catch(error){console.error('Build Log runtime patch failed',error)}
    };
    install();
  })();</script>`;

  return html.replace("</body>", `${script}\n</body>`);
}
