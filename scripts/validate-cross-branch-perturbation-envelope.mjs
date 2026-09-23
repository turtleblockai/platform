import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "worldspec/tests/cross-branch-perturbation-envelope-cases.json";
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const humanActors = new Set(["learner", "collaborator", "human_group"]);
const visible = (value) => typeof value === "string" && value.trim().length > 0;

function actorEvidenceErrors(actor, evidenceClass, prefix, errors) {
  if (humanActors.has(actor) && evidenceClass !== "human_interaction") errors.push(`${prefix}: human actor must remain human_interaction`);
  if (actor === "turtle" && evidenceClass !== "system_record") errors.push(`${prefix}: Turtle actor must remain system_record`);
  if (actor === "synthetic_turtle" && evidenceClass !== "synthetic_self_play") errors.push(`${prefix}: synthetic_turtle must remain synthetic_self_play`);
  if (actor === "world" && evidenceClass !== "world_observation") errors.push(`${prefix}: world actor must remain world_observation`);
}
function inspectForSecretBearingFields(value, trail, errors) {
  if (Array.isArray(value)) return value.forEach((item, index) => inspectForSecretBearingFields(item, `${trail}[${index}]`, errors));
  if (!isObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (/(api.?key|access.?token|refresh.?token|password|credential|private.?key|secret.?value)/i.test(key)) errors.push(`${trail}.${key} looks secret-bearing`);
    inspectForSecretBearingFields(child, `${trail}.${key}`, errors);
  }
}
function validateEnvelope(envelope) {
  const errors = [];
  if (!isObject(envelope)) return ["envelope must be an object"];
  if (envelope.version !== "0.1") errors.push("version must be 0.1");
  if (!visible(envelope.id)) errors.push("id must be visible");
  const source = envelope.source_branch, target = envelope.target_branch;
  if (!isObject(source)) errors.push("source_branch must be an object");
  if (!isObject(target)) errors.push("target_branch must be an object");
  if (isObject(source)) {
    if (!visible(source.branch_ref)) errors.push("source branch_ref must be visible");
    if (!visible(source.worldspec_revision_ref)) errors.push("source worldspec_revision_ref must be visible");
    if (source.history_preserved !== true) errors.push("source branch history must remain preserved");
    if (source.origin === "human_perturbation" && !visible(source.source_human_response_ref)) errors.push("human_perturbation source branch must preserve its upstream human response");
  }
  if (isObject(target)) {
    if (!visible(target.branch_ref)) errors.push("target branch_ref must be visible");
    if (!visible(target.worldspec_revision_ref)) errors.push("target worldspec_revision_ref must be visible");
    if (!humanActors.has(target.owner_type)) errors.push("target branch must remain human-owned");
    if (target.history_preserved !== true) errors.push("target branch history must remain preserved");
  }
  if (isObject(source) && isObject(target) && visible(source.branch_ref) && source.branch_ref === target.branch_ref) errors.push("source and target branches must remain distinct");

  const perturbation = envelope.perturbation;
  if (!isObject(perturbation)) errors.push("perturbation must be an object");
  else {
    if (!["question","observation","constraint"].includes(perturbation.kind)) errors.push("perturbation kind must be question, observation, or constraint");
    if (!visible(perturbation.content_ref)) errors.push("perturbation content_ref must be visible");
    actorEvidenceErrors(perturbation.source_actor_type, perturbation.evidence_class, "perturbation", errors);
    if (!isObject(source) || perturbation.source_branch_ref !== source.branch_ref) errors.push("perturbation must point to the declared source branch");
    if (perturbation.source_recoverable !== true) errors.push("perturbation source must remain recoverable");
    if (perturbation.raw_source_duplicated !== false) errors.push("cross-branch transfer must reference rather than duplicate raw source material");
    if (perturbation.claims_correction !== false) errors.push("perturbation may not claim that the source branch corrected the target");
    if (perturbation.claims_truth !== false) errors.push("perturbation may not claim branch-local material as truth");
  }

  const proposal = envelope.proposal;
  if (!isObject(proposal)) errors.push("proposal must be an object");
  else {
    actorEvidenceErrors(proposal.actor_type, proposal.evidence_class, "proposal", errors);
    if (proposal.action !== "propose_transfer") errors.push("proposal action must remain propose_transfer");
    if (!isObject(target) || proposal.target_branch_ref !== target.branch_ref) errors.push("proposal must point to the declared target branch");
    if (proposal.execution_authority !== false) errors.push("proposal may not carry execution authority");
    if (proposal.world_authority !== false) errors.push("world evidence may not authorize transfer");
    if (proposal.metric_authority !== false) errors.push("easy metrics may not authorize transfer");
  }

  const decision = envelope.target_decision;
  if (!isObject(decision)) errors.push("target_decision must be an object");
  else if (decision.status === "pending") {
    if (decision.decided_by !== null || decision.decision_ref !== null || decision.evidence_class !== "none") errors.push("pending target decision must not fabricate human authorization");
  } else if (["accepted","rewritten","rejected"].includes(decision.status)) {
    if (!humanActors.has(decision.decided_by) || !visible(decision.decision_ref) || decision.evidence_class !== "human_interaction") errors.push("completed target decision must preserve explicit human authority");
  } else errors.push("target decision status is invalid");
  if (isObject(decision) && decision.canonical_source_preserved !== true) errors.push("target decision source must remain canonical");

  const application = envelope.application;
  if (!isObject(application)) errors.push("application must be an object");
  else {
    if (application.merge_performed !== false) errors.push("cross-branch perturbation may not perform a merge");
    if (application.source_branch_mutated !== false) errors.push("application may not mutate the source branch");
    if (application.target_history_rewritten !== false) errors.push("application may not rewrite target branch history");
    if (application.correction_claim !== false) errors.push("application may not claim that one branch corrected another");
    if (application.canonical_branch_created !== false) errors.push("application may not create a canonical branch");
    if (isObject(decision)) {
      if (["pending","rejected"].includes(decision.status) && (application.status !== "not_applied" || application.target_revision_ref !== null || application.applied_content_ref !== null)) errors.push("unapproved or rejected transfer may not alter the target branch");
      if (decision.status === "accepted" && (application.status !== "applied_as_is" || !visible(application.target_revision_ref) || !visible(application.applied_content_ref))) errors.push("accepted transfer must become an explicit new target revision");
      if (decision.status === "rewritten" && (application.status !== "applied_rewritten" || !visible(application.target_revision_ref) || !visible(application.applied_content_ref))) errors.push("rewritten transfer must preserve the human rewrite as an explicit target revision");
    }
    if (isObject(target) && visible(application.target_revision_ref) && application.target_revision_ref === target.worldspec_revision_ref) errors.push("application must append a target revision rather than overwrite the current one");
    if (isObject(source) && visible(application.target_revision_ref) && application.target_revision_ref === source.worldspec_revision_ref) errors.push("application target revision may not alias the source revision");
  }

  const lineage = envelope.lineage;
  if (!isObject(lineage)) errors.push("lineage must be an object");
  else {
    if (!Array.isArray(lineage.prior_transfer_refs)) errors.push("prior transfer lineage must be an array");
    if (lineage.source_branch_lineage_preserved !== true || lineage.target_branch_lineage_preserved !== true) errors.push("both branch lineages must remain preserved");
    if (isObject(source) && source.origin === "human_perturbation" && lineage.upstream_human_source_ref !== source.source_human_response_ref) errors.push("human-origin branch transfer must preserve the upstream human source in lineage");
  }

  const provenance = envelope.provenance;
  if (!isObject(provenance)) errors.push("provenance must be an object");
  else {
    if (provenance.branch_histories_preserved !== true) errors.push("branch histories must remain preserved");
    if (provenance.transfer_is_merge !== false) errors.push("transfer may not be represented as merge");
    if (provenance.transfer_is_proof_of_correction !== false) errors.push("transfer may not be proof of correction");
    if (provenance.human_authority_required !== true) errors.push("human authority must remain required for target application");
    if (provenance.synthetic_production_authority !== false) errors.push("synthetic activity may not gain production authority");
    if (provenance.world_evidence_authorizes_transfer !== false) errors.push("world evidence may not authorize transfer");
    if (provenance.easy_metric_authorizes_transfer !== false) errors.push("easy metric may not authorize transfer");
    if (provenance.generalized_personal_memory !== false) errors.push("contract may not introduce generalized persistent personal memory");
    if (provenance.production_self_modification !== false) errors.push("contract may not authorize production self-modification");
    if (provenance.reversible !== true) errors.push("cross-branch transfer must remain reversible");
  }
  inspectForSecretBearingFields(envelope, "envelope", errors);
  return errors;
}
function deepMerge(base, patch) {
  if (Array.isArray(patch)) return structuredClone(patch);
  if (!isObject(patch)) return patch;
  const out = isObject(base) ? structuredClone(base) : {};
  for (const [key, value] of Object.entries(patch)) out[key] = isObject(value) && isObject(out[key]) ? deepMerge(out[key], value) : structuredClone(value);
  return out;
}
let suite;
try { suite = JSON.parse(await readFile(path, "utf8")); }
catch (error) { console.error(`Cross-Branch Perturbation validation failed: could not read ${path}`); console.error(error.message); process.exit(1); }
if (!isObject(suite.base_envelope) || !Array.isArray(suite.cases) || suite.cases.length === 0) { console.error("Cross-Branch Perturbation validation failed: base_envelope and regression cases are required"); process.exit(1); }
let failures = 0, validCases = 0, intentionallyInvalidCases = 0;
for (const testCase of suite.cases) {
  const envelope = deepMerge(suite.base_envelope, testCase.patch || {});
  const errors = validateEnvelope(envelope);
  const actualValid = errors.length === 0;
  if (actualValid) validCases += 1; else intentionallyInvalidCases += 1;
  if (actualValid !== testCase.expected_valid) {
    failures += 1; console.error(`FAIL ${testCase.id}: expected_valid=${testCase.expected_valid}, actual_valid=${actualValid}`); for (const error of errors) console.error(`  - ${error}`); continue;
  }
  if (!actualValid && testCase.expected_error && !errors.some((error) => error.includes(testCase.expected_error))) {
    failures += 1; console.error(`FAIL ${testCase.id}: expected error containing '${testCase.expected_error}'`); for (const error of errors) console.error(`  - ${error}`); continue;
  }
  console.log(`PASS ${testCase.id}: ${actualValid ? "difference crossed branches without collapsing provenance" : "hostile cross-branch transfer rejected as intended"}`);
}
if (failures) { console.error(`Cross-Branch Perturbation regression suite failed: ${failures} case(s) did not behave as expected.`); process.exit(1); }
console.log(`Cross-Branch Perturbation regression suite passed: ${suite.cases.length} cases (${validCases} valid, ${intentionallyInvalidCases} intentionally invalid).`);
console.log("Invariant: a branch may donate a traceable question, observation, or constraint, but only human authority may decide whether that proposal changes a human-owned target branch; transfer is neither merge nor correction.");
