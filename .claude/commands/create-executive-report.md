*** /create-executive-report — boss-ready chart report ***
*** Implemented by skills/executive-insight-reports/SKILL.md ***

# /create-executive-report

Run the Brain SK **Executive Insight Reports** skill to produce a professional,
chart-heavy, boss-ready report (Markdown + HTML, PDF when the toolchain is
available).

## What it does

1. **Calls Statistical Intelligence first** whenever the report needs KPIs,
   percentages, trends, or risk scores — charts never show invented numbers.
2. Reads canonical inputs from `C:\Falcon\Brain Outputs\understanding\` and
   `C:\Falcon\Brain Outputs\reports\` (including `reports\statistics\`).
3. Builds the report: Executive Summary → KPI Scorecard → Charts → Diagrams →
   Evidence → Risks/Gaps → Next Actions.
4. Emits the report folder under
   `C:\Falcon\Brain Outputs\reports\executive-insights\<report-name>-<YYYY-MM-DD-HHmm>\`
   (`EXECUTIVE_REPORT.md`, `.html`, `.pdf` if available,
   `EXECUTIVE_REPORT_DATA.json`, `CHART_PROVENANCE.md`,
   `REPORT_GENERATION_TRACE.md`, `charts\`, `diagrams\`, `screenshots\`,
   `evidence\`, `README.md`).
5. Mirrors additively to `C:\Falcon\Brain SK\outputs\reports\executive-insights\`.

## Aliases

These phrasings all route here:

- "create boss report" / "make report for my boss"
- "create executive report" / "create chart report"
- "show progress with charts" / "summarize with charts"
- "generate status PDF" / "create dashboard report"

## Dependency rule

Executive Insight Reports **must call Statistical Intelligence first** for any
numbers. It renders KPIs and charts — it does not compute them.

## Hard rules

- The Markdown report is always produced; HTML/PDF export is optional if the
  toolchain is unavailable.
- Never invent or inflate numbers.
- Provenance is mandatory — every chart/diagram gets a Chart Provenance block,
  every report carries a Chart Provenance table, and every report folder
  contains `CHART_PROVENANCE.md` + `REPORT_GENERATION_TRACE.md`.
- Does not modify Falcon application code.
- Additive output sync only — never `robocopy /MIR`.

## See also

- `skills/executive-insight-reports/SKILL.md` (see *Chart Provenance & Generation Trace*)
- `domains/shared/executive-insight-reports/SKILL.md`
- `skills/statistical-intelligence/SKILL.md` (required dependency)
- `tools/insight-reports/README.md`
- `_obsidian/EXECUTIVE_REPORTS_INDEX.md`
