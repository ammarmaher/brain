---
name: data-visualization
category: Shared / Analytics / Data Visualization
description: Render charts, scorecards, progress bars, statistics tables, gap charts, readiness charts, and capability dashboards for every Ammar Brain report. Used by the PDF/reporting system to convert metric JSON into Markdown + Mermaid + SVG visuals.
owner: Brain SK v0.1
status: active
---

# data-visualization

> **The visualization brain.** Any time Ammar Brain produces a report, it MUST route every numeric, percentage, gap, severity, readiness, or comparison fact through this skill instead of inventing ad-hoc tables.

## Purpose

Convert structured input (JSON / front-matter / Markdown tables) into a **standard family of visuals** that look identical across every report Ammar Brain emits:

- boss reports
- capability reports
- PRD reports
- backend understanding reports
- frontend component reports
- visual parity reports
- implementation progress reports

This skill **does NOT generate reports.** It generates the *building blocks* (charts + scorecards + tables) that report generators embed.

## When to invoke

This skill is invoked **automatically** by:

| Caller | Trigger |
|---|---|
| `skills/task-report-generator/SKILL.md` | Every task report build |
| `domains/frontend/component-knowledge/incremental-scan/SKILL.md` | Component scan report |
| `skills/business-understanding/SKILL.md` | PRD report and module readiness |
| `skills/backend-api-understanding/SKILL.md` | Backend understanding report |
| `skills/component-capability-upgrade/SKILL.md` | Capability dashboard |
| `skills/initial-bootstrap-discovery/SKILL.md` | Startup readiness report |
| `brain-skills/pdf-skills/*` (PDF Skills Suite) | PDF render pipeline |

Triggers (natural language):

- `chart this`, `visualize this`, `make a scorecard`
- `gap chart`, `severity chart`, `readiness chart`
- `module comparison`, `confidence matrix`, `capability dashboard`

## Supported chart types

| Type | Template | Best for |
|---|---|---|
| Bar chart | [`templates/bar-chart.md`](templates/bar-chart.md) | Comparing absolute values across categories |
| Donut / Pie | [`templates/donut-pie.md`](templates/donut-pie.md) | Composition / share of a total (≤7 slices) |
| Scorecard | [`templates/scorecard.md`](templates/scorecard.md) | Single headline metric with delta + trend |
| Metric grid | [`templates/metric-grid.md`](templates/metric-grid.md) | 4–12 KPIs in one block, mobile-friendly |
| Gap severity chart | [`templates/gap-severity.md`](templates/gap-severity.md) | HIGH / MEDIUM / LOW gap distribution |
| Readiness percentage | [`templates/readiness.md`](templates/readiness.md) | % complete per module/area with bar bars |
| Module comparison table | [`templates/module-comparison.md`](templates/module-comparison.md) | Module-by-module side-by-side scoring |
| Implementation confidence matrix | [`templates/confidence-matrix.md`](templates/confidence-matrix.md) | 2-axis (impact × confidence) capability map |
| Progress bar | [`templates/progress-bar.md`](templates/progress-bar.md) | Inline % bars inside tables |
| Statistics table | [`templates/stats-table.md`](templates/stats-table.md) | Raw numeric summary with min/max/avg |

See [`CHART_TYPES.md`](CHART_TYPES.md) for the full chart catalog with selection rules.

## Input contract

Every caller passes a **single visualization request** shaped like:

```json
{
  "chart": "bar | donut | scorecard | metric-grid | gap-severity | readiness | module-comparison | confidence-matrix | progress-bar | stats-table",
  "title": "Module readiness — May 2026",
  "subtitle": "Source: PRD + scan metadata",
  "data": [ /* shape depends on chart type — see CHART_TYPES.md */ ],
  "options": {
    "palette": "falcon-default | severity | readiness | neutral",
    "showLegend": true,
    "showValues": true,
    "sortBy": "value-desc",
    "max": 100,
    "unit": "%"
  },
  "outputs": ["markdown", "mermaid", "svg"]
}
```

The skill returns:

```json
{
  "markdown": "...",
  "mermaid": "...",
  "svg": "...",
  "caption": "Module readiness — May 2026 (Source: PRD + scan metadata)",
  "writtenTo": "C:/Falcon/Brain Outputs/reports/<report-id>/charts/<chart-id>.{md,mmd,svg}"
}
```

