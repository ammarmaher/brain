# Example run — Brain SK Statistics Tool

Brain SK routes here when Ammar asks for calculated numbers. Example prompt:

```text
Calculate statistics for Organization Hierarchy using Brain SK Statistical Intelligence Skill.
```

Expected output folder:

```text
C:\Falcon\Brain Outputs\reports\statistics\organization-hierarchy-<YYYY-MM-DD-HHmm>\
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

> Setup-only note: tool dependencies are not yet installed. Run `npm install`
> inside this folder before the first real statistics run. Every KPI must trace
> to explicit source data — missing data is reported as `NEEDS_DATA`, never
> guessed — and every run writes a `REPORT_GENERATION_TRACE.md`.
