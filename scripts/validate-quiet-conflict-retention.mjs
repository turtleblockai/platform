import fs from "node:fs";

const suite = JSON.parse(fs.readFileSync(process.argv[2] || "worldspec/tests/quiet-conflict-retention-cases.json", "utf8"));
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
  if (!obj(x) || x.version !== "0.1" || !visible(x.id) || !visible(x.conflict_ref) || !visible(x.scope_ref)) errors.push("identity");

  const retention = x.retention;
  if (!obj(retention) || !["quiet","surfaced","retired"].includes(retention.status) ||
      retention.unresolved_at_capture !== true || !visible(retention.canonical_pointer) ||
      retention.source_text_copied !== false || retention.carries_precedence !== false ||
      retention.carries_resolution !== false || retention.cross_scope_generalization !== false) errors.push("retention");

  const salience = x.salience;
  if (!obj(salience) || salience.notification_pending !== false ||
      salience.auto_resurface_on_session_start !== false || salience.auto_resurface_on_relevance !== false ||
      salience.auto_resurface_on_recency !== false || salience.machine_relevance_is_proposal !== true) errors.push("salience");

  const authority = x.return_authority;
  if (!obj(authority) || !["none","explicit_learner_request","active_learner_attention_rule","machine_proposal"].includes(authority.basis) ||
      typeof authority.authorized_to_surface !== "boolean") errors.push("authority");

  const lifecycle = x.lifecycle;
  if (!obj(lifecycle) || lifecycle.learner_can_inspect !== true || lifecycle.learner_can_mute !== true ||
      lifecycle.learner_can_retire !== true || lifecycle.auto_carry_salience_across_sessions !== false ||
      lifecycle.revalidate_on_source_rule_change !== true || lifecycle.revalidate_on_scope_change !== true) errors.push("lifecycle");

  const provenance = x.provenance;
  if (!obj(provenance) || !["private","internal","unlisted","public"].includes(provenance.privacy_class) ||
      provenance.source_text_copied !== false || provenance.new_collection_authorized !== false ||
      provenance.reversible !== true || !Array.isArray(provenance.canonical_pointers) || provenance.canonical_pointers.length < 2 ||
      provenance.canonical_pointers.some((ref) => !visible(ref))) errors.push("provenance");

  if (obj(retention) && obj(salience) && obj(authority)) {
    if (retention.status === "quiet") {
      if (salience.foregrounded !== false || authority.authorized_to_surface !== false) errors.push("quiet_must_stay_backgrounded");
    }
    if (retention.status === "retired") {
      if (salience.foregrounded !== false || authority.authorized_to_surface !== false || authority.basis !== "none" || authority.request_ref !== null) errors.push("retired_state");
    }
    if (retention.status === "surfaced") {
      if (salience.foregrounded !== true || authority.authorized_to_surface !== true) errors.push("surfaced_requires_authority");
      if (!["explicit_learner_request","active_learner_attention_rule"].includes(authority.basis)) errors.push("surfacing_basis");
      if (!visible(authority.request_ref)) errors.push("surfacing_request_ref");
    }
    if (authority.basis === "none" && authority.request_ref !== null) errors.push("none_basis_request_ref");
    if (authority.basis === "machine_proposal" && authority.authorized_to_surface !== false) errors.push("machine_proposal_no_surface_authority");
    if (["explicit_learner_request","active_learner_attention_rule","machine_proposal"].includes(authority.basis) && !visible(authority.request_ref)) errors.push("authority_pointer");
  }

  return [...new Set(errors)];
}

if (suite.schema !== "turtleblockai.quiet-conflict-retention-cases.v0.1") throw new Error("unexpected suite schema");
let failures = 0, valid = 0, hostile = 0;
for (const tc of suite.cases) {
  const errors = validate(merge(suite.base_retention, tc.patch || {}));
  const actual = errors.length === 0;
  const expected = tc.expected_valid === true;
  if (expected) valid += 1; else hostile += 1;
  if (actual !== expected) {
    failures += 1;
    console.error("FAIL " + tc.id + " expected=" + expected + " actual=" + actual + " errors=" + errors.join(","));
  } else console.log("PASS " + tc.id);
}
if (suite.cases.length !== 14 || valid !== 3 || hostile !== 11) throw new Error("unexpected case inventory");
if (failures) process.exit(1);
console.log("Quiet conflict retention suite passed: 14 cases, 3 valid, 11 hostile.");
console.log("Invariant: remembered conflict is returnable state, not permission to foreground, notify, or create precedence.");
