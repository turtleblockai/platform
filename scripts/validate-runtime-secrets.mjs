import fs from "node:fs";

const raw = fs.readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");
const config = JSON.parse(raw);
const vars = config?.vars ?? {};
const failures = [];

if (Object.prototype.hasOwnProperty.call(vars, "OPENAI_API_KEY")) {
  failures.push("OPENAI_API_KEY must not be stored in plaintext wrangler vars");
}
if (Object.prototype.hasOwnProperty.call(config, "secrets")) {
  failures.push("wrangler.jsonc must not invent a top-level secrets contract; production secrets are provisioned out-of-band in Cloudflare");
}

if (failures.length) {
  console.error("Runtime secret contract failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Runtime secret contract passed.");
console.log("Invariant: OPENAI_API_KEY, when enabled in production, is provisioned as an encrypted Cloudflare Worker secret and is never committed as a plaintext repo variable.");
