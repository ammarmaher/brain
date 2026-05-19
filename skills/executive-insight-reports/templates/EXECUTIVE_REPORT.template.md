# <Report Title>

> **Template file** — `skills/executive-insight-reports/templates/EXECUTIVE_REPORT.template.md`.
> Produced by the Executive Insight Reports skill. Every generated report folder MUST also
> contain `CHART_PROVENANCE.md` and `REPORT_GENERATION_TRACE.md` (templates beside this file).

- **Report category:** <executive report | page learning | PR review | visual parity | component scan | statistics>
- **Generated:** <YYYY-MM-DD HH:mm>
- **Triggering skill:** Executive Insight Reports
- **Numbers calculated by:** Statistical Intelligence (see `FORMULAS_USED.md`)

---

## 1. Executive Summary

<3–6 sentence plain-language summary for the boss.>

## 2. KPI Scorecard

| KPI | Value | Status | Source |
|---|---|---|---|
| <kpi> | <value %> | <NEEDS ATTENTION / PARTIAL / GOOD / STRONG / EXCELLENT> | <data source file> |

## 3. Charts

For **every** chart, render the chart, then immediately a Chart Provenance block.

### Chart 1 — <chart title>

<chart embed / image / ECharts spec reference>

**Chart Provenance**
- chart title: <title>
- chart purpose: <purpose>
- skill used: <skill(s)>
- tool / library used: <library>
- data source file(s): <path(s)>
- metric / formula used: <formula / metric>
- aggregation method: <method>
- generated output path: <path / report section>
- why this chart type was selected: <reason>
- report category: <category>

## 4. Diagrams

For **every** diagram, render the diagram, then immediately a Chart Provenance block (same 10 fields).

### Diagram 1 — <diagram title>

<Mermaid diagram block>

**Chart Provenance**
- chart title / chart purpose / skill used / tool-library used / data source file(s) / metric-formula used / aggregation method / generated output path / why this chart type / report category

## 5. Evidence

<screenshots, file references, links>

## 6. Risks / Gaps

| Risk / Gap | Severity | Notes |
|---|---|---|
| <item> | <severity> | <notes> |

## 7. Next Actions

1. <action>

## 8. Chart Provenance Table (MANDATORY)

One row per chart **and** diagram in this report.

| Chart | Skill Used | Library | Data Source | Formula / Metric | Why This Chart |
|---|---|---|---|---|---|
| <chart title> | <skill> | <library> | <data source> | <formula / metric> | <why> |

## Provenance & trace files

- [CHART_PROVENANCE.md](./CHART_PROVENANCE.md) — full per-chart provenance
- [REPORT_GENERATION_TRACE.md](./REPORT_GENERATION_TRACE.md) — how this report was generated