See [`SCHEMA.md`](SCHEMA.md) for the full JSON Schema per chart type.

## Output location (mandatory)

Generated visuals **never** live inside the core skill package. They are written to:

```text
C:\Falcon\Brain Outputs\reports\<report-id>\charts\
C:\Falcon\Brain Outputs\reports\<report-id>\dashboards\
C:\Falcon\Brain Outputs\reports\<report-id>\assets\
```

The active report writer chooses `<report-id>` (typically `<YYYY-MM-DD-HHmm>-<report-name>`).

For shared cross-report dashboards (capability, readiness, gap), the canonical home is:

```text
C:\Falcon\Brain Outputs\reports\dashboards\<dashboard-name>\
```

## Palettes & tokens

All chart colors must come from a registered palette. See [`PALETTES.md`](PALETTES.md):

| Palette | Use |
|---|---|
| `falcon-default` | Generic Falcon brand primaries (blue / teal / amber) |
| `severity` | HIGH=red-600, MEDIUM=amber-500, LOW=emerald-500 |
| `readiness` | red-500 / amber-400 / lime-500 / emerald-500 |
| `neutral` | Greyscale for monochrome PDF |
| `confidence` | 4-step blue ramp for confidence matrices |

Never hardcode hex values inside a chart. Always reference a palette token.

## Renderers

Each chart type ships three renderers — Markdown, Mermaid, SVG. The caller picks one or many via `outputs[]`:

| Renderer | When used | Engine |
|---|---|---|
| Markdown | Inline tables, scorecards, progress bars, severity chips | Pure GFM |
| Mermaid | Bar, pie/donut, gantt-style progress, confidence matrix | `mermaid` v10 fenced block |
| SVG | PDF-pipeline embedding, high-res dashboards | Hand-rolled minimal SVG (no JS) |

Renderer source files live in [`renderers/`](renderers/).

## Rules

1. Every report MUST cite its data source under each chart (`Source:` caption line).
2. Every percentage MUST round to one decimal and show the unit (`87.4%`, not `87`).
3. Every gap chart MUST surface HIGH count first, then MEDIUM, then LOW.
4. Every readiness chart MUST include a "remaining %" remainder so totals reach 100.
5. Charts MUST be deterministic — given the same input JSON, the output must be byte-identical (no random colors, no timestamps inside the chart body).
6. Charts MUST be color-blind-safe — never rely on red/green only; pair color with shape, label, or position.
7. Never generate reports inside this skill. Only chart fragments + dashboards.
8. Never commit secrets or local-only config (Falcon non-negotiable safety rule).
9. Follow the canonical output path. Do not write inside `C:\Falcon\Brain SK\`.
10. Follow architecture wiki governance and source-of-truth priority.

## Cross-skill dependencies

| Skill | Relationship |
|---|---|
| `shared/context-output/UNDERSTANDING_OUTPUT_PROTOCOL.md` | All chart files registered as understanding outputs |
| `shared/obsidian-auto-link/` | Charts auto-linked into Obsidian index notes when vault is present |
| `shared/git-sync/` | Generated chart files auto-synced (additive only — never `/MIR` or `/PURGE`) |
| `skills/task-report-generator/` | Primary consumer |

## Definition of done

A visualization request is complete only when:

- input JSON validates against the chart-type schema
- requested outputs (`markdown` / `mermaid` / `svg`) are produced
- files written to the canonical `Brain Outputs/reports/.../charts/` path
- palette is a registered token (no inline hex)
- caption includes a `Source:` line
- the calling report has the returned fragment embedded
- Obsidian index updated when the vault exists
- additive Git sync runs (no destructive flags)

## Files

- [`SKILL.md`](SKILL.md) — this file
- [`README.md`](README.md) — short overview for humans
- [`CHART_TYPES.md`](CHART_TYPES.md) — full chart catalog and selection rules
- [`SCHEMA.md`](SCHEMA.md) — JSON Schema per chart type
- [`PALETTES.md`](PALETTES.md) — color token reference
- [`INTEGRATION.md`](INTEGRATION.md) — how PDF/reporting callers wire in
- [`templates/`](templates/) — one Markdown template per chart type
- [`renderers/`](renderers/) — Markdown / Mermaid / SVG renderer notes
- [`examples/`](examples/) — sample inputs + outputs for each chart type
