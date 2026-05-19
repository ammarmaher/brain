# Executive Insight Reports Skill

## Purpose

Brain SK uses this skill to create professional, boss-ready chart-heavy reports.

This skill answers:

```text
How do we explain progress, quality, risks, gaps, and next actions beautifully?
```

It should create executive reports that are:

- chart-heavy
- table-heavy
- low text
- professional
- PDF-ready
- Obsidian/Git friendly
- suitable for status meetings

## Trigger phrases

Use this skill when Ammar says:

- create boss report
- create executive report
- create chart report
- show progress with charts
- generate status PDF
- make report for my boss
- summarize with charts
- create dashboard report
- create visual report
- create KPI report
- create statistics report with charts

## Recommended isolated stack

Tool folder:

```text
C:\Falcon\Brain SK\tools\insight-reports
```

Preferred dependencies:

```text
echarts
mermaid
puppeteer or playwright for HTML/PDF export
handlebars or mustache for templates
chart.js as optional lightweight fallback
```

Keep dependencies isolated. Do not add them to the Falcon Angular workspace unless explicitly needed.

## Tool strategy

```text
Apache ECharts = dashboards, KPI charts, visual scorecards
Mermaid = flowcharts, architecture diagrams, sequence diagrams, dependency graphs
HTML/PDF renderer = final boss-ready report
Statistical Intelligence = all KPI calculations and formulas
```

Executive Insight Reports must call Statistical Intelligence first when numbers or percentages are required.

## Canonical inputs

Read from:

```text
C:\Falcon\Brain Outputs\understanding
C:\Falcon\Brain Outputs\understanding\frontend
C:\Falcon\Brain Outputs\understanding\backend
C:\Falcon\Brain Outputs\understanding\service
C:\Falcon\Brain Outputs\understanding\pages
C:\Falcon\Brain Outputs\reports
C:\Falcon\Brain Outputs\reports\pr-reviews
C:\Falcon\Brain Outputs\reports\falcon-eyes
C:\Falcon\Brain Outputs\reports\component-scans
C:\Falcon\Brain Outputs\reports\statistics
```

## Report types

### Page Implementation Report

Shows:

- UI/UX %
- Validation %
- API %
- Business %
- Visual parity %
- Test coverage %
- Gap resolution %
- Before/after screenshots
- Remaining gaps
- Next actions

### Component Understanding Report

Shows:

- total components understood
- components ready
- components needing upgrade
- token coverage
- dynamic API support
- missing capabilities

### PR Review Report

Shows:

- final decision
- P0/P1/P2/P3 findings
- risk matrix
- required fixes
- source-truth coverage

### Falcon Eyes Visual Report

Shows:

- source/destination/diff screenshots
- section scores
- mismatch categories
- repair backlog
- visual parity trend

### Brain Capability Report

Shows:

- frontend understanding
- backend understanding
- API/DTO understanding
- page learning coverage
- Obsidian graph coverage
- approved patterns
- gaps

## Design rules

Every report must include:

1. Executive Summary
2. KPI Scorecard
3. Charts
4. Diagrams
5. Evidence
6. Risks / Gaps
7. Next Actions
8. Chart Provenance Table (see "Chart Provenance & Generation Trace (MANDATORY)")

Prefer:

- KPI cards at the top
- charts in the middle
- concise findings tables
- screenshots/evidence at the bottom
- minimal long paragraphs

## Default KPIs

Support:

- Understanding %
- Implementation %
- UI/UX %
- Validation %
- API %
- Business %
- Visual parity %
- Component reuse %
- Falcon custom component compliance %
- Tailwind/token compliance %
- Test coverage %
- Gap resolution %
- PR risk %
- Build health %
- Obsidian link coverage %

Thresholds:

```text
0–59% = NEEDS ATTENTION
60–74% = PARTIAL
75–89% = GOOD
90–94% = STRONG
95–100% = EXCELLENT
```

Do not inflate scores.

## Chart types

Use ECharts for:

- KPI cards data
- progress bars
- scorecards
- radar charts
- pie/donut charts
- stacked bars
- before/after trend charts
- severity charts
- PR review finding charts
- visual parity charts
- page learning charts
- component reuse charts
- gap resolution charts
- test/build status charts

