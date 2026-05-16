# Shared / Analytics / Data Visualization

The visualization brain for Ammar Brain. Converts numeric data into a fixed family of charts, scorecards, and dashboards used by every Brain SK report.

## Why it exists

Every report Brain SK emits — boss reports, capability reports, PRD reports, backend/frontend understanding, visual parity, implementation progress — was previously inventing its own tables and severity blocks. This skill makes the visual language **one set of building blocks** reused everywhere.

## What it does

- Renders 10 chart families: bar, donut/pie, scorecard, metric grid, gap severity, readiness, module comparison, confidence matrix, progress bar, statistics table
- Outputs Markdown / Mermaid / SVG fragments
- Writes to the canonical report tree under `C:\Falcon\Brain Outputs\`
- Enforces brand palettes, sourcing, and accessibility rules

## What it does NOT do

- Does **not** generate reports. Only fragments.
- Does **not** fetch data. Callers pass JSON in.
- Does **not** write inside `C:\Falcon\Brain SK\`. All outputs go to `Brain Outputs`.

## Entry points

- Main contract: [`SKILL.md`](SKILL.md)
- Chart catalog: [`CHART_TYPES.md`](CHART_TYPES.md)
- Input schema: [`SCHEMA.md`](SCHEMA.md)
- Palette tokens: [`PALETTES.md`](PALETTES.md)
- Integration guide: [`INTEGRATION.md`](INTEGRATION.md)

## Output home

```text
C:\Falcon\Brain Outputs\reports\<report-id>\charts\
C:\Falcon\Brain Outputs\reports\<report-id>\dashboards\
C:\Falcon\Brain Outputs\reports\dashboards\<dashboard-name>\
```
