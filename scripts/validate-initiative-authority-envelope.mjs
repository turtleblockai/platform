import { readFile } from "node:fs/promises";
import process from "node:process";

const schemaPath = process.argv[2] || "worldspec/schema/initiative-authority-envelope.schema.json";
const casesPath = process.argv[3] || "worldspec/tests/initiative-authority-envelope-cases.json";

const REQUIRED_ACTIONS = [
  "go_quiet",
  "reduce_initiative",
  "stop_resurfacing",
  "retire_purpose",
  "revoke_delegation",
  "request_explanation",
  "restore_initiative"
];

const allowedModes = new Set(["quiet","responsive_only","situational","delegated_bounded"]);
const allowedDelegation = new Set(["none","bounded"]);
const allowedScopes = new Set(["project","branch","purpose"]);
const visible = (value) => typeof value === "string" && value.trim().length > 0;
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function deepMerge(base, patch) {
  if (!isObject(base) || !isObject(patch)) return patch;
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    out[key] = isObject(value) && isObject(base[key]) ? deepMerge(base[key], value) : value;
  }
  return out;
}

function inspectForSecretBearingFields(value, trail, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectForSecretBearingFields(item, `${trail}[${index}]`, errors));
    return;
  }
  if (!isObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (/(api.?key|access.?token|refresh.?token|password|credential|private.?key|secret.?value)/i.test(key)) {
      errors.push(`${trail}.${key} looks secret-bearing`);
    }
    inspectForSecretBearingFields(child, `${trail}.${key}`, errors);
  }
}

function validateAuthorityState(state, label, errors) {
  if (!isObject(state)) {
    errors.push(`${label} must be an object`);
    return;
  }
  if (!allowedModes.has(state.initiative_mode)) errors.push(`${label}.initiative_mode is invalid`);
  if (typeof state.resurfacing_allowed !== "boolean") errors.push(`${label}.resurfacing_allowed must be boolean`);
  if (typeof state.unsolicited_questions_allowed !== "boolean") errors.push(`${label}.unsolicited_questions_allowed must be boolean`);
  if (!allowedDelegation.has(state.delegated_action_authority)) errors.push(`${label}.delegated_action_authority is invalid`);
  if (!Array.isArray(state.active_purpose_refs) || state.active_purpose_refs.some((ref) => !visible(ref))) {
    errors.push(`${label}.active_purpose_refs must be visible canonical references`);
  }
}

function validateEnvelope(envelope, declaredActions) {
  const errors = [];
  if (!isObject(envelope)) return ["envelope must be an object"];
  if (envelope.version !== "0.1") errors.push("version must be 0.1");
  if (!visible(envelope.id)) errors.push("id must be visible");

  const scope = envelope.scope;
  if (!isObject(scope) || !allowedScopes.has(scope.kind) || !visible(scope.ref) || scope.generalized_person_scope !== false) {
    errors.push("authority scope must remain project, branch, or purpose bounded");
  }

  const directive = envelope.directive;
  if (!isObject(directive)) {
    errors.push("directive must be an object");
  } else {
    if (!declaredActions.has(directive.action)) errors.push("directive action must be declared by the Initiative Authority schema");
    if (directive.actor_type !== "learner" || directive.evidence_class !== "human_interaction" || directive.explicit_human_direction !== true) {
      errors.push("initiative authority directive must be learner-authored");
    }
    if (!visible(directive.directive_ref)) errors.push("directive_ref must be visible");
  }

  validateAuthorityState(envelope.authority_before, "authority_before", errors);
  validateAuthorityState(envelope.authority_after, "authority_after", errors);

  const explanation = envelope.explanation;
  if (!isObject(explanation)) errors.push("explanation must be an object");
  const restoration = envelope.restoration;
  if (!isObject(restoration)) errors.push("restoration must be an object");

  const provenance = envelope.provenance;
  if (!isObject(provenance)) {
    errors.push("provenance must be an object");
  } else {
    if (provenance.remembered_purpose_reactivates_authority !== false) errors.push("remembered purpose may not reactivate authority");
    if (provenance.relevance_inference_overrides_explicit_direction !== false) errors.push("relevance inference may not override explicit direction");
    if (provenance.collection_expansion_authorized !== false) errors.push("authority change may not authorize broader collection");
    if (provenance.generalized_personal_memory !== false) errors.push("initiative authority contract may not introduce generalized personal memory");
    if (provenance.production_self_modification !== false) errors.push("initiative authority contract may not authorize production self-modification");
    if (provenance.reversible !== true) errors.push("initiative authority changes must remain reversible");
  }

  if (isObject(directive) && isObject(envelope.authority_after)) {
    const after = envelope.authority_after;
    switch (directive.action) {
      case "go_quiet":
        if (after.initiative_mode !== "quiet" || after.resurfacing_allowed !== false || after.unsolicited_questions_allowed !== false || after.delegated_action_authority !== "none") {
          errors.push("go_quiet must remove unsolicited initiative, resurfacing, and delegated action authority");
        }
        break;
      case "reduce_initiative":
        if (!["quiet","responsive_only"].includes(after.initiative_mode) || after.unsolicited_questions_allowed !== false) {
          errors.push("reduce_initiative must end unsolicited questions and reduce initiative mode");
        }
        break;
      case "stop_resurfacing":
        if (after.resurfacing_allowed !== false) errors.push("stop_resurfacing must disable resurfacing");
        break;
      case "retire_purpose":
        if (!visible(directive.purpose_ref)) errors.push("retire_purpose requires a purpose_ref");
        if (visible(directive.purpose_ref) && after.active_purpose_refs.includes(directive.purpose_ref)) {
          errors.push("retired purpose must be removed from active purpose refs");
        }
        break;
      case "revoke_delegation":
        if (after.delegated_action_authority !== "none") errors.push("revoke_delegation must leave delegated action authority none");
        break;
      case "request_explanation":
        if (!isObject(explanation) || explanation.requested !== true || !visible(explanation.explanation_ref) || explanation.bounded_reference_only !== true || explanation.raw_dialogue_duplicated !== false) {
          errors.push("explanation must be bounded, reference-based, and requested");
        }
        break;
      case "restore_initiative":
        if (!isObject(restoration) || restoration.explicit_learner_request !== true || !visible(restoration.request_ref)) {
          errors.push("restoration requires an explicit learner request");
        }
        break;
    }
  }

  if (isObject(explanation) && explanation.raw_dialogue_duplicated !== false) errors.push("explanation must not duplicate raw dialogue");
  if (isObject(explanation) && explanation.bounded_reference_only !== true) errors.push("explanation must use bounded references");
  inspectForSecretBearingFields(envelope, "envelope", errors);
  return [...new Set(errors)];
}

