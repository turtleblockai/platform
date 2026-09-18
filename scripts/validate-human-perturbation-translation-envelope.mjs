import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "worldspec/tests/human-perturbation-translation-envelope-cases.json";
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const nonAnswerStates = new Set(["refused", "deferred", "no_response"]);
const answerStates = new Set(["answered", "sideways"]);
const translationStates = new Set(["not_attempted", "proposed", "contested", "accepted", "rejected"]);
const worldActions = new Set(["no_change", "proposed_delta", "parallel_branch", "merge_proposal"]);
const mergeStates = new Set(["not_applicable", "unproposed", "proposed", "human_approved", "human_rejected"]);
const differenceClasses = new Set(["contradiction", "value", "ambiguity", "situated_knowledge", "playful_perturbation", "unresolved_meaning", "other"]);
const privacyClasses = new Set(["private", "internal", "unlisted", "public", "none"]);

function validateEnvelope(e) {
  const errors = [];
  if (!isObject(e)) return ["envelope must be an object"];
  if (e.version !== "0.1") errors.push("version must be 0.1");
  for (const key of ["id", "turtle_ask_ref", "source_run_ref"]) if (typeof e[key] !== "string" || !e[key].trim()) errors.push(`${key} must be visible`);

  const h = e.human_input;
  if (!isObject(h)) errors.push("human_input must be an object");
  else {
    if (![...answerStates, ...nonAnswerStates].includes(h.state)) errors.push("human_input.state is invalid");
    if (h.canonical_source_preserved !== true || e.provenance?.human_response_not_rewritten !== true) errors.push("human response must remain canonical and unrevised");
    if (h.raw_text_duplicated !== false) errors.push("human_input may not duplicate raw text");
    if (answerStates.has(h.state)) {
      if (typeof h.response_object_ref !== "string" || !h.response_object_ref.trim()) errors.push("answered/sideways input requires a human response object reference");
      if (h.evidence_class !== "human_interaction") errors.push("answered/sideways input must remain human_interaction evidence");
    }
    if (nonAnswerStates.has(h.state)) {
      if (h.response_object_ref !== null || h.evidence_class !== "none") errors.push("non-answer states may not invent a human response object");
    }
  }

  const t = e.turtle_translation;
  if (!isObject(t)) errors.push("turtle_translation must be an object");
  else {
    if (!translationStates.has(t.status)) errors.push("turtle_translation.status is invalid");
    if (t.actor_type !== "turtle" || t.evidence_class !== "system_record") errors.push("Turtle translation must retain Turtle/system provenance");
    if (t.claims_equivalence !== false) errors.push("Turtle interpretation may not claim equivalence with the human source");
    if (t.unresolved_phrases_retained !== true) errors.push("unresolved human difference must remain preservable");
    if (t.status !== "not_attempted" && (typeof t.interpretation_object_ref !== "string" || !t.interpretation_object_ref.trim())) errors.push("attempted Turtle translation requires a distinct interpretation object");
  }

  const w = e.worldspec_effect;
  if (!isObject(w)) errors.push("worldspec_effect must be an object");
  else {
    if (!worldActions.has(w.action)) errors.push("worldspec_effect.action is invalid");
    if (!mergeStates.has(w.merge_status)) errors.push("worldspec_effect.merge_status is invalid");
    if (w.canonical_merge_required !== false) errors.push("canonical merge may not be required by the machine");
    if (w.source_response_recoverable !== true) errors.push("source response must remain recoverable after WorldSpec translation");
    if (w.human_authority_required_for_merge !== true) errors.push("merge authority must remain human");
    if (w.action === "parallel_branch" && (typeof w.branch_ref !== "string" || !w.branch_ref.trim())) errors.push("parallel branch requires a branch_ref");
    if (w.action === "merge_proposal" && !["proposed", "human_approved", "human_rejected"].includes(w.merge_status)) errors.push("merge proposal needs an explicit merge decision state");
    if (w.action !== "merge_proposal" && ["proposed", "human_approved", "human_rejected"].includes(w.merge_status)) errors.push("merge decision state requires merge_proposal action");
  }

  const d = e.difference_trace;
  if (!isObject(d)) errors.push("difference_trace must be an object");
  else {
    if (!Array.isArray(d.difference_classes) || d.difference_classes.length < 1 || d.difference_classes.some((x) => !differenceClasses.has(x))) errors.push("difference_trace must name at least one supported difference class");
    if (d.unresolved_difference_preserved !== true || t?.unresolved_phrases_retained !== true) errors.push("unresolved human difference must remain preservable");
    if (d.turtle_interpretation_distinct !== true || d.provenance_distinct !== true) errors.push("human source and Turtle interpretation must remain distinct");
    if (typeof d.assimilation_risk_note !== "string" || !d.assimilation_risk_note.trim()) errors.push("assimilation risk must remain inspectable");
  }

  const p = e.provenance;
  if (!isObject(p)) errors.push("provenance must be an object");
  else {
    if (!privacyClasses.has(p.source_response_privacy_class)) errors.push("source response privacy class is invalid");
    if (p.synthetic_human_substitution !== false) errors.push("synthetic human substitution is forbidden");
    if (p.machine_final_authority !== false) errors.push("machine final authority is forbidden");
    if (p.learner_learning_claim !== false) errors.push("trajectory change is not automatically learner-learning evidence");
    if (p.production_self_modification !== false) errors.push("production self-modification is forbidden");
    if (p.reversible !== true) errors.push("translation must remain reversible");
    if (p.raw_dialogue_duplicated !== false) errors.push("translation envelope may not duplicate raw dialogue");
  }

  if (isObject(h) && isObject(t) && isObject(w)) {
    if (nonAnswerStates.has(h.state) && (t.status !== "not_attempted" || t.interpretation_object_ref !== null || t.source_response_ref !== null || w.action !== "no_change" || w.resulting_revision_ref !== null || w.branch_ref !== null)) {
      errors.push("non-answer states may not produce Turtle translation or WorldSpec change");
    }
    if (answerStates.has(h.state) && t.status !== "not_attempted" && t.source_response_ref !== h.response_object_ref) errors.push("Turtle translation must point to the same human response object");
    if (answerStates.has(h.state) && p?.source_response_privacy_class === "none") errors.push("a real human response requires a source privacy class");
    if (nonAnswerStates.has(h.state) && p?.source_response_privacy_class !== "none") errors.push("no human response should use privacy class none");
  }
  return [...new Set(errors)];
}

