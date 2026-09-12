export interface BuildLogEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  done?: boolean;
}

// Newest completed work first. The public asset runtime is the primary WWW path;
// this Worker-side layer remains as a compatibility path if HTML is ever rendered
// through the Worker. Open inquiry belongs in Next Edge, not in completed entries.
export const BUILD_LOG_ENTRIES: BuildLogEntry[] = [
  {
    id: "2026-09-11-human-tamagotchi-turtle-ask",
    date: "Sep 11, 2026",
    title: "A third Terrarium waits for Turtle to ask a human",
    body: "Turtle Terraria now has a third theoretical habitat: Human Tamagotchi Terrarium. Humans mostly do human things there while an intentionally silly virtual-human representation points to a real person without simulating that person's mind, mood, availability, or willingness to engage. A new TurtleAsk boundary event lets a Turtle form a provenance-preserving request for genuine human perturbation when machine-only inquiry appears saturated, contradictory, repetitive, or bounded by meaning. Ask formation remains separate from surfacing authority; Recursive Turtle can form only a candidate ask; human silence is valid; and no proactive production messaging has been authorized. Migration 0009 and research/TURTLE_ASK.md make the hypothesis inspectable without pretending Turtle literally experiences boredom.",
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
    body: "Turtle Lab became Turtle Terraria: an umbrella for multiple bounded research habitats, beginning with Human + Turtle and Recursive Turtle self-play. Migration 0007 adds first-class Terraria runs, events, artifacts, observations, auto-build research records, a universal research-object registry, ontology tags, the seven established CTC domains, emergent tags, and an explicit holding area for observations that may someday justify an eighth, ninth, or later CTC domain. Migration 0008 seeds the first structured traces.",
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
  date: "Sep 12, 2026",
  title: "Can one shared world hold different foregrounds?",
  question: "Can TurtleBlock AI support a shared world in which different collaborators keep distinct attention agendas—and sometimes choose to share or negotiate them—without collapsing everyone into one machine-selected foreground?",
  xFactor: "whoooo knooooowwwssssssssssss — what if the same collapsing bridge is urgent to one learner, delightful to another, and none of Turtle's business to a third?"
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function entryHtml(entry: BuildLogEntry) {
  const doneClass = entry.done ? ' class="done"' : "";
  const marker = entry.done ? "✓ " : "→ ";
  return `<div class="stage" data-build-entry-id="${escapeHtml(entry.id)}"><span class="date">${escapeHtml(entry.date)}</span><strong${doneClass}>${marker}${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.body)}</p></div>`;
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