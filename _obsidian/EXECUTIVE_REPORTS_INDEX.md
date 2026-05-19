---
type: index
hub: executive-reports
created: 2026-05-19
---
# 📈 Executive Reports Index

Graph node for the **Executive Insight Reports** skill — the Brain SK skill that
turns Brain Outputs knowledge into professional, chart-heavy, boss-ready reports
(Markdown + HTML, PDF when the toolchain is available).

## Skill

- Canonical skill — [`../skills/executive-insight-reports/SKILL.md`](../skills/executive-insight-reports/SKILL.md)
- Shared-domain entry — [`../domains/shared/executive-insight-reports/SKILL.md`](../domains/shared/executive-insight-reports/SKILL.md)
- Shared domain — [`../domains/shared/SKILL.md`](../domains/shared/SKILL.md)
- Slash command — [`../.claude/commands/create-executive-report.md`](../.claude/commands/create-executive-report.md)

## Tool

- [`../tools/insight-reports/README.md`](../tools/insight-reports/README.md) — isolated charts/report tool + dependency plan
- [`../tools/insight-reports/example-run.md`](../tools/insight-reports/example-run.md)

## Dependency

Executive Insight Reports **calls Statistical Intelligence first** for every KPI,
percentage, trend, or risk score. Charts never show invented numbers. See
[[STATISTICS_INDEX]].

## Outputs

- Executive reports — `../../Brain Outputs/reports/executive-insights/<report-name>-<YYYY-MM-DD-HHmm>/`
- Mirror — `../outputs/reports/executive-insights/`

*(no executive reports generated yet — setup only)*

## Chart provenance (mandatory)

Every executive/dashboard report must be fully traceable. Each report folder contains:

- a **Chart Provenance block** after every chart and diagram (10 fields);
- a **Chart Provenance table** in the report body;
- **`CHART_PROVENANCE.md`** — per chart/diagram: what created it, what data was used, what formula was applied, which Brain SK skill triggered it, which output file contains it;
- **`REPORT_GENERATION_TRACE.md`** — triggered skill, sub-skills, tools, input folders, output files, Obsidian links, Git sync.

A report missing provenance is invalid. See the skill section "Chart Provenance & Generation Trace (MANDATORY)".

Templates + worked sample — [`../skills/executive-insight-reports/templates/README.md`](../skills/executive-insight-reports/templates/README.md):
[`EXECUTIVE_REPORT.template.md`](../skills/executive-insight-reports/templates/EXECUTIVE_REPORT.template.md) ·
[`CHART_PROVENANCE.template.md`](../skills/executive-insight-reports/templates/CHART_PROVENANCE.template.md) ·
[`REPORT_GENERATION_TRACE.template.md`](../skills/executive-insight-reports/templates/REPORT_GENERATION_TRACE.template.md) ·
[`sample-report/`](../skills/executive-insight-reports/templates/sample-report/EXECUTIVE_REPORT.md).

## Triggers

`create boss report` · `create executive report` · `create chart report` · `show
progress with charts` · `generate status PDF` · `make report for my boss` ·
`summarize with charts` · `create dashboard report`.

## Related

- [[STATISTICS_INDEX]] — required dependency (KPIs / formulas / chart-ready JSON)
- [[AMMAR_BRAIN_HOME]]
- [[PR_REVIEW_INDEX]] · [[FALCON_EYES_INDEX]] · [[PAGE_KNOWLEDGE_INDEX]] — common report inputs

#type/index #executive-reports #charts #shared-domain
