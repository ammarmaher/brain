# Executive Insight Reports

Output root for the Brain SK **Executive Insight Reports** skill
(`Brain SK/skills/executive-insight-reports/SKILL.md`).

Each report creates one dated folder here:

```text
<report-name>-<YYYY-MM-DD-HHmm>/
  EXECUTIVE_REPORT.md
  EXECUTIVE_REPORT.html
  EXECUTIVE_REPORT.pdf           (only when the PDF toolchain works)
  EXECUTIVE_REPORT_DATA.json
  CHART_PROVENANCE.md            (mandatory — provenance of every chart/diagram)
  REPORT_GENERATION_TRACE.md     (mandatory — generation trace)
  charts/  diagrams/  screenshots/  evidence/
  README.md
```

Reports mirror additively into `Brain SK/outputs/reports/executive-insights/`
(`robocopy /E /XO`, never `/MIR`).

Rules:

- Executive Insight Reports calls Statistical Intelligence first for every
  KPI / percentage / trend / risk score. Charts never show invented numbers.
- Provenance is mandatory — every chart/diagram gets a Chart Provenance block,
  every report carries a Chart Provenance table, and every report folder
  contains `CHART_PROVENANCE.md` + `REPORT_GENERATION_TRACE.md`. See the
  canonical skill's *Chart Provenance & Generation Trace (MANDATORY)* section.
