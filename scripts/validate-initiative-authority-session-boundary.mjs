import fs from "node:fs";

const path = process.argv[2] || "worldspec/tests/initiative-authority-session-boundary-cases.json";
const suite = JSON.parse(fs.readFileSync(path, "utf8"));
const isObj = v => v && typeof v === "object" && !Array.isArray(v);
const visible = v => typeof v === "string" && v.trim().length > 0;
const allowedScopes = new Set(["project","branch","purpose"]);
const allowedModes = new Set(["quiet","responsive_only","situational","delegated_bounded"]);
const allowedDelegation = new Set(["none","bounded"]);
const allowedFields = new Set(["initiative_mode","resurfacing_allowed","unsolicited_questions_allowed","delegated_action_authority","active_purpose_refs","human_rule_ref"]);

function merge(a,b){
  if(!isObj(a)||!isObj(b)) return b;
  const o={...a};
  for(const [k,v] of Object.entries(b)) o[k]=isObj(v)&&isObj(a[k])?merge(a[k],v):v;
  return o;
}
function stateErrors(s,label,e){
  if(!isObj(s)){e.push(label+" must be object");return;}
  if(!allowedModes.has(s.initiative_mode)) e.push(label+".initiative_mode invalid");
  if(typeof s.resurfacing_allowed!=="boolean") e.push(label+".resurfacing_allowed must be boolean");
  if(typeof s.unsolicited_questions_allowed!=="boolean") e.push(label+".unsolicited_questions_allowed must be boolean");
  if(!allowedDelegation.has(s.delegated_action_authority)) e.push(label+".delegated_action_authority invalid");
  if(!Array.isArray(s.active_purpose_refs)||s.active_purpose_refs.some(x=>!visible(x))) e.push(label+".active_purpose_refs invalid");
}
function sameState(before,after){
  const fields=["initiative_mode","resurfacing_allowed","unsolicited_questions_allowed","delegated_action_authority","human_rule_ref"];
  if(fields.some(k=>before[k]!==after[k])) return false;
  const a=[...(before.active_purpose_refs||[])].sort();
  const b=[...(after.active_purpose_refs||[])].sort();
  return JSON.stringify(a)===JSON.stringify(b);
}
function gained(before,after){
  const rank={quiet:0,responsive_only:1,situational:2,delegated_bounded:3};
  if(rank[after.initiative_mode]>rank[before.initiative_mode]) return true;
  if(!before.resurfacing_allowed && after.resurfacing_allowed) return true;
  if(!before.unsolicited_questions_allowed && after.unsolicited_questions_allowed) return true;
  if(before.delegated_action_authority==="none" && after.delegated_action_authority==="bounded") return true;
  const b=new Set(before.active_purpose_refs||[]);
  if((after.active_purpose_refs||[]).some(x=>!b.has(x))) return true;
  return false;
}
function validate(x){
  const e=[];
  if(x.version!=="0.1") e.push("version must be 0.1");
  const s=x.scope;
  if(!isObj(s)||!allowedScopes.has(s.kind)||!visible(s.ref)||s.generalized_person_scope!==false) e.push("scope must remain project, branch, or purpose bounded");

  const d=x.source_directive;
  const p=x.persistence_record;
  if(!isObj(d)||d.actor_type!=="learner"||d.evidence_class!=="human_interaction"||d.explicit_human_direction!==true) e.push("persisted authority boundary must originate in explicit learner direction");
  if(!isObj(p)||p.source_actor_type!=="learner"||p.evidence_class!=="human_interaction"||p.explicit_human_direction!==true) e.push("persisted authority boundary must originate in explicit learner direction");
  if(isObj(d)&&isObj(p)&&p.source_directive_ref!==d.directive_ref) e.push("persistence record must point to the source directive");

  if(isObj(p)){
    if(p.record_kind!=="initiative_authority_boundary") e.push("persistence record kind must remain initiative_authority_boundary");
    if(p.scope_ref!==s?.ref) e.push("persistence record scope must match the authority scope");
    if(p.carries_person_profile!==false) e.push("persistence record may not carry a person profile");
    if(!Array.isArray(p.derived_preferences)||p.derived_preferences.length) e.push("persistence record may not contain derived preferences");
    if(p.raw_dialogue_duplicated!==false) e.push("persistence record may not duplicate raw dialogue");
    if(!Array.isArray(p.persisted_fields)||p.persisted_fields.some(k=>!allowedFields.has(k))) e.push("persisted_fields may contain only authority-state fields");
  }
  if(x.next_session?.scope_ref!==s?.ref) e.push("persisted boundary may only seed the same exact scope");

  const before=x.previous_session?.final_authority_state;
  const after=x.next_session?.initial_authority_state;
  stateErrors(before,"previous_session.final_authority_state",e);
  stateErrors(after,"next_session.initial_authority_state",e);
  if(isObj(before)&&isObj(after)){
    const r=x.next_session?.restoration;
    const explicitRestore=isObj(r)&&r.requested===true&&r.explicit_learner_request===true&&visible(r.request_ref);
    if(!sameState(before,after)&&!explicitRestore) e.push("cross-session carryover must preserve the exact authority state unless explicitly restored");
    if(gained(before,after)&&!explicitRestore) e.push("authority gain across sessions requires explicit learner restoration");
  }

  const pr=x.provenance;
  if(!isObj(pr)) e.push("provenance must be object");
  else {
    if(pr.cross_session!==true) e.push("cross_session provenance must be true");
    if(pr.remembered_purpose_reactivates_authority!==false) e.push("remembered purpose may not reactivate authority");
    if(pr.relevance_inference_overrides_boundary!==false) e.push("relevance inference may not override a persisted boundary");
    if(pr.generalized_personal_memory!==false) e.push("authority persistence may not become generalized personal memory");
    if(pr.collection_expansion_authorized!==false) e.push("authority persistence may not authorize broader collection");
    if(pr.production_self_modification!==false) e.push("authority persistence may not authorize production self-modification");
    if(pr.reversible!==true) e.push("authority persistence must remain reversible");
  }
  return [...new Set(e)];
}

if(suite.schema!=="turtleblockai.initiative-authority-session-boundary-cases.v0.1") throw new Error("unexpected suite schema");
let failures=0,valid=0,hostile=0;
for(const tc of suite.cases){
  const x=merge(suite.base_envelope,tc.patch||{});
  const errors=validate(x);
  const actual=errors.length===0;
  if(tc.expected_valid) valid++; else hostile++;
  const wanted=tc.expected_valid===true;
  const expectedErrorOk=!tc.expected_error||errors.some(e=>e.includes(tc.expected_error));
  if(actual!==wanted||!expectedErrorOk){
    failures++;
    console.error("FAIL "+tc.id+" expected="+wanted+" actual="+actual);
    if(tc.expected_error&&!expectedErrorOk) console.error("  missing: "+tc.expected_error);
    for(const err of errors) console.error("  - "+err);
  } else console.log("PASS "+tc.id);
}
if(suite.cases.length!==13||valid!==3||hostile!==10) throw new Error(`Expected 13 cases (3 valid, 10 hostile); found ${suite.cases.length} (${valid} valid, ${hostile} hostile)`);
if(failures) process.exit(1);
console.log(`Session-boundary Initiative Authority suite passed: ${suite.cases.length} cases, ${valid} valid, ${hostile} hostile.`);
console.log("Invariant: an explicit learner boundary may persist across the same scope, but no profile, inferred preference, copied dialogue, scope leak, silent restoration, or broader collection may hitch a ride.");
