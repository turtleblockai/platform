(()=>{
  const VERSION='2026-09-12.2';
  const summaries={
    home:'We built a place to build places: learner ideas become persistent, revisable worlds through dialogue, construction, experience, and reflection.',
    try:'Talk with Turtle inside the Human + Turtle Terrarium: wander, build, or throw in something weird while provenance stays visible.',
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
  let dailyEntries=[
    {date:'Sep 12, 2026',title:'TRY IT enters Turtle Terraria and the daily build gets a memory-hole sweep',body:'TRY IT now offers Wander with Turtle, Make a world, and Throw in something weird as Human + Turtle Terrarium entry modes. Consented play keeps canonical private session/turn/WorldSpec records while adding a provenance-only Terrarium trace when D1 is active. A standing repository + WWW to D1 reconciliation sweep and CI audit now look for research-bearing artifacts that might otherwise fall outside the research substrate.',done:true},
    {date:'Sep 11, 2026',title:'A third Terrarium waits for Turtle to ask a human',body:'Human Tamagotchi Terrarium and the TurtleAsk boundary event make room for a Turtle to seek genuine human perturbation after inquiry saturation without simulating a human, acquiring interruption authority, or turning synthetic self-play into human evidence.',done:true},
    {date:'Sep 12, 2026',title:'Turtle learns that noticing is not the same as interrupting',body:'A provisional Selective Attention Envelope separates observability, retention, salience, surfacing, interruption, and importance while preserving deliberate silence and learner authority.',done:true},
    {date:'Sep 11, 2026',title:'The world can report facts without becoming the judge',body:'A provisional World Evidence Envelope separates machine-checkable world events from interpretation and final learner judgment.',done:true},
    {date:'Sep 10, 2026',title:'Learner Verification becomes a thing we can break before learners depend on it',body:'A provisional Learner Verification Card makes criteria, evidence, uncertainty, disagreement, authorship, and reversibility inspectable in a hostile regression suite.',done:true},
    {date:'Sep 9, 2026',title:'Next Edge gets a deterministic provenance contract',body:'The public research horizon remains generative and human-revisable while a deterministic validator prevents its provenance and research structure from drifting silently.',done:true},
    {date:'Sep 8, 2026',title:'Next Edge becomes a living possible-possibles horizon',body:'The Build Log now separates completed work from open inquiry. One Next Edge question stays at the top and is read from a machine-readable public artifact.',done:true},
    {date:'Sep 8, 2026',title:'WWW direct-asset publication path restored',body:'WWW presentation work moved back into direct public assets after a Worker-first routing experiment briefly blacked out SPA routes.',done:true},
    {date:'Sep 8, 2026',title:'Turtle Terraria + exhaustive research tagging architecture',body:'Turtle Lab became Turtle Terraria with multiple bounded habitats, universal research objects, CTC/ontology/emergent tags, uncaptured observations, and provenance-preserving research traces.',done:true},
    {date:'Sep 8, 2026',title:'Daily co-active build loop activated',body:'TurtleBlock AI now runs a daily primary-source hunt, ontology comparison, one bounded contribution, testing, exhaustive research capture, Build Log update, and Next Edge synthesis.',done:true}
  ];
  const nextEdgeFallback={
    updated_at:'2026-09-12',
    title:'Can one shared world hold different foregrounds?',
    question:'Can TurtleBlock AI support a shared world in which different collaborators keep distinct attention agendas—and sometimes choose to share or negotiate them—without collapsing everyone into one machine-selected foreground?',
    why_now:'Selective attention creates a new question: one shared world may contain several legitimate foregrounds at once.',
    possible_possibles:['Collaborators keep private watchpoints and selectively reveal them.','A shared event may matter differently to different people.','Someone may reveal that something matters without revealing why.'],
    x_factor:'whoooo knooooowwwssssssssssss — what if the same collapsing bridge is urgent to one learner, delightful to another, and none of Turtle’s business to a third?'
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
  const rerenderBuild=()=>{if(routeKey()==='build'&&typeof go==='function')go('build',false)};
  const loadBuildLog=async()=>{
    try{
      const response=await fetch('/api/build-log',{cache:'no-store'});
      if(!response.ok)return;
      const data=await response.json();
      if(data&&Array.isArray(data.entries)&&data.entries.length){
        dailyEntries=data.entries;
        rerenderBuild();
      }
    }catch(error){console.warn('Canonical Build Log feed unavailable; using embedded fallback',error)}
  };
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
  const loadTerrariaTry=()=>{
    if(document.querySelector('script[src*="/assets/terraria-try.js"]'))return;
    const script=document.createElement('script');
    script.src='/assets/terraria-try.js?v=20260912.1';
    script.defer=true;
    document.head.appendChild(script);
  };
  const patched=patchPages();
  if(patched){const key=routeKey();if(['build','privacy','disclaimer'].includes(key)&&typeof go==='function')go(key,false)}
  patchVisibleText();
  loadTerrariaTry();
  loadBuildLog();
  loadNextEdge();
  document.addEventListener('click',()=>setTimeout(patchVisibleText,0),true);
  addEventListener('popstate',()=>setTimeout(patchVisibleText,0));
  const observer=new MutationObserver(()=>setTimeout(patchVisibleText,0));observer.observe(document.documentElement,{subtree:true,childList:true});
})();
