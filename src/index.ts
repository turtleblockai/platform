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
  const desktopLayout = `<style id="desktop-scroll-layout">@media (min-width:821px){html,body{height:100%;overflow:hidden}body{padding-bottom:0}main{height:calc(100vh - var(--footer-h));min-height:0;padding-top:28px;padding-bottom:18px}.shell{height:100%;min-height:0;align-items:stretch}.content{height:100%;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding-right:16px;padding-bottom:64px;scrollbar-gutter:stable}.panel{position:relative;top:auto;align-self:stretch;height:fit-content;max-height:calc(100vh - var(--footer-h) - 46px);overflow-y:auto;overscroll-behavior:contain}}</style>`;
  if (!html.includes('id="desktop-scroll-layout"')) html = html.replace("</head>", `${desktopLayout}\n</head>`);
  html = html.replace(/<strong>STEAMHAMLET<\/strong>/g, '<strong>STEAM<br>HAMLET</strong>').replace(/<strong>RE\/EDUCATION<\/strong>/g, '<strong>RE\/<br>EDUCATION</strong>');
  const headers = new Headers(assetResponse.headers);
  headers.set("content-type", "text/html; charset=UTF-8");
  headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");
  headers.delete("content-length");
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
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
