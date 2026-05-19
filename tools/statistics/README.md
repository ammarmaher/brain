# Brain SK — Statistics Tool

Isolated tool folder for the **Statistical Intelligence** skill
([`skills/statistical-intelligence/SKILL.md`](../../skills/statistical-intelligence/SKILL.md)).

This tool computes KPIs, percentages, scores, risk scores, trends, and
chart-ready JSON for Brain SK statistics runs and executive reports.

## Isolation rule

All dependencies for this tool stay **inside this folder**. They are never added
to the Falcon Angular workspace (`C:\Falcon\Falcon\falcon-web-platform-ui`) or to
any other Brain SK tool. Treat this folder as its own npm package.

## Dependency plan (planned — not yet installed)

This is a **setup-only** scaffold. No `npm install` has been run. Install the
dependencies the first time a real statistics run is executed.

| Dependency | Role | Status |
|---|---|---|
| `simple-statistics` | descriptive stats, regression, distributions | preferred |
| `@datashaper/arquero` | clean / group / join / transform tabular data | preferred |
| `duckdb` *or* `@duckdb/duckdb-wasm` | SQL queries over JSON/CSV inputs — use the wasm build if the native build is incompatible | preferred |
| `jstat` | advanced statistical tests (t-test, chi-square, …) | optional — only if needed |

Default tool responsibility split:

```text
DuckDB            -> query data
Arquero           -> clean / group / transform data
simple-statistics -> calculate statistics
(ECharts)         -> chart-ready output is handed to tools/insight-reports
```

## Inputs / outputs

- **Reads:** `C:\Falcon\Brain Outputs\understanding\` + `C:\Falcon\Brain Outputs\reports\`
- **Writes:** `C:\Falcon\Brain Outputs\reports\statistics\<stats-name>-<YYYY-MM-DD-HHmm>\`
- **Mirror:** additively to `C:\Falcon\Brain SK\outputs\reports\statistics\` (`robocopy /E /XO`, never `/MIR`)

## Provenance (mandatory)

Every chart-ready dataset this tool exports must carry provenance metadata — skill, tool/library,
data source file(s), formula/metric, aggregation method. Every statistics run folder must contain
`REPORT_GENERATION_TRACE.md` (and `CHART_PROVENANCE.md` when the run emits charts). See the
canonical skill section "Chart Provenance & Generation Trace (MANDATORY)".

## Safety

- Never invent or inflate numbers — every KPI traces to explicit source data + formula.
- Missing data → `UNKNOWN` / `NEEDS_DATA`, never a guess.
- Do not alter Falcon application code.
- Do not commit `node_modules/`, secrets, or build output.

See [`example-run.md`](example-run.md) and the canonical skill for the full
statistics catalog, scoring thresholds, and formula rules.
