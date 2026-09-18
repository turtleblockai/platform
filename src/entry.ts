import app, { type Env } from "./index";
import { BUILD_LOG_ENTRIES, injectBuildLogRuntime } from "./buildLog";
import { applySiteChrome } from "./siteChrome";

const TERRARIA_TRY_SCRIPT = '<script src="/assets/terraria-try.js?v=20260912.1"></script>';

function applyTerrariaLanguage(html: string) {
  let next = html.replace(/Turtle Lab/g, "Turtle Terraria");
  next = next.replace(/Public artifacts\./g, "Multiple habitats.");
  next = next.replace(
    '<p class="lede">The public research edge of TurtleBlock AI: build notes, learner-approved projects, WorldSpec artifacts, experiments, reflections, and documented lessons from implementation.</p>',
    '<p class="lede">Bounded habitats for observing what emerges when people and computers construct, question, reflect, and revise together — and what happens when human-made computational agents recursively do the same with one another.</p><div class="gallery"><div class="project"><strong>🧑‍💻🐢 Human + Turtle Terrarium</strong><p class="muted">A person drives inquiry. Turtle contributes interpretations, questions, alternatives, technical assistance, and construction while human purpose, correction, reflection, and judgment remain human-authored evidence.</p></div><div class="project"><strong>🐢🐢 Recursive Turtle Terrarium</strong><p class="muted">Synthetic Turtle roles construct, critique, test, and revise one another\'s representations. These traces are explicitly synthetic, never learner evidence, and have no authority to promote themselves directly into production.</p></div></div><div class="card loop">cohabitation without provenance collapse: human meaning ≠ Turtle interpretation ≠ synthetic self-play ≠ scholarly source</div>'
  );
  next = next.replace(
    '🐢 Turtle Terraria is the opt-in public artifact layer; raw conversations stay private by default.',
    '🐢 Turtle Terraria contains multiple research habitats; human, machine, synthetic, world, and scholarly traces may cohabitate without losing provenance.'
  );
  next = next.replace(
    '<h2>Research lineage in practice</h2>',
    '<h2>Research lineage in practice</h2><p>The seven established Critical Techno Constructivism domains remain the primary operational frame, while the database now preserves observations that do not fit them cleanly so possible eighth, ninth, or later domains can emerge from evidence rather than being invented in advance.</p>'
  );
  return next;
}

function normalizeEntryMode(value: unknown) {
  return value === "build" || value === "perturb" || value === "wander" ? value : "wander";
}

