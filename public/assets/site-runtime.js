(()=>{
  const VERSION='2026-09-08.6';
  const summaries={
    home:'We built a place to build places: learner ideas become persistent, revisable worlds through dialogue, construction, experience, and reflection.',
    try:'Talk with Turtle, shape a WorldSpec, move toward Minecraft construction, experience what was built, and revise through dialogue.',
    about:'TurtleBlock AI continues decades of recursive educational practice connecting learner agency, construction, research, dialogue, computational environments, and human-machine collaboration.',
    worldspec:'WorldSpec preserves learner meaning as a persistent, inspectable representation that can move between dialogue, construction, experience, and revision.',
    charter:'The Turtle Charter keeps the learner in control: Turtle may collaborate, question, suggest, and build, but meaning and judgment remain human.',
    research:'The research lineage connects Logo, Critical Techno Constructivism, STEAMHAMLET, Minecraft, AI engagement, co-active emergence, and the developing Sanders research ontology.',
    build:'The Build Log starts with one living Next Edge question, followed by completed and committed work in reverse chronological order.',
    terraria:'Turtle Terraria contains multiple bounded research habitats where human, Turtle, synthetic, world, and scholarly traces can cohabitate without losing provenance.',
    steamhamlet:'STEAMHAMLET is the earlier room of possibilities: ideas become manipulable objects, environments generate inquiry, and experience recursively changes representation.',
    reeducation:'RE/EDUCATION is the focused practice-and-R&D setting where TurtleBlock AI connects live teaching, research, school design, and technical experimentation.',
    privacy:'Turtle conversations are private by default; research capture, provenance, redaction, consent, and intentional publication are explicit boundaries.',
    disclaimer:'TurtleBlock AI is experimental software: outputs can be wrong, integrations can fail, and consequential decisions still require human judgment.',
    terms:'These terms define experimental use, learner responsibility, acceptable conduct, data boundaries, third-party services, and the limits of TurtleBlock AI.'
  };
  const dailyEntries=[
    {date:'Sep 8, 2026',title:'Next Edge becomes a living possible-possibles horizon',body:'The Build Log now separates completed work from open inquiry. One Next Edge question stays at the top and is read from a machine-readable public artifact; the newest committed build follows beneath it. The edge can eventually synthesize repository, research-store, ontology, project-context, failure, and X-factor signals without pretending a possibility is already a decision.',done:true},
    {date:'Sep 8, 2026',title:'WWW direct-asset publication path restored',body:'A Worker-first routing experiment briefly blacked out SPA routes while true static pages such as Terms and Terraria remained visible. The setting was rolled back, and WWW presentation work moved into direct public assets so Cloudflare can keep its stable asset-first delivery model.',done:true},
    {date:'Sep 8, 2026',title:'Turtle Terraria + exhaustive research tagging architecture',body:'Turtle Lab became Turtle Terraria: an umbrella for multiple bounded habitats, beginning with Human + Turtle and Recursive Turtle self-play. Migrations 0007 and 0008 add Terraria runs, events, artifacts, observations, auto-build research records, universal research objects, the seven established CTC domains, emergent tags, uncaptured observations, and structured seed traces.',done:true},
    {date:'Sep 8, 2026',title:'Daily co-active build loop activated',body:'TurtleBlock AI now runs a daily primary-source hunt across OpenAI, NVIDIA, Minecraft / Minecraft Education, and the MIT Media Lab; maps useful signals against the Sanders research ontology; makes one bounded repository contribution when justified; records the deliberation; and updates the public log.',done:true}
  ];
  const nextEdgeFallback={
    updated_at:'2026-09-08',
    title:'Make the edge of curiosity observable',
    question:'Can TurtleBlock AI continuously synthesize one irresistible next question from the whole ecology of the project without turning curiosity into a backlog or letting the machine mistake a suggestion for authority?',
    why_now:'The project is becoming increasingly observable. The next possibility is to make the horizon observable too: one living question that appears only after the newest work is actually committed.',
    possible_possibles:['A recurring uncaptured observation suggests a new Terrarium rather than a new feature.','A D1 pattern suggests a regression test nobody explicitly planned.','Something important appears that the current ontology cannot name yet.'],
    x_factor:'whoooo knooooowwwssssssssssss'
  };
  let nextEdge={...nextEdgeFallback};
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const entryHtml=e=>`<div class="stage"><span class="date">${esc(e.date)}</span><strong${e.done?' class="done"':''}>${e.done?'✓ ':'→ '}${esc(e.title)}</strong><p>${esc(e.body)}</p></div>`;
  const edgeHtml=()=>{
    const possibles=Array.isArray(nextEdge.possible_possibles)?nextEdge.possible_possibles.slice(0,3):[];
    const possibleHtml=possibles.length?`<div class="edgepossibles"><span>possible possibles</span>${possibles.map(p=>`<em>${esc(p)}</em>`).join('')}</div>`:'';
    return `<div class="stage nextedge" id="next-edge"><span class="date">Next Edge · ${esc(nextEdge.updated_at||'open')}</span><strong>✦ ${esc(nextEdge.title||'What is tugging next?')}</strong><p class="edgequestion">${esc(nextEdge.question||'What is tugging next?')}</p><p class="edgewhy">${esc(nextEdge.why_now||'')}</p>${possibleHtml}<div class="edgex">X factor · ${esc(nextEdge.x_factor||'whoooo knooooowwwssssssssssss')}</div></div>`;
  };
  const updateEdgeDom=()=>{const old=document.getElementById('next-edge');if(!old)return;const tpl=document.createElement('template');tpl.innerHTML=edgeHtml();old.replaceWith(tpl.content.firstElementChild)};
  const loadNextEdge=async()=>{
    try{
      const response=await fetch('/data/next-edge.json',{cache:'no-store'});
      if(!response.ok)return;
      const data=await response.json();
      if(data&&typeof data.title==='string'&&typeof data.question==='string'){
        nextEdge={...nextEdgeFallback,...data};
        updateEdgeDom();
      }
    }catch(error){console.warn('Next Edge feed unavailable; using embedded fallback',error)}
  };
  const routeKey=()=>{const key=location.pathname.replace(/^\/+|\/+$/g,'')||'home';return key==='lab'?'terraria':key};
  const routeForCard=el=>{const data=el.getAttribute('data-route');if(data)return data==='lab'?'terraria':data;const href=el.getAttribute('href')||'';const key=href.replace(/^\/+|\/+$/g,'')||'home';return key==='lab'?'terraria':key};
  const rewriteTerrariaLinks=()=>{
    document.querySelectorAll('a[href="/lab/"]').forEach(a=>{a.setAttribute('href','/terraria/');const strong=a.querySelector('strong');const span=a.querySelector('span');if(strong)strong.textContent='Turtle Terraria';else if(a.classList.contains('secondary')||a.classList.contains('pill'))a.textContent='Turtle Terraria';if(span)span.textContent='Multiple habitats.'});
    document.querySelectorAll('.navcard').forEach(el=>{if((el.textContent||'').includes('Turtle Lab')){const strong=el.querySelector('strong');const span=el.querySelector('span');if(strong)strong.textContent='Turtle Terraria';if(span)span.textContent='Multiple habitats.'}});
  };
  const appendCard=(grid,href,title,subtitle)=>{if(grid.querySelector(`a[href="${href}"]`))return;const a=document.createElement('a');a.className='navcard';a.href=href;a.innerHTML=`<strong>${title}</strong><span>${subtitle}</span>`;grid.appendChild(a)};
  const ensurePolicyCards=()=>{const grid=document.querySelector('.navgrid');if(!grid)return;appendCard(grid,'/terms/','Terms','Use + boundaries.');appendCard(grid,'/disclaimer/','Disclaimer','Experimental limits.')};
  const updateActiveCard=()=>{const current=routeKey();document.querySelectorAll('.navcard').forEach(el=>el.classList.toggle('active',routeForCard(el)===current))};
  const updateBlurb=()=>{
    const key=routeKey();
    let el=document.querySelector('.railstatus,.status');
    if(!el){const panel=document.querySelector('.panel');if(panel){el=document.createElement('div');el.className='status railstatus';panel.appendChild(el)}}
    if(el){el.id='railstatus';const next='🐢 '+(summaries[key]||summaries.home);if(el.textContent!==next)el.textContent=next}
  };
  const patchVisibleText=()=>{
    rewriteTerrariaLinks();
    ensurePolicyCards();
    updateActiveCard();
    document.querySelectorAll('#conversationmeta').forEach(el=>{if(el.textContent.includes('Turtle Lab '))el.textContent=el.textContent.replace('Turtle Lab ','Turtle session ')});
    updateBlurb();
    document.documentElement.dataset.turtleAssetVersion=VERSION;
  };
  const reorderBuildHtml=source=>{
    const tpl=document.createElement('template');tpl.innerHTML=source;
    const stages=[...tpl.content.querySelectorAll('.stage')];
    if(!stages.length)return source;
    const dated=[];
    for(const stage of stages){const label=(stage.querySelector('.date')?.textContent||'').trim();stage.remove();if(label!=='Current edge'&&label!=='Next')dated.push(stage)}
    const lede=tpl.content.querySelector('.lede');if(lede)lede.textContent='One living Next Edge question stays open at the top. Completed and committed milestones follow newest first; older work remains visible below.';
    const frag=document.createDocumentFragment();
    const edge=document.createElement('template');edge.innerHTML=edgeHtml();frag.append(...edge.content.childNodes);
    const daily=document.createElement('template');daily.innerHTML=dailyEntries.map(entryHtml).join('');frag.append(...daily.content.childNodes);
    for(const stage of dated.reverse())frag.append(stage);
    const anchor=tpl.content.querySelector('.pills');if(anchor)anchor.before(frag);else tpl.content.append(frag);
    tpl.content.querySelectorAll('a[href="/lab/"]').forEach(a=>{a.href='/terraria/';a.textContent='Turtle Terraria'});
    tpl.content.querySelectorAll('.stage').forEach(stage=>{stage.innerHTML=stage.innerHTML.replace(/Turtle Lab/g,'Turtle Terraria')});
    return tpl.innerHTML;
  };
  const patchPages=()=>{
    try{
      if(typeof pages==='undefined'||pages.__terrariaPatched)return false;
      Object.defineProperty(pages,'__terrariaPatched',{value:true,enumerable:false});
      if(pages.build){const original=pages.build;pages.build=()=>reorderBuildHtml(original())}
      if(pages.privacy){const original=pages.privacy;pages.privacy=()=>original().replace(/Turtle Lab/g,'Turtle Terraria').replace(/\/lab\//g,'/terraria/')}
      if(pages.disclaimer){const original=pages.disclaimer;pages.disclaimer=()=>original().replace(/Turtle Lab/g,'Turtle Terraria').replace(/\/lab\//g,'/terraria/')}
      return true;
    }catch(error){console.error('Turtle direct-asset page patch failed',error);return false}
  };
  const patched=patchPages();
  if(patched){const key=routeKey();if(['build','privacy','disclaimer'].includes(key)&&typeof go==='function')go(key,false)}
  patchVisibleText();
  loadNextEdge();
  document.addEventListener('click',()=>setTimeout(patchVisibleText,0),true);
  addEventListener('popstate',()=>setTimeout(patchVisibleText,0));
  const observer=new MutationObserver(()=>setTimeout(patchVisibleText,0));observer.observe(document.documentElement,{subtree:true,childList:true});
})();
