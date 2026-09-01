# TurtleBlock AI Research Infrastructure

This directory documents how the public Playground can become a transparent, reviewable research corpus without treating every submission as automatically approved training data.

## Documents

- [DATA_PIPELINE.md](./DATA_PIPELINE.md) — raw → screened → redacted → candidate → reviewed → approved/rejected
- [CLOUDFLARE_D1_SETUP.md](./CLOUDFLARE_D1_SETUP.md) — exact activation steps once the Cloudflare D1 database is created

## Current state

The interpreter runs today, but D1 is intentionally **not yet bound**. The code already performs the deterministic screening pass in memory and reports what its persistence state would be. Once D1 is created and bound as `DB`, the same request path will begin writing the structured research records defined in `migrations/0001_playground_submissions.sql`.

The research boundary is deliberate:

```text
public Playground submission != approved dataset row
```

Only explicitly reviewed and approved redacted records belong in future curated research/evaluation/training exports.