async function storeTerrariaPlayTrace(env: Env, body: any, data: any) {
  if (!env.DB) return { stored: false, reason: "D1 binding not configured" };
  if (!data?.ok || !data?.session_id || !data?.worldspec_id) return { stored: false, reason: "Conversation did not produce a traceable session" };

  const entryMode = normalizeEntryMode(body?.entry_mode);
  const revision = Number(data?.revision || 0);
  if (!Number.isInteger(revision) || revision < 1) return { stored: false, reason: "Conversation revision unavailable" };

  const runId = `terraria:web:${data.session_id}`;
  const now = new Date().toISOString();
  const provenance = JSON.stringify({
    source: "public_try_it",
    habitat: "human_turtle",
    entry_mode: entryMode,
    consent_version: body?.consent_version || null,
    raw_dialogue_canonical_table: "turtle_turns",
    raw_dialogue_duplicated_here: false,
    research_capture: "consented_play",
    production_authority: false
  });
  const modelConfig = JSON.stringify({ conversation_engine: data?.conversation_engine || null });
  const humanPayload = JSON.stringify({ entry_mode: entryMode, worldspec_revision: revision, source: "public_try_it" });
  const turtlePayload = JSON.stringify({ entry_mode: entryMode, worldspec_revision: revision, source: "public_try_it", conversation_engine: data?.conversation_engine || null });

  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT OR IGNORE INTO terraria_runs (id,habitat_id,started_at,status,session_id,worldspec_id,title,initiating_question,evidence_class,privacy_class,model_config_json,provenance_json) VALUES (?,'habitat-human-turtle',?,'running',?,?,?,NULL,'human_interaction','private',?,?)`).bind(runId, now, data.session_id, data.worldspec_id, `TRY IT · Human + Turtle · ${entryMode}`, modelConfig, provenance),
      env.DB.prepare(`INSERT OR IGNORE INTO terraria_events (id,run_id,sequence_number,created_at,actor_type,event_type,parent_event_id,text_content,payload_json,evidence_class,provenance_json) VALUES (?,?,?,?, 'human','human_turn',NULL,NULL,?,'human_interaction',?)`).bind(`${runId}:r${revision}:human`, runId, revision * 2 - 1, now, humanPayload, provenance),
      env.DB.prepare(`INSERT OR IGNORE INTO terraria_events (id,run_id,sequence_number,created_at,actor_type,event_type,parent_event_id,text_content,payload_json,evidence_class,provenance_json) VALUES (?,?,?,?, 'turtle','turtle_turn',NULL,NULL,?,'system_record',?)`).bind(`${runId}:r${revision}:turtle`, runId, revision * 2, now, turtlePayload, provenance)
    ]);
    return { stored: true, run_id: runId, habitat: "human_turtle", entry_mode: entryMode };
  } catch (error) {
    console.error("Terraria TRY IT trace persistence failed", error);
    return { stored: false, reason: "Terraria tables unavailable or write failed", habitat: "human_turtle", entry_mode: entryMode };
  }
}

async function handleTerrariaPlay(request: Request, env: Env, ctx: ExecutionContext) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const entryMode = normalizeEntryMode(body?.entry_mode);
  const internalUrl = new URL(request.url);
  internalUrl.pathname = "/api/turtle/converse";
  const forwardedBody = { ...body, terrarium_habitat: "human_turtle", entry_mode: entryMode };
  const headers = new Headers(request.headers);
  headers.set("content-type", "application/json");
  const forwarded = new Request(internalUrl.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify(forwardedBody)
  });

  const response = await app.fetch(forwarded, env, ctx);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return response;

  const data: any = await response.json();
  if (!response.ok) return Response.json(data, { status: response.status, headers: response.headers });

  const terrariaPersistence = await storeTerrariaPlayTrace(env, forwardedBody, data);
  return Response.json({ ...data, terraria: { habitat: "human_turtle", entry_mode: entryMode }, terraria_persistence: terrariaPersistence }, { status: response.status });
}

function injectTerrariaTryScript(html: string) {
  if (html.includes("terraria-try.js")) return html;
  return html.replace("</body>", `${TERRARIA_TRY_SCRIPT}\n</body>`);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const originalUrl = new URL(request.url);

    if (originalUrl.pathname === "/api/build-log" && request.method === "GET") {
      return Response.json({ entries: BUILD_LOG_ENTRIES, source: "src/buildLog.ts" }, { headers: { "cache-control": "no-store" } });
    }

    if (originalUrl.pathname === "/api/terraria/play" && request.method === "POST") {
      return handleTerrariaPlay(request, env, ctx);
    }

    // /lab/ was the original public research page. Keep old links working while
    // making /terraria/ the canonical public habitat URL.
    if (originalUrl.pathname === "/lab" || originalUrl.pathname === "/lab/") {
      const target = new URL("/terraria/", originalUrl.origin);
      return Response.redirect(target.toString(), 301);
    }

    let internalRequest = request;
    if (originalUrl.pathname === "/terraria" || originalUrl.pathname === "/terraria/") {
      const internalUrl = new URL(request.url);
      internalUrl.pathname = "/lab/";
      internalRequest = new Request(internalUrl.toString(), request);
    }

    const response = await app.fetch(internalRequest, env, ctx);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    let html = applyTerrariaLanguage(await response.text());
    html = injectBuildLogRuntime(html);
    html = applySiteChrome(html, originalUrl.pathname);
    html = injectTerrariaTryScript(html);

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
