import { readFile } from "node:fs/promises";
import process from "node:process";

const path = process.argv[2] || "public/data/next-edge.json";
const errors = [];

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const fail = (message) => errors.push(message);

function requireString(object, key, options = {}) {
  const value = object[key];
  if (typeof value !== "string" || !value.trim()) {
    fail(`${key} must be a non-empty string`);
    return "";
  }
  if (options.pattern && !options.pattern.test(value)) fail(`${key} has an invalid format`);
  if (options.allowed && !options.allowed.includes(value)) fail(`${key} must be one of: ${options.allowed.join(", ")}`);
  return value;
}

function requireArray(object, key, min = 1) {
  const value = object[key];
  if (!Array.isArray(value) || value.length < min) {
    fail(`${key} must be an array with at least ${min} item${min === 1 ? "" : "s"}`);
    return [];
  }
  return value;
}

function requireRationalizedMappings(items, key, labelKey) {
  for (const [index, item] of items.entries()) {
    if (!isObject(item)) {
      fail(`${key}[${index}] must be an object`);
      continue;
    }
    if (typeof item[labelKey] !== "string" || !item[labelKey].trim()) {
      fail(`${key}[${index}].${labelKey} must be a non-empty string`);
    }
    if (typeof item.rationale !== "string" || !item.rationale.trim()) {
      fail(`${key}[${index}].rationale must be a non-empty string`);
    }
  }
}

function inspectForSecretBearingFields(value, trail = "root") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectForSecretBearingFields(item, `${trail}[${index}]`));
    return;
  }
  if (!isObject(value)) return;

  for (const [key, child] of Object.entries(value)) {
    if (/(api.?key|access.?token|refresh.?token|password|credential|private.?key|secret.?value)/i.test(key)) {
      fail(`${trail}.${key} looks secret-bearing; Next Edge may record metadata, never secret values`);
    }
    inspectForSecretBearingFields(child, `${trail}.${key}`);
  }
}

let edge;
try {
  edge = JSON.parse(await readFile(path, "utf8"));
} catch (error) {
  console.error(`Next Edge validation failed: could not read valid JSON from ${path}`);
  console.error(error.message);
  process.exit(1);
}

if (!isObject(edge)) fail("root must be a JSON object");

requireString(edge, "version");
requireString(edge, "updated_at", { pattern: /^\d{4}-\d{2}-\d{2}$/ });
requireString(edge, "status", { allowed: ["open_question"] });
requireString(edge, "title");
const question = requireString(edge, "question");
if (question && !question.trim().endsWith("?")) fail("question must remain an explicit question ending in ?");
requireString(edge, "why_now");
requireString(edge, "follows_commit", { pattern: /^[0-9a-f]{40}$/i });
requireString(edge, "follows_commit_role");
requireString(edge, "x_factor");
requireString(edge, "selected_by");
requireString(edge, "scope");

const inputs = requireArray(edge, "inputs", 4);
if (new Set(inputs.map(String)).size !== inputs.length) fail("inputs must not contain duplicates");

const sourceClasses = requireArray(edge, "source_classes_consulted", 3);
if (new Set(sourceClasses.map(String)).size !== sourceClasses.length) fail("source_classes_consulted must not contain duplicates");

const possibles = requireArray(edge, "possible_possibles", 3);
if (new Set(possibles.map(String)).size !== possibles.length) fail("possible_possibles must not contain duplicates");

requireArray(edge, "constraints", 3);
requireArray(edge, "uncaptured_residue", 1);

const ontologyMappings = requireArray(edge, "ontology_mappings", 1);
requireRationalizedMappings(ontologyMappings, "ontology_mappings", "concept_key");

const ctcMappings = requireArray(edge, "ctc_mappings", 1);
requireRationalizedMappings(ctcMappings, "ctc_mappings", "domain");

if (!isObject(edge.provenance)) {
  fail("provenance must be an object");
} else {
  requireString(edge.provenance, "evidence_class");
  requireString(edge.provenance, "privacy_class");
  requireString(edge.provenance, "selection_method");
}

inspectForSecretBearingFields(edge);

if (errors.length) {
  console.error(`Next Edge validation failed for ${path}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Next Edge manifest valid: ${edge.title}`);
console.log(`Question: ${edge.question}`);
console.log(`Follows completed build: ${edge.follows_commit}`);
console.log(`Possible possibles preserved: ${edge.possible_possibles.length}`);
console.log(`CTC mappings: ${edge.ctc_mappings.length}; ontology mappings: ${edge.ontology_mappings.length}`);
