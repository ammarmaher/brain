---
type: index
hub: statistics
created: 2026-05-19
---
# 📊 Statistics Index

Graph node for the **Statistical Intelligence** skill — the Brain SK skill that
calculates KPIs, percentages, scores, risk scores, trends, coverage, and
data-quality numbers. It never invents numbers; every KPI traces to source data.

## Skill

- Canonical skill — [`../skills/statistical-intelligence/SKILL.md`](../skills/statistical-intelligence/SKILL.md)
- Shared-domain entry — [`../domains/shared/statistical-intelligence/SKILL.md`](../domains/shared/statistical-intelligence/SKILL.md)
- Shared domain — [`../domains/shared/SKILL.md`](../domains/shared/SKILL.md)
- Slash command — [`../.claude/commands/calculate-statistics.md`](../.claude/commands/calculate-statistics.md)

## Tool

- [`../tools/statistics/README.md`](../tools/statistics/README.md) — isolated statistics tool + dependency plan
- [`../tools/statistics/example-run.md`](../tools/statistics/example-run.md)

## Outputs

- Statistics reports — `../../Brain Outputs/reports/statistics/<stats-name>-<YYYY-MM-DD-HHmm>/`
- Mirror — `../outputs/reports/statistics/`

*(no statistics reports generated yet — setup only)*

## Provenance (mandatory)

Every statistics run must be traceable. Each run folder contains `REPORT_GENERATION_TRACE.md`
(and `CHART_PROVENANCE.md` when the run emits charts). Every chart-ready dataset carries
provenance metadata — skill, tool/library, data source file(s), formula/metric, aggregation
method — which Executive Insight Reports copies verbatim. See the skill section
"Chart Provenance & Generation Trace (MANDATORY)".

## Triggers

`calculate statistics` · `generate KPI stats` · `calculate report percentages` ·
`analyze progress statistically` · `calculate risk score` · `calculate page
score` · `calculate PR review stats` · `calculate visual parity stats` · `make
statistics for my boss report`.

## Routing

Statistical Intelligence runs whenever a task needs calculated numbers, and is
called **first** by Executive Insight Reports whenever a report needs KPIs,
percentages, trends, or risk scores.

## Related

- [[EXECUTIVE_REPORTS_INDEX]] — Executive Insight Reports consumes this skill's KPIs
- [[AMMAR_BRAIN_HOME]]
- [[PR_REVIEW_INDEX]] · [[FALCON_EYES_INDEX]] · [[PAGE_KNOWLEDGE_INDEX]] — common statistics inputs

#type/index #statistics #kpi #shared-domain
