import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "worldspec/tests/plural-foreground-envelope-cases.json";

const allowedActorTypes = new Set(["learner", "collaborator"]);
const allowedAttentionStates = new Set(["surface_now", "defer", "remain_silent", "unconcerned", "unspecified"]);
const allowedPrivacy = new Set(["private", "internal", "unlisted", "public"]);
const allowedDisclosureLevels = new Set(["private", "existence_only", "rule_without_rationale", "full"]);
const allowedSharedStatus = new Set(["none", "proposed", "active", "rejected", "withdrawn"]);
const allowedSharedAuthors = new Set(["human_group", "turtle", "synthetic_turtle", "system", "none"]);
const allowedRationaleVisibility = new Set(["none", "existence_only", "shared"]);
const allowedDecisionActors = new Set(["human_group", "turtle", "synthetic_turtle", "system"]);
const allowedDecisionEvidence = new Set(["human_interaction", "system_record", "synthetic_self_play"]);
const allowedActions = new Set(["remain_plural", "surface_to_consenting", "defer_shared", "no_shared_foreground"]);
const allowedDecisionStatus = new Set(["proposed", "executed", "rejected"]);

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

function setEquals(a, b) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

function validateEnvelope(envelope) {
  const errors = [];
  if (!isObject(envelope)) return ["envelope must be an object"];
  if (envelope.version !== "0.1") errors.push("version must be 0.1");
  if (typeof envelope.id !== "string" || !envelope.id.trim()) errors.push("id must be a non-empty string");
  if (typeof envelope.shared_world_ref !== "string" || !envelope.shared_world_ref.trim()) errors.push("shared_world_ref must be visible");
  if (typeof envelope.shared_event_ref !== "string" || !envelope.shared_event_ref.trim()) errors.push("shared_event_ref must be visible");

  const foregrounds = envelope.participant_foregrounds;
  const participantIds = new Set();
  if (!Array.isArray(foregrounds) || foregrounds.length < 2) {
    errors.push("participant_foregrounds must contain at least two participants");
  } else {
    for (const [index, foreground] of foregrounds.entries()) {
      const prefix = `participant_foregrounds[${index}]`;
      if (!isObject(foreground)) {
        errors.push(`${prefix} must be an object`);
        continue;
      }
      if (typeof foreground.participant_ref !== "string" || !foreground.participant_ref.trim()) errors.push(`${prefix}.participant_ref must be visible`);
      else if (participantIds.has(foreground.participant_ref)) errors.push("participant_foregrounds must use unique participant_ref values");
      else participantIds.add(foreground.participant_ref);
      if (!allowedActorTypes.has(foreground.actor_type)) errors.push(`${prefix}.actor_type is invalid`);
      if (foreground.evidence_class !== "human_interaction") errors.push(`${prefix}: human participant foreground must remain human_interaction`);
      if (!allowedPrivacy.has(foreground.privacy_class)) errors.push(`${prefix}.privacy_class is invalid`);
      if (!allowedAttentionStates.has(foreground.attention_state)) errors.push(`${prefix}.attention_state is invalid`);
      if (typeof foreground.purpose_ref !== "string" || !foreground.purpose_ref.trim()) errors.push(`${prefix}.purpose_ref must be visible`);
      if (!(typeof foreground.attention_rule_ref === "string" || foreground.attention_rule_ref === null)) errors.push(`${prefix}.attention_rule_ref must be string or null`);
      const disclosure = foreground.disclosure;
      if (!isObject(disclosure)) {
        errors.push(`${prefix}.disclosure must be an object`);
      } else {
        if (!allowedDisclosureLevels.has(disclosure.level)) errors.push(`${prefix}.disclosure.level is invalid`);
        if (typeof disclosure.rationale_shared !== "boolean") errors.push(`${prefix}.disclosure.rationale_shared must be explicit`);
        if (["private", "existence_only", "rule_without_rationale"].includes(disclosure.level) && disclosure.rationale_shared === true) {
          errors.push(`${prefix}: rationale may be shared only with full disclosure`);
        }
      }
    }
  }

  const sharedRule = envelope.shared_rule;
  if (!isObject(sharedRule)) {
    errors.push("shared_rule must be an object");
  } else {
    if (!allowedSharedStatus.has(sharedRule.status)) errors.push("shared_rule.status is invalid");
    if (!allowedSharedAuthors.has(sharedRule.authored_by)) errors.push("shared_rule.authored_by is invalid");
    if (!Array.isArray(sharedRule.affected_participants) || new Set(sharedRule.affected_participants).size !== sharedRule.affected_participants.length) errors.push("shared_rule.affected_participants must be a unique array");
    if (!Array.isArray(sharedRule.consented_participants) || new Set(sharedRule.consented_participants).size !== sharedRule.consented_participants.length) errors.push("shared_rule.consented_participants must be a unique array");
    if (!allowedRationaleVisibility.has(sharedRule.rationale_visibility)) errors.push("shared_rule.rationale_visibility is invalid");
    if (sharedRule.new_collection_authorized !== false) errors.push("plural foreground envelope may not authorize new collection");

    const affected = new Set(Array.isArray(sharedRule.affected_participants) ? sharedRule.affected_participants : []);
    const consented = new Set(Array.isArray(sharedRule.consented_participants) ? sharedRule.consented_participants : []);
    for (const participant of affected) if (!participantIds.has(participant)) errors.push("shared_rule may affect only participants represented in the envelope");
    for (const participant of consented) if (!participantIds.has(participant)) errors.push("shared_rule consent may name only participants represented in the envelope");

    if (sharedRule.status === "none") {
      if (sharedRule.authored_by !== "none" || affected.size || consented.size) errors.push("shared_rule none must not invent author, affected participants, or consent");
    }
    if (sharedRule.status === "active") {
      if (sharedRule.authored_by !== "human_group") errors.push("active shared rule must be human-group authored");
      if (!setEquals(affected, consented)) errors.push("active shared rule requires consent from every affected participant");
      if (!sharedRule.purpose_ref || !sharedRule.trigger_description) errors.push("active shared rule requires visible purpose and trigger");
    }
    if (["turtle", "synthetic_turtle", "system"].includes(sharedRule.authored_by) && sharedRule.status === "active") {
      errors.push("machine-authored shared rule may not become active");
    }
  }

  const decision = envelope.decision;
  if (!isObject(decision)) {
    errors.push("decision must be an object");
  } else {
    if (!allowedDecisionActors.has(decision.actor_type)) errors.push("decision.actor_type is invalid");
    if (!allowedDecisionEvidence.has(decision.evidence_class)) errors.push("decision.evidence_class is invalid");
    if (!allowedActions.has(decision.action)) errors.push("decision.action is invalid");
    if (!Array.isArray(decision.delivery_participants) || new Set(decision.delivery_participants).size !== decision.delivery_participants.length) errors.push("decision.delivery_participants must be a unique array");
    if (typeof decision.interruptive !== "boolean") errors.push("decision.interruptive must be explicit");
    if (!allowedDecisionStatus.has(decision.status)) errors.push("decision.status is invalid");
    if (typeof decision.rationale !== "string" || !decision.rationale.trim()) errors.push("decision.rationale must be visible");

    if (decision.actor_type === "human_group" && decision.evidence_class !== "human_interaction") errors.push("human_group decision must remain human_interaction");
    if (["turtle", "system"].includes(decision.actor_type) && decision.evidence_class !== "system_record") errors.push("Turtle/system decision must remain system_record");
    if (decision.actor_type === "synthetic_turtle" && decision.evidence_class !== "synthetic_self_play") errors.push("synthetic_turtle decision must remain synthetic_self_play");
    if (decision.actor_type === "synthetic_turtle" && decision.status === "executed") errors.push("synthetic_turtle shared-foreground decisions may not execute");

    if (["remain_plural", "defer_shared", "no_shared_foreground"].includes(decision.action)) {
      if (decision.interruptive !== false) errors.push(`${decision.action} must be noninterruptive`);
      if (decision.delivery_participants.length) errors.push(`${decision.action} must not deliver to participants`);
    }
    if (decision.action === "surface_to_consenting") {
      if (!isObject(sharedRule) || sharedRule.status !== "active" || sharedRule.authored_by !== "human_group") errors.push("shared surfacing requires an active human-group shared rule");
      const consented = new Set(isObject(sharedRule) && Array.isArray(sharedRule.consented_participants) ? sharedRule.consented_participants : []);
      if (decision.delivery_participants.some((id) => !consented.has(id))) errors.push("shared surfacing may deliver only to consented participants");
      if (decision.interruptive !== true) errors.push("surface_to_consenting must explicitly represent its interruptive delivery");
    }
  }

  const provenance = envelope.provenance;
  if (!isObject(provenance)) {
    errors.push("provenance must be an object");
  } else {
    if (provenance.private_foregrounds_preserved !== true) errors.push("private participant foregrounds must remain preserved");
    if (provenance.shared_world_implies_shared_attention !== false) errors.push("shared world must not imply shared attention");
    if (provenance.machine_consensus_authority !== false) errors.push("machine may not manufacture consensus authority");
    if (provenance.machine_may_average_priorities !== false) errors.push("machine may not average participant priorities into consensus");
    if (provenance.participant_can_withdraw !== true) errors.push("participants must be able to withdraw from shared foreground rules");
    if (provenance.selective_disclosure_supported !== true) errors.push("selective disclosure must remain supported");
    if (provenance.synthetic_production_authority !== false) errors.push("synthetic production authority must remain false");
    if (provenance.surveillance_expansion_authorized !== false) errors.push("surveillance expansion must remain unauthorized");
    if (provenance.reversible !== true) errors.push("plural foreground decisions must remain reversible");
  }

  inspectForSecretBearingFields(envelope, "envelope", errors);
  return errors;
}

let suite;
try {
  suite = JSON.parse(await readFile(path, "utf8"));
} catch (error) {
  console.error(`Plural Foreground Envelope validation failed: could not read ${path}`);
  console.error(error.message);
  process.exit(1);
}

if (!Array.isArray(suite.cases) || suite.cases.length === 0) {
  console.error("Plural Foreground Envelope validation failed: no regression cases found");
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

  console.log(`PASS ${testCase.id}: ${actualValid ? "plural foregrounds preserved" : "hostile shared-foreground case rejected as intended"}`);
}

if (failures) {
  console.error(`Plural Foreground Envelope regression suite failed: ${failures} case(s) did not behave as expected.`);
  process.exit(1);
}

console.log(`Plural Foreground Envelope regression suite passed: ${suite.cases.length} cases (${validCases} valid, ${intentionallyInvalidCases} intentionally invalid).`);
console.log("Invariant: a shared world does not imply a shared foreground; negotiated attention requires human consent and preserves plurality.");
