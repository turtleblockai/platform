import fs from "node:fs";

const raw = fs.readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");
const config = JSON.parse(raw);
const required = config?.secrets?.required ?? [];
const vars = config?.vars ?? {};

const failures = [];
if (!Array.isArray(required) || !required.includes("OPENAI_API_KEY")) {
  failures.push("wrangler.jsonc must declare OPENAI_API_KEY in secrets.required");
}
if (Object.prototype.hasOwnProperty.call(vars, "OPENAI_API_KEY")) {
  failures.push("OPENAI_API_KEY must not be stored in plaintext vars");
}

if (failures.length) {
  console.error("Runtime secret contract failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Runtime secret contract passed.");
console.log("Invariant: production Turtle chat requires OPENAI_API_KEY as an encrypted Worker secret, never a plaintext repo var.");
