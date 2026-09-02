import { generateTurtleReply, type TurtleLLMEnv } from "./turtleLLM";

type DiscordInteraction = {
  type: number;
  id?: string;
  token?: string;
  guild_id?: string;
  channel_id?: string;
  member?: { user?: { id?: string; username?: string } };
  user?: { id?: string; username?: string };
  data?: {
    name?: string;
    options?: Array<{ name: string; type: number; value?: string }>;
  };
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

  const publicKey = await crypto.subtle.importKey(
    "raw",
    hexToBytes(publicKeyHex),
    { name: "Ed25519" },
    false,
    ["verify"]
  );

  const message = new TextEncoder().encode(timestamp + body);
  return crypto.subtle.verify("Ed25519", publicKey, hexToBytes(signature), message);
}

function getStringOption(interaction: DiscordInteraction, name: string) {
  const option = interaction.data?.options?.find((item) => item.name === name);
  return typeof option?.value === "string" ? option.value.trim() : "";
}

function buildMinecraftHandoff(interpretation: TurtleInterpretation, interaction: DiscordInteraction) {
  return {
    build_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    source: "discord",
    discord: {
      guild_id: interaction.guild_id ?? null,
      channel_id: interaction.channel_id ?? null,
      user_id: interaction.member?.user?.id ?? interaction.user?.id ?? null
    },
    adapter: "minecraft-paper",
    destination: "/api/minecraft/build",
    status: "awaiting-minecraft-adapter",
    worldspec: interpretation.proposed_worldspec,
    research_dataset_consent: false
  };
}

function commandResponse(content: string) {
  return Response.json({
    type: 4,
    data: {
      content,
      allowed_mentions: { parse: [] }
    }
  });
}

function deferredResponse() {
  return Response.json({ type: 5 });
}

async function replaceOriginalInteraction(
  env: DiscordEnv,
  interaction: DiscordInteraction,
  content: string
) {
  if (!env.DISCORD_APPLICATION_ID || !interaction.token) {
    console.error("Cannot replace deferred Discord response: missing application ID or interaction token");
    return;
  }

  const url = `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${interaction.token}/messages/@original`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: content.slice(0, 1990),
      allowed_mentions: { parse: [] }
    })
  });

  if (!response.ok) {
    console.error("Discord deferred response update failed", response.status, (await response.text()).slice(0, 500));
  }
}

function fallbackConversation(idea: string, interpretation: TurtleInterpretation) {
  const question = interpretation.clarification_question
    ? `\n\n${interpretation.clarification_question}`
    : "\n\nWhat part of this idea feels most important for us to understand before we try building it?";

  return `I’m holding onto your whole idea, not just the keywords I can normalize. I can already see that **${idea.slice(0, 220)}${idea.length > 220 ? "…" : ""}** contains more than a construction command—it carries choices about meaning, relationships, atmosphere, and what the world might communicate.${question}`;
}

async function persistOpeningSession(
  env: DiscordEnv,
  interaction: DiscordInteraction,
  sessionId: string,
  worldspecId: string,
  learnerTurnId: string,
  idea: string,
  interpretation: TurtleInterpretation,
  createdAt: string
) {
  if (!env.DB) return false;

  const learnerId = interaction.member?.user?.id ?? interaction.user?.id ?? null;
  const provenance = JSON.stringify({
    source: "discord",
    learner_explicit: true,
    turtle_inferred: false,
    raw_language_retained: true,
    research_dataset_consent: false
  });

  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO turtle_sessions (
          id, worldspec_id, created_at, updated_at, source,
          discord_guild_id, discord_channel_id, learner_id,
          status, visibility
        ) VALUES (?, ?, ?, ?, 'discord', ?, ?, ?, 'exploring', 'private')
      `).bind(
        sessionId,
        worldspecId,
        createdAt,
        createdAt,
        interaction.guild_id ?? null,
        interaction.channel_id ?? null,
        learnerId
      ),
      env.DB.prepare(`
        INSERT INTO turtle_turns (
          id, session_id, created_at, actor, raw_text,
          interpretation_json, worldspec_delta_json, provenance_json
        ) VALUES (?, ?, ?, 'learner', ?, ?, NULL, ?)
      `).bind(
        learnerTurnId,
        sessionId,
        createdAt,
        idea,
        JSON.stringify(interpretation),
        provenance
      ),
      env.DB.prepare(`
        INSERT INTO worldspec_revisions (
          id, worldspec_id, session_id, revision_number,
          created_at, created_by_turn_id, worldspec_json,
          delta_json, provenance_json
        ) VALUES (?, ?, ?, 1, ?, ?, ?, NULL, ?)
      `).bind(
        crypto.randomUUID(),
        worldspecId,
        sessionId,
        createdAt,
        learnerTurnId,
        JSON.stringify(interpretation.proposed_worldspec),
        provenance
      )
    ]);
    return true;
  } catch (error) {
    console.error("Turtle Lab opening persistence failed", error);
    return false;
  }
}

async function persistTurtleTurn(
  env: DiscordEnv,
  sessionId: string,
  text: string,
  modelLabel: string
) {
  if (!env.DB) return;
  const now = new Date().toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO turtle_turns (
          id, session_id, created_at, actor, raw_text,
          interpretation_json, worldspec_delta_json, provenance_json
        ) VALUES (?, ?, ?, 'turtle', ?, NULL, NULL, ?)
      `).bind(
        crypto.randomUUID(),
        sessionId,
        now,
        text,
        JSON.stringify({
          source: "turtle_conversation_engine",
          model: modelLabel,
          turtle_inferred: true,
          learner_explicit: false
        })
      ),
      env.DB.prepare(`UPDATE turtle_sessions SET updated_at = ? WHERE id = ?`).bind(now, sessionId)
    ]);
  } catch (error) {
    console.error("Turtle turn persistence failed", error);
  }
}

