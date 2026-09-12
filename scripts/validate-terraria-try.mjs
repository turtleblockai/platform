import fs from 'node:fs';

const entry = fs.readFileSync('src/entry.ts', 'utf8');
const client = fs.readFileSync('public/assets/terraria-try.js', 'utf8');

const checks = [
  ['Terraria play endpoint', entry.includes('/api/terraria/play')],
  ['Human + Turtle habitat', entry.includes('habitat-human-turtle') && entry.includes('human_turtle')],
  ['Terraria runs persistence', entry.includes('INSERT OR IGNORE INTO terraria_runs')],
  ['Terraria events persistence', entry.includes('INSERT OR IGNORE INTO terraria_events')],
  ['Raw dialogue not duplicated into Terraria events', entry.includes('raw_dialogue_duplicated_here: false')],
  ['TRY IT request rerouted through Terraria endpoint', client.includes("'/api/turtle/converse'") && client.includes("'/api/terraria/play'")],
  ['Wander entry mode', client.includes('wander')],
  ['Build entry mode', client.includes('build')],
  ['Perturb entry mode', client.includes('perturb')],
  ['Private-by-default explanation', client.includes('stays private by default')],
  ['No automatic learning claim', client.includes('not automatically') && client.includes('evidence of learning')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}

for (const [name] of checks) console.log(`PASS: ${name}`);
console.log('Terraria TRY IT contract valid.');
