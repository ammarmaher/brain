# Report Generation Trace — Organization Hierarchy Implementation Status (SAMPLE)

> **SAMPLE** — illustrative values, demonstrates the mandatory `REPORT_GENERATION_TRACE.md` contract.
> Built from `skills/executive-insight-reports/templates/REPORT_GENERATION_TRACE.template.md`.

## Report header

- **Report:** Organization Hierarchy — Implementation Status (SAMPLE)
- **Report folder:** skills/executive-insight-reports/templates/sample-report/
- **Generated:** 2026-05-19 14:30 (SAMPLE)

## Triggered skill

- **Triggering skill:** Executive Insight Reports
- **Trigger phrase / request:** "create executive report for Organization Hierarchy" (SAMPLE)

## Called sub-skills

| Sub-skill | Purpose | Called when |
|---|---|---|
| Statistical Intelligence | KPI values, weighted readiness %, status thresholds | Before any chart that displays a number |

## Tools used

| Tool / library | Version | Used for |
|---|---|---|
| ECharts | 5.x (SAMPLE) | KPI scorecard bar chart |
| Mermaid | 10.x (SAMPLE) | page flow diagram |
| simple-statistics | latest (SAMPLE) | weighted average + threshold mapping |
| Playwright | latest (SAMPLE) | HTML / PDF export |

## Input folders read

- Brain Outputs/understanding/pages/organization-hierarchy/
- Brain Outputs/reports/statistics/ (latest Organization Hierarchy statistics run, if any)

## Output files created

- sample-report/EXECUTIVE_REPORT.md
- sample-report/CHART_PROVENANCE.md
- sample-report/REPORT_GENERATION_TRACE.md
- (a real run also creates: EXECUTIVE_REPORT.html, EXECUTIVE_REPORT_DATA.json, charts/, diagrams/)

## Obsidian links updated

- _obsidian/EXECUTIVE_REPORTS_INDEX.md — this sample linked under "Templates & sample"

## Git sync status

- **Brain artifacts committed:** no (SAMPLE — not committed)
- **Pushed:** no
- **Excluded from commit (secrets / node_modules / dist / bin / obj / temp):** none
- **Blockers:** none — this is a template sample, not a real run
