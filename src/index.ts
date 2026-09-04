import { handleDiscordInteraction, minecraftStagingResponse } from "./discord";
import { generateTurtleReply } from "./turtleLLM";
import { candidateDatasetStatus, screenResearchInput } from "./researchData";

export interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  DISCORD_PUBLIC_KEY?: string;
  DISCORD_APPLICATION_ID?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

const worldSpecSummary = {
  version: "0.1",
  status: "experimental",
  interaction_modes: ["direct", "interpretive", "reflective", "exploratory", "comparative", "social"],
  core_loop: ["learner intent","agent dialogue","WorldSpec","build","inhabit","notice","reflect","revise"],
  principles: ["learner is designer and producer","inquiry before predetermined outcome","manual learner edits are preserved","semantic interpretations remain revisable","reflection is first-class state","the agent is collaborator, not authority"],
  repository: "https://github.com/turtleblockai/platform/tree/main/worldspec"
};

const SOCIAL_DESCRIPTION = "An educational research platform investigating constructivist human-AI collaboration, persistent computational worlds, and learner agency in Minecraft and beyond.";

const RAIL_SUMMARIES: Record<string, string> = {
  home: "We built a place to build places: learner ideas become persistent, revisable worlds through dialogue, construction, experience, and reflection.",
  try: "Talk with Turtle, shape a WorldSpec, export it into Minecraft, enter what was built, then revise the world through dialogue.",
  about: "TurtleBlock AI continues decades of recursive educational practice connecting learner agency, construction, research, dialogue, computational environments, and human–machine collaboration.",
  worldspec: "WorldSpec preserves learner meaning as a persistent, inspectable representation that can move between dialogue, Minecraft construction, experience, and revision.",
  charter: "The Turtle Charter keeps the learner in control: Turtle may collaborate, question, suggest, and build, but meaning and judgment remain human.",
  research: "The research lineage connects Logo, experimental teaching, Critical Techno Constructivism, Minecraft, custom agents, Sunshine Machine, co-active emergence, and TurtleBlock AI.",
  build: "The Build Log records working infrastructure, reversals, research decisions, and the next edge as TurtleBlock AI is built in public.",
  steamhamlet: "STEAMHAMLET is the earlier room of possibilities: ideas become manipulable objects, environments generate inquiry, and experience recursively changes the representation.",
  reeducation: "RE/EDUCATION is the focused practice-and-R&D setting where TurtleBlock AI connects live teaching, research, school design, and technical experimentation.",
  privacy: "Turtle conversations are private by default; research capture, provenance, redaction, consent, and intentional publication are designed as explicit boundaries.",
  disclaimer: "TurtleBlock AI is experimental software: outputs can be wrong, integrations can fail, and consequential decisions still require human judgment.",
  lab: "Turtle Lab is the opt-in public artifact layer: selected WorldSpecs, builds, reflections, and dialogue—not raw private conversations.",
  terms: "These terms define experimental use, learner responsibility, acceptable conduct, data boundaries, third-party services, and the limits of TurtleBlock AI."
};

function routeKeyFromPath(pathname: string) {
  const key = pathname.replace(/^\/+|\/+$/g, "");
  return key || "home";
}

function railSummaryFor(pathname: string) {
  return RAIL_SUMMARIES[routeKeyFromPath(pathname)] || RAIL_SUMMARIES.home;
}

