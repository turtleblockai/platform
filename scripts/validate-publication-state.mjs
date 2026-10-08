import { readFile } from "node:fs/promises";

const edgePath = "public/data/next-edge.json";
const narrativePath = "research/NEXT_EDGE.md";
const buildLogPath = "src/buildLog.ts";

const [edgeText, narrative, buildLog] = await Promise.all([
  readFile(edgePath, "utf8"),
  readFile(narrativePath, "utf8"),
  readFile(buildLogPath, "utf8")
]);

const errors = [];
let edge;
try {
  edge = JSON.parse(edgeText);
} catch (error) {
  console.error("Publication-state validation failed: Next Edge JSON is invalid.");
  console.error(error.message);
  process.exit(1);
}

const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const fail = (message) => errors.push(message);

if (!nonEmpty(edge.follows_build_log_entry_id)) {
  fail("Next Edge must declare follows_build_log_entry_id.");
} else if (!buildLog.includes(`id: "${edge.follows_build_log_entry_id}"`)) {
  fail(`Next Edge follows_build_log_entry_id '${edge.follows_build_log_entry_id}' is not present in src/buildLog.ts.`);
}

if (!nonEmpty(edge.title) || !nonEmpty(edge.question)) {
  fail("Next Edge title and question must both be non-empty.");
}

const marker = "## Current theoretical question";
const markerIndex = narrative.indexOf(marker);
if (markerIndex < 0) {
  fail("research/NEXT_EDGE.md is missing the Current theoretical question section.");
} else {
  const currentSection = narrative.slice(markerIndex);
  if (nonEmpty(edge.title) && !currentSection.includes(`**${edge.title}**`)) {
    fail("research/NEXT_EDGE.md current title does not match public/data/next-edge.json.");
  }
  if (nonEmpty(edge.question) && !currentSection.includes(edge.question)) {
    fail("research/NEXT_EDGE.md current question does not match public/data/next-edge.json.");
  }
}

if (!/^[0-9a-f]{40}$/i.test(edge.follows_commit || "")) {
  fail("Next Edge follows_commit must remain a full commit SHA.");
}

const buildLogArray = buildLog.match(/export const BUILD_LOG_ENTRIES: BuildLogEntry\[\] = \[([\s\S]*?)\n\];/);
if (!buildLogArray) {
  fail("Could not locate canonical Build Log array.");
} else {
  const dates = [...buildLogArray[1].matchAll(/date:\s*"([^"]+)"/g)].map((match) => match[1]);
  for (let i = 1; i < dates.length; i += 1) {
    if (Date.parse(dates[i]) > Date.parse(dates[i - 1])) {
      fail(`Build Log is not newest-first: '${dates[i]}' appears after '${dates[i - 1]}'.`);
    }
  }
}

if (errors.length) {
  console.error("Publication-state validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Publication state valid: ${edge.title}`);
console.log(`Question: ${edge.question}`);
console.log(`Follows Build Log entry: ${edge.follows_build_log_entry_id}`);
console.log("Invariant: completed history, narrative horizon, and public horizon identify the same canonical research state.");
