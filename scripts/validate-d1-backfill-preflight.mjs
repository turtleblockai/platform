import {readFileSync} from "node:fs";

// Research-only gate. This validates staged evidence shape; it NEVER queries D1,
// issues writes, grants approval, or certifies that a live row exists.
function validatePreflight(r) {
  const e=[], fail=x=>e.push(x), s=x=>typeof x==="string"&&x.trim().length>0;
  if(!r||typeof r!=="object"||Array.isArray(r))return ["record"];
  if(r.schema!=="turtleblockai.d1-backfill-preflight.v0.1")fail("schema");
  const c=r.candidate||{},d=r.live_readiness||{},g=r.gate||{},p=r.provenance_boundaries||{};
  if(!s(c.id)||!/^build_log_entry:|^repo_file:/.test(c.id))fail("object_identity");
  if(!s(c.repo_path)||! /^(research|worldspec|scripts|public\/data)\/[A-Za-z0-9_.\/-]+$/.test(c.repo_path)||c.repo_path.includes(".."))fail("canonical_public_path");
  if(!["build_log_entry","repository_artifact","repo_change"].includes(c.object_type))fail("public_object_type");
  if(c.privacy_class!=="public"||c.source_class!=="public_repository_artifact")fail("public_source_only");
  if(c.evidence_class!=="system_research"||c.actor!=="machine_synthesis_under_human_research_direction")fail("provenance");
  if(c.capture_batch_closed!==true||r.established_ctc_domains!==7)fail("batch_or_ctc_authority");
  if(d.read_verified!==true||d.research_objects_table_present!==true||!s(d.observed_date)||!s(d.query_reference))fail("verified_read_metadata");
  if(!["staged_for_review","human_review_candidate"].includes(g.disposition))fail("disposition");
  if(g.write_performed!==false||g.claims_live_persistence!==false||g.auto_deploy!==false)fail("no_execution_or_persistence_claim");
  if(g.disposition==="human_review_candidate"&&(d.migration_ledger_aligned!==true||d.write_permission_verified!==true||g.human_approval_recorded!==true||!s(g.human_approval_scope)))fail("review_readiness");
  if(g.disposition==="staged_for_review"&&g.human_approval_recorded===true)fail("premature_approval_claim");
  if(p.synthetic_as_human!==false||p.collection_expansion!==false||p.consent_bypassed!==false||p.source_overwritten!==false)fail("provenance_or_consent_expansion");
  const forbidden=new Set(["raw_dialogue","transcript","private_turn","user_identity","secret","credential","api_key","access_token","production_patch","human_response"]);
  function walk(v){if(!v||typeof v!=="object")return;for(const [k,val] of Object.entries(v)){if(forbidden.has(k.toLowerCase()))fail("forbidden_raw_or_secret_field");if(typeof val==="object")walk(val);}}
  walk(r);
  return [...new Set(e)];
}
const suite=JSON.parse(readFileSync("research/fixtures/2026-11-17-d1-backfill-preflight-cases.json","utf8"));
function apply(base,patch){const copy=JSON.parse(JSON.stringify(base));for(const [path,value] of Object.entries(patch)){const keys=path.split(".");let at=copy;for(const key of keys.slice(0,-1))at=at[key];at[keys.at(-1)]=value;}return copy;}
let mismatches=0;
for(const test of suite.cases){const errors=validatePreflight(apply(suite.base,test.set));const valid=errors.length===0;if(valid!==(test.expected==="valid")){mismatches++;console.error(test.id,errors);}}
const valid=suite.cases.filter(c=>c.expected==="valid").length;
console.log("D1 backfill preflight (synthetic only): "+suite.cases.length+" cases; "+valid+" valid, "+(suite.cases.length-valid)+" hostile; "+mismatches+" mismatches.");
console.log("No D1 connection or write is made by this test.");
if(mismatches)process.exit(1);
