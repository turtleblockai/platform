# Dr. Bryan P. Sanders TurtleBlock AI Research Ontology — D1 Catalog

The TurtleBlock AI D1 research layer is designed to preserve a longitudinal research program without collapsing original scholarship, later interpretation, pedagogical experiments, machine interpretation, and learner meaning into one undifferentiated corpus.

## Core rule

Original source terminology remains intact. Later mappings are additive, versioned, and provenance-aware.

`original source ≠ later interpretation ≠ operational Turtle mapping ≠ learner meaning`

## Major D1 areas

### Experimental interaction data

- `playground_submissions`
- `screening_findings`
- `research_data_events`
- `approved_dataset_rows`

These tables govern research-data screening, redaction, review, consent versioning, and explicit dataset approval.

### Operational Turtle continuity

- `turtle_sessions`
- `turtle_turns`
- `worldspec_revisions`
- `turtle_publications`

These preserve continuing projects, lossless learner language, Turtle dialogue, WorldSpec history, and learner-approved publication artifacts.

### Foundational scholarly ontology

- `ontology_versions`
- `ontology_sources`
- `ontology_concepts`
- `ontology_precepts`
- `ontology_precept_codes`
- `ontology_source_metrics`
- `ontology_relationships`
- `ontology_source_passages`
- `ontology_passages_fts`

The protected foundational layer begins with the 2019 dissertation and its exact Dedoose terminology, source mappings, metrics, relationships, and retrievable passages.

### Authored tools and later scholarship

- `ontology_tools`
- `ontology_tool_steps`
- `ontology_tool_concepts`

This includes the seven Critical Techno Constructivism Tenet → Question → Action structures and explicit later mappings back to the dissertation taxonomy.

### Longitudinal pedagogical and research experiments

- `pedagogical_experiments`
- `pedagogical_experiment_sources`
- `pedagogical_experiment_concepts`

Experiments can be documented, partially documented, author-reported, or source-needed. Date precision is also explicit. This prevents retrospective certainty from being inserted into the historical record.

Representative experiment rows include:

- Music + Literature Summer Enrichment
- The Experimental Classroom
- Literary-Character Fantasy-League Database and Embodied Play
- Hot Tub Fever
- STEAMHAMLET
- Minecraft as Persistent Learning Environment / Purposeful Play
- GPT Designed to Help Build Better GPTs
- Structured Database for the How of Building GPTs
- Public-Document Ingestion and Persistent Research Databases
- Sunshine Machine
- Iterative Generative Writing Toward Co-active Emergence
- RE/EDUCATION Focused Research and Practice
- TurtleBlock AI Field Tests

### Research catalog layer

Migration `0006` adds:

- `ontology_source_aliases`
- `ontology_source_artifacts`
- `ontology_source_relationships`

These distinguish a scholarly source from its manifestations. One source may have a DOI, web page, PDF, manuscript, presentation, repository, archive copy, or locally recovered artifact without becoming multiple intellectual sources.

## Catalog views

### `ontology_bibliography`

One-row-per-source bibliography with counts of artifacts, passages, and concepts.

```sql
SELECT *
FROM ontology_bibliography
ORDER BY publication_year, title;
```

### `ontology_source_completeness`

Audit which sources still need citation, URL, artifact recovery, passage ingestion, concept mapping, or experiment linkage.

```sql
SELECT *
FROM ontology_source_completeness
WHERE has_citation = 0
   OR has_artifact = 0
   OR has_passages = 0
ORDER BY publication_year, title;
```

### `ontology_experiment_timeline`

Chronological experiment browser with evidence status, recursive cycle, and documentation counts.

```sql
SELECT
  date_label,
  title,
  experiment_type,
  evidence_status,
  source_count,
  concept_count
FROM ontology_experiment_timeline
ORDER BY COALESCE(start_year, 9999), title;
```

### `ontology_retrieval_catalog`

A retrieval-oriented union of sources, concepts, passages, and experiments. Record identity remains explicit so a retrieved passage is not mistaken for a concept or later interpretation.

```sql
SELECT *
FROM ontology_retrieval_catalog
WHERE label LIKE '%Minecraft%';
```

## Create Boldly

The previously provisional California Teachers Summit source has been resolved as:

**Sanders, B. (2018). _Create Boldly_. California Teachers Summit.**

Recovered URL:

`http://cateacherssummit.com/create-boldly-bryan-sanders/`

The URL is cataloged as a source artifact. Passage-level ingestion should occur when the article text or an archived copy is recovered and inspected.

## Source lineage

`ontology_source_relationships` stores later research interpretation about how authored works and research-development systems relate over time. These relationships do not rewrite what an earlier source originally claimed.

Examples represented in D1 include:

`STEAMHAMLET → Virtual Learning Environments → Critical Techno Constructivism`

`Could Minecraft Be a School? → Purposeful Play`

`Engaging with AI → Co-active Emergence`

`GPT-building-GPT → structured GPT design database → ingestion systems → Sunshine Machine → TurtleBlock AI`

## Retrieval boundary

Turtle should eventually retrieve selectively from this ontology rather than loading the entire corpus. Retrieval should preserve at least:

- source identity
- source type
- source reference
- original versus later layer
- exact quotation versus paraphrase
- concept identity
- experiment evidence status
- provenance

A useful response bundle might therefore contain a source passage, its source, a linked concept, an authored operational tool, and a later experiment mapping as distinct objects rather than merged prose.

## Useful inspection queries

### Count every ontology table

```sql
SELECT 'sources' AS kind, COUNT(*) AS n FROM ontology_sources
UNION ALL SELECT 'concepts', COUNT(*) FROM ontology_concepts
UNION ALL SELECT 'passages', COUNT(*) FROM ontology_source_passages
UNION ALL SELECT 'relationships', COUNT(*) FROM ontology_relationships
UNION ALL SELECT 'tools', COUNT(*) FROM ontology_tools
UNION ALL SELECT 'tool_steps', COUNT(*) FROM ontology_tool_steps
UNION ALL SELECT 'experiments', COUNT(*) FROM pedagogical_experiments
UNION ALL SELECT 'source_artifacts', COUNT(*) FROM ontology_source_artifacts
UNION ALL SELECT 'source_lineage', COUNT(*) FROM ontology_source_relationships;
```

### Show all Sanders-authored sources

```sql
SELECT
  publication_year,
  source_type,
  title,
  canonical_citation,
  url
FROM ontology_sources
WHERE author LIKE '%Sanders%'
ORDER BY COALESCE(publication_year, 9999), title;
```

### Find experiments supported only by autobiographical reconstruction

```sql
SELECT
  date_label,
  title,
  evidence_status
FROM pedagogical_experiments
WHERE evidence_status IN ('author_reported','source_needed')
ORDER BY COALESCE(start_year, 9999), title;
```

### Follow the research-development chain into TurtleBlock AI

```sql
SELECT
  s1.title AS from_source,
  r.predicate,
  s2.title AS to_source,
  r.relationship_layer,
  r.notes
FROM ontology_source_relationships r
JOIN ontology_sources s1 ON s1.id = r.subject_source_id
JOIN ontology_sources s2 ON s2.id = r.object_source_id
ORDER BY COALESCE(s1.publication_year, 9999), s1.title;
```

## Activation

The migration files existing in GitHub does not mean the remote Cloudflare D1 database contains these tables or seed rows. Remote activation requires applying migrations and verifying them against the `turtleblockai` D1 database.

```bash
npx wrangler d1 migrations apply turtleblockai --remote
```

After application, inspect the database with the queries above and verify the migration history before allowing Turtle to depend on ontology retrieval.
