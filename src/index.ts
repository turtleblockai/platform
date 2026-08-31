export interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
}

const worldSpecSummary = {
  version: "0.1",
  status: "experimental",
  interaction_modes: ["direct", "interpretive", "reflective", "exploratory", "comparative", "social"],
  core_loop: [
    "learner intent",
    "agent dialogue",
    "WorldSpec",
    "build",
    "inhabit",
    "notice",
    "reflect",
    "revise"
  ],
  principles: [
    "learner is designer and producer",
    "inquiry before predetermined outcome",
    "manual learner edits are preserved",
    "semantic interpretations remain revisable",
    "reflection is first-class state",
    "the agent is collaborator, not authority"
  ],
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
  const patterns = [
    /\bbut\s+(.+)/i,
    /\bwithout\s+(.+)/i,
    /\bdon't\s+(.+)/i,
    /\bdo not\s+(.+)/i,
    /\bkeep\s+(.+)/i,
    /\bpreserve\s+(.+)/i
  ];
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match?.[1]) constraints.push(match[1].trim());
  }
  return [...new Set(constraints)];
}

function extractTargets(utterance: string) {
  const known = ["village","house","houses","tower","bridge","entrance","courtyard","garden","road","roads","path","paths","city","building","buildings","room","rooms","wall","walls","castle","school","farm","river","mountain","forest"];
  const text = utterance.toLowerCase();
  return known.filter((word) => new RegExp(`\\b${word}\\b`).test(text));
}

function makeInterpretation(utterance: string) {
  const mode = classifyInteraction(utterance);
  const targets = extractTargets(utterance);
  const constraints = extractConstraints(utterance);
  const semanticWords = utterance.toLowerCase().match(/\b(welcoming|authoritarian|oppressive|democratic|sacred|hopeful|precarious|communal|playful|threatening|peaceful|intimidating|friendly|cozy|grand|mysterious)\b/g) || [];
  const needsClarification = mode === "interpretive" && semanticWords.length > 0;

  return {
    mode,
    utterance,
    targets,
    constraints,
    semantic_terms: [...new Set(semanticWords)],
    needs_clarification: needsClarification,
    clarification_question: needsClarification
      ? `When you say ${semanticWords.map((w) => `“${w}”`).join(" and ")}, what qualities in the world would make that true for you?`
      : null,
    proposed_worldspec: {
      version: "0.1",
      intent: {
        mode,
        statement: utterance
      },
      world: {
        targets
      },
      meaning: {
        semantic_terms: [...new Set(semanticWords)]
      },
      constraints,
      status: needsClarification ? "proposed-awaiting-learner-clarification" : "proposed"
    }
  };
}

async function maybeStoreSubmission(env: Env, data: {
  id: string;
  created_at: string;
  anonymous_session_id: string;
  input_text: string;
  consent_version: string;
  worldspec_version: string;
  interpretation_json: string;
}) {
  if (!env.DB) return { stored: false, reason: "D1 binding not configured" };

  await env.DB.prepare(`
    INSERT INTO playground_submissions (
      id, created_at, anonymous_session_id, input_text, consent_version,
      worldspec_version, interpretation_json, moderation_status,
      redacted_text, dataset_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'unreviewed', NULL, 'raw')
  `).bind(
    data.id,
    data.created_at,
    data.anonymous_session_id,
    data.input_text,
    data.consent_version,
    data.worldspec_version,
    data.interpretation_json
  ).run();

  return { stored: true };
}

const appRoutes = new Set([
  "/",
  "/try", "/try/",
  "/about", "/about/",
  "/worldspec", "/worldspec/",
  "/charter", "/charter/",
  "/research", "/research/",
  "/build", "/build/",
  "/steamhamlet", "/steamhamlet/",
  "/reeducation", "/reeducation/",
  "/privacy", "/privacy/"
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "turtleblockai-platform",
        message: "TurtleBlock AI is awake."
      });
    }

    if (url.pathname === "/api/worldspec" && request.method === "GET") {
      return Response.json(worldSpecSummary);
    }

    if (url.pathname === "/api/worldspec/interpret" && request.method === "POST") {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
      }

      const utterance = typeof body?.utterance === "string" ? body.utterance.trim() : "";
      const consentVersion = body?.consent_version === "0.1" ? "0.1" : null;
      const sessionId = typeof body?.anonymous_session_id === "string" ? body.anonymous_session_id.slice(0, 120) : "";

      if (utterance.length < 3 || utterance.length > 4000) {
        return Response.json({ error: "Please submit between 3 and 4000 characters." }, { status: 400 });
      }
      if (!consentVersion) {
        return Response.json({ error: "Privacy consent version 0.1 is required." }, { status: 400 });
      }

      const interpretation = makeInterpretation(utterance);
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const persistence = await maybeStoreSubmission(env, {
        id,
        created_at: createdAt,
        anonymous_session_id: sessionId || crypto.randomUUID(),
        input_text: utterance,
        consent_version: consentVersion,
        worldspec_version: "0.1",
        interpretation_json: JSON.stringify(interpretation)
      });

      return Response.json({
        ok: true,
        submission_id: id,
        interpretation,
        persistence
      });
    }

    if (request.method === "GET" && appRoutes.has(url.pathname)) {
      const shellUrl = new URL("/index.html", url.origin);
      return env.ASSETS.fetch(new Request(shellUrl.toString(), request));
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
