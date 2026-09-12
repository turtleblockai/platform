import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "worldspec/tests/selective-attention-envelope-cases.json";

const allowedContextModes = new Set(["do_not_interrupt", "watchpoint_only", "interruptible", "unspecified"]);
const allowedContextSources = new Set(["learner_stated", "project_default"]);
const allowedActors = new Set(["learner", "collaborator", "turtle", "synthetic_turtle", "system"]);
const allowedEvidenceClasses = new Set(["human_interaction", "system_record", "synthetic_self_play"]);
const allowedBases = new Set(["learner_watchpoint", "explicit_learner_request", "learner_session_setting", "collaborator_agreement", "turtle_proposal", "synthetic_proposal", "system_policy"]);
const allowedRuleStatus = new Set(["active", "proposed", "muted", "rejected", "superseded"]);
const allowedActions = new Set(["surface_now", "defer", "log_without_surfacing", "remain_silent", "discard"]);
const allowedAudiences = new Set(["learner", "collaborators", "public", "none"]);
const allowedRetention = new Set(["discard_after_decision", "ephemeral_private", "project_record"]);
const allowedDecisionStatus = new Set(["proposed", "executed", "rejected"]);
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

function actorEvidenceErrors(actor, evidenceClass, prefix, errors) {
  if (["learner", "collaborator"].includes(actor) && evidenceClass !== "human_interaction") {
    errors.push(`${prefix}: human actor must remain human_interaction`);
  }
  if (["turtle", "system"].includes(actor) && evidenceClass !== "system_record") {
    errors.push(`${prefix}: Turtle/system actor must remain system_record`);
  }
  if (actor === "synthetic_turtle" && evidenceClass !== "synthetic_self_play") {
    errors.push(`${prefix}: synthetic_turtle must remain synthetic_self_play`);
  }
}

