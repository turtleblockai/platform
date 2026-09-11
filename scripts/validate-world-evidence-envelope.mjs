import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "worldspec/tests/world-evidence-envelope-cases.json";
const allowedEventTypes = new Set(["world_state_change", "world_measurement", "simulation_result", "artifact_behavior"]);
const allowedInterpretationActors = new Set(["learner", "collaborator", "turtle", "synthetic_turtle"]);
const allowedInterpretationClasses = new Set(["human_interaction", "system_record", "synthetic_self_play"]);
const allowedRelations = new Set(["supports", "counters", "mixed", "inconclusive"]);
const allowedRelationStatus = new Set(["proposed", "held", "revised", "rejected"]);
const allowedInterpretationStatus = new Set(["proposed", "held", "revised", "rejected", "intentionally_plural"]);
const allowedPrivacy = new Set(["private", "internal", "unlisted", "public"]);

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

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

function validateEnvelope(envelope) {
  const errors = [];
  if (!isObject(envelope)) return ["envelope must be an object"];
  if (envelope.version !== "0.1") errors.push("version must be 0.1");
  if (typeof envelope.id !== "string" || !envelope.id.trim()) errors.push("id must be a non-empty string");
  if (typeof envelope.question_ref !== "string" || !envelope.question_ref.trim()) errors.push("question_ref must be visible");

  const event = envelope.world_event;
  if (!isObject(event)) {
    errors.push("world_event must be an object");
  } else {
    if (typeof event.id !== "string" || !event.id.trim()) errors.push("world_event.id must be visible");
    if (!allowedEventTypes.has(event.event_type)) errors.push("world_event.event_type is invalid");
    if (event.actor_type !== "world") errors.push("world_event.actor_type must be world");
    if (event.evidence_class !== "world_observation") errors.push("world_event.evidence_class must be world_observation");
    if (event.observation_only !== true) errors.push("world_event.observation_only must be true");
    if (!Array.isArray(event.facts) || event.facts.length === 0) errors.push("world_event.facts must contain at least one inspectable fact");
    else {
      for (const [index, fact] of event.facts.entries()) {
        if (!isObject(fact)) {
          errors.push(`world_event.facts[${index}] must be an object`);
          continue;
        }
        if (typeof fact.metric !== "string" || !fact.metric.trim()) errors.push(`world_event.facts[${index}].metric must be visible`);
        if (!("value" in fact)) errors.push(`world_event.facts[${index}].value must be present`);
      }
    }
    if (typeof event.source_ref !== "string" || !event.source_ref.trim()) errors.push("world_event.source_ref must be visible");
    for (const forbidden of ["verdict", "meaning", "relation", "supports", "counters", "judgment", "learner_feeling"]) {
      if (Object.prototype.hasOwnProperty.call(event, forbidden)) {
        errors.push(`world_event may report observations but may not contain ${forbidden}`);
      }
    }
  }

  const eventId = isObject(event) ? event.id : null;
  const interpretationById = new Map();
  if (!Array.isArray(envelope.interpretations)) {
    errors.push("interpretations must be an array");
  } else {
    for (const [index, interpretation] of envelope.interpretations.entries()) {
      const prefix = `interpretations[${index}]`;
      if (!isObject(interpretation)) {
        errors.push(`${prefix} must be an object`);
        continue;
      }
      if (typeof interpretation.id !== "string" || !interpretation.id.trim()) errors.push(`${prefix}.id must be visible`);
      else if (interpretationById.has(interpretation.id)) errors.push(`${prefix}.id must be unique`);
      else interpretationById.set(interpretation.id, interpretation);
      if (interpretation.event_id !== eventId) errors.push(`${prefix}.event_id must reference world_event.id`);
      if (!allowedInterpretationActors.has(interpretation.actor_type)) errors.push(`${prefix}.actor_type is invalid`);
      if (!allowedInterpretationClasses.has(interpretation.evidence_class)) errors.push(`${prefix}.evidence_class is invalid`);
      if (typeof interpretation.statement !== "string" || !interpretation.statement.trim()) errors.push(`${prefix}.statement must be visible`);
      if (!allowedInterpretationStatus.has(interpretation.status)) errors.push(`${prefix}.status is invalid`);
      if (interpretation.actor_type === "synthetic_turtle" && interpretation.evidence_class !== "synthetic_self_play") {
        errors.push(`${prefix}: synthetic_turtle interpretation must remain synthetic_self_play`);
      }
      if (["learner", "collaborator"].includes(interpretation.actor_type) && interpretation.evidence_class !== "human_interaction") {
        errors.push(`${prefix}: human interpretation must remain human_interaction`);
      }
      if (interpretation.actor_type === "turtle" && interpretation.evidence_class !== "system_record") {
        errors.push(`${prefix}: Turtle interpretation must remain system_record`);
      }
    }
  }

  if (!Array.isArray(envelope.criterion_relations)) {
    errors.push("criterion_relations must be an array");
  } else {
    for (const [index, relation] of envelope.criterion_relations.entries()) {
      const prefix = `criterion_relations[${index}]`;
      if (!isObject(relation)) {
        errors.push(`${prefix} must be an object`);
        continue;
      }
      if (typeof relation.criterion_id !== "string" || !relation.criterion_id.trim()) errors.push(`${prefix}.criterion_id must be visible`);
      if (!allowedRelations.has(relation.relation)) errors.push(`${prefix}.relation is invalid`);
      if (!allowedInterpretationActors.has(relation.assigned_by)) errors.push(`${prefix}.assigned_by must be an interpreting actor, never the world`);
      if (relation.status !== undefined && !allowedRelationStatus.has(relation.status)) errors.push(`${prefix}.status is invalid`);
      const interpretation = interpretationById.get(relation.interpretation_id);
      if (!interpretation) errors.push(`${prefix}.interpretation_id must reference a visible interpretation`);
      else if (relation.assigned_by !== interpretation.actor_type) errors.push(`${prefix}: assigned_by must match the referenced interpretation actor`);
    }
  }

  if (!isObject(envelope.provenance)) {
    errors.push("provenance must be an object");
  } else {
    if (!allowedPrivacy.has(envelope.provenance.privacy_class)) errors.push("provenance.privacy_class is invalid");
    if (envelope.provenance.world_is_final_authority !== false) errors.push("provenance.world_is_final_authority must be false");
    if (envelope.provenance.machine_final_authority !== false) errors.push("provenance.machine_final_authority must be false");
    if (envelope.provenance.reversible !== true) errors.push("provenance.reversible must be true");
    if (envelope.provenance.interpretation_authorship_visible !== true) errors.push("provenance.interpretation_authorship_visible must be true");
  }

  inspectForSecretBearingFields(envelope, "envelope", errors);
  return errors;
}