const suite = JSON.parse(await readFile(path, "utf8"));
if (!Array.isArray(suite.cases) || !suite.cases.length) throw new Error("no regression cases found");
let failures = 0;
let valid = 0;
let hostile = 0;
for (const testCase of suite.cases) {
  const errors = validateEnvelope(testCase.envelope);
  const actualValid = errors.length === 0;
  actualValid ? valid++ : hostile++;
  if (actualValid !== testCase.expected_valid) {
    failures++;
    console.error(`FAIL ${testCase.id}: expected_valid=${testCase.expected_valid}, actual_valid=${actualValid}`);
    for (const error of errors) console.error(`  - ${error}`);
    continue;
  }
  if (!actualValid && testCase.expected_error && !errors.some((error) => error.includes(testCase.expected_error))) {
    failures++;
    console.error(`FAIL ${testCase.id}: expected error containing '${testCase.expected_error}'`);
    for (const error of errors) console.error(`  - ${error}`);
    continue;
  }
  console.log(`PASS ${testCase.id}: ${actualValid ? "human difference remained source-distinct" : "assimilation/provenance violation rejected as intended"}`);
}
if (failures) {
  console.error(`Human Perturbation Translation regression suite failed: ${failures} case(s).`);
  process.exit(1);
}
console.log(`Human Perturbation Translation regression suite passed: ${suite.cases.length} cases (${valid} valid, ${hostile} intentionally invalid).`);
console.log("Invariant: lossless before normalized — human perturbation remains recoverable and distinct from Turtle interpretation and WorldSpec effect.");
