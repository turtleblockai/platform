import app, { type Env } from "./index";
import { BUILD_LOG_ENTRIES, injectBuildLogRuntime } from "./buildLog";
import { applySiteChrome } from "./siteChrome";

const TERRARIA_TRY_SCRIPT = '<script src="/assets/terraria-try.js?v=20260912.1"></script>';

const SOCIAL_CARD_PATH = "/assets/turtleblock-social-card.jpg";
const SOCIAL_CARD_PARTS = [
  "/assets/social-card/turtleblock-social-card-01.b64",
  "/assets/social-card/turtleblock-social-card-02.b64",
  "/assets/social-card/turtleblock-social-card-03.b64",
  "/assets/social-card/turtleblock-social-card-04.b64",
  "/assets/social-card/turtleblock-social-card-05.b64",
  "/assets/social-card/turtleblock-social-card-06.b64"
];
const SOCIAL_TITLE = "TurtleBlock AI";
const SOCIAL_DESCRIPTION = "We built a place to build places. TurtleBlock AI helps learners turn ideas into worlds they can build, explore, question, and change.";
const SOCIAL_CARD_ABSOLUTE_URL = "https://turtleblockai.com/assets/turtleblock-social-card.jpg";
const SOCIAL_CARD_ALT = "TurtleBlock AI — a block-shelled turtle exploring worlds rooted in Papert, Dewey, Bruner, Logo, Critical Techno Constructivism, ChatGPT, Minecraft, and whoooo knooowwwssssss.";

function applySocialMetadata(html: string, requestUrl: URL) {
  if (html.includes('data-turtleblock-social="v1"')) return html;
  const canonicalPath = requestUrl.pathname || "/";
  const canonicalUrl = `https://turtleblockai.com${canonicalPath}`;
  const tags = `<link rel="canonical" href="${canonicalUrl}" data-turtleblock-social="v1">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SOCIAL_TITLE}">
  <meta property="og:title" content="${SOCIAL_TITLE}">
  <meta property="og:description" content="${SOCIAL_DESCRIPTION}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${SOCIAL_CARD_ABSOLUTE_URL}">
  <meta property="og:image:secure_url" content="${SOCIAL_CARD_ABSOLUTE_URL}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${SOCIAL_CARD_ALT}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${SOCIAL_TITLE}">
  <meta name="twitter:description" content="${SOCIAL_DESCRIPTION}">
  <meta name="twitter:image" content="${SOCIAL_CARD_ABSOLUTE_URL}">
  <meta name="twitter:image:alt" content="${SOCIAL_CARD_ALT}">`;
  return html.replace("</head>", `${tags}\n</head>`);
}

