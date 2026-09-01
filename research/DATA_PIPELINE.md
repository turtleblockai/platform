# TurtleBlock AI Research Data Pipeline

Status: **pre-D1 activation**

This document defines how public Playground submissions move from raw learner input to any future research/evaluation/training dataset.

## Core rule

A Playground submission is **not** automatically training data.

The lifecycle is:

```text
submission
  -> raw record
  -> automated screening
      -> clean
      -> needs_review
      -> rejected
  -> redacted candidate text
  -> explicit research review
      -> approved
      -> rejected
  -> approved dataset view/export
```

Only records that are both `review_status = approved` and `dataset_status = approved`, and that have non-null `redacted_text`, are exposed by the `approved_dataset_rows` database view.

## What is stored

When D1 is eventually bound, each submission may store:

- a random submission id
- creation time
- anonymous browser session id
- raw learner input
- redacted learner input
- consent version
- WorldSpec version
- Turtle interpretation JSON
- automated-screening version and status
- whether redaction was applied
- research review state
- dataset state
- provenance JSON

TurtleBlock AI does **not intentionally store IP addresses in this research schema**.

Cloudflare may separately maintain ordinary infrastructure/security logs; those are not the TurtleBlock AI research dataset.

## Automated screening

`src/researchData.ts` currently implements a conservative deterministic first pass for obvious personal/secret-like values, including:

- email addresses
- phone numbers
- Social Security number patterns
- payment-card-like number patterns
- password/passcode/API-key/secret/token assignments

This screening layer is intentionally incomplete. It is a preprocessing safeguard, not a claim that the text is fully de-identified or safe.

The system records finding metadata and offsets but deliberately does **not** duplicate the matched sensitive value into the findings table.

### Screening states

- `clean`: no current deterministic finding; may become a dataset `candidate`
- `needs_review`: redaction or human judgment is required before dataset candidacy
- `rejected`: high-risk obvious secret/identifier pattern; excluded from candidacy by default

A future content-moderation/model-assisted screening layer can add findings, but it should preserve the same provenance model and must not silently convert flagged material into approved data.

## Dataset states

- `raw`: retained research submission, not a dataset candidate
- `candidate`: passed current automated screening but still requires explicit review
- `approved`: explicitly approved for the curated dataset
- `rejected`: excluded from the curated dataset

There is intentionally no public API endpoint that can mark a record approved.

## Provenance and events

`research_data_events` records important state transitions, such as:

- submission received
- automated screening completed
- future reviewer approval/rejection
- future re-screening with a newer screening version
- future dataset export/version inclusion

The purpose is to make it possible to answer later:

> Why is this row in this dataset, what transformations were applied, what consent covered it, and what software/reviewer decision admitted it?

## Raw vs. redacted data

Raw input is retained separately so TurtleBlock AI can study parsing failures and improve the interpreter. Raw text is **not** the preferred dataset field.

Dataset curation should use `redacted_text`.

If future research governance decides raw text should be deleted after a retention period, that policy can be added without changing the dataset contract.

## Session-level research

The anonymous browser session id allows related revisions to be connected without requiring an account. This is important because TurtleBlock AI is interested not only in isolated prompts but in the sequence:

```text
learner utterance
-> Turtle interpretation
-> clarification / experiment
-> learner revision
-> changed WorldSpec
-> observation
-> reflection
```

That sequence is closer to the project's concept of co-active emergence than a bag of disconnected prompts.

## Before enabling persistence

Do not add the D1 binding until:

1. the database is created;
2. migration `0001_playground_submissions.sql` is applied;
3. the binding is configured as `DB`;
4. the Privacy Notice still matches the implemented behavior;
5. at least one test submission is inspected end-to-end;
6. the research review/export process is defined before any row is marked `approved`.