function validateEnvelope(envelope) {
  const errors = [];
  if (!isObject(envelope)) return ["envelope must be an object"];
  if (envelope.version !== "0.1") errors.push("version must be 0.1");
  if (typeof envelope.id !== "string" || !envelope.id.trim()) errors.push("id must be a non-empty string");
  if (typeof envelope.question_ref !== "string" || !envelope.question_ref.trim()) errors.push("question_ref must be visible");
  if (typeof envelope.world_event_ref !== "string" || !envelope.world_event_ref.trim()) errors.push("world_event_ref must reference an existing observation rather than duplicate it");

  const context = envelope.attention_context;
  if (!isObject(context)) {
    errors.push("attention_context must be an object");
  } else {
    if (!allowedContextModes.has(context.mode)) errors.push("attention_context.mode is invalid");
    if (!allowedContextSources.has(context.source)) errors.push("attention_context.source is invalid");
    if (context.source === "project_default" && context.mode === "interruptible") {
      errors.push("project_default may not silently enable interruptible mode");
    }
  }

  const rule = envelope.attention_rule;
  if (!isObject(rule)) {
    errors.push("attention_rule must be an object");
  } else {
    if (typeof rule.id !== "string" || !rule.id.trim()) errors.push("attention_rule.id must be visible");
    if (typeof rule.purpose_ref !== "string" || !rule.purpose_ref.trim()) errors.push("attention_rule.purpose_ref must be visible");
    if (!allowedActors.has(rule.authored_by)) errors.push("attention_rule.authored_by is invalid");
    if (!allowedEvidenceClasses.has(rule.evidence_class)) errors.push("attention_rule.evidence_class is invalid");
    if (!allowedBases.has(rule.basis)) errors.push("attention_rule.basis is invalid");
    if (!allowedRuleStatus.has(rule.status)) errors.push("attention_rule.status is invalid");
    if (typeof rule.trigger_description !== "string" || !rule.trigger_description.trim()) errors.push("attention_rule.trigger_description must be visible");
    if (rule.new_collection_authorized !== false) errors.push("attention envelope may not authorize new collection");
    actorEvidenceErrors(rule.authored_by, rule.evidence_class, "attention_rule", errors);

    if (["learner_watchpoint", "explicit_learner_request", "learner_session_setting"].includes(rule.basis) && rule.authored_by !== "learner") {
      errors.push("learner-authored attention basis must remain learner-authored");
    }
    if (rule.basis === "collaborator_agreement" && !["learner", "collaborator"].includes(rule.authored_by)) {
      errors.push("collaborator_agreement must be human-authored");
    }
    if (rule.basis === "turtle_proposal" && (rule.authored_by !== "turtle" || rule.status !== "proposed")) {
      errors.push("turtle_proposal must remain a proposed Turtle-authored rule");
    }
    if (rule.basis === "synthetic_proposal" && (rule.authored_by !== "synthetic_turtle" || rule.status !== "proposed")) {
      errors.push("synthetic_proposal must remain a proposed synthetic_turtle rule");
    }
  }

  const decision = envelope.decision;
  if (!isObject(decision)) {
    errors.push("decision must be an object");
  } else {
    if (!allowedActors.has(decision.actor_type)) errors.push("decision.actor_type is invalid");
    if (!allowedEvidenceClasses.has(decision.evidence_class)) errors.push("decision.evidence_class is invalid");
    if (!allowedActions.has(decision.action)) errors.push("decision.action is invalid");
    if (typeof decision.rationale !== "string" || !decision.rationale.trim()) errors.push("decision.rationale must be visible");
    if (typeof decision.interruptive !== "boolean") errors.push("decision.interruptive must be explicit");
    if (!allowedAudiences.has(decision.delivery_audience)) errors.push("decision.delivery_audience is invalid");
    if (!allowedRetention.has(decision.retention)) errors.push("decision.retention is invalid");
    if (!allowedDecisionStatus.has(decision.status)) errors.push("decision.status is invalid");
    actorEvidenceErrors(decision.actor_type, decision.evidence_class, "decision", errors);

    const isLearnerAuthorizedRule = isObject(rule) && rule.authored_by === "learner" && rule.evidence_class === "human_interaction" && rule.status === "active" && ["learner_watchpoint", "explicit_learner_request", "learner_session_setting"].includes(rule.basis);
    if (decision.action === "surface_now" && decision.interruptive === true && !isLearnerAuthorizedRule) {
      errors.push("interruptive surfacing requires active learner authorization");
    }
    if (decision.action === "surface_now" && isObject(context) && context.mode === "do_not_interrupt") {
      errors.push("do_not_interrupt context forbids immediate surfacing");
    }
    if (["remain_silent", "log_without_surfacing", "discard", "defer"].includes(decision.action)) {
      if (decision.interruptive !== false) errors.push(`${decision.action} must be noninterruptive`);
      if (decision.delivery_audience !== "none") errors.push(`${decision.action} must have delivery_audience none`);
    }
    if (decision.actor_type === "synthetic_turtle" && decision.status === "executed") {
      errors.push("synthetic_turtle attention decisions may not execute");
    }
  }

  const provenance = envelope.provenance;
  if (!isObject(provenance)) {
    errors.push("provenance must be an object");
  } else {
    if (!allowedPrivacy.has(provenance.source_event_privacy_class)) errors.push("provenance.source_event_privacy_class is invalid");
    if (provenance.event_content_duplicated !== false) errors.push("provenance.event_content_duplicated must be false");
    if (provenance.learner_can_mute !== true) errors.push("provenance.learner_can_mute must be true");
    if (provenance.learner_can_revise !== true) errors.push("provenance.learner_can_revise must be true");
    if (provenance.machine_salience_is_proposal !== true) errors.push("provenance.machine_salience_is_proposal must be true");
    if (provenance.machine_final_authority !== false) errors.push("provenance.machine_final_authority must be false");
    if (provenance.surveillance_expansion_authorized !== false) errors.push("provenance.surveillance_expansion_authorized must be false");
    if (provenance.reversible !== true) errors.push("provenance.reversible must be true");
    if (provenance.non_interruption_is_valid !== true) errors.push("provenance.non_interruption_is_valid must be true");
    if (provenance.source_event_privacy_class === "private" && isObject(decision) && decision.delivery_audience === "public") {
      errors.push("private source event may not be delivered publicly");
    }
  }

  inspectForSecretBearingFields(envelope, "envelope", errors);
  return errors;
}

let suite;
try {
  suite = JSON.parse(await readFile(path, "utf8"));
} catch (error) {
  console.error(`Selective Attention Envelope validation failed: could not read ${path}`);
  console.error(error.message);
  process.exit(1);
}

if (!Array.isArray(suite.cases) || suite.cases.length === 0) {
  console.error("Selective Attention Envelope validation failed: no regression cases found");
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

  console.log(`PASS ${testCase.id}: ${actualValid ? "attention remained learner-governed and reversible" : "hostile attention case rejected as intended"}`);
}

if (failures) {
  console.error(`Selective Attention Envelope regression suite failed: ${failures} case(s) did not behave as expected.`);
  process.exit(1);
}

console.log(`Selective Attention Envelope regression suite passed: ${suite.cases.length} cases (${validCases} valid, ${intentionallyInvalidCases} intentionally invalid).`);
console.log("Invariant: observable is not the same as interrupt-worthy; learner purpose and explicit attention rules govern surfacing.");