const schema = JSON.parse(await readFile(schemaPath, "utf8"));
const suite = JSON.parse(await readFile(casesPath, "utf8"));

if (schema.version !== "0.1") throw new Error("Initiative Authority schema version must remain 0.1 for this suite");
const declaredActions = new Set(schema.actions || []);
for (const action of REQUIRED_ACTIONS) {
  if (!declaredActions.has(action)) throw new Error(`Schema is missing required action: ${action}`);
}
if (declaredActions.size !== REQUIRED_ACTIONS.length) throw new Error("Schema action set changed; review the semantic regression suite before accepting drift");
if (!Array.isArray(schema.rules) || schema.rules.length < 6) throw new Error("Schema must preserve its standing authority rules");
if (!isObject(suite.base_envelope) || !Array.isArray(suite.cases)) throw new Error("Regression suite must provide base_envelope and cases");

let failures = 0;
for (const testCase of suite.cases) {
  const envelope = deepMerge(suite.base_envelope, testCase.patch || {});
  const errors = validateEnvelope(envelope, declaredActions);
  const valid = errors.length === 0;
  const expected = testCase.expected_valid === true;
  const expectedErrorSatisfied = !testCase.expected_error || errors.some((error) => error.includes(testCase.expected_error));
  if (valid !== expected || !expectedErrorSatisfied) {
    failures += 1;
    console.error(`FAIL ${testCase.id}: expected_valid=${expected} actual_valid=${valid}`);
    if (testCase.expected_error && !expectedErrorSatisfied) console.error(`  missing expected error: ${testCase.expected_error}`);
    errors.forEach((error) => console.error(`  - ${error}`));
  } else {
    console.log(`PASS ${testCase.id}`);
  }
}

const validCount = suite.cases.filter((item) => item.expected_valid === true).length;
const hostileCount = suite.cases.length - validCount;
if (suite.cases.length !== 17 || validCount !== 7 || hostileCount !== 10) {
  throw new Error(`Expected 17 cases (7 valid, 10 hostile); found ${suite.cases.length} (${validCount} valid, ${hostileCount} hostile)`);
}
if (failures) process.exit(1);

console.log(`Initiative Authority semantic regression suite passed: ${suite.cases.length} cases, ${validCount} valid, ${hostileCount} hostile.`);
console.log("Invariant: explicit learner direction can contract or restore scoped Turtle initiative; remembered purpose, inferred relevance, synthetic actors, and collection expansion cannot silently acquire authority.");