function applyCanonicalRailChrome(html: string) {
  const css = `<style id="canonical-rail-chrome">
.navgrid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.52rem!important;align-items:stretch!important;min-width:0!important}
.navcard{display:block!important;text-align:left!important;padding:.66rem .7rem!important;border:1px solid var(--border)!important;border-radius:11px!important;background:var(--card)!important;color:var(--text)!important;cursor:pointer!important;min-height:76px!important;height:auto!important;min-width:0!important;overflow:hidden!important;text-decoration:none!important}
.navcard:hover,.navcard.active{border-color:#6fa87a!important;background:#142019!important}
.navcard strong{display:block!important;margin:0 0 .12rem!important;font-size:.86rem!important;line-height:1.12!important;overflow-wrap:normal!important;word-break:normal!important;text-align:left!important}
.navcard span{display:block!important;margin:0!important;font-size:.67rem!important;line-height:1.2!important;color:var(--soft)!important;text-align:left!important}
.status,.railstatus{margin-top:.66rem!important;padding:.65rem .72rem!important;border-radius:11px!important;background:var(--bg)!important;color:#78947e!important;font-size:.74rem!important;line-height:1.3!important;text-align:left!important}
@media(max-width:1040px) and (min-width:821px){.navcard{min-height:70px!important;padding:.58rem .62rem!important}.navcard span{font-size:.63rem!important}.navcard strong{font-size:.8rem!important}}
@media(max-width:820px){.panel{padding:.75rem!important}.navgrid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:.5rem!important;padding:.55rem 0 0!important}.navcard{min-height:50px!important;padding:.68rem .72rem!important;display:flex!important;align-items:center!important}.navcard strong{margin:0!important;font-size:.88rem!important}.navcard span{display:none!important}.panel.compact .navgrid{display:none!important}.status,.railstatus{display:none!important}}
</style>`;
  if (html.includes('id="canonical-rail-chrome"')) return html;
  return html.replace("</head>", `${css}\n</head>`);
}

function applyRailSummary(html: string, pathname: string) {
  const summary = `<div class="status railstatus">🐢 ${railSummaryFor(pathname)}</div>`;
  if (/<div class="(?:status|railstatus|status railstatus|railstatus status)">[\s\S]*?<\/div>/.test(html)) {
    return html.replace(/<div class="(?:status|railstatus|status railstatus|railstatus status)">[\s\S]*?<\/div>/, summary);
  }
  return html.replace(/(<\/div>\s*<\/aside>)/, `${summary}$1`);
}

function injectRailSummaryRuntime(html: string) {
  if (html.includes('id="rail-summary-runtime"')) return html;
  const summaries = JSON.stringify(RAIL_SUMMARIES);
  const script = `<script id="rail-summary-runtime">(()=>{const summaries=${summaries};const key=()=>location.pathname.replace(/^\\/+|\\/+$/g,'')||'home';const update=()=>{const el=document.querySelector('.status,.railstatus');if(el)el.textContent='🐢 '+(summaries[key()]||summaries.home)};const observer=new MutationObserver(update);observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});addEventListener('popstate',update);document.addEventListener('click',()=>setTimeout(update,0));update()})();</script>`;
  return html.replace("</body>", `${script}\n</body>`);
}

function applySocialMetadata(html: string, pageUrl: string) {
  if (html.includes('property="og:title"')) return html;
  const meta = [
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="TurtleBlock AI">',
    `<meta property="og:description" content="${SOCIAL_DESCRIPTION}">`,
    `<meta property="og:url" content="${pageUrl}">`,
    '<meta property="og:image" content="https://turtleblockai.com/assets/turtleblock-mark.svg">',
    '<meta property="og:image:alt" content="TurtleBlock AI logo">',
    '<meta name="twitter:card" content="summary">',
    '<meta name="twitter:title" content="TurtleBlock AI">',
    `<meta name="twitter:description" content="${SOCIAL_DESCRIPTION}">`,
    '<meta name="twitter:image" content="https://turtleblockai.com/assets/turtleblock-mark.svg">'
  ].join("\n  ");
  return html.replace("</head>", `  ${meta}\n</head>`);
}

