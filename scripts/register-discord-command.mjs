const applicationId = process.env.DISCORD_APPLICATION_ID || "1544175868471943279";
const guildId = process.env.DISCORD_GUILD_ID;
const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error("Missing DISCORD_BOT_TOKEN. Export it in your shell; do not commit it.");
  process.exit(1);
}

const command = {
  name: "turtle",
  description: "Think with Turtle and stage an idea as WorldSpec for Minecraft.",
  type: 1,
  options: [
    {
      name: "idea",
      description: "What do you want to make, change, test, or understand?",
      type: 3,
      required: true,
      max_length: 1800
    }
  ]
};

const route = guildId
  ? `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`
  : `https://discord.com/api/v10/applications/${applicationId}/commands`;

const response = await fetch(route, {
  method: "POST",
  headers: {
    Authorization: `Bot ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(command)
});

const body = await response.text();
if (!response.ok) {
  console.error(`Discord returned ${response.status}: ${body}`);
  process.exit(1);
}

const registered = JSON.parse(body);
console.log(`Registered /${registered.name} (${registered.id}) ${guildId ? `in guild ${guildId}` : "globally"}.`);
