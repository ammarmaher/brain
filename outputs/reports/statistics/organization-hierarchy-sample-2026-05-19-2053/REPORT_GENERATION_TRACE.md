# Report Generation Trace — Organization Hierarchy  *(SCAFFOLD)*

> **SCAFFOLD / TEMPLATE — no run executed.** This file shows the mandatory
> generation-trace contract. A real `/calculate-statistics` run fills it in.

- **Stats name:** organization-hierarchy
- **Run trigger:** SCAFFOLD (setup-only, 2026-05-19) — no prompt executed
- **Status:** NEEDS_DATA

## Inputs read

| File | Path | Status |
|---|---|---|
| (to be populated by a real run) | `Brain Outputs/understanding/pages/organization-hierarchy/...` | NEEDS_DATA |

## Tools / libraries used

| Step | Tool | Notes |
|---|---|---|
| query | duckdb / @duckdb/duckdb-wasm | NEEDS_DATA |
| transform | @datashaper/arquero | NEEDS_DATA |
| statistics | simple-statistics | NEEDS_DATA |

## Formulas applied

```text
Page Understanding % = (UIUX*0.35)+(Business*0.25)+(Validation*0.20)+(GapsResolved*0.20)
```

## Data-quality notes

- All metrics `NEEDS_DATA` — this is a scaffold, not a measured run.

## Notes

Provenance is mandatory for real runs: this trace plus per-dataset provenance
metadata (and `CHART_PROVENANCE.md` when charts are emitted). See the canonical
skill's *Chart Provenance & Generation Trace (MANDATORY)* section.
