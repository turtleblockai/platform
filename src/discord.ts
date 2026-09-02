import { generateTurtleReply, type TurtleLLMEnv } from "./turtleLLM";

type DiscordInteraction = {
  type: number;
  id?: string;
  token?: string;
  guild_id?: string;
  channel_id?: string;
  member?: { user?: { id?: string; username?: string } };
  user?: { id?: string; username?: string };
  data?: { name?: string; options?: Array<{ name: string; type: number; value?: string }> };
};

export type DiscordEnv = TurtleLLMEnv & {
  DISCORD_PUBLIC_KEY?: string;
  DISCORD_APPLICATION_ID?: string;
  DB?: D1Database;
};

export type TurtleInterpretation = {
  mode: string;
  needs_clarification?: boolean;
  clarification_question?: string | null;
  proposed_worldspec: unknown;
};

type SessionContext = {
  id: string;
  worldspec_id: string;
  revision: number;
  worldspec: any;
  recent_turns: Array<{ actor: string; text: string }>;
};

function hexToBytes(hex: string) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) throw new Error("Invalid hex value");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function verifyDiscordRequest(request: Request, publicKeyHex: string, body: string) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  if (!signature || !timestamp) return false;
  const publicKey = await crypto.subtle.importKey("raw", hexToBytes(publicKeyHex), { name: "Ed25519" }, false, ["verify"]);
  return crypto.subtle.verify("Ed25519", publicKey, hexToBytes(signature), new TextEncoder().encode(timestamp + body));
}

function getStringOption(interaction: DiscordInteraction, name: string) {
  const option = interaction.data?.options?.find((item) => item.name === name);
  return typeof option?.value === "string" ? option.value.trim() : "";
}

function commandResponse(content: string) {
  return Response.json({ type: 4, data: { content, allowed_mentions: { parse: [] } } });
}

function deferredResponse() { return Response.json({ type: 5 }); }

async function replaceOriginalInteraction(env: DiscordEnv, interaction: DiscordInteraction, content: string) {
  if (!env.DISCORD_APPLICATION_ID || !interaction.token) return;
  const response = await fetch(`https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${interaction.token}/messages/@original`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: content.slice(0, 1990), allowed_mentions: { parse: [] } })
  });
  if (!response.ok) console.error("Discord deferred response update failed", response.status, (await response.text()).slice(0, 500));
}

function fallbackConversation(idea: string, interpretation: TurtleInterpretation, continuing: boolean) {
  const question = interpretation.clarification_question || "What feels most important to change, preserve, or test next?";
  return continuing
    ? `I’m treating that as the next move in the same project, not a fresh prompt. I’m keeping your earlier WorldSpec intact while adding **${idea.slice(0, 220)}${idea.length > 220 ? "…" : ""}** as new learner-authored state.\n\n${question}`
    : `I’m holding onto your whole idea, not just the keywords I can normalize. **${idea.slice(0, 220)}${idea.length > 220 ? "…" : ""}** is the beginning of a conversation, not a one-shot build request.\n\n${question}`;
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

async function loadExistingSession(env: DiscordEnv, interaction: DiscordInteraction): Promise<SessionContext | null> {
  if (!env.DB) return null;
  const learnerId = interaction.member?.user?.id ?? interaction.user?.id ?? null;
  if (!learnerId) return null;
  try {
    const session = await env.DB.prepare(`
      SELECT id, worldspec_id FROM turtle_sessions
      WHERE source='discord' AND learner_id=? AND status='exploring'
        AND COALESCE(discord_guild_id,'')=COALESCE(?, '')
        AND COALESCE(discord_channel_id,'')=COALESCE(?, '')
      ORDER BY updated_at DESC LIMIT 1
    `).bind(learnerId, interaction.guild_id ?? null, interaction.channel_id ?? null).first<any>();
    if (!session) return null;
    const revision = await env.DB.prepare(`
      SELECT revision_number, worldspec_json FROM worldspec_revisions
      WHERE session_id=? ORDER BY revision_number DESC LIMIT 1
    `).bind(session.id).first<any>();
    const turns = await env.DB.prepare(`
      SELECT actor, raw_text FROM turtle_turns WHERE session_id=? ORDER BY created_at DESC LIMIT 8
    `).bind(session.id).all<any>();
    return {
      id: session.id,
      worldspec_id: session.worldspec_id,
      revision: Number(revision?.revision_number || 0),
      worldspec: revision?.worldspec_json ? JSON.parse(revision.worldspec_json) : {},
      recent_turns: [...(turns.results || [])].reverse().map((t: any) => ({ actor: t.actor, text: t.raw_text }))
    };
  } catch (error) {
    console.error("Turtle session lookup failed", error);
    return null;
  }
}

async function persistLearnerRevision(env: DiscordEnv, interaction: DiscordInteraction, session: SessionContext | null, idea: string, interpretation: TurtleInterpretation) {
  const now = new Date().toISOString();
  const learnerId = interaction.member?.user?.id ?? interaction.user?.id ?? null;
  const sessionId = session?.id || crypto.randomUUID();
  const worldspecId = session?.worldspec_id || crypto.randomUUID();
  const learnerTurnId = crypto.randomUUID();
  const revision = (session?.revision || 0) + 1;
  const worldspec = mergeWorldSpec(session?.worldspec, interpretation.proposed_worldspec, idea);
  if (!env.DB) return { sessionId, worldspecId, learnerTurnId, revision, worldspec, stored: false };
  const provenance = JSON.stringify({ source: "discord", learner_explicit: true, turtle_inferred: false, raw_language_retained: true, research_dataset_consent: false });
  try {
    const statements = [];
    if (!session) statements.push(env.DB.prepare(`INSERT INTO turtle_sessions (id,worldspec_id,created_at,updated_at,source,discord_guild_id,discord_channel_id,learner_id,status,visibility) VALUES (?,?,?,?, 'discord',?,?,?,'exploring','private')`).bind(sessionId, worldspecId, now, now, interaction.guild_id ?? null, interaction.channel_id ?? null, learnerId));
    statements.push(
      env.DB.prepare(`INSERT INTO turtle_turns (id,session_id,created_at,actor,raw_text,interpretation_json,worldspec_delta_json,provenance_json) VALUES (?,?,?,'learner',?,?,?,?)`).bind(learnerTurnId, sessionId, now, idea, JSON.stringify(interpretation), JSON.stringify(interpretation.proposed_worldspec), provenance),
      env.DB.prepare(`INSERT INTO worldspec_revisions (id,worldspec_id,session_id,revision_number,created_at,created_by_turn_id,worldspec_json,delta_json,provenance_json) VALUES (?,?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(), worldspecId, sessionId, revision, now, learnerTurnId, JSON.stringify(worldspec), JSON.stringify(interpretation.proposed_worldspec), provenance),
      env.DB.prepare(`UPDATE turtle_sessions SET updated_at=? WHERE id=?`).bind(now, sessionId)
    );
    await env.DB.batch(statements);
    return { sessionId, worldspecId, learnerTurnId, revision, worldspec, stored: true };
  } catch (error) {
    console.error("Turtle learner revision persistence failed", error);
    return { sessionId, worldspecId, learnerTurnId, revision, worldspec, stored: false };
  }
}

async function persistTurtleTurn(env: DiscordEnv, sessionId: string, text: string, modelLabel: string) {
  if (!env.DB) return;
  const now = new Date().toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO turtle_turns (id,session_id,created_at,actor,raw_text,interpretation_json,worldspec_delta_json,provenance_json) VALUES (?,?,?,'turtle',?,NULL,NULL,?)`).bind(crypto.randomUUID(), sessionId, now, text, JSON.stringify({ source: "turtle_conversation_engine", model: modelLabel, turtle_inferred: true, learner_explicit: false })),
      env.DB.prepare(`UPDATE turtle_sessions SET updated_at=? WHERE id=?`).bind(now, sessionId)
    ]);
  } catch (error) { console.error("Turtle turn persistence failed", error); }
}