Use Mermaid for:

- architecture diagrams
- page flow diagrams
- PRD flow diagrams
- API sequence diagrams
- component dependency diagrams
- approval/workflow diagrams
- learning flow diagrams

## Chart Provenance & Generation Trace (MANDATORY)

Every report this skill generates MUST be fully traceable. A reader must be able to see exactly which skill, tool, library, data source, and formula produced every chart and diagram. **A report missing provenance is invalid** and must be regenerated before it is shown to Ammar, committed, or sent to a boss. This applies to every chart AND every diagram (ECharts charts, Mermaid diagrams, KPI cards, scorecards) in every report category — executive report, page learning, PR review, visual parity, component scan, or statistics.

### 1. Per-chart Chart Provenance block

Immediately after every chart/diagram, emit a Chart Provenance block with ALL of these fields:

- chart title
- chart purpose
- skill used
- tool / library used
- data source file(s)
- metric / formula used
- aggregation method
- generated output path
- why this chart type was selected
- report category — one of: executive report · page learning · PR review · visual parity · component scan · statistics

### 2. Report-level Chart Provenance table

Every report MUST include this table, one row per chart:

| Chart | Skill Used | Library | Data Source | Formula / Metric | Why This Chart |
|---|---|---|---|---|---|

### 3. CHART_PROVENANCE.md — in every report folder

Every generated report folder MUST contain `CHART_PROVENANCE.md`, listing every chart/diagram and, for each: what created it · what data was used · what formula was applied · which Brain SK skill triggered it · which output file contains the chart. Template: `skills/executive-insight-reports/templates/CHART_PROVENANCE.template.md`.

### 4. REPORT_GENERATION_TRACE.md — in every report folder

Every generated report folder MUST contain `REPORT_GENERATION_TRACE.md`, recording: triggered skill · called sub-skills · tools used · input folders read · output files created · Obsidian links updated · Git sync status. Template: `skills/executive-insight-reports/templates/REPORT_GENERATION_TRACE.template.md`.

### Enforcement

- No chart without a provenance block. No report without the provenance table + `CHART_PROVENANCE.md` + `REPORT_GENERATION_TRACE.md`.
- Provenance must be factual. Never invent a skill, tool, library, formula, or data source — unknown → `UNKNOWN` and flag it.
- The formula/metric, data-source, and aggregation values come from Statistical Intelligence (`FORMULAS_USED.md` + chart-ready dataset metadata). Call Statistical Intelligence first and copy those values verbatim — never restate a formula from memory.
- Templates and a worked sample live in `skills/executive-insight-reports/templates/` (`EXECUTIVE_REPORT.template.md`, `CHART_PROVENANCE.template.md`, `REPORT_GENERATION_TRACE.template.md`, `sample-report/`).

## Outputs

For each report:

```text
C:\Falcon\Brain Outputs\reports\executive-insights\<report-name>-<YYYY-MM-DD-HHmm>\
```

Files:

```text
EXECUTIVE_REPORT.md
EXECUTIVE_REPORT.html
EXECUTIVE_REPORT.pdf if PDF tool works
EXECUTIVE_REPORT_DATA.json
CHART_PROVENANCE.md
REPORT_GENERATION_TRACE.md
charts\
diagrams\
screenshots\
evidence\
README.md
```

Mirror to:

```text
C:\Falcon\Brain SK\outputs\reports\executive-insights\<report-name>-<YYYY-MM-DD-HHmm>\
```

## Obsidian

Update/create:

```text
C:\Falcon\Brain SK\_obsidian\EXECUTIVE_REPORTS_INDEX.md
C:\Falcon\Brain SK\_obsidian\AMMAR_BRAIN_HOME.md
```

Link latest executive reports, page reports, PR review reports, Falcon Eyes reports, component understanding reports, and charts/diagrams where possible.

Do not touch Obsidian plugin files.

## Safety

- Do not alter application code.
- Do not commit secrets.
- HTML/PDF export is optional if the toolchain is unavailable.
- Markdown report must always be generated.
