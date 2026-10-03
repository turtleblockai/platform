import fs from "node:fs";

const suite = JSON.parse(fs.readFileSync(process.argv[2] || "worldspec/tests/conflict-explanation-cases.json", "utf8"));
const obj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const visible = (v) => typeof v === "string" && v.trim().length > 0;

function merge(a, b) {
  if (!obj(a) || !obj(b)) return b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = obj(v) && obj(a[k]) ? merge(a[k], v) : v;
  return out;
}

function sameMembers(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const aa = [...a].sort();
  const bb = [...b].sort();
  return aa.every((value, i) => value === bb[i]);
}

function validate(x) {
  const errors = [];
  if (!obj(x) || x.version !== "0.1" || !visible(x.id) || !visible(x.hold_ref) || !visible(x.conflict_ref)) errors.push("identity");

  const refs = x.source_rule_refs;
  if (!Array.isArray(refs) || refs.length < 2 || refs.some((ref) => !visible(ref)) || new Set(refs).size !== refs.length) errors.push("source_rules");

  const p = x.presentation;
  if (!obj(p) || p.mode !== "non_directive" || p.order_basis !== "canonical_ref" ||
      p.equal_visual_weight !== true || p.source_fields_symmetric !== true ||
      !Array.isArray(p.ordered_rule_refs) || !sameMembers(refs, p.ordered_rule_refs) ||
      p.ordered_rule_refs.some((ref, i, arr) => i > 0 && arr[i - 1].localeCompare(ref) > 0) ||
      !Array.isArray(p.hidden_rule_refs) || p.hidden_rule_refs.length !== 0 ||
      !Array.isArray(p.collapsed_rule_refs) || p.collapsed_rule_refs.length !== 0) errors.push("presentation");

  const f = x.framing;
  if (!obj(f) || f.recommended_rule_ref !== null || f.default_rule_ref !== null ||
      f.winner_language_used !== false || f.specificity_hint_used !== false ||
      f.recency_hint_used !== false || f.relevance_hint_used !== false ||
      f.uncertainty_visible !== true) errors.push("framing");

  const i = x.inspection;
  if (!obj(i) || (i.inspected_rule_ref !== null && !refs?.includes(i.inspected_rule_ref)) ||
      i.inspection_changes_priority !== false) errors.push("inspection");

  const r = x.resolution;
  if (!obj(r) || r.learner_resolution_required !== true || r.defer_allowed !== true ||
      r.resolution_written !== false || r.mutates_rule_state !== false) errors.push("resolution");

  const prov = x.provenance;
  if (!obj(prov) || !["private","internal","unlisted","public"].includes(prov.privacy_class) ||
      prov.source_payload_copied !== false || !Array.isArray(prov.canonical_pointers) ||
      prov.canonical_pointers.length < 2 || prov.canonical_pointers.some((ref) => !visible(ref))) errors.push("provenance");

  return [...new Set(errors)];
}

if (suite.schema !== "turtleblockai.conflict-explanation-cases.v0.1") throw new Error("unexpected suite schema");

let failures = 0;
let valid = 0;
let hostile = 0;

for (const tc of suite.cases) {
  const errors = validate(merge(suite.base_explanation, tc.patch || {}));
  const actual = errors.length === 0;
  const expected = tc.expected_valid === true;
  if (expected) valid += 1;
  else hostile += 1;
  if (actual !== expected) {
    failures += 1;
    console.error("FAIL " + tc.id + " expected=" + expected + " actual=" + actual + " errors=" + errors.join(","));
  } else {
    console.log("PASS " + tc.id);
  }
}

if (suite.cases.length !== 14 || valid !== 3 || hostile !== 11) throw new Error("unexpected case inventory");
if (failures) process.exit(1);

console.log("Conflict explanation suite passed: 14 cases, 3 valid, 11 hostile.");
console.log("Invariant: explanation can expose a conflict without ranking, hiding, defaulting, or mutating learner-authored rules.");
