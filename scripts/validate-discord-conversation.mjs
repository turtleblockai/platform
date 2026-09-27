import fs from "node:fs";

const discord = fs.readFileSync(new URL("../src/discord.ts", import.meta.url), "utf8");
const llm = fs.readFileSync(new URL("../src/turtleLLM.ts", import.meta.url), "utf8");

const requiredDiscord = [
  'surface: "discord"',
  'continuing: Boolean(existing)',
  'Turtle chat: ${engineMode}',
  'The richer Turtle chat model is unavailable on this turn',
  'engineMode: "model" | "fallback"',
  'fallbackReasonLabel(llmFailureCode)',
  'generated.reason_code'
];

const forbiddenDiscord = [
  'Turtle Lab:',
  'Ordinary thread messages become possible when the Discord Gateway listener is connected.',
  'I’m treating that as the next move in the same project',
  'I’m holding onto your whole idea, not just the keywords I can normalize'
];

const requiredLlm = [
  'reason_code: "configuration"',
  'reason_code: reasonCode',
  'reason_code: "network"',
  'Do not routinely recap the WorldSpec',
  'A reply does not need to end with a question.',
  'Discord conversation: answer/react first; no routine state recap; one useful thread at a time; zero or one question'
];

const failures = [];

for (const text of requiredDiscord) {
  if (!discord.includes(text)) failures.push(`discord.ts missing required contract: ${text}`);
}
for (const text of forbiddenDiscord) {
  if (discord.includes(text)) failures.push(`discord.ts contains retired chat behavior: ${text}`);
}
for (const text of requiredLlm) {
  if (!llm.includes(text)) failures.push(`turtleLLM.ts missing required contract: ${text}`);
}

if (failures.length) {
  console.error("Discord Turtle conversation regression failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Discord Turtle conversation regression passed.");
console.log("Invariant: model/fallback state and safe failure category are visible, fallback is honest, and Discord replies avoid routine state narration.");
