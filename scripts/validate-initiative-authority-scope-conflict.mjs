import fs from "node:fs";

const suite = JSON.parse(fs.readFileSync(process.argv[2] || "worldspec/tests/initiative-authority-scope-conflict-cases.json", "utf8"));
const obj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const visible = (v) => typeof v === "string" && v.trim().length > 0;
const allowedScopes = new Set(["project", "branch", "purpose"]);
const rank = { quiet: 0, responsive_only: 1, situational: 2, delegated_bounded: 3 };

function merge(a, b) {
  if (!obj(a) || !obj(b)) return b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = obj(v) && obj(a[k]) ? merge(a[k], v) : v;
  return out;
}
function sameState(a, b) {
  const fields = ["initiative_mode", "resurfacing_allowed", "unsolicited_questions_allowed", "delegated_action_authority"];
  return obj(a) && obj(b) && fields.every((k) => a[k] === b[k]) &&
    JSON.stringify([...(a.active_purpose_refs || [])].sort()) === JSON.stringify([...(b.active_purpose_refs || [])].sort());
}
function closed(rules, state) {
  if (!obj(state) || !rules.length) return false;
  const states = rules.map((r) => r.authority_state);
  if (states.some((s) => !obj(s))) return false;
  if ((rank[state.initiative_mode] ?? 99) > Math.min(...states.map((s) => rank[s.initiative_mode] ?? 99))) return false;
  if (state.resurfacing_allowed && states.some((s) => !s.resurfacing_allowed)) return false;
  if (state.unsolicited_questions_allowed && states.some((s) => !s.unsolicited_questions_allowed)) return false;
  if (state.delegated_action_authority === "bounded" && states.some((s) => s.delegated_action_authority !== "bounded")) return false;
  return true;
}
function validate(x) {
  const errors = [];
  const rules = Array.isArray(x.rules) ? x.rules : [];
  if (x.version !== "0.1") errors.push("version");
  if (rules.length < 2) errors.push("rule_count");
  const byRef = new Map();
  const scopeByRef = new Map();
  for (const rule of rules) {
    if (!obj(rule) || !visible(rule.rule_ref)) { errors.push("rule_ref"); continue; }
    const s = rule.scope;
    if (!obj(s) || !allowedScopes.has(s.kind) || !visible(s.ref) || s.generalized_person_scope !== false) errors.push("scope");
    else scopeByRef.set(rule.rule_ref, s.ref);
    const d = rule.directive;
    if (!obj(d) || d.actor_type !== "learner" || d.evidence_class !== "human_interaction" || d.explicit_human_direction !== true) errors.push("learner_direction");
    byRef.set(rule.rule_ref, rule.authority_state);
  }

  const r = x.resolution;
  if (!obj(r)) errors.push("resolution");
  else if (r.status === "unresolved") {
    if (r.strategy !== "do_less_until_human_resolution" || r.resolver_actor_type !== "system" ||
        r.explicit_human_resolution !== false || r.resolution_ref !== null ||
        !Array.isArray(r.precedence_rule_refs) || r.precedence_rule_refs.length ||
        !Array.isArray(r.mutated_scope_refs) || r.mutated_scope_refs.length ||
        r.inferred_precedence !== false || r.scope_local_only !== true) errors.push("unresolved_shape");
    if (!closed(rules, r.effective_state)) errors.push("unresolved_not_closed");
  } else if (r.status === "resolved") {
    if (r.strategy !== "explicit_learner_precedence" || r.resolver_actor_type !== "learner" ||
        r.explicit_human_resolution !== true || !visible(r.resolution_ref) ||
        !Array.isArray(r.precedence_rule_refs) || !r.precedence_rule_refs.length ||
        r.inferred_precedence !== false || r.scope_local_only !== true) errors.push("resolved_shape");
    else {
      const selected = r.precedence_rule_refs;
      if (selected.some((ref) => !byRef.has(ref))) errors.push("selected_rule");
      if (selected.length === 1 && !sameState(byRef.get(selected[0]), r.effective_state)) errors.push("selected_state");
      const allowed = new Set(selected.map((ref) => scopeByRef.get(ref)).filter(Boolean));
      if ((r.mutated_scope_refs || []).some((ref) => !allowed.has(ref))) errors.push("scope_mutation");
    }
  } else errors.push("status");

  const p = x.provenance;
  if (!obj(p)) errors.push("provenance");
  else {
    for (const [k, v] of Object.entries(p)) {
      if (k === "reversible") { if (v !== true) errors.push(k); }
      else if (typeof v === "boolean" && v !== false) errors.push(k);
    }
  }
  return [...new Set(errors)];
}

if (suite.schema !== "turtleblockai.initiative-authority-scope-conflict-cases.v0.1") throw new Error("unexpected suite schema");
let failures = 0, valid = 0, hostile = 0;
for (const tc of suite.cases) {
  const errors = validate(merge(suite.base_conflict, tc.patch || {}));
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
console.log("Initiative Authority scope-conflict suite passed: 14 cases, 3 valid, 11 hostile.");
console.log("Invariant: conflicting learner-authored scope rules either remain bounded and conservative or use explicit learner-selected precedence.");
