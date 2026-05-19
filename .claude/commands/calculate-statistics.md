*** /calculate-statistics — KPI & statistics computation ***
*** Implemented by skills/statistical-intelligence/SKILL.md ***

# /calculate-statistics

Run the Brain SK **Statistical Intelligence** skill to compute reliable
statistics, KPIs, percentages, scores, risk scores, and trends from Brain
Outputs knowledge.

## What it does

1. Reads canonical inputs from `C:\Falcon\Brain Outputs\understanding\` and
   `C:\Falcon\Brain Outputs\reports\`.
2. Computes the requested statistics — descriptive, page-learning, UI/UX,
   validation, API, business, gap, PR-review, visual-parity, component.
3. Applies the scoring thresholds and records every formula used.
4. Marks missing data `UNKNOWN` / `NEEDS_DATA` — never guesses.
5. Emits the statistics report folder under
   `C:\Falcon\Brain Outputs\reports\statistics\<stats-name>-<YYYY-MM-DD-HHmm>\`
   (`STATISTICS_REPORT.md`, `STATISTICS_DATA.json`, `KPI_SUMMARY.md`,
   `FORMULAS_USED.md`, `DATA_QUALITY_REPORT.md`, `RISK_SCORECARD.md`,
   `REPORT_GENERATION_TRACE.md`, `CHART_PROVENANCE.md` when charts are emitted,
   `TREND_ANALYSIS.md` when prior data exists).
6. Exports chart-ready JSON — with provenance metadata — when Executive Insight
   Reports is the caller.
7. Mirrors additively to `C:\Falcon\Brain SK\outputs\reports\statistics\`.

## Aliases

These phrasings all route here:

- "calculate statistics" / "generate KPI stats"
- "calculate report percentages" / "analyze progress statistically"
- "calculate risk score" / "calculate page score"
- "calculate PR review stats" / "calculate visual parity stats"
- "make statistics for my boss report"

## Hard rules

- Never invent percentages — every KPI traces to explicit source data + formula.
- Never inflate scores.
- Provenance is mandatory — every run writes `REPORT_GENERATION_TRACE.md`, and
  every chart-ready dataset carries provenance metadata (skill, tool, data
  source, formula/metric, aggregation).
- Does not modify Falcon application code.
- Additive output sync only — never `robocopy /MIR`.

## See also

- `skills/statistical-intelligence/SKILL.md` (see *Chart Provenance & Generation Trace*)
- `domains/shared/statistical-intelligence/SKILL.md`
- `tools/statistics/README.md`
- `_obsidian/STATISTICS_INDEX.md`
