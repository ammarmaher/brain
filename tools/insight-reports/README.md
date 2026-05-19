# Brain SK — Insight Reports Tool

Isolated tool folder for the **Executive Insight Reports** skill
([`skills/executive-insight-reports/SKILL.md`](../../skills/executive-insight-reports/SKILL.md)).

This tool renders professional, chart-heavy, boss-ready executive reports
(Markdown + HTML, PDF when the toolchain is available).

## Isolation rule

All dependencies for this tool stay **inside this folder**. They are never added
to the Falcon Angular workspace (`C:\Falcon\Falcon\falcon-web-platform-ui`) or to
any other Brain SK tool. Treat this folder as its own npm package.

## Dependency plan (planned — not yet installed)

This is a **setup-only** scaffold. No `npm install` has been run. Install the
dependencies the first time a real executive report is generated.

| Dependency | Role | Status |
|---|---|---|
| `echarts` | KPI cards, scorecards, radar/pie/bar/trend charts | preferred |
| `mermaid` | architecture / flow / sequence / dependency diagrams | preferred |
| `puppeteer` *or* `playwright` | HTML → PDF export | preferred (PDF optional) |
| `handlebars` *or* `mustache` | report HTML templating | preferred |
| `chart.js` | lightweight chart fallback | optional |

Default tool strategy:

```text
ECharts            -> dashboards, KPI charts, visual scorecards
Mermaid            -> flowcharts, architecture / sequence / dependency diagrams
puppeteer/playwright -> final boss-ready HTML -> PDF
Statistical Intelligence -> ALL KPI calculations and formulas (called first)
```

## Hard dependency rule

Executive Insight Reports **must call Statistical Intelligence first** whenever
the report needs KPIs, percentages, trends, or risk scores. This tool renders
numbers — it does not compute them. See
[`../statistics/README.md`](../statistics/README.md).

## Inputs / outputs

- **Reads:** `C:\Falcon\Brain Outputs\understanding\` + `C:\Falcon\Brain Outputs\reports\` (incl. `reports\statistics\`)
- **Writes:** `C:\Falcon\Brain Outputs\reports\executive-insights\<report-name>-<YYYY-MM-DD-HHmm>\`
- **Mirror:** additively to `C:\Falcon\Brain SK\outputs\reports\executive-insights\` (`robocopy /E /XO`, never `/MIR`)

## Chart provenance (mandatory)

Every report this tool generates must be fully traceable. Each report folder contains a Chart
Provenance block after every chart/diagram, a Chart Provenance table in the report body,
`CHART_PROVENANCE.md`, and `REPORT_GENERATION_TRACE.md`. Templates and a worked sample:
[`../../skills/executive-insight-reports/templates/README.md`](../../skills/executive-insight-reports/templates/README.md).
See the canonical skill section "Chart Provenance & Generation Trace (MANDATORY)".

## Safety

- The Markdown report is always produced; HTML/PDF export is optional if the toolchain is unavailable.
- Never invent or inflate numbers — charts only show values from Statistical Intelligence.
- Do not alter Falcon application code.
- Do not commit `node_modules/`, secrets, or build output.

See [`example-run.md`](example-run.md) and the canonical skill for report types,
design rules, chart types, and the output contract.
