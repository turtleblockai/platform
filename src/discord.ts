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

export type DiscordEnv = {
  DISCORD_PUBLIC_KEY?: string;
  DISCORD_APPLICATION_ID?: string;
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

function shortJson(value: unknown, max = 700) {
  const text = JSON.stringify(value, null, 2);
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
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

export async function handleDiscordInteraction(
  request: Request,
  env: DiscordEnv,
  interpret: (utterance: string) => TurtleInterpretation
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

  const interpretation = interpret(idea);
  const handoff = buildMinecraftHandoff(interpretation, interaction);
  const next = interpretation.needs_clarification && interpretation.clarification_question
    ? `\n\n**Turtle asks:** ${interpretation.clarification_question}`
    : "\n\n**Turtle:** I have enough to stage a provisional WorldSpec.";

  const content = [
    `🐢 **TurtleBlock AI**`,
    `**Mode:** ${interpretation.mode}`,
    next.trim(),
    `\n**Minecraft handoff:** \`${handoff.build_id}\` → \`${handoff.adapter}\``,
    `_Status: ${handoff.status}. Nothing has been sent to a Minecraft server yet._`,
    `\n**WorldSpec preview**\n\`\`\`json\n${shortJson(interpretation.proposed_worldspec)}\n\`\`\``,
    `Continue in the Playground: https://turtleblockai.com/try/`,
    `Discord interactions are not automatically added to the research dataset.`
  ].join("\n");

  return commandResponse(content.slice(0, 1950));
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
