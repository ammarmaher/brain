# Brain SK — Shared Domain

The **Shared** domain holds cross-cutting skills that any other domain
(Business, Frontend, Backend, Full-Stack) calls into. A shared skill does not
own a feature area — it provides reusable reporting, statistics, and analysis
capability for the whole brain.

Ammar does not need to name the domain. Brain SK auto-routes to a shared skill
whenever a task needs statistics, KPIs, percentages, scoring, charts, or
executive/boss reports.

## Skills in this domain

| Skill | Canonical | Domain entry | Use for |
|---|---|---|---|
| Statistical Intelligence | [`skills/statistical-intelligence/SKILL.md`](../../skills/statistical-intelligence/SKILL.md) | [`statistical-intelligence/SKILL.md`](statistical-intelligence/SKILL.md) | KPIs, percentages, scores, risk scores, trends, coverage, data quality |
| Executive Insight Reports | [`skills/executive-insight-reports/SKILL.md`](../../skills/executive-insight-reports/SKILL.md) | [`executive-insight-reports/SKILL.md`](executive-insight-reports/SKILL.md) | Boss-ready, chart-heavy, PDF-ready executive / status reports |

## Hard dependency rule

**Executive Insight Reports MUST call Statistical Intelligence first** whenever a
report needs KPIs, percentages, trends, or risk scores. Statistical Intelligence
produces the numbers + formulas + chart-ready JSON; Executive Insight Reports
only renders them. Charts must never display invented numbers.

## Provenance (mandatory)

Both skills must make every number and chart traceable — provenance is not
optional. Every statistics run writes `REPORT_GENERATION_TRACE.md` (and
`CHART_PROVENANCE.md` when charts are emitted) and tags each chart-ready dataset
with provenance metadata; every executive report carries a per-chart Chart
Provenance block, a Chart Provenance table, and `CHART_PROVENANCE.md` +
`REPORT_GENERATION_TRACE.md`. A report or run missing provenance is invalid. See
each canonical skill's `Chart Provenance & Generation Trace (MANDATORY)` section;
report templates live at `skills/executive-insight-reports/templates/`.

## Tooling

| Skill | Isolated tool folder |
|---|---|
| Statistical Intelligence | [`tools/statistics/`](../../tools/statistics/README.md) |
| Executive Insight Reports | [`tools/insight-reports/`](../../tools/insight-reports/README.md) |

Tool dependencies stay isolated in those folders and are never added to the
Falcon Angular workspace.

## Output paths

| Skill | Output |
|---|---|
| Statistical Intelligence | `C:\Falcon\Brain Outputs\reports\statistics\<stats-name>-<YYYY-MM-DD-HHmm>\` |
| Executive Insight Reports | `C:\Falcon\Brain Outputs\reports\executive-insights\<report-name>-<YYYY-MM-DD-HHmm>\` |

Both mirror additively into `C:\Falcon\Brain SK\outputs\` (`robocopy /E /XO`,
never `/MIR`).

## Obsidian graph nodes

- [`_obsidian/STATISTICS_INDEX.md`](../../_obsidian/STATISTICS_INDEX.md)
- [`_obsidian/EXECUTIVE_REPORTS_INDEX.md`](../../_obsidian/EXECUTIVE_REPORTS_INDEX.md)

## Safety

- Do not alter Falcon application code.
- Do not invent or inflate numbers — every KPI traces to explicit source data.
- Missing data → `UNKNOWN` / `NEEDS_DATA`, never a guess.
- Additive output sync only (`robocopy /E /XO`, never `/MIR`).
- Never commit secrets or Obsidian plugin data.