async function processTurtleCommand(
  env: DiscordEnv,
  interaction: DiscordInteraction,
  idea: string,
  interpret: (utterance: string) => TurtleInterpretation
) {
  const interpretation = interpret(idea);
  const handoff = buildMinecraftHandoff(interpretation, interaction);
  const sessionId = crypto.randomUUID();
  const worldspecId = crypto.randomUUID();
  const learnerTurnId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const stored = await persistOpeningSession(
    env,
    interaction,
    sessionId,
    worldspecId,
    learnerTurnId,
    idea,
    interpretation,
    createdAt
  );

  let conversation = fallbackConversation(idea, interpretation);
  let llmLabel = "deterministic fallback";

  try {
    const generated = await generateTurtleReply(env, {
      learner_text: idea,
      interpretation,
      session: {
        id: sessionId,
        worldspec_id: worldspecId,
        revision: 1
      }
    });
    if (generated.ok) {
      conversation = generated.text;
      llmLabel = generated.model;
    } else {
      console.warn("Turtle used fallback conversation", generated.reason);
    }
  } catch (error) {
    console.error("Turtle LLM processing error", error);
  }

  await persistTurtleTurn(env, sessionId, conversation, llmLabel);

  const storageLabel = stored
    ? "persistent WorldSpec revision 0001 saved"
    : "session IDs created; persistent D1 storage not active yet";

  const content = [
    "🐢 **Turtle**",
    conversation,
    "",
    `**Turtle Lab:** \`${sessionId}\` · **WorldSpec:** \`${worldspecId}\` · revision 0001`,
    `_Conversation engine: ${llmLabel}. ${storageLabel}. No Minecraft build has been executed._`,
    `_${handoff.status}: ${handoff.build_id}_`
  ].join("\n");

  await replaceOriginalInteraction(env, interaction, content);
}

export async function handleDiscordInteraction(
  request: Request,
  env: DiscordEnv,
  interpret: (utterance: string) => TurtleInterpretation,
  executionContext?: ExecutionContext
) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  if (!env.DISCORD_PUBLIC_KEY) return new Response("Discord public key is not configured", { status: 503 });

  const rawBody = await request.text();
  let verified = false;
  try {
    verified = await verifyDiscordRequest(request, env.DISCORD_PUBLIC_KEY, rawBody);
  } catch (error) {
    console.error("Discord signature verification error", error);
  }
  if (!verified) return new Response("Invalid request signature", { status: 401 });

  let interaction: DiscordInteraction;
  try {
    interaction = JSON.parse(rawBody) as DiscordInteraction;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (interaction.type === 1) return Response.json({ type: 1 });

  if (interaction.type !== 2 || interaction.data?.name !== "turtle") {
    return commandResponse("🐢 Turtle does not know that command yet.");
  }

  const idea = getStringOption(interaction, "idea");
  if (idea.length < 3) return commandResponse("🐢 Give Turtle an idea to think with. Example: `/turtle idea:make a bridge across the lake`");
  if (idea.length > 1800) return commandResponse("🐢 That idea is too long for the Discord command right now. Please keep it under 1,800 characters or continue in the Playground: https://turtleblockai.com/try/");

  const work = processTurtleCommand(env, interaction, idea, interpret);
  if (executionContext) {
    executionContext.waitUntil(work);
  } else {
    await work;
  }
  return deferredResponse();
}

export function minecraftStagingResponse(payload: unknown) {
  return Response.json({
    ok: false,
    status: "awaiting-minecraft-adapter",
    adapter: "minecraft-paper",
    message: "TurtleBlock can stage a WorldSpec build handoff, but no Minecraft server adapter is connected yet.",
    received: payload
  }, { status: 501 });
}
