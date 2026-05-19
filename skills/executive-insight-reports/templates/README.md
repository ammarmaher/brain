# Executive Insight Reports — Templates

Templates used by the **Executive Insight Reports** and **Statistical Intelligence**
skills to satisfy the mandatory **Chart Provenance & Generation Trace** requirement.

Every generated report or statistics-run folder must be fully traceable: a reader must
be able to see exactly which skill, tool, library, data source, and formula produced
every chart and every diagram.

## Files

| Template | Copy into the report folder as | Purpose |
|---|---|---|
| `EXECUTIVE_REPORT.template.md` | `EXECUTIVE_REPORT.md` | The report body — Chart Provenance table + a per-chart provenance block after every chart/diagram are built in. |
| `CHART_PROVENANCE.template.md` | `CHART_PROVENANCE.md` | Per-chart provenance for every chart/diagram: what created it, what data, what formula, which skill triggered it, which output file contains it. |
| `REPORT_GENERATION_TRACE.template.md` | `REPORT_GENERATION_TRACE.md` | How the report was generated: triggered skill, sub-skills, tools, input folders, output files, Obsidian links, Git sync status. |

## Worked sample

`sample-report/` is a complete filled example showing the provenance trace end to end —
`EXECUTIVE_REPORT.md` + `CHART_PROVENANCE.md` + `REPORT_GENERATION_TRACE.md`. All values
in the sample are marked `SAMPLE` (illustrative only — not a real statistics run).

## Rule

Never invent a value. Unknown → `UNKNOWN` and flag it. The formula / metric, data-source,
and aggregation values come from Statistical Intelligence (`FORMULAS_USED.md` and the
chart-ready dataset metadata) — copy them verbatim, never restate a formula from memory.

See: Executive Insight Reports skill → section "Chart Provenance & Generation Trace (MANDATORY)".
