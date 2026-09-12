(()=>{
  const VERSION='2026-09-12.1';
  const MODES={
    wander:{
      label:'Wander with Turtle',
      note:'Start with a thought, half-thought, question, contradiction, or nothing fully formed yet.',
      opening:'We do not have to begin with a build. Bring me something you are wondering about, something that feels unfinished, or something you want to think around. We can see what becomes constructible later.',
      placeholder:'A question, half-idea, contradiction, weird thought, or something you want to think around…'
    },
    build:{
      label:'Make a world',
      note:'Start with a place, structure, atmosphere, story, problem, or system you may eventually want to inhabit.',
      opening:'What kind of place are you thinking about making? We can talk through what it means and what should matter before anything gets translated into blocks.',
      placeholder:'Describe a place, world, structure, atmosphere, problem, or idea to build with Turtle…'
    },
    perturb:{
      label:'Throw in something weird',
      note:'Offer a contradiction, object, constraint, image-in-your-head, unfair thing, beautiful thing, impossible thing, or left-field ingredient.',
      opening:'Give the terrarium something it was not already expecting: a contradiction, an object, a constraint, something unfair, something beautiful, or something completely from left field.',
      placeholder:'Throw something weird into the terrarium…'
    }
  };

  let mode=sessionStorage.getItem('turtleblock_terrarium_entry_mode')||'wander';
  if(!MODES[mode])mode='wander';
  window.__turtleTerrariaEntryMode=mode;

  const originalFetch=window.fetch.bind(window);
  window.fetch=(input,init={})=>{
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(url==='/api/turtle/converse'&&String(init.method||'GET').toUpperCase()==='POST'){
      try{
        const body=JSON.parse(String(init.body||'{}'));
        body.terrarium_habitat='human_turtle';
        body.entry_mode=window.__turtleTerrariaEntryMode||'wander';
        return originalFetch('/api/terraria/play',{...init,body:JSON.stringify(body)});
      }catch(error){
        console.warn('Terraria TRY IT request enrichment failed; using original conversation endpoint.',error);
      }
    }
    return originalFetch(input,init);
  };

  function install(){
    if(location.pathname.replace(/^\/+|\/+$/g,'')!=='try')return;
    const conversation=document.getElementById('conversation');
    const textarea=document.getElementById('idea');
    if(!conversation||!textarea)return;
    if(document.getElementById('terraria-entry')){
      refreshMode();
      return;
    }

    const panel=document.createElement('div');
    panel.id='terraria-entry';
    panel.className='callout';
    panel.innerHTML=`
      <strong>🌿 Enter the Human + Turtle Terrarium</strong>
      <p>This is the first thin slice of a Terraria interaction engine: the same Turtle conversation, but with an explicit habitat and entry mode preserved as research provenance when D1 is active.</p>
      <div class="examplebar" id="terraria-mode-buttons">
        <button class="examplebtn" type="button" data-terraria-mode="wander">Wander with Turtle</button>
        <button class="examplebtn" type="button" data-terraria-mode="build">Make a world</button>
        <button class="examplebtn" type="button" data-terraria-mode="perturb">Throw in something weird</button>
      </div>
      <p class="meta" id="terraria-mode-note"></p>
      <div class="examplebar">
        <button class="examplebtn" type="button" data-terraria-starter="I have half an idea and I do not know what it is yet.">Half an idea</button>
        <button class="examplebtn" type="button" data-terraria-starter="Ask me something you actually wonder about from what we are doing here.">Ask me something</button>
        <button class="examplebtn" type="button" data-terraria-starter="Here is a contradiction I cannot resolve: ">A contradiction</button>
        <button class="examplebtn" type="button" data-terraria-starter="Let us make this idea stranger without taking it away from me.">Make it stranger</button>
      </div>
      <p class="meta">Consented play stays private by default. Human turns, Turtle turns, WorldSpec revisions, and the Terrarium trace keep distinct provenance; play is not automatically public, approved training data, or evidence of learning.</p>`;

    conversation.parentElement?.insertBefore(panel,conversation);

    panel.querySelectorAll('[data-terraria-mode]').forEach(button=>button.addEventListener('click',()=>{
      mode=button.getAttribute('data-terraria-mode')||'wander';
      if(!MODES[mode])mode='wander';
      sessionStorage.setItem('turtleblock_terrarium_entry_mode',mode);
      window.__turtleTerrariaEntryMode=mode;
      refreshMode(true);
    }));

    panel.querySelectorAll('[data-terraria-starter]').forEach(button=>button.addEventListener('click',()=>{
      textarea.value=button.getAttribute('data-terraria-starter')||'';
      textarea.dispatchEvent(new Event('input',{bubbles:true}));
      textarea.focus();
    }));

    refreshMode(true);
  }

  function refreshMode(updateOpening=false){
    const current=MODES[window.__turtleTerrariaEntryMode]||MODES.wander;
    document.querySelectorAll('[data-terraria-mode]').forEach(button=>button.classList.toggle('active',button.getAttribute('data-terraria-mode')===window.__turtleTerrariaEntryMode));
    const note=document.getElementById('terraria-mode-note');
    if(note)note.textContent=`${current.label} — ${current.note}`;
    const textarea=document.getElementById('idea');
    if(textarea)textarea.placeholder=current.placeholder;
    if(updateOpening){
      const first=document.querySelector('#conversation .turn.turtle');
      if(first&&document.querySelectorAll('#conversation .turn').length===1){
        const strong=first.querySelector('strong');
        first.textContent='';
        if(strong)first.appendChild(strong);
        else{const label=document.createElement('strong');label.textContent='🐢 Turtle';first.appendChild(label)}
        first.appendChild(document.createTextNode(current.opening));
      }
    }
  }

  const observer=new MutationObserver(()=>setTimeout(install,0));
  observer.observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('popstate',()=>setTimeout(install,0));
  document.addEventListener('click',()=>setTimeout(install,0),true);
  document.documentElement.dataset.terrariaTryVersion=VERSION;
  install();
})();