function classifyInteraction(utterance: string) {
  const text = utterance.toLowerCase();
  const reflective = /\b(why|notice|noticed|feel|felt|worked|didn't work|did not work|what happened|reflect|compare)\b/.test(text);
  const interpretive = /\b(welcoming|authoritarian|oppressive|democratic|sacred|hopeful|precarious|communal|playful|threatening|peaceful|intimidating|friendly|cozy|grand|mysterious)\b/.test(text);
  return reflective ? "reflective" : interpretive ? "interpretive" : "direct";
}

function extractConstraints(utterance: string) {
  const constraints: string[] = [];
  for (const pattern of [/\bbut\s+(.+)/i,/\bwithout\s+(.+)/i,/\bdon't\s+(.+)/i,/\bdo not\s+(.+)/i,/\bkeep\s+(.+)/i,/\bpreserve\s+(.+)/i]) {
    const match = utterance.match(pattern);
    if (match?.[1]) constraints.push(match[1].trim());
  }
  return [...new Set(constraints)];
}

function extractTargets(utterance: string) {
  const known = ["village","house","houses","tower","bridge","entrance","courtyard","garden","road","roads","path","paths","city","building","buildings","room","rooms","wall","walls","castle","school","farm","river","mountain","forest","lake","restaurant","kitchen","water","animals","beasts"];
  const text = utterance.toLowerCase();
  return known.filter((word) => new RegExp(`\\b${word}\\b`).test(text));
}

function makeInterpretation(utterance: string) {
  const mode = classifyInteraction(utterance);
  const targets = extractTargets(utterance);
  const constraints = extractConstraints(utterance);
  const semanticWords = utterance.toLowerCase().match(/\b(welcoming|authoritarian|oppressive|democratic|sacred|hopeful|precarious|communal|playful|threatening|peaceful|intimidating|friendly|cozy|grand|mysterious|dangerous|integrated|dark|rich|safe|fair|natural|beautiful|evil)\b/g) || [];
  const isQuestion = /\?\s*$/.test(utterance) || /\b(thoughts|what do you think|what if|should we|could we|can we)\b/i.test(utterance);
  const needsClarification = semanticWords.length > 0 || isQuestion;
  const effectiveMode = isQuestion ? "exploratory" : mode;
  return {
    mode: effectiveMode,
    utterance,
    targets,
    constraints,
    semantic_terms: [...new Set(semanticWords)],
    needs_clarification: needsClarification,
    clarification_question: needsClarification
      ? semanticWords.length > 0
        ? `When you say ${[...new Set(semanticWords)].map((w) => `“${w}”`).join(" and ")}, what qualities or consequences in the world would make that true for you?`
        : "Do you want Turtle to discuss possibilities first, or stage a provisional build so you can test it?"
      : null,
    proposed_worldspec: {
      version: "0.1",
      intent: { mode: effectiveMode, statement: utterance, speech_act: isQuestion ? "consult" : "request_change" },
      world: { targets },
      meaning: { semantic_terms: [...new Set(semanticWords)] },
      constraints,
      status: needsClarification ? "proposed-awaiting-learner-clarification" : "proposed"
    }
  };
}

function mergeWorldSpec(current: any, proposed: any, learnerText: string) {
  const base = current && typeof current === "object" ? current : {};
  const next = proposed && typeof proposed === "object" ? proposed : {};
  const priorTerms = Array.isArray(base?.meaning?.semantic_terms) ? base.meaning.semantic_terms : [];
  const nextTerms = Array.isArray(next?.meaning?.semantic_terms) ? next.meaning.semantic_terms : [];
  const priorConstraints = Array.isArray(base?.constraints) ? base.constraints : [];
  const nextConstraints = Array.isArray(next?.constraints) ? next.constraints : [];
  return {
    ...base,
    ...next,
    intent: { ...(base.intent || {}), ...(next.intent || {}), latest_statement: learnerText },
    world: { ...(base.world || {}), ...(next.world || {}) },
    meaning: { ...(base.meaning || {}), ...(next.meaning || {}), semantic_terms: [...new Set([...priorTerms, ...nextTerms])] },
    constraints: [...new Set([...priorConstraints, ...nextConstraints])],
    conversation: { ...(base.conversation || {}), latest_learner_text: learnerText, updated_at: new Date().toISOString() }
  };
}

function applyCanonicalFooter(html: string) {
  return html
    .replace(/<span>Created and researched by<\/span><a[^>]*>@nayrbgo<\/a><span class="dot">•<\/span>/g, '<span>Created and researched by <a href="https://read.bryansanders.com" target="_blank" rel="noopener noreferrer">Dr. Bryan P. Sanders</a></span><span class="dot">•</span>')
    .replace(/<span>Created and researched by<\/span><a[^>]*>Dr\. Bryan P\. Sanders<\/a><span class="dot">•<\/span>/g, '<span>Created and researched by <a href="https://read.bryansanders.com" target="_blank" rel="noopener noreferrer">Dr. Bryan P. Sanders</a></span><span class="dot">•</span>')
    .replace(/<span class="dot">•<\/span><a href="https:\/\/read\.bryansanders\.com"[^>]*>read\.bryansanders\.com<\/a>/g, '');
}

async function maybeStoreSubmission(env: Env, data: { id: string; created_at: string; anonymous_session_id: string; input_text: string; consent_version: string; worldspec_version: string; interpretation_json: string; }) {
  const screening = screenResearchInput(data.input_text);
  const datasetStatus = candidateDatasetStatus(screening);
  if (!env.DB) return { stored: false, reason: "D1 binding not configured", screening: { version: screening.version, status: screening.status, redaction_applied: screening.redaction_applied, finding_count: screening.findings.length, dataset_status_if_stored: datasetStatus } };
  const provenance = { pipeline_version: "0.2", source: "public_playground", consent_version: data.consent_version, worldspec_version: data.worldspec_version, screening_version: screening.version, raw_retained_separately: true, approved_dataset_requires_explicit_review: true, intentional_ip_storage: false };
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO playground_submissions (id,created_at,anonymous_session_id,input_text,redacted_text,consent_version,worldspec_version,interpretation_json,screening_version,screened_at,screening_status,redaction_applied,review_status,dataset_status,dataset_candidate_at,provenance_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'pending',?,?,?)`).bind(data.id,data.created_at,data.anonymous_session_id,data.input_text,screening.redacted_text,data.consent_version,data.worldspec_version,data.interpretation_json,screening.version,data.created_at,screening.status,screening.redaction_applied ? 1 : 0,datasetStatus,datasetStatus === "candidate" ? data.created_at : null,JSON.stringify(provenance)),
    env.DB.prepare(`INSERT INTO research_data_events (id,submission_id,created_at,event_type,actor_type,from_status,to_status,notes,metadata_json) VALUES (?,?,?,'submission_received','system',NULL,'raw',NULL,?)`).bind(crypto.randomUUID(),data.id,data.created_at,JSON.stringify({ consent_version: data.consent_version })),
    env.DB.prepare(`INSERT INTO research_data_events (id,submission_id,created_at,event_type,actor_type,from_status,to_status,notes,metadata_json) VALUES (?,?,?,'automated_screening','system','raw',?,NULL,?)`).bind(crypto.randomUUID(),data.id,data.created_at,screening.status,JSON.stringify({ screening_version: screening.version, finding_count: screening.findings.length, redaction_applied: screening.redaction_applied, dataset_status: datasetStatus })),
    ...screening.findings.map((finding) => env.DB!.prepare(`INSERT INTO screening_findings (id,submission_id,created_at,screening_version,finding_type,severity,start_offset,end_offset,replacement_label) VALUES (?,?,?,?,?,?,?,?,?)`).bind(finding.id,data.id,data.created_at,screening.version,finding.type,finding.severity,finding.start,finding.end,finding.replacement))
  ]);
  return { stored: true, screening: { version: screening.version, status: screening.status, redaction_applied: screening.redaction_applied, finding_count: screening.findings.length, dataset_status: datasetStatus, review_status: "pending" } };
}

async function loadWebSession(env: Env, browserSessionId: string) {
  if (!env.DB) return null;
  try {
    const session = await env.DB.prepare(`SELECT id,worldspec_id FROM turtle_sessions WHERE source='web' AND learner_id=? AND status='exploring' ORDER BY updated_at DESC LIMIT 1`).bind(browserSessionId).first<any>();
    if (!session) return null;
    const revision = await env.DB.prepare(`SELECT revision_number,worldspec_json FROM worldspec_revisions WHERE session_id=? ORDER BY revision_number DESC LIMIT 1`).bind(session.id).first<any>();
    const turns = await env.DB.prepare(`SELECT actor,raw_text FROM turtle_turns WHERE session_id=? ORDER BY created_at DESC LIMIT 10`).bind(session.id).all<any>();
    return { id: session.id, worldspec_id: session.worldspec_id, revision: Number(revision?.revision_number || 0), worldspec: revision?.worldspec_json ? JSON.parse(revision.worldspec_json) : {}, recent_turns: [...(turns.results || [])].reverse().map((t: any) => ({ actor: t.actor, text: t.raw_text })) };
  } catch (error) { console.error("Web Turtle session lookup failed", error); return null; }
}

async function converseOnWeb(env: Env, utterance: string, browserSessionId: string, consentVersion: string) {
  const interpretation = makeInterpretation(utterance);
  const existing = await loadWebSession(env, browserSessionId);
  const now = new Date().toISOString();
  const sessionId = existing?.id || crypto.randomUUID();
  const worldspecId = existing?.worldspec_id || crypto.randomUUID();
  const revision = (existing?.revision || 0) + 1;
  const learnerTurnId = crypto.randomUUID();
  const worldspec = mergeWorldSpec(existing?.worldspec, interpretation.proposed_worldspec, utterance);
  let operationalStored = false;

  if (env.DB) {
    try {
      const provenance = JSON.stringify({ source: "public_playground", learner_explicit: true, turtle_inferred: false, raw_language_retained: true, consent_version: consentVersion });
      const statements = [];
      if (!existing) statements.push(env.DB.prepare(`INSERT INTO turtle_sessions (id,worldspec_id,created_at,updated_at,source,learner_id,status,visibility) VALUES (?,?,?,?, 'web',?,'exploring','private')`).bind(sessionId,worldspecId,now,now,browserSessionId));
      statements.push(
        env.DB.prepare(`INSERT INTO turtle_turns (id,session_id,created_at,actor,raw_text,interpretation_json,worldspec_delta_json,provenance_json) VALUES (?,?,?,'learner',?,?,?,?)`).bind(learnerTurnId,sessionId,now,utterance,JSON.stringify(interpretation),JSON.stringify(interpretation.proposed_worldspec),provenance),
        env.DB.prepare(`INSERT INTO worldspec_revisions (id,worldspec_id,session_id,revision_number,created_at,created_by_turn_id,worldspec_json,delta_json,provenance_json) VALUES (?,?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(),worldspecId,sessionId,revision,now,learnerTurnId,JSON.stringify(worldspec),JSON.stringify(interpretation.proposed_worldspec),provenance),
        env.DB.prepare(`UPDATE turtle_sessions SET updated_at=? WHERE id=?`).bind(now,sessionId)
      );
      await env.DB.batch(statements);
      operationalStored = true;
    } catch (error) { console.error("Web Turtle operational persistence failed", error); }
  }

  const recentTurns = [...(existing?.recent_turns || []), { actor: "learner", text: utterance }].slice(-10);
  let turtleText = existing
    ? `I’m keeping this inside the same Turtle project. I’m treating your latest turn as a revision, not a reset. ${interpretation.clarification_question || "What should we preserve or test next?"}`
    : `This is the beginning of a Turtle conversation, not a one-shot interpretation. I’m keeping your language intact while we start shaping the WorldSpec together. ${interpretation.clarification_question || "What part of the idea matters most to you?"}`;
  let model = "deterministic fallback";
  try {
    const generated = await generateTurtleReply(env, { learner_text: utterance, interpretation, session: { id: sessionId, worldspec_id: worldspecId, revision }, current_worldspec: worldspec, recent_turns: recentTurns });
    if (generated.ok) { turtleText = generated.text; model = generated.model; }
  } catch (error) { console.error("Web Turtle LLM error", error); }

  if (env.DB && operationalStored) {
    try {
      await env.DB.batch([
        env.DB.prepare(`INSERT INTO turtle_turns (id,session_id,created_at,actor,raw_text,interpretation_json,worldspec_delta_json,provenance_json) VALUES (?,?,?,'turtle',?,NULL,NULL,?)`).bind(crypto.randomUUID(),sessionId,new Date().toISOString(),turtleText,JSON.stringify({ source: "turtle_conversation_engine", model, turtle_inferred: true, learner_explicit: false })),
        env.DB.prepare(`UPDATE turtle_sessions SET updated_at=? WHERE id=?`).bind(new Date().toISOString(),sessionId)
      ]);
    } catch (error) { console.error("Web Turtle reply persistence failed", error); }
  }

  const researchPersistence = await maybeStoreSubmission(env, { id: crypto.randomUUID(), created_at: now, anonymous_session_id: browserSessionId, input_text: utterance, consent_version: consentVersion, worldspec_version: "0.1", interpretation_json: JSON.stringify(interpretation) });
  return { ok: true, session_id: sessionId, worldspec_id: worldspecId, revision, continuing: Boolean(existing), turtle: turtleText, interpretation, worldspec, conversation_engine: model, operational_persistence: operationalStored, research_persistence: researchPersistence };
}

