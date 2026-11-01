import fs from 'node:fs';

const path = process.argv[2] || 'worldspec/tests/deictic-refusal-envelope-cases.json';
const suite = JSON.parse(fs.readFileSync(path, 'utf8'));
const isObject = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const str = (x) => typeof x === 'string' && x.trim().length > 0;

function merge(a, b) {
  if (!isObject(a) || !isObject(b)) return b;
  const result = {...a};
  for (const [key, value] of Object.entries(b)) result[key] = isObject(value) && isObject(a[key]) ? merge(a[key], value) : value;
  return result;
}

function validate(x) {
  const errors = [];
  const src = x.source || {}, scope = x.scope || {}, ctx = x.context || {};
  const r = x.resolution || {}, d = x.decision || {}, p = x.provenance || {};
  if (x.version !== '0.1') errors.push('version must be 0.1');
  if (src.actor_role !== 'fictional_learner' || !str(src.source_ref) || !['rejection', 'correction', 'revision'].includes(src.reaction_type) || src.utterance_class !== 'deictic') errors.push('source must be an explicitly fictional deictic learner-role example');
  if (!['project', 'branch', 'purpose'].includes(scope.kind) || !str(scope.ref)) errors.push('source scope must be bounded');
  if (!str(ctx.worldspec_revision_ref)) errors.push('local WorldSpec revision pointer required');
  const candidates = Array.isArray(ctx.candidates) ? ctx.candidates : [];
  if (!candidates.length || candidates.some(c => !isObject(c) || !str(c.object_ref) || !str(c.object_kind) || !str(c.source_ref))) errors.push('each candidate needs a typed object and source pointer');
  if (new Set(candidates.map(c => c.object_ref)).size !== candidates.length) errors.push('candidate object refs must be unique');
  if (d.scope_ref !== scope.ref) errors.push('decision must stay in source scope');
  if (d.interrupt_authorized !== false) errors.push('ambiguity grants no interruption authority');
  if (r.generalized_to_parent !== false) errors.push('refusal must not generalize');
  if (r.derived_person_profile !== false) errors.push('no derived person profile');
  if (r.raw_dialogue_duplicated !== false) errors.push('no raw dialogue duplication');
  if (p.fixture_is_synthetic !== true || p.synthetic_as_observed_human !== false) errors.push('synthetic evidence cannot be relabeled as human');
  if (p.collection_expanded !== false || p.production_self_modification !== false || p.reversible !== true) errors.push('research-only reversible and consent-limited provenance required');
  if (!['unresolved', 'learner_confirmed'].includes(r.status)) errors.push('unknown resolution state');
  if (!['defer_targeted_action', 'continue_adjacent', 'respect_confirmed_refusal'].includes(d.action)) errors.push('unknown decision action');
  if (r.status === 'unresolved') {
    if (r.selected_ref !== null || r.confirmation_source_ref !== null || r.human_confirmation !== false) errors.push('unresolved target must not be selected');
    if (!['defer_targeted_action', 'continue_adjacent'].includes(d.action) || d.target_ref !== null) errors.push('unresolved target may not be enforced');
  }
  if (r.status === 'learner_confirmed') {
    if (r.human_confirmation !== true || !str(r.confirmation_source_ref) || !r.confirmation_source_ref.startsWith('turn:fictional-learner-')) errors.push('confirmation must be explicitly learner-authored');
    if (!str(r.selected_ref) || !candidates.some(c => c.object_ref === r.selected_ref)) errors.push('confirmed target must be a context candidate');
    if (d.action !== 'respect_confirmed_refusal' || d.target_ref !== r.selected_ref) errors.push('confirmed refusal must target only confirmed candidate');
  }
  return [...new Set(errors)];
}
if (suite.schema !== 'turtleblockai.deictic-refusal-envelope-cases.v0.1' || suite.evidence_class !== 'synthetic_contract_examples') throw new Error('unexpected suite provenance');
let failures = 0, accepted = 0, hostile = 0;
for (const test of suite.cases) {
  const errors = validate(merge(suite.base_envelope, test.patch || {}));
  if (test.expected_valid) accepted++; else hostile++;
  const observedValid = errors.length === 0;
  if (observedValid !== test.expected_valid || (test.expected_error && !errors.some(e => e.includes(test.expected_error)))) {
    failures++;
    console.error(`FAIL ${test.id}: ${errors.join('; ')}`);
  } else console.log(`PASS ${test.id}`);
}
if (suite.cases.length !== 18 || accepted !== 6 || hostile !== 12) throw new Error('expected 18 cases: 6 accepted, 12 hostile');
if (failures) process.exit(1);
console.log(`Deictic refusal uncertainty: ${accepted} accepted, ${hostile} hostile, 0 mismatches. Synthetic contract only.`);
