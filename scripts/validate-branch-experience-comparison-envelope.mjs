import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "worldspec/tests/branch-experience-comparison-envelope-cases.json";
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function actorEvidenceErrors(actor, evidenceClass, prefix, errors) {
  if (["learner", "collaborator", "human_group"].includes(actor) && evidenceClass !== "human_interaction") {
    errors.push(`${prefix}: human actor must remain human_interaction`);
  }
  if (["turtle", "system"].includes(actor) && evidenceClass !== "system_record") {
    errors.push(`${prefix}: Turtle/system actor must remain system_record`);
  }
  if (actor === "synthetic_turtle" && evidenceClass !== "synthetic_self_play") {
    errors.push(`${prefix}: synthetic_turtle must remain synthetic_self_play`);
  }
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

function validateEnvelope(envelope) {
  const errors = [];
  if (!isObject(envelope)) return ["envelope must be an object"];
  if (envelope.version !== "0.1") errors.push("version must be 0.1");
  if (typeof envelope.id !== "string" || !envelope.id.trim()) errors.push("id must be visible");
  if (typeof envelope.question_ref !== "string" || !envelope.question_ref.trim()) errors.push("question_ref must be visible");
  if (typeof envelope.source_translation_ref !== "string" || !envelope.source_translation_ref.trim()) errors.push("source_translation_ref must be visible");

  const branches = Array.isArray(envelope.branches) ? envelope.branches : [];
  if (branches.length < 2) errors.push("at least two branches are required");
  const branchRefs = new Set();
  for (const branch of branches) {
    if (!isObject(branch)) {
      errors.push("branch must be an object");
      continue;
    }
    const ref = typeof branch.branch_ref === "string" ? branch.branch_ref.trim() : "";
    if (!ref) errors.push("branch_ref must be visible");
    else if (branchRefs.has(ref)) errors.push("branch_ref values must be unique");
    else branchRefs.add(ref);
    if (branch.canonical !== false) errors.push("branch may not be canonical");
    if (branch.origin === "human_perturbation" && (typeof branch.source_human_response_ref !== "string" || !branch.source_human_response_ref.trim())) {
      errors.push("human_perturbation branch must preserve its source human response");
    }
  }

  const evidence = Array.isArray(envelope.world_evidence) ? envelope.world_evidence : [];
  if (!evidence.length) errors.push("at least one world evidence reference is required");
  for (const item of evidence) {
    if (!isObject(item)) {
      errors.push("world evidence item must be an object");
      continue;
    }
    if (!branchRefs.has(item.branch_ref)) errors.push("world evidence must reference a declared branch");
    if (item.evidence_class !== "world_observation") errors.push("world evidence must remain world_observation");
    if (item.facts_duplicated !== false) errors.push("branch comparison must reference rather than duplicate world facts");
    if (item.world_judgment !== false) errors.push("world evidence may not become a judgment");
  }

  const criteria = Array.isArray(envelope.criteria) ? envelope.criteria : [];
  const activeCriteria = new Map();
  for (const criterion of criteria) {
    if (!isObject(criterion)) {
      errors.push("criterion must be an object");
      continue;
    }
    if (!['learner','collaborator','human_group'].includes(criterion.authored_by)) errors.push("criterion must be human-authored");
    if (criterion.evidence_class !== "human_interaction") errors.push("criterion must remain human_interaction");
    if (typeof criterion.criterion_ref !== "string" || !criterion.criterion_ref.trim()) errors.push("criterion_ref must be visible");
    if (typeof criterion.purpose_ref !== "string" || !criterion.purpose_ref.trim()) errors.push("criterion purpose_ref must be visible");
    if (criterion.status === "active" && typeof criterion.criterion_ref === "string") activeCriteria.set(criterion.criterion_ref, criterion);
  }

  const reflections = Array.isArray(envelope.reflections) ? envelope.reflections : [];
  for (const reflection of reflections) {
    if (!isObject(reflection)) {
      errors.push("reflection must be an object");
      continue;
    }
    if (reflection.evidence_class !== "human_interaction") errors.push("reflection must remain human_interaction");
    if (reflection.canonical_source_preserved !== true) errors.push("human reflection source must remain canonical");
    if (!Array.isArray(reflection.branch_refs) || !reflection.branch_refs.length) errors.push("reflection must reference at least one branch");
    else for (const ref of reflection.branch_refs) if (!branchRefs.has(ref)) errors.push("reflection must reference declared branches");
  }

  const comparison = envelope.comparison;
  if (!isObject(comparison)) {
    errors.push("comparison must be an object");
  } else {
    actorEvidenceErrors(comparison.actor_type, comparison.evidence_class, "comparison", errors);
    if (comparison.winner_required !== false) errors.push("comparison may not require a winner");
    if (comparison.canonical_branch_ref !== null) errors.push("comparison may not select a canonical branch");
    if (comparison.merge_required !== false) errors.push("comparison may not require merge");
    if (comparison.machine_final_authority !== false) errors.push("machine may not have final comparison authority");
    if (comparison.learning_claim !== false) errors.push("comparison may not claim learner learning");
    if (comparison.actor_type === "synthetic_turtle" && comparison.status !== "proposed") errors.push("synthetic_turtle comparison must remain a proposal");
    const relations = Array.isArray(comparison.criterion_relations) ? comparison.criterion_relations : [];
    for (const relation of relations) {
      if (!isObject(relation)) {
        errors.push("criterion relation must be an object");
        continue;
      }
      if (!activeCriteria.has(relation.criterion_ref)) errors.push("criterion relation must reference a declared active human criterion");
      if (!branchRefs.has(relation.branch_ref)) errors.push("criterion relation must reference a declared branch");
    }
  }

  const provenance = envelope.provenance;
  if (!isObject(provenance)) {
    errors.push("provenance must be an object");
  } else {
    if (provenance.branch_histories_preserved !== true) errors.push("branch histories must remain preserved");
    if (provenance.human_source_recoverable !== true) errors.push("human source must remain recoverable");
    if (provenance.world_is_final_authority !== false) errors.push("world may not become final authority");
    if (provenance.easy_metric_is_authority !== false) errors.push("easy metric may not become authority");
    if (provenance.human_purpose_governs_metric_relevance !== true) errors.push("human purpose must govern metric relevance");
    if (provenance.synthetic_production_authority !== false) errors.push("synthetic activity may not gain production authority");
    if (provenance.comparison_reversible !== true) errors.push("comparison must remain reversible");
    if (provenance.forced_convergence_authorized !== false) errors.push("forced convergence may not be authorized");
  }

  inspectForSecretBearingFields(envelope, "envelope", errors);
  return errors;
}

let suite;
try {
  suite = JSON.parse(await readFile(path, "utf8"));
} catch (error) {
  console.error(`Branch Experience Comparison validation failed: could not read ${path}`);
  console.error(error.message);
  process.exit(1);
}

if (!Array.isArray(suite.cases) || suite.cases.length === 0) {
  console.error("Branch Experience Comparison validation failed: no regression cases found");
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

  if (!actualValid && testCase.expected_error && !errors.some((error) => error.includes(testCase.expected_error))) {
    failures += 1;
    console.error(`FAIL ${testCase.id}: expected error containing '${testCase.expected_error}'`);
    for (const error of errors) console.error(`  - ${error}`);
    continue;
  }

  console.log(`PASS ${testCase.id}: ${actualValid ? "branch difference survived comparison" : "hostile branch-comparison case rejected as intended"}`);
}

if (failures) {
  console.error(`Branch Experience Comparison regression suite failed: ${failures} case(s) did not behave as expected.`);
  process.exit(1);
}

console.log(`Branch Experience Comparison regression suite passed: ${suite.cases.length} cases (${validCases} valid, ${intentionallyInvalidCases} intentionally invalid).`);
console.log("Invariant: construction and measurement may create evidence, but neither the world nor the machine gets to turn evidence into a canonical branch truth.");
