import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_ROOTS = ['research', 'worldspec', 'public', 'src', 'scripts', 'migrations', '.github/workflows'];
const INCLUDED_EXTENSIONS = new Set(['.md', '.json', '.jsonc', '.yaml', '.yml', '.sql', '.ts', '.js', '.html']);
const EXCLUDED_BASENAMES = new Set(['package-lock.json']);

function walk(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const rel = path.posix.join(dir.replaceAll('\\', '/'), entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else if (entry.isFile()) out.push(rel);
  }
  return out;
}

function classify(file) {
  if (file.startsWith('research/daily-build/')) return 'daily_build';
  if (file.startsWith('research/d1-reconciliation/')) return 'reconciliation';
  if (file.startsWith('research/')) return 'research_artifact';
  if (file.startsWith('worldspec/')) return 'worldspec_or_ontology';
  if (file.startsWith('public/data/')) return 'public_data';
  if (file.startsWith('public/') && file.endsWith('/index.html')) return 'public_page';
  if (file.startsWith('public/')) return 'public_asset';
  if (file.startsWith('migrations/')) return 'migration';
  if (file.startsWith('scripts/')) return 'evaluation_or_tooling';
  if (file.startsWith('.github/workflows/')) return 'workflow';
  if (file.startsWith('src/')) return 'source_code';
  return 'other';
}

const candidates = SCAN_ROOTS.flatMap(walk)
  .filter((file) => INCLUDED_EXTENSIONS.has(path.extname(file)))
  .filter((file) => !EXCLUDED_BASENAMES.has(path.basename(file)))
  .sort();

const evidenceFiles = candidates.filter((file) =>
  file.startsWith('migrations/') ||
  file.endsWith('.tags.json') ||
  file === 'research/D1_RECONCILIATION.md'
);

const evidenceText = evidenceFiles
  .map((file) => fs.readFileSync(path.join(ROOT, file), 'utf8'))
  .join('\n');

const highPriorityClasses = new Set([
  'daily_build',
  'research_artifact',
  'worldspec_or_ontology',
  'public_data',
  'public_page',
  'migration',
  'evaluation_or_tooling',
  'workflow'
]);

const rows = candidates.map((file) => {
  const classification = classify(file);
  const mentioned = evidenceText.includes(file);
  return {
    file,
    classification,
    high_priority: highPriorityClasses.has(classification),
    declared_in_migration_or_tags: mentioned
  };
});

const gaps = rows.filter((row) => row.high_priority && !row.declared_in_migration_or_tags);
const summary = {
  schema: 'turtleblockai.d1-reconciliation-audit.v0.1',
  generated_at: new Date().toISOString(),
  note: 'Static repository audit only. A missing declaration is a reconciliation candidate, not proof that live D1 lacks the object. Live D1 must be queried separately when authorized.',
  counts: {
    candidates: rows.length,
    high_priority: rows.filter((row) => row.high_priority).length,
    declared_in_migration_or_tags: rows.filter((row) => row.declared_in_migration_or_tags).length,
    reconciliation_candidates: gaps.length
  },
  reconciliation_candidates: gaps
};

console.log(JSON.stringify(summary, null, 2));
