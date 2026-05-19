# Brain SK — Shared Domain · Statistical Intelligence

This is the shared-domain entry point for **Statistical Intelligence**. It links
to the canonical skill and registers it for any domain that needs reliable
statistics, KPIs, percentages, scores, or trends.

**Canonical skill:** [`skills/statistical-intelligence/SKILL.md`](../../../skills/statistical-intelligence/SKILL.md)
**Shared domain:** [`domains/shared/SKILL.md`](../SKILL.md)

## When to use

Route here whenever a task — in any domain — needs calculated numbers:
statistics, KPI stats, report percentages, progress analysis, risk scores, page
scores, PR-review stats, visual-parity stats, coverage, or gap-resolution rates.

Trigger phrases: `calculate statistics` · `generate KPI stats` · `calculate
report percentages` · `analyze progress statistically` · `calculate risk score` ·
`calculate page score` · `calculate PR review stats` · `calculate visual parity
stats` · `make statistics for my boss report`.

## Process (summary)

1. Read canonical inputs from `Brain Outputs/understanding/` and `Brain Outputs/reports/`.
2. Compute descriptive / page-learning / UI-UX / validation / API / business /
   gap / PR-review / visual-parity / component statistics.
3. Apply the scoring thresholds and document every formula used.
4. Mark missing data `UNKNOWN` / `NEEDS_DATA` — never guess.
5. Emit the statistics report folder under
   `Brain Outputs/reports/statistics/<stats-name>-<YYYY-MM-DD-HHmm>/`.
6. Export chart-ready JSON when Executive Insight Reports is the caller.

## Tooling

Isolated tool folder: [`tools/statistics/`](../../../tools/statistics/README.md).
Slash command: `/calculate-statistics`.

## Hard rules

- Do not invent percentages — every KPI traces to explicit source data + formula.
- Do not inflate scores.
- Do not alter Falcon application code.
- Additive output sync only (`robocopy /E /XO`, never `/MIR`).
- **Provenance output is mandatory** — every chart-ready dataset carries provenance metadata (skill, tool/library, data source, formula/metric, aggregation); every statistics run folder contains `REPORT_GENERATION_TRACE.md` (and `CHART_PROVENANCE.md` when it emits charts). See the canonical skill section "Chart Provenance & Generation Trace (MANDATORY)".

See the canonical skill for the full statistics catalog, scoring thresholds,
formulas, and output contract.
