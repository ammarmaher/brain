# Chart Provenance — Organization Hierarchy Implementation Status (SAMPLE)

> **SAMPLE** — illustrative values, demonstrates the mandatory `CHART_PROVENANCE.md` contract.
> Built from `skills/executive-insight-reports/templates/CHART_PROVENANCE.template.md`.

## Report header

- **Report:** Organization Hierarchy — Implementation Status (SAMPLE)
- **Report folder:** skills/executive-insight-reports/templates/sample-report/
- **Generated:** 2026-05-19 14:30 (SAMPLE)
- **Report category:** executive report
- **Triggering skill:** Executive Insight Reports
- **Total charts/diagrams in this report:** 2

## Chart Provenance table

| Chart | Skill Used | Library | Data Source | Formula / Metric | Why This Chart |
|---|---|---|---|---|---|
| Page Implementation Readiness Scorecard | Executive Insight Reports + Statistical Intelligence | ECharts (bar) | PAGE_SCORECARD.md, API_RULES.md | Page Implementation Readiness % = (UIUX*0.25)+(Business*0.20)+(Validation*0.20)+(API*0.20)+(TestCoverage*0.15) | Bar chart compares dimension scores at a glance for a non-technical reader |
| Organization Hierarchy Page Flow | Executive Insight Reports | Mermaid (flowchart) | PAGE_LEARNING.md | none (structural diagram) | Left-to-right flowchart shows the linear page flow clearly |

## Per-chart provenance

### Chart 1 — Page Implementation Readiness Scorecard

- **Chart title:** Page Implementation Readiness Scorecard
- **Chart purpose:** Show each implementation dimension's score against the 0–100 scale
- **Skill used:** Executive Insight Reports + Statistical Intelligence
- **Tool / library used:** ECharts (bar chart)
- **Data source file(s):** Brain Outputs/understanding/pages/organization-hierarchy/PAGE_SCORECARD.md; .../API_RULES.md
- **Metric / formula used:** Page Implementation Readiness % = (UIUX*0.25)+(Business*0.20)+(Validation*0.20)+(API*0.20)+(TestCoverage*0.15)
- **Aggregation method:** weighted average
- **Generated output path:** sample-report/charts/page-readiness-scorecard.json → rendered in EXECUTIVE_REPORT.md §3
- **Why this chart type was selected:** a bar chart compares independent dimension scores on one axis at a glance
- **Report category:** executive report
- **What created it:** Executive Insight Reports skill, ECharts library
- **What data was used:** UI/UX, Business, Validation, API and Test-coverage dimension scores from PAGE_SCORECARD.md (SAMPLE)
- **What formula was applied:** Page Implementation Readiness % (weighted) — see Statistical Intelligence `FORMULAS_USED.md`
- **Which Brain SK skill triggered it:** Executive Insight Reports (numbers supplied by Statistical Intelligence)
- **Which output file contains the chart:** EXECUTIVE_REPORT.md (§3) and EXECUTIVE_REPORT.html

### Chart 2 (Diagram) — Organization Hierarchy Page Flow

- **Chart title:** Organization Hierarchy Page Flow
- **Chart purpose:** Show the page load and primary-action flow for the boss
- **Skill used:** Executive Insight Reports
- **Tool / library used:** Mermaid (flowchart)
- **Data source file(s):** Brain Outputs/understanding/pages/organization-hierarchy/PAGE_LEARNING.md
- **Metric / formula used:** none (structural diagram, not a metric)
- **Aggregation method:** none
- **Generated output path:** sample-report/diagrams/org-hierarchy-flow.mmd → rendered in EXECUTIVE_REPORT.md §4
- **Why this chart type was selected:** a left-to-right flowchart is the clearest way to show a linear page flow
- **Report category:** executive report
- **What created it:** Executive Insight Reports skill, Mermaid library
- **What data was used:** the page flow described in PAGE_LEARNING.md (SAMPLE)
- **What formula was applied:** none — structural diagram
- **Which Brain SK skill triggered it:** Executive Insight Reports
- **Which output file contains the chart:** EXECUTIVE_REPORT.md (§4) and EXECUTIVE_REPORT.html

## Validation checklist

- [x] Every chart and every diagram has a per-chart block.
- [x] Every value is factual or explicitly marked `SAMPLE`.
- [x] Formula/metric values match the Statistical Intelligence formula catalog.
- [x] The Chart Provenance table row count (2) equals charts + diagrams (2).
