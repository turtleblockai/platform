const RAIL_SUMMARIES: Record<string, string> = {
  home: "We built a place to build places: learner ideas become persistent, revisable worlds through dialogue, construction, experience, and reflection.",
  try: "Talk with Turtle, shape a WorldSpec, move toward Minecraft construction, experience what was built, and revise through dialogue.",
  about: "TurtleBlock AI continues decades of recursive educational practice connecting learner agency, construction, research, dialogue, computational environments, and human-machine collaboration.",
  worldspec: "WorldSpec preserves learner meaning as a persistent, inspectable representation that can move between dialogue, construction, experience, and revision.",
  charter: "The Turtle Charter keeps the learner in control: Turtle may collaborate, question, suggest, and build, but meaning and judgment remain human.",
  research: "The research lineage connects Logo, Critical Techno Constructivism, STEAMHAMLET, Minecraft, AI engagement, co-active emergence, and the developing Sanders research ontology.",
  build: "The Build Log records working infrastructure, reversals, research decisions, failures, and the next edge as TurtleBlock AI is built in public.",
  terraria: "Turtle Terraria contains multiple bounded research habitats where human, Turtle, synthetic, world, and scholarly traces may cohabitate without losing provenance.",
  steamhamlet: "STEAMHAMLET is the earlier room of possibilities: ideas become manipulable objects, environments generate inquiry, and experience recursively changes representation.",
  reeducation: "RE/EDUCATION is the focused practice-and-R&D setting where TurtleBlock AI connects live teaching, research, school design, and technical experimentation.",
  privacy: "Turtle conversations are private by default; research capture, provenance, redaction, consent, and intentional publication are explicit boundaries.",
  disclaimer: "TurtleBlock AI is experimental software: outputs can be wrong, integrations can fail, and consequential decisions still require human judgment.",
  terms: "These terms define experimental use, learner responsibility, acceptable conduct, data boundaries, third-party services, and the limits of TurtleBlock AI."
};

function routeKey(pathname: string) {
  const key = pathname.replace(/^\/+|\/+$/g, "") || "home";
  return key === "lab" ? "terraria" : key;
}

function summaryFor(pathname: string) {
  return RAIL_SUMMARIES[routeKey(pathname)] || RAIL_SUMMARIES.home;
}

export function applySiteChrome(html: string, pathname: string) {
  let next = html
    .replace(/Turtle Lab/g, "Turtle Terraria")
    .replace(/Public artifacts\./g, "Multiple habitats.")
    .replace(/href="\/lab\//g, 'href="/terraria/');

  const css = `<style id="turtle-site-chrome">
.panel{display:flex!important;flex-direction:column!important}
.navgrid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:76px!important;gap:8px!important;align-items:stretch!important;width:100%!important}
.navcard{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;width:100%!important;height:76px!important;min-height:76px!important;margin:0!important;padding:10px 11px!important;border:1px solid var(--border)!important;border-radius:11px!important;background:var(--card)!important;color:var(--text)!important;text-align:left!important;text-decoration:none!important;overflow:hidden!important;appearance:none!important;-webkit-appearance:none!important}
.navcard strong{display:block!important;margin:0 0 3px!important;padding:0!important;font:700 13.75px/1.12 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;letter-spacing:0!important;text-align:left!important}
.navcard span{display:block!important;margin:0!important;padding:0!important;font:400 10.75px/1.2 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;color:var(--soft)!important;text-align:left!important}
.navcard:hover,.navcard.active{border-color:#6fa87a!important;background:#142019!important}
.status,.railstatus{box-sizing:border-box!important;margin:12px 0 0!important;min-height:64px!important;padding:10px 11px!important;border-radius:11px!important;background:var(--bg)!important;color:#78947e!important;font-size:11.75px!important;line-height:1.35!important;text-align:left!important}
@media(max-width:1040px) and (min-width:821px){.navgrid{grid-auto-rows:70px!important;gap:8px!important}.navcard{height:70px!important;min-height:70px!important;padding:9px 10px!important}.navcard strong{font-size:12.8px!important}.navcard span{font-size:10px!important}.status,.railstatus{min-height:60px!important}}
@media(max-width:820px){.navgrid{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:50px!important;gap:8px!important;padding-top:8px!important}.navcard{height:50px!important;min-height:50px!important;padding:9px 11px!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important}.navcard strong{margin:0!important;font-size:14px!important}.navcard span{display:none!important}.panel.compact .navgrid{display:none!important}.status,.railstatus{display:none!important}}
</style>`;
  if (!next.includes('id="turtle-site-chrome"')) next = next.replace("</head>", `${css}\n</head>`);

  const summary = `<div class="status railstatus">🐢 ${summaryFor(pathname)}</div>`;
  if (/<div class="(?:status|railstatus|status railstatus|railstatus status)">[\s\S]*?<\/div>/.test(next)) {
    next = next.replace(/<div class="(?:status|railstatus|status railstatus|railstatus status)">[\s\S]*?<\/div>/, summary);
  } else {
    next = next.replace(/(<\/div>\s*<\/aside>)/, `${summary}$1`);
  }

  if (!next.includes('id="turtle-route-blurb-runtime"')) {
    const summaries = JSON.stringify(RAIL_SUMMARIES);
    const script = `<script id="turtle-route-blurb-runtime">(()=>{const summaries=${summaries};const key=()=>{const k=location.pathname.replace(/^\\/+|\\/+$/g,'')||'home';return k==='lab'?'terraria':k};const summary=()=>summaries[key()]||summaries.home;const update=()=>{document.querySelectorAll('a[href="/lab/"]').forEach(a=>a.setAttribute('href','/terraria/'));document.querySelectorAll('.navcard').forEach(el=>{const route=el.getAttribute('data-route')||(el.getAttribute('href')||'').replace(/^\\/+|\\/+$/g,'')||'home';el.classList.toggle('active',(route==='lab'?'terraria':route)===key())});let el=document.querySelector('.railstatus,.status');if(!el){const panel=document.querySelector('.panel');if(panel){el=document.createElement('div');el.className='status railstatus';panel.appendChild(el)}}if(el)el.textContent='🐢 '+summary()};const later=()=>setTimeout(update,0);if(!window.__turtleChromeHistoryPatched){window.__turtleChromeHistoryPatched=true;const p=history.pushState.bind(history);history.pushState=(...a)=>{p(...a);later()};const r=history.replaceState.bind(history);history.replaceState=(...a)=>{r(...a);later()}}addEventListener('popstate',update);document.addEventListener('click',later,true);document.addEventListener('DOMContentLoaded',update);const observer=new MutationObserver(()=>later());observer.observe(document.documentElement,{subtree:true,childList:true});update()})();</script>`;
    next = next.replace("</body>", `${script}\n</body>`);
  }

  return next;
}
