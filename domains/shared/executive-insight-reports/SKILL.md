# Brain SK — Shared Domain · Executive Insight Reports

This is the shared-domain entry point for **Executive Insight Reports**. It links
to the canonical skill and registers the report chain for any domain that needs
a professional, chart-heavy, boss-ready report.

**Canonical skill:** [`skills/executive-insight-reports/SKILL.md`](../../../skills/executive-insight-reports/SKILL.md)
**Shared domain:** [`domains/shared/SKILL.md`](../SKILL.md)

## When to use

Route here whenever Ammar asks for a status / boss / executive report that
should be chart-heavy, table-heavy, low-text, and PDF-ready.

Trigger phrases: `create boss report` · `create executive report` · `create
chart report` · `show progress with charts` · `generate status PDF` · `make
report for my boss` · `summarize with charts` · `create dashboard report`.

## Hard dependency rule

**Executive Insight Reports MUST call Statistical Intelligence first** whenever
the report needs KPIs, percentages, trends, or risk scores. Statistical
Intelligence owns the numbers + formulas + chart-ready JSON; this skill only
renders them. Charts never display invented numbers. See
[`domains/shared/statistical-intelligence/SKILL.md`](../statistical-intelligence/SKILL.md).

## Process (summary)

1. Call Statistical Intelligence first for every KPI / percentage / trend / risk.
2. Read canonical inputs from `Brain Outputs/understanding/` and `Brain Outputs/reports/`.
3. Build the report: Executive Summary → KPI Scorecard → Charts → Diagrams →
   Evidence → Risks/Gaps → Next Actions.
4. Emit the report folder under
   `Brain Outputs/reports/executive-insights/<report-name>-<YYYY-MM-DD-HHmm>/`.
5. Mirror additively to `Brain SK/outputs/reports/executive-insights/`.

## Tooling

Isolated tool folder: [`tools/insight-reports/`](../../../tools/insight-reports/README.md).
Slash command: `/create-executive-report`.

## Hard rules

- The Markdown report is always produced; HTML/PDF export is optional.
- Do not invent or inflate numbers.
- Do not alter Falcon application code.
- Additive output sync only (`robocopy /E /XO`, never `/MIR`).
- **Chart provenance is mandatory** — every chart and diagram gets a Chart Provenance block; every report carries the Chart Provenance table; every report folder contains `CHART_PROVENANCE.md` + `REPORT_GENERATION_TRACE.md`. See the canonical skill section "Chart Provenance & Generation Trace (MANDATORY)".

See the canonical skill for report types, design rules, chart/diagram types, and
the full output contract.
