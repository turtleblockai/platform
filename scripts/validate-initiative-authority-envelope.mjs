import { readFile } from "node:fs/promises";

const path = process.argv[2] || "worldspec/tests/initiative-authority-envelope-cases.json";
const suite = JSON.parse(await readFile(path, "utf8"));

const base = () => ({
  scope: "project:market-world",
  prior: { mode: "situational", resurfacing: true, unsolicited: true, delegation: "none" },
  directive: { action: "go_quiet", scope: "project:market-world", actor: "learner", source_preserved: true, raw_dialogue_duplicated: false },
  turtle: { applied: true, claims_override: false, persuades_after_refusal: false, treats_as_preference: false, explanation_ref: null },
  result: { mode: "quiet", resurfacing: false, unsolicited: false, delegation: "none", quiet_until_reinvited: true, expires_automatically: false, human_reauthorization_required: true },
  provenance: { remembered_purpose_is_authority: false, relevance_may_override: false, machine_auto_restore: false, new_collection: false, raw_dialogue_required: false, generalized_profile_memory: false, production_mutation: false }
});

function fixture(id) {
  const x = base();
  if (id === "stop-one-question-resurfacing") { x.scope = "question:old-goal"; x.directive = {...x.directive, action:"stop_resurfacing", scope:x.scope}; x.result = {...x.result, mode:"situational", unsolicited:true, quiet_until_reinvited:false}; }
  if (id === "revoke-delegation") { x.scope = "delegation:build-42"; x.prior = {...x.prior, mode:"delegated_bounded", delegation:"bounded"}; x.directive = {...x.directive, action:"revoke_delegation", scope:x.scope}; x.result = {...x.result, mode:"responsive_only", resurfacing:true, quiet_until_reinvited:false}; }
  if (id === "reduce-unsolicited-initiative") { x.directive.action = "reduce_initiative"; x.result = {...x.result, mode:"responsive_only", resurfacing:true, quiet_until_reinvited:false}; }
  if (id === "request-explanation-no-state-change") { x.directive.action = "request_explanation"; x.turtle.explanation_ref = "explanation:nudge-17"; x.result = {...x.prior, quiet_until_reinvited:false, expires_automatically:false, human_reauthorization_required:false}; }
  if (id === "explicit-human-restoration") { x.prior = {mode:"quiet",resurfacing:false,unsolicited:false,delegation:"none"}; x.directive.action = "restore_initiative"; x.result = {mode:"situational",resurfacing:true,unsolicited:true,delegation:"none",quiet_until_reinvited:false,expires_automatically:false,human_reauthorization_required:false}; }
  if (id === "machine-vetoes-quieting") x.turtle.claims_override = true;
  if (id === "preference-laundering") x.turtle.treats_as_preference = true;
  if (id === "auto-expiring-quiet") x.result.expires_automatically = true;
  if (id === "stale-purpose-authority") x.provenance.remembered_purpose_is_authority = true;
  if (id === "relevance-overrides-refusal") x.provenance.relevance_may_override = true;
  if (id === "scope-mismatch") x.directive.scope = "project:other";
  if (id === "explanation-silently-changes-authority") { x.directive.action = "request_explanation"; x.turtle.explanation_ref = "explanation:nudge-18"; x.result = {...x.result, mode:"responsive_only", quiet_until_reinvited:false, human_reauthorization_required:false}; }
  if (id === "quiet-leaves-delegation-active") { x.prior.delegation = "bounded"; x.result.delegation = "bounded"; }
  if (id === "new-collection-from-revocation") x.provenance.new_collection = true;
  if (id === "raw-dialogue-copy-required") x.provenance.raw_dialogue_required = true;
  return x;
}

function sameAuthority(a,b) {
  return a.mode===b.mode && a.resurfacing===b.resurfacing && a.unsolicited===b.unsolicited && a.delegation===b.delegation;
}

function validate(x) {
  const errors = [];
  if (x.directive.actor !== "learner") errors.push("directive is not human-authored");
  if (x.directive.scope !== x.scope) errors.push("scope mismatch");
  if (!x.directive.source_preserved || x.directive.raw_dialogue_duplicated) errors.push("raw dialogue/source provenance violation");
  if (x.turtle.claims_override) errors.push("machine override");
  if (x.turtle.persuades_after_refusal) errors.push("persuasion after refusal");
  if (x.turtle.treats_as_preference) errors.push("preference feedback");
  if (x.result.expires_automatically) errors.push("automatic expiry");
  if (x.provenance.remembered_purpose_is_authority) errors.push("remembered purpose");
  if (x.provenance.relevance_may_override) errors.push("relevance inference");
  if (x.provenance.machine_auto_restore) errors.push("machine auto restore");
  if (x.provenance.new_collection) errors.push("new collection");
  if (x.provenance.raw_dialogue_required) errors.push("raw dialogue");
  if (x.provenance.generalized_profile_memory) errors.push("generalized profile memory");
  if (x.provenance.production_mutation) errors.push("production mutation");
  if (x.directive.action === "go_quiet") {
    if (x.result.mode !== "quiet" || x.result.resurfacing || x.result.unsolicited || !x.result.quiet_until_reinvited) errors.push("quiet state incomplete");
    if (x.result.delegation !== "none") errors.push("delegation remains");
    if (!x.result.human_reauthorization_required) errors.push("human reauthorization missing");
  }
  if (x.directive.action === "stop_resurfacing" && x.result.resurfacing) errors.push("resurfacing remains");
  if (x.directive.action === "revoke_delegation" && x.result.delegation !== "none") errors.push("delegation remains");
  if (x.directive.action === "reduce_initiative" && !(x.prior.unsolicited && !x.result.unsolicited)) errors.push("initiative not reduced");
  if (x.directive.action === "request_explanation") {
    if (!x.turtle.explanation_ref) errors.push("explanation missing");
    if (!sameAuthority(x.prior,x.result)) errors.push("explanation state change");
  }
  if (["go_quiet","stop_resurfacing","revoke_delegation","reduce_initiative"].includes(x.directive.action) && !x.result.human_reauthorization_required) errors.push("restriction can return without human reauthorization");
  return errors;
}

let failures = 0, valid = 0, hostile = 0;
for (const c of suite.cases) {
  const errors = validate(fixture(c.id));
  const actual = errors.length === 0;
  if (actual) valid++; else hostile++;
  if (actual !== c.expected_valid || (!actual && c.expected_error && !errors.some(e => e.includes(c.expected_error)))) {
    failures++;
    console.error(`FAIL ${c.id}: ${errors.join("; ") || "unexpected pass"}`);
  } else console.log(`PASS ${c.id}`);
}
if (failures) process.exit(1);
console.log(`Initiative Authority regression suite passed: ${suite.cases.length} cases (${valid} valid, ${hostile} intentionally invalid).`);
console.log("Invariant: explicit human quieting/revocation changes scoped Turtle authority; stale purpose or relevance cannot silently restore it.");
