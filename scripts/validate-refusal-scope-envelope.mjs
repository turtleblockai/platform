import fs from "node:fs";

const path = process.argv[2] || "worldspec/tests/refusal-scope-envelope-cases.json";
const suite = JSON.parse(fs.readFileSync(path, "utf8"));

const obj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const visible = (v) => typeof v === "string" && v.trim().length > 0;
const sameNullable = (a,b) => a === b;
const allowedScopes = new Set(["project","branch","purpose"]);
const allowedKinds = new Set(["wording","nudge","task","purpose","resurfacing"]);
const allowedReactions = new Set(["rejection","correction","revision"]);
const allowedActions = new Set(["respect_refusal","continue_adjacent","resume_refused_object"]);

function merge(a,b){
  if(!obj(a)||!obj(b)) return b;
  const out={...a};
  for(const [k,v] of Object.entries(b)) out[k]=obj(v)&&obj(a[k])?merge(a[k],v):v;
  return out;
}

function validate(x){
  const errors=[];
  if(!obj(x)||x.version!=="0.1") errors.push("version must be 0.1");

  const s=x.scope;
  if(!obj(s)||!allowedScopes.has(s.kind)||!visible(s.ref)||s.generalized_person_scope!==false){
    errors.push("scope must remain project, branch, or purpose bounded");
  }

  const r=x.source_refusal;
  const explicitHuman=obj(r)&&r.actor_type==="learner"&&r.evidence_class==="human_interaction"&&
    r.explicit_human_direction===true&&allowedReactions.has(r.reaction_type);
  if(!explicitHuman) errors.push("refusal boundary must originate in explicit learner direction");
  if(obj(r)){
    if(!allowedKinds.has(r.object_kind)||!visible(r.object_ref)) errors.push("refused object must be explicit and typed");
    if(r.object_kind!=="purpose"&&!visible(r.parent_purpose_ref)) errors.push("non-purpose refusal must preserve parent purpose provenance");
    if(["wording","nudge","task"].includes(r.object_kind)&&!visible(r.parent_task_ref)) errors.push("wording, nudge, and task refusals must preserve parent task provenance");
  }

  const p=x.persistence;
  if(!obj(p)||p.record_kind!=="refusal_boundary") errors.push("persistence must be a refusal_boundary record");
  if(obj(p)&&obj(r)&&obj(s)){
    if(p.scope_ref!==s.ref) errors.push("persisted refusal scope must match source scope");
    if(p.source_refusal_ref!==r.source_ref) errors.push("persistence must point to the source refusal");
    if(p.refused_object_kind!==r.object_kind||p.refused_object_ref!==r.object_ref) errors.push("persisted refused object must exactly match source object");
    if(!sameNullable(p.parent_task_ref,r.parent_task_ref)||!sameNullable(p.parent_purpose_ref,r.parent_purpose_ref)) errors.push("persistence must preserve parent provenance without rewriting it");
  }
  if(obj(p)){
    if(p.generalized_to_parent_task!==false) errors.push("refusal may not generalize to parent task");
    if(p.generalized_to_parent_purpose!==false) errors.push("refusal may not generalize to parent purpose");
    if(p.generalized_person_trait!==false) errors.push("refusal may not become a generalized person trait");
    if(!Array.isArray(p.derived_preferences)||p.derived_preferences.length) errors.push("refusal persistence may not contain derived preferences");
    if(p.raw_dialogue_duplicated!==false) errors.push("refusal persistence may not duplicate raw dialogue");
  }

  const later=x.later_turn;
  if(!obj(later)||!visible(later.scope_ref)||!allowedKinds.has(later.target_kind)||!visible(later.target_ref)||!allowedActions.has(later.action)){
    errors.push("later turn must declare bounded target and action");
  } else if(obj(s)&&later.scope_ref!==s.ref){
    errors.push("persisted refusal may only govern the same exact scope");
  }

  if(obj(later)&&obj(r)){
    const sameObject=later.target_kind===r.object_kind&&later.target_ref===r.object_ref;
    if(later.action==="respect_refusal"&&!sameObject) errors.push("refusal may not silently spread to a different object");
    if(later.action==="continue_adjacent"&&sameObject) errors.push("continuing the exact refused object requires learner reopening");
    if(later.action==="resume_refused_object"){
      const reopen=later.explicit_reopen;
      const explicit=obj(reopen)&&reopen.requested===true&&reopen.explicit_learner_request===true&&visible(reopen.request_ref);
      if(!sameObject||!explicit) errors.push("resuming the refused object requires explicit learner reopening");
    }
  }

  const pr=x.provenance;
  if(!obj(pr)) errors.push("provenance must be present");
  else {
    if(pr.cross_turn!==true) errors.push("refusal persistence must identify cross-turn provenance");
    if(pr.silence_interpreted_as_refusal!==false) errors.push("silence may not be interpreted as refusal");
    if(pr.partial_uptake_generalized!==false) errors.push("partial uptake may not become generalized refusal");
    if(pr.collection_expansion_authorized!==false) errors.push("refusal persistence may not authorize broader collection");
    if(pr.synthetic_evidence_as_human!==false) errors.push("synthetic evidence may not be represented as human refusal");
    if(pr.production_self_modification!==false) errors.push("refusal persistence may not authorize production self-modification");
    if(pr.reversible!==true) errors.push("refusal boundary must remain reversible");
  }
  return [...new Set(errors)];
}

if(suite.schema!=="turtleblockai.refusal-scope-envelope-cases.v0.1") throw new Error("unexpected suite schema");

let failures=0,valid=0,hostile=0;
for(const tc of suite.cases){
  const errors=validate(merge(suite.base_envelope,tc.patch||{}));
  const actual=errors.length===0;
  const expected=tc.expected_valid===true;
  if(expected) valid++; else hostile++;
  const expectedErrorOk=!tc.expected_error||errors.some(e=>e.includes(tc.expected_error));
  if(actual!==expected||!expectedErrorOk){
    failures++;
    console.error("FAIL "+tc.id+" expected="+expected+" actual="+actual);
    if(tc.expected_error&&!expectedErrorOk) console.error("  missing: "+tc.expected_error);
    for(const err of errors) console.error("  - "+err);
  } else {
    console.log("PASS "+tc.id);
  }
}

if(suite.cases.length!==16||valid!==7||hostile!==9) throw new Error(`Expected 16 cases (7 valid, 9 hostile); found ${suite.cases.length} (${valid} valid, ${hostile} hostile)`);
if(failures) process.exit(1);

console.log(`Refusal Scope suite passed: ${suite.cases.length} cases, ${valid} valid, ${hostile} hostile.`);
console.log("Invariant: a learner refusal remains attached to its exact object and scope; persistence cannot inflate it into task, purpose, person, preference, or renewed authority.");