async function processTurtleCommand(env: DiscordEnv, interaction: DiscordInteraction, idea: string, interpret: (utterance: string) => TurtleInterpretation) {
  const existing = await loadExistingSession(env, interaction);
  const interpretation = interpret(idea);
  const state = await persistLearnerRevision(env, interaction, existing, idea, interpretation);
  const recentTurns = [...(existing?.recent_turns || []), { actor: "learner", text: idea }].slice(-10);
  let conversation = fallbackConversation(idea, interpretation, Boolean(existing));
  let llmLabel = "deterministic fallback";
  try {
    const generated = await generateTurtleReply(env, {
      learner_text: idea,
      interpretation,
      session: { id: state.sessionId, worldspec_id: state.worldspecId, revision: state.revision },
      current_worldspec: state.worldspec,
      recent_turns: recentTurns
    });
    if (generated.ok) { conversation = generated.text; llmLabel = generated.model; }
  } catch (error) { console.error("Turtle LLM processing error", error); }
  await persistTurtleTurn(env, state.sessionId, conversation, llmLabel);
  const content = [
    "🐢 **Turtle**",
    conversation,
    "",
    `**Turtle Lab:** \`${state.sessionId}\` · **WorldSpec:** \`${state.worldspecId}\` · revision ${String(state.revision).padStart(4,"0")}`,
    `_This is ${existing ? "a continuation of" : "the opening of"} the same evolving project. ${state.stored ? "Persistent state saved." : "D1 persistence is not active."} No Minecraft build has been executed._`,
    `_For now, keep using /turtle to continue. Ordinary thread messages become possible when the Discord Gateway listener is connected._`
  ].join("\n");
  await replaceOriginalInteraction(env, interaction, content);
}

export async function handleDiscordInteraction(request: Request, env: DiscordEnv, interpret: (utterance: string) => TurtleInterpretation, executionContext?: ExecutionContext) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  if (!env.DISCORD_PUBLIC_KEY) return new Response("Discord public key is not configured", { status: 503 });
  const rawBody = await request.text();
  let verified = false;
  try { verified = await verifyDiscordRequest(request, env.DISCORD_PUBLIC_KEY, rawBody); } catch (error) { console.error("Discord signature verification error", error); }
  if (!verified) return new Response("Invalid request signature", { status: 401 });
  let interaction: DiscordInteraction;
  try { interaction = JSON.parse(rawBody) as DiscordInteraction; } catch { return new Response("Invalid JSON", { status: 400 }); }
  if (interaction.type === 1) return Response.json({ type: 1 });
  if (interaction.type !== 2 || interaction.data?.name !== "turtle") return commandResponse("🐢 Turtle does not know that command yet.");
  const idea = getStringOption(interaction, "idea");
  if (idea.length < 3) return commandResponse("🐢 Give Turtle something to think with. Example: `/turtle idea:make a bridge across the lake`");
  if (idea.length > 1800) return commandResponse("🐢 Keep this turn under 1,800 characters for Discord, or continue at https://turtleblockai.com/try/");
  const work = processTurtleCommand(env, interaction, idea, interpret);
  if (executionContext) executionContext.waitUntil(work); else await work;
  return deferredResponse();
}

export function minecraftStagingResponse(payload: unknown) {
  return Response.json({ ok: false, status: "awaiting-minecraft-adapter", adapter: "minecraft-paper", message: "TurtleBlock can stage a WorldSpec build handoff, but no Minecraft server adapter is connected yet.", received: payload }, { status: 501 });
}
