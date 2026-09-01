# Cloudflare D1 activation runbook

TurtleBlock AI currently runs without a D1 binding. The Playground interpreter works, but persistence returns `stored: false` until a database is created and bound.

## 1. Create the database

From the repository root after authenticating Wrangler:

```bash
npx wrangler d1 create turtleblockai-research
```

Cloudflare will return a database id.

## 2. Add the binding

Add the returned id to `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "turtleblockai-platform",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-30",
  "assets": {
    "directory": "./public",
    "binding": "ASSETS"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "turtleblockai-research",
      "database_id": "PASTE_DATABASE_ID_HERE"
    }
  ]
}
```

The binding name must remain `DB` because `src/index.ts` expects `env.DB`.

## 3. Apply the initial schema

Because D1 had not been created when the research pipeline was designed, `migrations/0001_playground_submissions.sql` is the canonical initial schema rather than a legacy migration plus patches.

Apply it remotely:

```bash
npx wrangler d1 execute turtleblockai-research --remote --file=./migrations/0001_playground_submissions.sql
```

For local testing first:

```bash
npx wrangler d1 execute turtleblockai-research --local --file=./migrations/0001_playground_submissions.sql
```

## 4. Deploy

```bash
npx wrangler deploy
```

If GitHub-to-Cloudflare automatic deployment is used, commit the D1 binding only after the database exists and the migration has been applied.

## 5. Smoke test

Submit one intentionally non-sensitive Playground prompt and confirm the response changes from:

```text
stored: false
```

to:

```text
stored: true
```

Then inspect the database:

```bash
npx wrangler d1 execute turtleblockai-research --remote --command="SELECT id, created_at, screening_status, review_status, dataset_status, redaction_applied FROM playground_submissions ORDER BY created_at DESC LIMIT 10;"
```

## 6. Test redaction without real personal data

Use obvious synthetic examples only, such as:

```text
My fake test email is turtle@example.com and my fake phone is 310-555-0100. Build a village around a lake.
```

Expected behavior:

- raw text remains in `input_text`
- `redacted_text` substitutes labels for detected values
- `screening_status = needs_review`
- `dataset_status = raw`
- `screening_findings` contains metadata/offsets but not a second copy of the sensitive match

Do **not** test with real credentials, real student data, real medical information, or genuine financial identifiers.

## 7. Approval remains separate

Do not create a public route that changes `review_status` or `dataset_status` to `approved`.

A later reviewer/admin workflow should:

1. inspect the raw and redacted forms;
2. inspect automated findings;
3. add reviewer notes if needed;
4. approve or reject the record;
5. write a `research_data_events` audit event;
6. only then set dataset status to `approved` or `rejected`.

The `approved_dataset_rows` view is the intended boundary for future dataset exports.
