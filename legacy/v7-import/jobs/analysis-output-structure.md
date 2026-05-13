*** Job: analysis-output-structure ***
*** Every Brain analysis (gap detection, PRD reasoning, business audit, etc.) writes its result into C:\falcon\Brain\analysis\ organized by abstraction level. ***
*** Triggered by: "night mode: analysis output" / "set up analysis folders" ***

# Job: Analysis Output Folder Structure

## Status

DONE (2026-05-01).

## Pre-approved design (verbatim user request 2026-04-30)

> "I need, when you finish searching the best way to implement the brain and how we can fix all the business issues and gaps, the result also always will be in our folder inside the brain. That has the folder from abstraction level inside it that has the output, so it will be a schema or tables or text or anything."

The Brain produces a lot of analysis output (gap reports, PRD interpretations, business audits, schema diffs, decision tables). All of it lives under `C:\falcon\Brain\analysis\`, sorted by abstraction level so the user can drill from high-level summary down to raw data.

## Folder structure to create

```
C:\falcon\Brain\analysis\
  README.md                                  Index of analysis levels + how output gets routed
  L0-summary\                                One-pager rollups (latest only — overwritten)
    business-state.md                        Current snapshot of business gaps/coverage
    pipeline-state.md                        Current pipeline status
    prd-coverage.md                          PRD vs implementation coverage matrix
  L1-abstraction\                            High-level diagrams, narrative reports
    YYYYMMDD\                                Dated folder per analysis run
      <topic>.md
  L2-business\                               Business rules, permission matrices, status transitions
    YYYYMMDD\
      <topic>-rules.md
      <topic>-permissions.md
      <topic>-transitions.md
  L3-technical\                              File-level diffs, code paths, schemas
    YYYYMMDD\
      <topic>-files.md
      <topic>-schema.json
      <topic>-api-map.md
  schemas\                                   Stable schemas (referenced by L0/L1/L2/L3 outputs)
    business-state.schema.json
    gap-report.schema.json
    prd-coverage.schema.json
    test-case.schema.json
  tables\                                    Reusable canonical tables (CSV + markdown)
    role-action-matrix.csv
    role-action-matrix.md
    status-transitions.csv
    permission-matrix.csv
  raw\                                       Untransformed source captures (Drive zips, screenshots)
    YYYYMMDD\
      <source>\
  index.json                                 Auto-generated — lists every analysis run with metadata
```

## Routing rules (which agent writes where)

| Analysis | Output level | Folder |
|---|---|---|
| business-gap-detection skill | L0 + L2 | `L0-summary/business-state.md`, `L2-business/<date>/gaps.md` |
| prd-knowledge sync | L1 | `L1-abstraction/<date>/<module>-prd-summary.md` + `raw/<date>/<module>/` |
| domain-glossary additions | tables | `tables/glossary-deltas.md` |
| module-catalog dossier | L1 + L2 | `L1-abstraction/<date>/<module>-overview.md`, `L2-business/<date>/<module>-rules.md` |
| test-case-authoring | L2 | `L2-business/<date>/<module>-test-cases.md` (Gherkin) |
| Brain orchestrator state changes | (nothing here — `Brain\state\` owns those) | — |
| Voice config audit | (nothing — settings\ owns) | — |

## Index format (`index.json` shape)

```json
{
  "runs": [
    {
      "id": "20260430-business-gap-detection",
      "type": "business-gap-detection",
      "level": "L2",
      "outputs": ["L2-business/20260430/gaps.md"],
      "summary": "12 unanswered conditions found across Account, Contact-Group modules.",
      "timestamp": "2026-04-30T22:00:00Z"
    }
  ]
}
```

## Execution checklist (the night job runs this)

1. Create the full folder tree above with empty/seeded files.
2. `analysis/README.md` documents the levels + routing rules.
3. Each schema file under `schemas/` has a real JSON Schema (draft-07).
4. `tables/role-action-matrix.csv` + `.md` are seeded with current Falcon roles (read from `falcon-wiki\Home\Software-Architecture-Design\Permissions-&-Authorization-Module-(Policy-Based-Access-Control).md` if present; else stub with TODO comment).
5. `index.json` exists with empty `runs: []`.
6. Update `Brain\Skill.md` with a "Where outputs land" pointer to `analysis\README.md`.

## Out of scope

- Do not run any actual analysis right now. This job ONLY creates the folder + schema scaffolding.
- Do not touch service code, voice samples, or settings.

## Done definition

- `Brain\analysis\` exists with all 5 level folders + `schemas\` + `tables\` + `raw\` + `index.json` + `README.md`.
- Schemas validate as JSON Schema draft-07.
- Skill.md links to the new structure.
