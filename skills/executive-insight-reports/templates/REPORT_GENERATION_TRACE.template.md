# Report Generation Trace — Template

> **Template file** — `skills/executive-insight-reports/templates/REPORT_GENERATION_TRACE.template.md`.
> Copy into every generated report folder (and every statistics-run folder) as
> `REPORT_GENERATION_TRACE.md` and fill every field.
> Mandatory per the "Chart Provenance & Generation Trace (MANDATORY)" section of the
> Executive Insight Reports and Statistical Intelligence skills.

## Report header

- **Report:** <report name>
- **Report folder:** <output path>
- **Generated:** <YYYY-MM-DD HH:mm>

## Triggered skill

- **Triggering skill:** <e.g. Executive Insight Reports | Statistical Intelligence>
- **Trigger phrase / request:** <what the user asked, verbatim where possible>

## Called sub-skills

| Sub-skill | Purpose | Called when |
|---|---|---|
| Statistical Intelligence | KPI / formula / percentage / risk-score calculation | <step or condition> |
| <other sub-skill> | <purpose> | <when> |

## Tools used

| Tool / library | Version | Used for |
|---|---|---|
| <e.g. ECharts> | <version> | charts |
| <e.g. Mermaid> | <version> | diagrams |
| <e.g. simple-statistics> | <version> | statistics |
| <e.g. Playwright / Puppeteer> | <version> | HTML/PDF export |

## Input folders read

- <path under Brain Outputs/...>
- <path>

## Output files created

- <report folder>/EXECUTIVE_REPORT.md
- <report folder>/EXECUTIVE_REPORT.html
- <report folder>/CHART_PROVENANCE.md
- <report folder>/REPORT_GENERATION_TRACE.md
- <report folder>/... (charts/, diagrams/, EXECUTIVE_REPORT_DATA.json, etc.)

## Obsidian links updated

- <_obsidian index path> — <what was added or updated>

## Git sync status

- **Brain artifacts committed:** <yes / no — commit hash if yes>
- **Pushed:** <yes / no>
- **Excluded from commit (secrets / node_modules / dist / bin / obj / temp):** <list, or `none`>
- **Blockers:** <none | description>
