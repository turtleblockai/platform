import fs from "node:fs";

const suite = JSON.parse(fs.readFileSync(process.argv[2] || "worldspec/tests/resurfacing-authority-cases.json", "utf8"));
const obj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const visible = (v) => typeof v === "string" && v.trim().length > 0;

function merge(a, b) {
  if (!obj(a) || !obj(b)) return b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = obj(v) && obj(a[k]) ? merge(a[k], v) : v;
  return out;
}

function validate(x) {
  const errors = [];
  if (!obj(x) || x.version !== "0.1" || !visible(x.id) || !visible(x.retained_context_ref)) errors.push("identity");

  const scope = x.scope;
  if (!obj(scope) || !["project","branch","purpose"].includes(scope.kind) || !visible(scope.ref) || scope.generalized_person_scope !== false) errors.push("scope");

  const relevance = x.relevance;
  if (!obj(relevance) || relevance.status !== "noticed" || !["turtle","system"].includes(relevance.assessed_by) ||
      relevance.evidence_class !== "system_record" || !visible(relevance.rationale) ||
      relevance.grants_resurfacing_authority !== false || relevance.score_controls_action !== false) errors.push("relevance");

  const authority = x.authority;
  if (!obj(authority) || !["none","learner_watchpoint","explicit_learner_request"].includes(authority.basis) ||
      !visible(authority.scope_ref) || authority.auto_carry_across_sessions !== false ||
      authority.machine_can_upgrade !== false || typeof authority.active !== "boolean") errors.push("authority");

  const decision = x.decision;
  if (!obj(decision) || !["remain_quiet","surface_now"].includes(decision.action) ||
      typeof decision.interruptive !== "boolean" || !["learner","none"].includes(decision.delivery_audience) ||
      !visible(decision.reason) || decision.status !== "executed") errors.push("decision");

  if (obj(decision) && decision.action === "surface_now") {
    const learnerAuthority = obj(authority) &&
      ["learner_watchpoint","explicit_learner_request"].includes(authority.basis) &&
      authority.authored_by === "learner" && visible(authority.authority_ref) &&
      authority.active === true && authority.scope_ref === scope?.ref;
    if (!learnerAuthority) errors.push("surface_requires_active_learner_authority");
    if (decision.interruptive !== false) errors.push("resurfacing_is_not_interruption_authority");
    if (decision.delivery_audience !== "learner") errors.push("surface_audience");
  } else if (obj(decision)) {
    if (decision.interruptive !== false || decision.delivery_audience !== "none") errors.push("quiet_decision_shape");
  }

  const hb = x.human_boundary;
  if (!obj(hb) || hb.availability_inferred !== false || hb.receptivity_inferred !== false ||
      hb.silence_is_permission !== false || hb.learner_can_mute !== true || hb.learner_can_revoke !== true) errors.push("human_boundary");

  const p = x.provenance;
  if (!obj(p) || p.raw_dialogue_copied !== false || p.new_collection_authorized !== false ||
      p.reversible !== true || !["private","internal","unlisted","public"].includes(p.privacy_class) ||
      !Array.isArray(p.canonical_pointers) || p.canonical_pointers.length < 2 ||
      p.canonical_pointers.some((ref) => !visible(ref))) errors.push("provenance");

  return [...new Set(errors)];
}

if (suite.schema !== "turtleblockai.resurfacing-authority-cases.v0.1") throw new Error("unexpected suite schema");

let failures = 0;
let valid = 0;
let hostile = 0;
for (const tc of suite.cases) {
  const errors = validate(merge(suite.base_decision, tc.patch || {}));
  const actual = errors.length === 0;
  const expected = tc.expected_valid === true;
  if (expected) valid += 1; else hostile += 1;
  if (actual !== expected) {
    failures += 1;
    console.error("FAIL " + tc.id + " expected=" + expected + " actual=" + actual + " errors=" + errors.join(","));
  } else {
    console.log("PASS " + tc.id);
  }
}

if (suite.cases.length !== 14 || valid !== 3 || hostile !== 11) throw new Error("unexpected case inventory");
if (failures) process.exit(1);
console.log("Resurfacing Authority suite passed: 14 cases, 3 valid, 11 hostile.");
console.log("Invariant: relevance may justify noticing, but returning retained context to the learner foreground requires active learner-authored authority.");
