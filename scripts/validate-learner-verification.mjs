import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "worldspec/tests/learner-verification-cases.json";
const allowedCriterionAuthors = new Set(["learner", "collaborator", "turtle_proposal"]);
const allowedHumanActors = new Set(["learner", "collaborator"]);
const allowedDecisionStates = new Set(["open", "provisional", "accepted", "rejected", "intentionally_plural"]);
const allowedEvidenceClasses = new Set(["human_interaction", "system_record", "world_observation", "external_source", "synthetic_self_play", "mixed"]);

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

function validateCard(card) {
  const errors = [];
  if (!isObject(card)) return ["card must be an object"];
  if (card.version !== "0.1") errors.push("version must be 0.1");
  if (typeof card.id !== "string" || !card.id.trim()) errors.push("id must be a non-empty string");

  if (!isObject(card.question) || typeof card.question.statement !== "string" || !card.question.statement.trim()) {
    errors.push("question.statement must be visible");
  }
  if (!isObject(card.question) || !allowedCriterionAuthors.has(card.question.authored_by)) {
    errors.push("question.authored_by must preserve learner/collaborator/Turtle-proposal provenance");
  }

  if (!Array.isArray(card.criteria) || card.criteria.length === 0) {
    errors.push("criteria must contain at least one visible criterion");
  } else {
    const ids = new Set();
    let humanCriterionCount = 0;
    for (const [index, criterion] of card.criteria.entries()) {
      const prefix = `criteria[${index}]`;
      if (!isObject(criterion)) {
        errors.push(`${prefix} must be an object`);
        continue;
      }
      if (typeof criterion.id !== "string" || !criterion.id.trim()) errors.push(`${prefix}.id must be visible`);
      else if (ids.has(criterion.id)) errors.push(`${prefix}.id must be unique`);
      else ids.add(criterion.id);
      if (typeof criterion.statement !== "string" || !criterion.statement.trim()) errors.push(`${prefix}.statement must be visible`);
      if (!allowedCriterionAuthors.has(criterion.authored_by)) errors.push(`${prefix}.authored_by is invalid`);
      if (allowedHumanActors.has(criterion.authored_by)) humanCriterionCount += 1;
      if (!new Set(["proposed", "accepted", "revised", "rejected"]).has(criterion.status)) errors.push(`${prefix}.status is invalid`);
      if (criterion.authored_by === "turtle_proposal" && criterion.status !== "proposed") {
        const acceptedByHuman = isObject(criterion.accepted_by) && allowedHumanActors.has(criterion.accepted_by.actor_type);
        if (!acceptedByHuman) errors.push(`${prefix}: turtle-proposed criterion cannot become ${criterion.status} without explicit human acceptance`);
      }
    }
    if (humanCriterionCount === 0) errors.push("at least one criterion must be human-authored");
  }

  const criterionIds = new Set(Array.isArray(card.criteria) ? card.criteria.map((criterion) => criterion?.id).filter(Boolean) : []);
  if (!Array.isArray(card.evidence)) {
    errors.push("evidence must be an array");
  } else {
    const evidenceIds = new Set();
    for (const [index, item] of card.evidence.entries()) {
      const prefix = `evidence[${index}]`;
      if (!isObject(item)) {
        errors.push(`${prefix} must be an object`);
        continue;
      }
      if (typeof item.id !== "string" || !item.id.trim()) errors.push(`${prefix}.id must be visible`);
      else if (evidenceIds.has(item.id)) errors.push(`${prefix}.id must be unique`);
      else evidenceIds.add(item.id);
      if (!Array.isArray(item.criterion_ids) || item.criterion_ids.length === 0) errors.push(`${prefix}.criterion_ids must link evidence to visible criteria`);
      else for (const id of item.criterion_ids) if (!criterionIds.has(id)) errors.push(`${prefix} references unknown criterion ${id}`);
      if (typeof item.statement !== "string" || !item.statement.trim()) errors.push(`${prefix}.statement must be visible`);
      if (!allowedEvidenceClasses.has(item.evidence_class)) errors.push(`${prefix}.evidence_class is invalid`);
      if (item.actor_type === "synthetic_turtle" && item.evidence_class !== "synthetic_self_play") {
        errors.push(`${prefix}: synthetic_turtle evidence must remain synthetic_self_play`);
      }
      if (item.evidence_class === "synthetic_self_play" && item.actor_type !== "synthetic_turtle") {
        errors.push(`${prefix}: synthetic_self_play evidence must identify synthetic_turtle provenance`);
      }
      if (!["supports", "counters", "mixed", "inconclusive"].includes(item.relation)) errors.push(`${prefix}.relation is invalid`);
      if (!["learner", "collaborator", "turtle", "synthetic_turtle"].includes(item.interpreted_by)) errors.push(`${prefix}.interpreted_by must remain visible`);
    }
  }

  if (!allowedDecisionStates.has(card.decision_status)) errors.push("decision_status is invalid");
  if (!isObject(card.reflection)) errors.push("reflection must remain an inspectable object even when empty");

  if (!isObject(card.provenance)) {
    errors.push("provenance must be an object");
  } else {
    if (!["human_interaction", "mixed"].includes(card.provenance.evidence_class)) errors.push("provenance.evidence_class must be human_interaction or mixed");
    if (!["private", "internal", "unlisted", "public"].includes(card.provenance.privacy_class)) errors.push("provenance.privacy_class is invalid");
    if (card.provenance.criteria_authorship_visible !== true) errors.push("provenance.criteria_authorship_visible must be true");
    if (card.provenance.machine_final_authority !== false) errors.push("provenance.machine_final_authority must be false");
    if (card.provenance.reversible !== true) errors.push("provenance.reversible must be true");
  }

  inspectForSecretBearingFields(card, "card", errors);
  return errors;
}

let suite;
try {
  suite = JSON.parse(await readFile(path, "utf8"));
} catch (error) {
  console.error(`Learner Verification validation failed: could not read ${path}`);
  console.error(error.message);
  process.exit(1);
}

if (!Array.isArray(suite.cases) || suite.cases.length === 0) {
  console.error("Learner Verification validation failed: no regression cases found");
  process.exit(1);
}

let failures = 0;
let validCases = 0;
let intentionallyInvalidCases = 0;
for (const testCase of suite.cases) {
  const errors = validateCard(testCase.card);
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

  console.log(`PASS ${testCase.id}: ${actualValid ? "valid learner verification trace" : "hostile case rejected as intended"}`);
}

if (failures) {
  console.error(`Learner Verification regression suite failed: ${failures} case(s) did not behave as expected.`);
  process.exit(1);
}

console.log(`Learner Verification regression suite passed: ${suite.cases.length} cases (${validCases} valid, ${intentionallyInvalidCases} intentionally invalid).`);
console.log("Invariant: human-authored criteria and provenance stay visible; Turtle has no final authority.");
