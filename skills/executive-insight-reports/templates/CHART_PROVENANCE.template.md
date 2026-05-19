# Chart Provenance — Template

> **Template file** — `skills/executive-insight-reports/templates/CHART_PROVENANCE.template.md`.
> Copy into every generated report folder as `CHART_PROVENANCE.md` and fill every field.
> Mandatory per the "Chart Provenance & Generation Trace (MANDATORY)" section of the
> Executive Insight Reports and Statistical Intelligence skills.
> Rule: never invent a value — unknown → `UNKNOWN` and flag it.

## Report header

- **Report:** <report name>
- **Report folder:** <output path, e.g. Brain Outputs/reports/executive-insights/<name>-<YYYY-MM-DD-HHmm>/>
- **Generated:** <YYYY-MM-DD HH:mm>
- **Report category:** <executive report | page learning | PR review | visual parity | component scan | statistics>
- **Triggering skill:** <e.g. Executive Insight Reports>
- **Total charts/diagrams in this report:** <N>

## Chart Provenance table

One row per chart/diagram — the same table that is embedded in the report body.

| Chart | Skill Used | Library | Data Source | Formula / Metric | Why This Chart |
|---|---|---|---|---|---|
| <chart title> | <skill(s)> | <library> | <data source file(s)> | <formula / metric> | <why this chart> |

## Per-chart provenance

Repeat this block for **every chart and every diagram** in the report.

### Chart <N> — <chart title>

- **Chart title:** <title>
- **Chart purpose:** <the question this chart answers>
- **Skill used:** <skill(s), e.g. Executive Insight Reports + Statistical Intelligence>
- **Tool / library used:** <e.g. ECharts | Mermaid | chart.js>
- **Data source file(s):** <explicit path(s) under Brain Outputs/...>
- **Metric / formula used:** <exact formula or KPI definition — must match FORMULAS_USED.md; `none` for a structural diagram>
- **Aggregation method:** <count | sum | mean | weighted | percentile | group-by | none>
- **Generated output path:** <chart/diagram file path, and the report section that renders it>
- **Why this chart type was selected:** <why this chart type fits the data and the audience>
- **Report category:** <executive report | page learning | PR review | visual parity | component scan | statistics>

Explanation (required by the `CHART_PROVENANCE.md` contract):

- **What created it:** <skill + tool/library>
- **What data was used:** <input dataset summary>
- **What formula was applied:** <formula / metric, or `none`>
- **Which Brain SK skill triggered it:** <skill>
- **Which output file contains the chart:** <file name(s) in this report folder>

## Validation checklist

- [ ] Every chart and every diagram in the report has a per-chart block above.
- [ ] Every value is factual — no invented skill, tool, library, formula, or data source.
- [ ] Formula/metric and data-source values match Statistical Intelligence `FORMULAS_USED.md`.
- [ ] The Chart Provenance table row count equals the number of charts + diagrams.