let suite;
try {
  suite = JSON.parse(await readFile(path, "utf8"));
} catch (error) {
  console.error(`World Evidence Envelope validation failed: could not read ${path}`);
  console.error(error.message);
  process.exit(1);
}

if (!Array.isArray(suite.cases) || suite.cases.length === 0) {
  console.error("World Evidence Envelope validation failed: no regression cases found");
  process.exit(1);
}

let failures = 0;
let validCases = 0;
let intentionallyInvalidCases = 0;
for (const testCase of suite.cases) {
  const errors = validateEnvelope(testCase.envelope);
  const actualValid = errors.length === 0;
  if (actualValid) validCases += 1;
  else intentionallyInvalidCases += 1;

  if (actualValid !== testCase.expected_valid) {
    failures += 1;
    console.error(`FAIL ${testCase.id}: expected_valid=${testCase.expected_valid}, actual_valid=${actualValid}`);
    for (const error of errors) console.error(`  - ${error}`);
    continue;
  }

  if (!actualValid && testCase.expected_error) {
    const matched = errors.some((error) => error.includes(testCase.expected_error));
    if (!matched) {
      failures += 1;
      console.error(`FAIL ${testCase.id}: expected error containing '${testCase.expected_error}'`);
      for (const error of errors) console.error(`  - ${error}`);
      continue;
    }
  }

  console.log(`PASS ${testCase.id}: ${actualValid ? "world fact and interpretation provenance stayed separate" : "hostile case rejected as intended"}`);
}

if (failures) {
  console.error(`World Evidence Envelope regression suite failed: ${failures} case(s) did not behave as expected.`);
  process.exit(1);
}

console.log(`World Evidence Envelope regression suite passed: ${suite.cases.length} cases (${validCases} valid, ${intentionallyInvalidCases} intentionally invalid).`);
console.log("Invariant: the world may report facts; interpretation and final judgment remain attributable and human-revisable.");