const appRoutes = new Set(["/","/try","/try/","/about","/about/","/worldspec","/worldspec/","/charter","/charter/","/research","/research/","/build","/build/","/steamhamlet","/steamhamlet/","/reeducation","/reeducation/","/privacy","/privacy/","/disclaimer","/disclaimer/"]);

async function renderAppShell(request: Request, env: Env, origin: string) {
  const shellUrl = new URL("/index.html", origin);
  const assetResponse = await env.ASSETS.fetch(new Request(shellUrl.toString(), request));
  if (!assetResponse.ok) return assetResponse;
  let html = await assetResponse.text();
  const desktopLayout = `<style id="desktop-scroll-layout">@media (min-width:821px){html,body{height:auto;min-height:100%;overflow-x:hidden;overflow-y:auto}body{padding-bottom:calc(var(--footer-h) + 34px)}main{height:auto;min-height:calc(100vh - var(--footer-h));padding-top:28px;padding-bottom:calc(var(--footer-h) + 34px)}.shell{height:auto;min-height:0;align-items:start}.content{height:auto;min-height:720px;overflow:visible;padding-right:16px;padding-bottom:64px;scrollbar-gutter:auto}.panel{position:sticky;top:28px;align-self:start;height:max-content;max-height:none;overflow:visible}}</style>`;
  if (!html.includes('id="desktop-scroll-layout"')) html = html.replace("</head>", `${desktopLayout}\n</head>`);
  html = html
    .replace(/<strong>STEAMHAMLET<\/strong>/g, '<strong>STEAM<br>HAMLET</strong>')
    .replace(/<strong>RE\/EDUCATION<\/strong>/g, '<strong>RE\/<br>EDUCATION</strong>')
    .replace('Start with an idea, then keep talking. Turtle treats each turn as part of the same evolving project and WorldSpec rather than a one-shot prompt. The conversation is recursive: each turn can return to, revise, or reinterpret what came before.', 'Describe a place you want to make in Minecraft, then build it through conversation. Turtle helps turn your evolving idea into a persistent WorldSpec that can drive block placement, let you experience what was built, and carry what you notice back into the next revision.')
    .replace('What are you thinking about making, changing, testing, or understanding? We can stay with the idea for a while before anything gets built.', 'What kind of place should we begin making? Tell me what you imagine. We can talk through the idea, turn it into a buildable world, place blocks in Minecraft, see what happens, and keep changing it together.')
    .replace('Persistent conversation · WorldSpec v0.1', 'Conversation → WorldSpec → Minecraft blocks → experience → revise ↺')
    .replace('Constructivist AI agents for building, exploring, and iterating computational worlds in Minecraft and beyond.', SOCIAL_DESCRIPTION)
    .replace('A public educational research playground · building the ship while flying the ship.', 'A build-in-public educational research program by Dr. Bryan P. Sanders · developed through RE/EDUCATION.')
    .replace('A public educational research and development playground exploring how constructivist AI agents can help learners turn ideas into computational worlds, inhabit those worlds, notice what happens, and revise what they made.', 'An educational research and development program led by Dr. Bryan P. Sanders exploring how constructivist AI agents can help learners turn ideas into computational worlds, inhabit those worlds, notice consequences, reflect, and revise what they make.')
    .replace('The project grows from Dr. Bryan P. Sanders\' work as a credentialed educator, school builder, doctoral researcher, educational technologist, and published author.', 'The project grows from Dr. Bryan P. Sanders\' work as a credentialed educator, educational researcher, school builder, educational technologist, and published author.')
    .replace('TurtleBlock AI is part of the ongoing educational work of RE/EDUCATION and is being developed in public so the ideas, code, language, mistakes, revisions, and emerging tools remain visible.', 'TurtleBlock AI is developed through RE/EDUCATION as a bridge between educational practice, research, and technical R&D. It is built in public so the conceptual lineage, code, design decisions, revisions, and emerging tools remain inspectable.')
    .replace('<h2>A public research trail</h2><p>The work is intentionally connected to the public intellectual trail behind it: dissertation research, published Minecraft writing, STEAMHAMLET, AI writing, presentations, code, and current field tests.', '<h2>A documented research program</h2><p>The work is intentionally connected to Dr. Sanders\' public scholarly and professional record: doctoral research, published Minecraft scholarship, STEAMHAMLET, writing on AI and co-active emergence, presentations, code, and current field tests.')
    .replace('<h2>Provenance matters</h2>', '<h2>Research ontology + provenance</h2><p>WorldSpec is being connected to the <strong>Dr. Bryan P. Sanders TurtleBlock AI research ontology</strong>, a versioned scholarly layer that preserves the original dissertation Dedoose taxonomy and maps later research concepts to Turtle, the Charter, and WorldSpec without overwriting their source meanings.</p><h2>Provenance matters</h2>')
    .replace('<h2>2019 · Purpose before automation</h2>', '<div class="callout"><strong>A research ontology made executable</strong><p>The <em>Dr. Bryan P. Sanders TurtleBlock AI research ontology</em> preserves the dissertation\'s original Dedoose taxonomy as a foundational scholarly layer, then adds explicitly versioned relationships to later publications, the Turtle Charter, WorldSpec, and operational Turtle behavior.</p></div><h2>2019 · Purpose before automation</h2>')
    .replace('TurtleBlock AI is being developed as part of the educational practice, research, and school-building work of RE/EDUCATION.', 'TurtleBlock AI is developed through RE/EDUCATION, where educational practice, school design, research, and technical R&D are deliberately brought into the same program of inquiry.')
    .replace('<h2>Credentialed practice meets research</h2><p>The project connects day-to-day work as a credentialed educator with doctoral and post-doctoral inquiry', '<h2>Credentialed practice meets scholarship</h2><p>Led by Dr. Bryan P. Sanders, the project connects professional practice as a California credentialed educator with doctoral and continuing scholarly inquiry')
    .replace('Not a detached software demo', 'Research translated into working infrastructure')
    .replace('TurtleBlock AI is intended as a functional playground for actual educational work:', 'TurtleBlock AI is intended as working research infrastructure for authentic educational practice:')
    .replace('TurtleBlock AI is a build-in-public educational research project associated with RE/EDUCATION and the ongoing educational and doctoral research of Dr. Bryan P. Sanders.', 'TurtleBlock AI is a build-in-public educational research and development program led by Dr. Bryan P. Sanders and developed through RE/EDUCATION, connecting ongoing scholarly work with educational practice and technical implementation.')
    .replace('<div class="stage"><span class="date">Current edge</span><strong>→ Native Discord conversation</strong>', '<div class="stage"><span class="date">Sep 2, 2026</span><strong class="done">✓ Research ontology formalized</strong><p>The <em>Dr_Bryan_P_Sanders_TurtleBlockAI_Taxonomy</em> now preserves the dissertation\'s original Dedoose codes as a foundational research ontology and defines versioned mappings to later scholarship, the Turtle Charter, WorldSpec, and Turtle behavior.</p></div><div class="stage"><span class="date">Current edge</span><strong>→ Native Discord conversation</strong>');
  html = applyCanonicalRailChrome(html);
  html = applyRailSummary(html, new URL(request.url).pathname);
  html = injectRailSummaryRuntime(html);
  html = applyCanonicalFooter(html);
  html = applySocialMetadata(html, new URL(request.url).toString());
  const headers = new Headers(assetResponse.headers);
  headers.set("content-type", "text/html; charset=UTF-8");
  headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");
  headers.delete("content-length");
  return new Response(html, { status: assetResponse.status, headers });
}

