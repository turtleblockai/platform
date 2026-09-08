export interface BuildLogEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  done?: boolean;
}

// Newest first. Daily build automation prepends here rather than editing the large
// public/index.html SPA by hand. Historical entries already embedded in the SPA
// are reversed at runtime so the whole public Build Log reads newest -> oldest.
export const BUILD_LOG_ENTRIES: BuildLogEntry[] = [
  {
    id: "2026-09-08-www-rail-deploy-repair",
    date: "Sep 8, 2026",
    title: "WWW rail normalized + continuous Cloudflare deployment added",
    body: "The right-hand navigation now has one canonical spacing layer across SPA and static pages, Turtle Terraria has the canonical /terraria/ route with /lab/ redirect compatibility, and the contextual blurb beneath the menu is wired to every route including Terraria, Terms, Privacy, and Disclaimer. A GitHub Actions production workflow now typechecks and deploys the Worker plus assets to Cloudflare on every main-branch push so repository progress no longer waits for a separate manual Wrangler deployment.",
    done: true
  },
  {
    id: "2026-09-08-turtle-terraria-tagging",
    date: "Sep 8, 2026",
    title: "Turtle Terraria + exhaustive research tagging architecture",
    body: "Turtle Lab is becoming Turtle Terraria: an umbrella for multiple bounded research habitats, beginning with Human + Turtle and Recursive Turtle self-play. Migration 0007 adds first-class Terraria runs, events, artifacts, observations, auto-build research records, a universal research-object registry, ontology tags, the seven established CTC domains, emergent tags, and an explicit holding area for observations that may someday justify an eighth, ninth, or later CTC domain. The WWW now uses Turtle Terraria language while preserving the existing /lab/ path for compatibility.",
    done: true
  },
  {
    id: "2026-09-08-daily-coactive-loop",
    date: "Sep 8, 2026",
    title: "Daily co-active build loop activated",
    body: "TurtleBlock AI now runs a daily primary-source hunt across OpenAI, NVIDIA, Minecraft / Minecraft Education, and the MIT Media Lab; maps useful signals against the Sanders research ontology; makes one small repository contribution when justified; records the detailed deliberation; and updates this public log. The first hunt selected Co-Active Trace — preserving learner intent, Turtle interpretation, human steering, and the resulting WorldSpec revision as distinguishable provenance — as the next v0.1.x experiment.",
    done: true
  }
];

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

export function injectBuildLogRuntime(html: string) {
  if (html.includes('id="build-log-runtime"')) return html;

  const dailyEntriesHtml = BUILD_LOG_ENTRIES.map(entryHtml).join("");
  const script = `<script id="build-log-runtime">(()=>{
    const dailyEntries=${JSON.stringify(dailyEntriesHtml)};
    const reorder=(source)=>{
      const tpl=document.createElement('template');
      tpl.innerHTML=source;
      const stages=[...tpl.content.querySelectorAll('.stage')];
      if(!stages.length)return source;
      const special=[];
      const dated=[];
      for(const stage of stages){
        const label=(stage.querySelector('.date')?.textContent||'').trim();
        if(label==='Current edge'||label==='Next')special.push(stage);else dated.push(stage);
        stage.remove();
      }
      const frag=document.createDocumentFragment();
      const daily=document.createElement('template');
      daily.innerHTML=dailyEntries;
      frag.append(...[...daily.content.childNodes]);
      for(const stage of special)frag.append(stage);
      for(const stage of dated.reverse())frag.append(stage);
      const anchor=tpl.content.querySelector('.pills');
      if(anchor)anchor.before(frag);else tpl.content.append(frag);
      const lede=tpl.content.querySelector('.lede');
      if(lede)lede.textContent='A running history of the code, mistakes, reversals, research questions, and architecture. Newest milestones appear first; older work stays visible.';
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
