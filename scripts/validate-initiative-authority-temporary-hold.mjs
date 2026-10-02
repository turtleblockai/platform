import fs from "node:fs";

const suite = JSON.parse(fs.readFileSync(process.argv[2] || "worldspec/tests/initiative-authority-temporary-hold-cases.json", "utf8"));
const obj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const visible = (v) => typeof v === "string" && v.trim().length > 0;
const requiredReviewTriggers = new Set(["explicit_learner_resolution", "source_rule_change", "scope_end"]);

function merge(a, b) {
  if (!obj(a) || !obj(b)) return b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = obj(v) && obj(a[k]) ? merge(a[k], v) : v;
  return out;
}
function validate(x) {
  const errors = [];
  if (!obj(x) || x.version !== "0.1" || !visible(x.id) || !visible(x.conflict_ref)) errors.push("identity");

  const scope = x.scope;
  if (!obj(scope) || scope.kind !== "conflict_set" || !Array.isArray(scope.refs) || scope.refs.length < 2 ||
      scope.refs.some((ref) => !visible(ref)) || scope.generalized_person_scope !== false) errors.push("scope");
  if (!Array.isArray(x.source_rule_refs) || x.source_rule_refs.length < 2 || x.source_rule_refs.some((ref) => !visible(ref))) errors.push("source_rules");

  const reason = x.reason;
  if (!obj(reason) || reason.class !== "unresolved_scope_conflict" || !visible(reason.source_fixture_ref) || reason.machine_inferred_precedence !== false) errors.push("reason");

  const state = x.state;
  if (!obj(state) || !["active","replaced","expired","withdrawn"].includes(state.status)) errors.push("state");
  else if (state.status === "active") {
    if (state.strategy !== "do_less_until_human_resolution" || state.initiative_mode !== "quiet" ||
        state.resurfacing_allowed !== false || state.unsolicited_questions_allowed !== false ||
        state.delegated_action_authority !== "none" || state.expiry_reason !== null) errors.push("active_not_conservative");
  } else if (state.status === "replaced") {
    if (state.strategy !== "explicit_learner_resolution") errors.push("replacement_strategy");
  } else if (state.status === "expired") {
    if (state.strategy !== "hold_expired_recompute" || !["source_rule_change","scope_end"].includes(state.expiry_reason)) errors.push("expiry");
  }

  const t = x.temporality;
  if (!obj(t) || t.reusable_as_default !== false || t.survives_rule_change !== false || t.survives_scope_end !== false ||
      t.auto_carry_across_sessions !== false || !Array.isArray(t.review_triggers) ||
      [...requiredReviewTriggers].some((trigger) => !t.review_triggers.includes(trigger))) errors.push("temporality");
  if (obj(t) && state?.status === "active" && t.replacement_ref !== null) errors.push("active_replacement");
  if (obj(t) && ["replaced","expired"].includes(state?.status) && !visible(t.replacement_ref)) errors.push("missing_replacement_ref");

  const a = x.authority;
  if (!obj(a) || a.human_resolution_required !== true || a.creates_precedence !== false || a.creates_new_rule !== false) errors.push("authority");
  if (obj(a) && state?.status === "active" && a.resolver_actor_type !== "system") errors.push("active_resolver");
  if (obj(a) && state?.status === "replaced" && a.resolver_actor_type !== "learner") errors.push("replacement_resolver");

  const p = x.provenance;
  if (!obj(p) || p.reversible !== true || p.explainable_on_request !== true || p.raw_dialogue_copied !== false ||
      !["private","internal","unlisted","public"].includes(p.privacy_class) || !Array.isArray(p.canonical_pointers) ||
      p.canonical_pointers.length < 2 || p.canonical_pointers.some((ref) => !visible(ref))) errors.push("provenance");

  return [...new Set(errors)];
}

if (suite.schema !== "turtleblockai.initiative-authority-temporary-hold-cases.v0.1") throw new Error("unexpected suite schema");
let failures = 0, valid = 0, hostile = 0;
for (const tc of suite.cases) {
  const errors = validate(merge(suite.base_hold, tc.patch || {}));
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
console.log("Initiative Authority temporary-hold suite passed: 14 cases, 3 valid, 11 hostile.");
console.log("Invariant: restraint remains conflict-local, reversible, non-precedential, and replaceable by explicit learner resolution.");