async function renderStaticAsset(request: Request, env: Env) {
  const assetResponse = await env.ASSETS.fetch(request);
  const contentType = assetResponse.headers.get("content-type") || "";
  if (!assetResponse.ok || !contentType.includes("text/html")) return assetResponse;
  const pathname = new URL(request.url).pathname;
  let html = applyCanonicalFooter(await assetResponse.text());
  html = applyCanonicalRailChrome(html);
  html = applyRailSummary(html, pathname);
  html = applySocialMetadata(html, new URL(request.url).toString());
  const headers = new Headers(assetResponse.headers);
  headers.delete("content-length");
  headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  return new Response(html, { status: assetResponse.status, headers });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") return Response.json({ ok: true, service: "turtleblockai-platform", message: "TurtleBlock AI is awake.", discord_interactions: "/api/discord/interactions", web_conversation: "/api/turtle/converse", turtle_conversation_engine: env.OPENAI_API_KEY ? "llm-enabled" : "deterministic-fallback", turtle_model: env.OPENAI_MODEL || null, minecraft_adapter: "staging-only" });
    if (url.pathname === "/api/discord/interactions") return handleDiscordInteraction(request, env, makeInterpretation, ctx);
    if (url.pathname === "/api/minecraft/build" && request.method === "POST") { let body: unknown = null; try { body = await request.json(); } catch { body = null; } return minecraftStagingResponse(body); }
    if (url.pathname === "/api/worldspec" && request.method === "GET") return Response.json(worldSpecSummary);

    if (url.pathname === "/api/turtle/converse" && request.method === "POST") {
      let body: any;
      try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }
      const utterance = typeof body?.utterance === "string" ? body.utterance.trim() : "";
      const consentVersion = body?.consent_version === "0.1" ? "0.1" : null;
      const browserSessionId = typeof body?.anonymous_session_id === "string" ? body.anonymous_session_id.slice(0, 120) : "";
      if (utterance.length < 3 || utterance.length > 4000) return Response.json({ error: "Please submit between 3 and 4000 characters." }, { status: 400 });
      if (!consentVersion) return Response.json({ error: "Privacy consent version 0.1 is required." }, { status: 400 });
      return Response.json(await converseOnWeb(env, utterance, browserSessionId || crypto.randomUUID(), consentVersion));
    }

    if (url.pathname === "/api/worldspec/interpret" && request.method === "POST") {
      let body: any;
      try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }
      const utterance = typeof body?.utterance === "string" ? body.utterance.trim() : "";
      const consentVersion = body?.consent_version === "0.1" ? "0.1" : null;
      const sessionId = typeof body?.anonymous_session_id === "string" ? body.anonymous_session_id.slice(0, 120) : "";
      if (utterance.length < 3 || utterance.length > 4000) return Response.json({ error: "Please submit between 3 and 4000 characters." }, { status: 400 });
      if (!consentVersion) return Response.json({ error: "Privacy consent version 0.1 is required." }, { status: 400 });
      const interpretation = makeInterpretation(utterance);
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const persistence = await maybeStoreSubmission(env, { id, created_at: createdAt, anonymous_session_id: sessionId || crypto.randomUUID(), input_text: utterance, consent_version: consentVersion, worldspec_version: "0.1", interpretation_json: JSON.stringify(interpretation) });
      return Response.json({ ok: true, submission_id: id, interpretation, persistence });
    }

    if (request.method === "GET" && appRoutes.has(url.pathname)) return renderAppShell(request, env, url.origin);
    return renderStaticAsset(request, env);
  }
} satisfies ExportedHandler<Env>;