# Statistics Reports

Output root for the Brain SK **Statistical Intelligence** skill
(`Brain SK/skills/statistical-intelligence/SKILL.md`).

Each statistics run creates one dated folder here:

```text
<stats-name>-<YYYY-MM-DD-HHmm>/
  STATISTICS_REPORT.md
  STATISTICS_DATA.json
  KPI_SUMMARY.md
  FORMULAS_USED.md
  DATA_QUALITY_REPORT.md
  RISK_SCORECARD.md
  REPORT_GENERATION_TRACE.md     (mandatory — generation trace)
  CHART_PROVENANCE.md            (when charts / chart-ready datasets are emitted)
  TREND_ANALYSIS.md              (only when previous data exists)
```

Runs mirror additively into `Brain SK/outputs/reports/statistics/`
(`robocopy /E /XO`, never `/MIR`).

Rules:

- Every KPI traces to explicit source data + formula. Missing data is reported
  as `UNKNOWN` / `NEEDS_DATA` — never guessed.
- Provenance is mandatory — every run writes `REPORT_GENERATION_TRACE.md`, and
  `CHART_PROVENANCE.md` whenever charts are emitted. See the canonical skill's
  *Chart Provenance & Generation Trace (MANDATORY)* section.
