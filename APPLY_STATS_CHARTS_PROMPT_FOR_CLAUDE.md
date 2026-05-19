Apply only the Statistics + Charts skills into Brain SK.

This is setup only.
Do NOT install older skills.
Do NOT overwrite existing unrelated skills.
Do NOT change Falcon application code.
Do NOT run Night Shift.
Do NOT run page implementation.

Goal:
Add only the new reporting/statistics skills:
1. Statistical Intelligence Skill
2. Executive Insight Reports Skill

Package source:
Use the extracted package folder I provide.

Brain core:
C:\Falcon\Brain SK

Brain outputs:
C:\Falcon\Brain Outputs

Obsidian:
C:\Falcon\Brain SK\_obsidian

Brain repo:
https://github.com/ammarmaher/brain

==================================================
FILES TO ADD / UPDATE
==================================================

Copy/add these skill files:

skills/statistical-intelligence/SKILL.md
skills/executive-insight-reports/SKILL.md

If shared domain folder exists, add/link:

domains/shared/statistical-intelligence/SKILL.md
domains/shared/executive-insight-reports/SKILL.md

If the project uses `domains/shared` differently, follow the existing Brain SK convention and document the path used.

Create tool folders:

tools/statistics/
tools/insight-reports/

At minimum, each tool folder must have:
- README.md
- package.json placeholder or dependency plan
- example-run.md if useful

==================================================
ROUTING UPDATES
==================================================

Update routing so Brain SK uses these skills automatically.

Update if they exist:
- CLAUDE.md
- shared/SKILL_ROUTING_MANIFEST.md
- domains/shared/SKILL.md
- shared/obsidian-auto-link/*.md
- .claude/commands/*.md

Add triggers for Statistical Intelligence:
- calculate statistics
- generate KPI stats
- calculate report percentages
- analyze progress statistically
- calculate risk score
- calculate page score
- calculate PR review stats
- calculate visual parity stats
- make statistics for my boss report

Add triggers for Executive Insight Reports:
- create boss report
- create executive report
- create chart report
- show progress with charts
- generate status PDF
- make report for my boss
- summarize with charts
- create dashboard report

Important dependency rule:
Executive Insight Reports must call Statistical Intelligence first when it needs KPIs, percentages, trends, or risk scores.

==================================================
TOOL DEPENDENCY PLAN
==================================================

Keep dependencies isolated.

For statistics:
C:\Falcon\Brain SK\tools\statistics

Preferred dependencies:
- simple-statistics
- @datashaper/arquero
- duckdb or @duckdb/duckdb-wasm if compatible
- jstat only if advanced statistical tests are needed

For insight reports:
C:\Falcon\Brain SK\tools\insight-reports

Preferred dependencies:
- echarts
- mermaid
- puppeteer or playwright for HTML/PDF export
- handlebars or mustache
- chart.js as optional fallback

Do not add these to the Falcon Angular workspace unless explicitly required.

==================================================
OBSIDIAN
==================================================

Create/update:
- _obsidian/STATISTICS_INDEX.md
- _obsidian/EXECUTIVE_REPORTS_INDEX.md
- _obsidian/AMMAR_BRAIN_HOME.md

Link:
- Statistical Intelligence Skill
- Executive Insight Reports Skill
- tools/statistics README
- tools/insight-reports README
- future statistics report output path
- future executive insights report output path

Do not touch:
- .obsidian plugin data
- Copilot/autopilot data.json
- workspace.json
- secrets
- local plugin config

==================================================
OUTPUT PATHS
==================================================

Statistics output:
C:\Falcon\Brain Outputs\reports\statistics\<stats-name>-<YYYY-MM-DD-HHmm>\

Executive report output:
C:\Falcon\Brain Outputs\reports\executive-insights\<report-name>-<YYYY-MM-DD-HHmm>\

Mirror outputs to:
C:\Falcon\Brain SK\outputs

Use additive sync only.
Do not use robocopy /MIR.

==================================================
INSTALLATION VALIDATION
==================================================

After applying, run setup validation only.

Do not implement application code.

Validation must confirm:
- Statistical Intelligence skill exists
- Executive Insight Reports skill exists
- routing updated
- Obsidian indexes updated
- tool folders exist
- dependency plan documented
- Executive Reports calls Statistics first

Create report:
C:\Falcon\Brain Outputs\reports\stats-charts-skill-verification-<YYYY-MM-DD>\STATS_CHARTS_SKILL_VERIFICATION.md

Optional sample:
If safe and quick, create a small sample statistics/report scaffold using existing Organization Hierarchy knowledge only.
Do not generate a huge report.

==================================================
GIT
==================================================

Commit and push only safe Brain SK changes.

Do not commit:
- secrets
- credentials
- Obsidian plugin data
- node_modules
- dist
- bin
- obj
- temp files

Commit message:
feat(brain-sk): add statistics and executive charts skills

Final response:
Give me a short table:
- Statistical Intelligence skill added
- Executive Insight Reports skill added
- tool folders created
- routing updated
- Obsidian indexes updated
- verification report path
- commit hash
- push status
- blockers
