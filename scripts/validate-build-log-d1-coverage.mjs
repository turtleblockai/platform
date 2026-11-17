import {readFileSync,readdirSync} from "node:fs";

// Research-evidence contract only: verifies staged claims, NOT remote D1 persistence.
const validateCoverage = function validateCoverage(m,ids){
 const e=[],s=(x)=>typeof x==="string"&&x.trim().length>0;const fail=(x)=>e.push(x);
 if(m.schema!=="turtleblockai.build-log-coverage.v0.6")fail("schema");
 if(m.capture_batch_closed!==true)fail("capture_batch_closed");
 if(!/^\d{4}-\d{2}-\d{2}$/.test(m.date||""))fail("date");
 if(m.opening_sweep?.build_log_entry_count!==ids.length-1)fail("opening_count");
 if(m.closing_sweep?.build_log_entry_count!==ids.length)fail("closing_count");
 if(!Array.isArray(m.coverage))return [...e,"coverage"];
 const allowed=new Set(["represented_by_canonical_pointer","safely_backfilled","historically_verified_live_d1","represented_in_d1","staged_canonical_pointer"]);
 const entries=m.coverage.map(r=>Array.isArray(r)?r[0]:null);
 if(entries.length!==ids.length||new Set(entries).size!==ids.length||ids.some(id=>!entries.includes(id)))fail("full_build_log_matrix");
 if(m.coverage.some(r=>!Array.isArray(r)||r.length!==3||!s(r[0])||!allowed.has(r[1])||!s(r[2])))fail("coverage_status_or_pointer");
 if(m.historical_status_not_current_assertion!==true)fail("historical_not_current");
 const live=m.live_d1_observation||{};
 if(live.read_verified!==true||!Array.isArray(live.queries)||live.queries.length<3||live.queries.some(q=>!s(q)))fail("verified_live_read_queries");
 if(!Number.isInteger(live.build_log_objects)||live.build_log_objects<0||live.build_log_objects>ids.length)fail("live_object_count");
 if(live.established_ctc_domains!==7)fail("seven_domains");
 if(live.live_write_persisted===true){
   if(live.live_write_attempted!==true||!s(live.write_receipt)||!s(live.read_after_write_receipt))fail("unverified_write_claim");
   if(m.d1_persistence==="staged_only_no_new_write")fail("staging_cannot_claim_write");
 } else if(live.live_write_persisted!==false)fail("write_status_unverified");
 if(!Array.isArray(m.migration_gaps))fail("migration_gaps");
 else for(const g of m.migration_gaps){
   if(!s(g.repo_migration)||!s(g.table_name)||g.status!=="absent_live"||g.observed_live_table!==false||g.read_verified!==true||g.disposition!=="stage_for_human_review")fail("migration_gap_evidence");
 }
 if(!Array.isArray(m.closing_sweep?.uncovered_entry_ids)||m.closing_sweep.uncovered_entry_ids.length!==0)fail("uncovered_entries");
 return [...new Set(e)];
};
const ids=[...readFileSync("src/buildLog.ts","utf8").matchAll(/^\s+id:\s*"([^"]+)"/gm)].map(x=>x[1]);
const paths=readdirSync("research/daily-build").filter(p=>/^\d{4}-\d{2}-\d{2}\.coverage\.json$/.test(p)).sort();
const file=process.argv[2] || ("research/daily-build/"+paths.at(-1));
const manifest=JSON.parse(readFileSync(file,"utf8"));
const errors=validateCoverage(manifest,ids);
if(errors.length){console.error("Build Log/D1 coverage evidence failed:",errors.join(", "));process.exit(1);}
const tests=[
  ["missing-entry",x=>x.coverage.pop()],
  ["duplicate-id",x=>x.coverage[1][0]=x.coverage[0][0]],
  ["missing-pointer",x=>x.coverage[0][2]=""],
  ["fabricated-write",x=>x.live_d1_observation.live_write_persisted=true],
  ["unverified-read",x=>x.live_d1_observation.read_verified=false],
  ["eighth-domain",x=>x.live_d1_observation.established_ctc_domains=8],
  ["unverified-migration",x=>x.migration_gaps.push({repo_migration:"migrations/future.sql",table_name:"fictional_table",status:"absent_live",observed_live_table:false,read_verified:false,disposition:"stage_for_human_review"})],
  ["unclosed-batch",x=>x.capture_batch_closed=false],
  ["invented-live-coverage",x=>x.live_d1_observation.build_log_objects=100]
];
for(const [name,mutate] of tests){const copy=JSON.parse(JSON.stringify(manifest));mutate(copy);if(!validateCoverage(copy,ids).length){console.error("Hostile case accepted:",name);process.exit(1);}}
console.log("Full Build Log/D1 coverage: "+ids.length+" entries, no missing pointers; 9 hostile claim mutations rejected.");
console.log("Live D1 counts are recorded evidence, not re-queried by this script.");
