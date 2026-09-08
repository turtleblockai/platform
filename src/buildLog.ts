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
  date: "Sep 8, 2026",
  title: "Make the edge of curiosity observable",
  question: "Can TurtleBlock AI continuously synthesize one irresistible next question from the whole ecology of the project without turning curiosity into a backlog or letting the machine mistake a suggestion for authority?",
  xFactor: "whoooo knooooowwwssssssssssss"
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
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