function decodeBase64(base64: string) {
  const clean = base64.replace(/\s+/g, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function handleSocialCard(request: Request, env: Env) {
  try {
    const requestUrl = new URL(request.url);
    const parts = await Promise.all(
      SOCIAL_CARD_PARTS.map(async (path) => {
        const assetUrl = new URL(path, requestUrl.origin);
        const response = await env.ASSETS.fetch(new Request(assetUrl.toString(), { method: "GET" }));
        if (!response.ok) throw new Error(`missing social card asset part: ${path}`);
        return response.text();
      })
    );
    const bytes = decodeBase64(parts.join(""));
    const headers = new Headers({
      "content-type": "image/jpeg",
      "cache-control": "public, max-age=604800, stale-while-revalidate=86400",
      "content-length": String(bytes.byteLength),
      "x-content-type-options": "nosniff"
    });
    return new Response(request.method === "HEAD" ? null : bytes.buffer, { status: 200, headers });
  } catch (error) {
    console.error("Social card assembly failed", error);
    return new Response("Social card unavailable.", { status: 503, headers: { "cache-control": "no-store" } });
  }
}

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

function parseLibraryJson(value: unknown, fallback: any) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

async function handlePublicLibrary(env: Env) {
  if (!env.DB) return Response.json({ error: "Library database is not configured." }, { status: 503 });
  try {
    const [sourceResult, noteResult] = await env.DB.batch([
      env.DB.prepare("SELECT id,entry_number,source_type,title,subtitle,canonical_work_title,author_display,contributors_json,original_publication_year,edition_year,chronology_year,chronology_basis,coverage_start_year,coverage_end_year,edition_label,printing_label,publisher,imprint,publication_place,isbn,lccn,lc_classification,dewey_classification,subjects_json,tags_json,contents_json,notes,physical_copy_status,digital_copy_status,digital_copy_url,digital_copy_type,digital_copy_verified_at,verification_status,metadata_provenance_json FROM library_sources WHERE collection_visibility='public' ORDER BY CASE WHEN chronology_year IS NULL THEN 1 ELSE 0 END, chronology_year, author_display, title"),
      env.DB.prepare("SELECT n.id,n.source_id,n.note_type,n.label,n.note_text,n.verification_status,n.evidence_basis,n.sort_order FROM library_special_notes n JOIN library_sources s ON s.id=n.source_id WHERE s.collection_visibility='public' ORDER BY s.entry_number,n.sort_order,n.id")
    ]);
    const notesBySource = new Map<string, any[]>();
    for (const row of (noteResult.results || []) as any[]) {
      const notes = notesBySource.get(row.source_id) || [];
      notes.push({ id: row.id, type: row.note_type, label: row.label, text: row.note_text, verification_status: row.verification_status, evidence_basis: row.evidence_basis });
      notesBySource.set(row.source_id, notes);
    }
    const sources = ((sourceResult.results || []) as any[]).map((row) => ({
      id: row.id, entry_number: Number(row.entry_number), source_type: row.source_type,
      title: row.title, subtitle: row.subtitle, canonical_work_title: row.canonical_work_title,
      author: row.author_display, contributors: parseLibraryJson(row.contributors_json, []),
      original_publication_year: row.original_publication_year == null ? null : Number(row.original_publication_year),
      edition_year: row.edition_year == null ? null : Number(row.edition_year),
      chronology_year: row.chronology_year == null ? null : Number(row.chronology_year),
      chronology_basis: row.chronology_basis,
      coverage_start_year: row.coverage_start_year == null ? null : Number(row.coverage_start_year),
      coverage_end_year: row.coverage_end_year == null ? null : Number(row.coverage_end_year),
      edition_label: row.edition_label, printing_label: row.printing_label, publisher: row.publisher,
      imprint: row.imprint, publication_place: row.publication_place, isbn: row.isbn, lccn: row.lccn,
      lc_classification: row.lc_classification, dewey_classification: row.dewey_classification,
      subjects: parseLibraryJson(row.subjects_json, []), tags: parseLibraryJson(row.tags_json, []),
      contents: parseLibraryJson(row.contents_json, []), catalog_notes: row.notes,
      physical_copy_status: row.physical_copy_status,
      digital_copy: { status: row.digital_copy_status, url: row.digital_copy_url, type: row.digital_copy_type, verified_at: row.digital_copy_verified_at },
      verification_status: row.verification_status,
      provenance: parseLibraryJson(row.metadata_provenance_json, {}),
      special_notes: notesBySource.get(row.id) || []
    }));
    return Response.json({
      generated_at: new Date().toISOString(),
      source_count: sources.length,
      special_note_count: (noteResult.results || []).length,
      ordering: "chronological",
      provenance_statement: "Catalog records are grounded in photographed physical copies and the cataloging session; interpretive notes are labeled separately.",
      sources
    }, { headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("Public library query failed", error);
    return Response.json({ error: "The library catalog is temporarily unavailable." }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}

function injectTerrariaTryScript(html: string) {
  if (html.includes("terraria-try.js")) return html;
  return html.replace("</body>", `${TERRARIA_TRY_SCRIPT}\n</body>`);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const originalUrl = new URL(request.url);

    if (originalUrl.pathname === SOCIAL_CARD_PATH && (request.method === "GET" || request.method === "HEAD")) {
      return handleSocialCard(request, env);
    }

    if (originalUrl.pathname === "/api/build-log" && request.method === "GET") {
      return Response.json({ entries: BUILD_LOG_ENTRIES, source: "src/buildLog.ts" }, { headers: { "cache-control": "no-store" } });
    }

    if (originalUrl.pathname === "/api/research/library" && request.method === "GET") {
      return handlePublicLibrary(env);
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
    html = applySocialMetadata(html, originalUrl);

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
