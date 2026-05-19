# Statistical Intelligence Skill

## Purpose

Brain SK uses this skill to calculate reliable statistics for reports, dashboards, PR reviews, page learning, visual parity, component scans, backend/API understanding, and executive reports.

This skill answers:

```text
Are the numbers meaningful, accurate, trending, improving, or risky?
```

It must not invent percentages. Every KPI must come from explicit source data, formulas, and evidence.

## Triggers

Use this skill when Ammar says:

- calculate statistics
- generate KPI stats
- calculate report percentages
- analyze progress statistically
- calculate risk score
- calculate page score
- calculate PR review stats
- calculate visual parity stats
- make statistics for my boss report
- create dashboard numbers
- calculate coverage
- calculate gap resolution

## Recommended isolated stack

Keep tool dependencies isolated under:

```text
C:\Falcon\Brain SK\tools\statistics
```

Preferred dependencies:

```text
simple-statistics
@datashaper/arquero
duckdb or @duckdb/duckdb-wasm if compatible
jstat only if advanced statistical tests are needed
```

Default tool responsibility:

```text
DuckDB = query data
Arquero = clean/group/transform data
simple-statistics = calculate stats
ECharts = chart-ready output for reports
```

## Canonical inputs

Read from:

```text
C:\Falcon\Brain Outputs\understanding
C:\Falcon\Brain Outputs\understanding\pages
C:\Falcon\Brain Outputs\understanding\frontend
C:\Falcon\Brain Outputs\understanding\backend
C:\Falcon\Brain Outputs\understanding\service
C:\Falcon\Brain Outputs\reports
C:\Falcon\Brain Outputs\reports\pr-reviews
C:\Falcon\Brain Outputs\reports\falcon-eyes
C:\Falcon\Brain Outputs\reports\component-scans
C:\Falcon\Brain Outputs\reports\executive-insights
```

For Organization Hierarchy:

```text
C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy
```

## Statistics supported

### Descriptive statistics

- count
- sum
- min
- max
- mean
- median
- mode
- variance
- standard deviation
- percentile
- distribution

### Page learning statistics

- total learning events
- pending events
- approved events
- rejected events
- promoted events
- approval rate
- promotion rate
- stale pending count
- learning velocity

### UI/UX statistics

- total UI rules
- applied
- not applied
- partially applied
- unknown
- blocked
- UI/UX score

### Validation statistics

- total validation rules
- implemented
- missing
- partially implemented
- blocked
- validation score

### API statistics

- total endpoints involved
- mapped DTOs
- missing DTOs
- contract gaps
- API readiness %

### Business statistics

- total business rules
- implemented
- missing
- unclear
- business coverage %

### Gap statistics

- open gaps
- resolved gaps
- deferred gaps
- gap age
- severity distribution
- gap resolution %

### PR review statistics

- total findings
- P0/P1/P2/P3 counts
- blocker rate
- major issue rate
- risk score
- approval decision support

### Visual parity statistics

- section score average
- before/after improvement
- P0/P1/P2/P3 visual mismatch count
- sections below 60
- sections below 90
- parity trend per round

### Component statistics

- total components used
- Falcon components reused
- upgraded components
- new components created
- raw HTML violations
- Tailwind/token compliance %

## Scoring thresholds

Use these default statuses:

```text
0–59% = NEEDS ATTENTION
60–74% = PARTIAL
75–89% = GOOD
90–94% = STRONG
95–100% = EXCELLENT
```

If data is missing:

```text
UNKNOWN or NEEDS_DATA
```

Do not guess.

## Formula rules

All reports must include formulas used.

Default weighted page understanding:

```text
Page Understanding % =
(UIUX * 0.35) +
(Business * 0.25) +
(Validation * 0.20) +
(GapsResolved * 0.20)
```

If API is part of the page scope:

```text
Page Implementation Readiness % =
(UIUX * 0.25) +
(Business * 0.20) +
(Validation * 0.20) +
(API * 0.20) +
(TestCoverage * 0.15)
```

PR risk score example:

```text
Risk Score =
(P0 * 40) +
(P1 * 20) +
(P2 * 8) +
(P3 * 2)
```

Visual parity improvement:

```text
Improvement % = currentScore - previousScore
Relative Improvement % = ((currentScore - previousScore) / max(previousScore, 1)) * 100
```

## Outputs

For every statistics run, generate:

```text
C:\Falcon\Brain Outputs\reports\statistics\<stats-name>-<YYYY-MM-DD-HHmm>\
```

Required files:

```text
STATISTICS_REPORT.md
STATISTICS_DATA.json
KPI_SUMMARY.md
FORMULAS_USED.md
DATA_QUALITY_REPORT.md
RISK_SCORECARD.md
CHART_PROVENANCE.md if the run produced charts
REPORT_GENERATION_TRACE.md
TREND_ANALYSIS.md if previous data exists
```

If used by Executive Insight Reports, also export:

```text
chart-ready JSON
KPI card data
ECharts dataset format
Mermaid summary if useful
```

## Chart Provenance & Generation Trace (MANDATORY)

Statistical Intelligence is the **source of truth for the provenance of every number** — the formula, data source, and aggregation behind every KPI. Executive Insight Reports relies on this skill to fill its Chart Provenance fields, so this skill MUST emit provenance, not just results.

### 1. Provenance metadata on every chart-ready dataset

Every chart-ready JSON / KPI card dataset / ECharts dataset this skill exports MUST carry provenance metadata: skill used · tool / library used · data source file(s) · metric / formula used (also recorded in `FORMULAS_USED.md`) · aggregation method. Executive Insight Reports copies these verbatim into its Chart Provenance block and table — never hand a downstream report a number without its provenance.

### 2. REPORT_GENERATION_TRACE.md for every statistics run

Every statistics run folder MUST contain `REPORT_GENERATION_TRACE.md`: triggered skill · called sub-skills · tools used · input folders read · output files created · Obsidian links updated · Git sync status. Template: `skills/executive-insight-reports/templates/REPORT_GENERATION_TRACE.template.md`.

### 3. CHART_PROVENANCE.md when a statistics run emits charts

If a statistics run itself produces charts/diagrams, its folder MUST also contain `CHART_PROVENANCE.md` — same template and rules as Executive Insight Reports (`skills/executive-insight-reports/templates/CHART_PROVENANCE.template.md`).

### Enforcement

- A chart-ready dataset without provenance metadata is invalid — the consumer must reject it and request a re-run.
- Never invent a formula, tool, library, or data source — unknown → `UNKNOWN` and flag it. This extends the existing "do not invent data / do not inflate scores" rule.

## Obsidian

Update/create:

```text
C:\Falcon\Brain SK\_obsidian\STATISTICS_INDEX.md
C:\Falcon\Brain SK\_obsidian\EXECUTIVE_REPORTS_INDEX.md
C:\Falcon\Brain SK\_obsidian\AMMAR_BRAIN_HOME.md
```

Link latest statistics reports, formulas, KPI summaries, related page, related PR review, related Falcon Eyes report, and related executive report.

Do not touch Obsidian plugin files.

## Routing

When Executive Insight Reports runs, it must call Statistical Intelligence first to generate chart-ready data.

## Safety

- Do not alter application code.
- Do not invent data.
- Do not inflate scores.
- Do not commit secrets.
- Use additive output sync only.
