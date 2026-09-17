import { readFile } from "node:fs/promises";

const canonicalPath = "src/buildLog.ts";
const runtimePath = "public/assets/site-runtime.js";

const [canonical, runtime] = await Promise.all([
  readFile(canonicalPath, "utf8"),
  readFile(runtimePath, "utf8")
]);

const errors = [];
const requireText = (source, needle, label) => {
  if (!source.includes(needle)) errors.push(`${label} is missing '${needle}'`);
};

requireText(canonical, "waitAMinute?: WaitAMinuteConnection", "canonical Build Log contract");
requireText(canonical, "function waitAMinuteHtml", "canonical Build Log renderer");
requireText(canonical, 'class="waitaminute"', "canonical Build Log renderer");
requireText(canonical, "Evidence ·", "canonical Build Log renderer");
requireText(runtime, "e.waitAMinute", "direct-asset Build Log renderer");
requireText(runtime, 'class="waitaminute"', "direct-asset Build Log renderer");
requireText(runtime, "Evidence ·", "direct-asset Build Log renderer");

const connectionBlocks = [...canonical.matchAll(/waitAMinute:\s*\{([\s\S]*?)\n\s*\}/g)].map((match) => match[1]);
if (connectionBlocks.length < 1) errors.push("at least one evidence-backed Wait a minute connection must exist");

for (const [index, block] of connectionBlocks.entries()) {
  if (!/summary:\s*"[^"\n]+"/.test(block)) errors.push(`waitAMinute block ${index + 1} needs a non-empty summary`);
  const evidenceMatch = block.match(/evidence:\s*\[([^\]]+)\]/s);
  if (!evidenceMatch || !/["'][^"']+["']/.test(evidenceMatch[1])) errors.push(`waitAMinute block ${index + 1} needs at least one evidence pointer`);
}

const optionalField = /waitAMinute\?:/.test(canonical);
if (!optionalField) errors.push("Wait a minute must remain optional so older entries do not require retroactive filler");

if (/waitAMinute![:=]/.test(canonical)) errors.push("Wait a minute must not be made mandatory through a non-null assertion");

if (errors.length) {
  console.error("Build Log Wait a minute validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Build Log Wait a minute contract passed: ${connectionBlocks.length} evidence-backed connection(s) found.`);
console.log("Invariant: blank is valid; when a connection is surfaced it carries a concise summary and canonical evidence pointers in both render paths.");
