# Skill Routing Manifest

## Canonical knowledge root (read first)

All Brain SK knowledge lives under `C:\Falcon\Brain Outputs\understanding\`. Index: [`understanding/KNOWLEDGE_ROOT_INDEX.md`](../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). Five active folders: `frontend/`, `backend/`, `integration/`, `pages/`, `wiki/`. Per-task load order:

| Task type | Loads (in order) |
|---|---|
| Frontend | `understanding/frontend/` (registries + `patterns/` + per-component dossier) + page `understanding/pages/<page>/` if named |
| Backend | `understanding/backend/<service>/` + `understanding/integration/` if cross-service |
| Full-stack | `understanding/frontend/` + `understanding/backend/<service>/` + `understanding/integration/` + `understanding/pages/<page>/` |
| Page | `understanding/pages/<page-name>/` (all 14+ files) + relevant component dossiers + Falcon Eyes reports |
| Screenshot / bug | `understanding/pages/<page>/evidence/<learningId>/` (save first) + relevant component dossier + Falcon Eyes report if generated |

Concept mappings (no dedicated top-level folder): service → `backend/<short-name>/` · business → per-page `BUSINESS_RULES.md` · api → `backend/<service>/ENDPOINT_REGISTRY.md` + per-page `API_RULES.md` · gaps → per-page `GAP_REGISTRY.md` + `integration/GAP_LIST.md` · evidence → per-page `evidence/<learningId>/` + `reports/falcon-eyes/<run>/`.

## Learning-first ordering (read first)

Every task in Brain SK routes through the Learning-First Task Routing protocol before any implementation step. Canonical: [`protocols/LEARNING_FIRST_TASK_ROUTING.md`](../protocols/LEARNING_FIRST_TASK_ROUTING.md). Six modes:

1. Quick prompt / screenshot / red X / green tick → Light Learning Intake first.
2. Page implementation → load page learning + patterns + component knowledge + Falcon Eyes + 4 rule registries + gaps + evidence + scorecard → plan → code.
3. Bug fix → save evidence, map to page/section/component, check patterns + gaps + component dossier, fix only required scope.
4. Screenshot comparison → Falcon Eyes first, no repair unless prompt asks for it.
5. Deep learning → ONLY on `deep learn`, `update vault`, `approve this pattern`, `promote this globally`, `learn this page`, `this is the approved way`.
6. Global promotion → ONLY on explicit Ammar approval.

## Auto-detection

| Ammar says | Domain | Required skills |
|---|---|---|
| Analyze PRD / feature / scenario | Business | business-understanding, validation-rules, PES if needed |
| Convert HTML to Angular | Frontend | html-to-angular, Angular best practice, Tailwind-only, Falcon component registry, visual parity |
| Convert React to Angular | Frontend | react-to-angular, Angular best practice, Tailwind-only, component upgrade, visual parity |
| Visual difference / parity / source-vs-destination screenshots / "why this table doesn't look like that" / Night Shift visual repair | Frontend | **falcon-eyes** (canonical) — aliases `visual-difference-qa` and `visual-parity` route here. Pre-requisite for any UI fix when parity < 90 %. |
| Any prompt / screenshot / bug / correction touching a page | Frontend | **page-learning** Light Learning Intake (always-on). Writes a `pending` event to `Brain Outputs/understanding/pages/<page>/LIGHT_LEARNING_EVENTS.md`. Never approves. |
| `deep learn this page`, `update vault`, `approve this pattern`, `promote this globally`, `learn this page`, `this is the approved way` | Frontend | **page-learning** Deep Page Learning. Walks pending events and applies Ammar's approve / reject / promote / deprecate per item. |
| `Light learn this screenshot` | Frontend | `/learn-screenshot` — force screenshot intake on the last image, no whole-page re-analysis. |
| `Run Falcon Eyes, no repair` | Frontend | Falcon Eyes report only — produce source/destination/diff + semantic mismatch backlog. Do NOT repair. |
| `Run Falcon Eyes and repair only the <section>` | Frontend | Falcon Eyes + scoped repair limited to the named section. No broader edits. |
| `Promote this to global <pattern> pattern` | Frontend | `/promote-pattern <id>` → append to matching file in `Brain Outputs/understanding/frontend/patterns/`. Requires the pattern to be already APPROVED at page level. |
| `This is the approved way` | Frontend | Treat the most recent pending pattern as an approval candidate; ask Ammar for the explicit id before moving status. |
| Analyze controller / DTO / API | Backend | backend-api-understanding, DTO dictionary, validation/error map, gateway map |
| UI is done, link backend | Full Stack | backend API understanding, FE/BE contract mapping, validation sync, integration tests |
| Generate report | Shared | task-report-generator, data-visualization (analytics), PDF/report skill |
| Chart / scorecard / progress bar / gap chart / readiness chart / capability dashboard | Shared / Analytics | data-visualization |
| `calculate statistics` · `generate KPI stats` · `calculate report percentages` · `analyze progress statistically` · `calculate risk score` · `calculate page score` · `calculate PR review stats` · `calculate visual parity stats` · `make statistics for my boss report` | Shared | **statistical-intelligence** (canonical `skills/statistical-intelligence/SKILL.md`; shared-domain entry `domains/shared/statistical-intelligence/SKILL.md`). Computes KPIs / percentages / scores / risk / trends from `Brain Outputs/understanding/` + `reports/`. Never invents numbers — missing data is `NEEDS_DATA`. Output: `Brain Outputs/reports/statistics/<stats-name>-<YYYY-MM-DD-HHmm>/`. Obsidian node: `_obsidian/STATISTICS_INDEX.md`. |
| `create boss report` · `create executive report` · `create chart report` · `show progress with charts` · `generate status PDF` · `make report for my boss` · `summarize with charts` · `create dashboard report` | Shared | **executive-insight-reports** (canonical `skills/executive-insight-reports/SKILL.md`; shared-domain entry `domains/shared/executive-insight-reports/SKILL.md`). Chart-heavy, boss-ready report. **Calls statistical-intelligence FIRST** for any KPIs / percentages / trends / risk. Output: `Brain Outputs/reports/executive-insights/<report-name>-<YYYY-MM-DD-HHmm>/`. Obsidian node: `_obsidian/EXECUTIVE_REPORTS_INDEX.md`. |
| `review this PR` · `check this pull request` · `review teammate work` · `inspect branch changes` · `compare branch with main` · `validate PR against PRD/wiki` · `check if this implementation is correct` · `review before merge` | Full Stack | **pr-review-governance** (canonical: `skills/pr-review-governance/SKILL.md`; full-stack entry: `domains/fullstack/pr-review/SKILL.md`). Review-only — never edits code. SoT order: diff → codebase → wiki → PRD → backend/API → page learning → component knowledge → registries → best practice. Produces 6 review docs under `Brain Outputs/reports/pr-reviews/<PR-or-branch>-<YYYY-MM-DD>/`, classifies findings P0–P3, ends in one decision (APPROVE / APPROVE_WITH_MINOR_NOTES / REQUEST_CHANGES / BLOCK_MERGE / NEEDS_MORE_CONTEXT). Obsidian node: `_obsidian/PR_REVIEW_INDEX.md`. |

## Manual override

Ammar can write:

```text
Domain: Frontend
Task: Convert this HTML to Falcon Angular.
```

Manual domain overrides auto-detection.

## Statistics & Executive Charts

Two shared-domain skills handle all statistics and chart reporting. They are
cross-cutting — any domain (Business / Frontend / Backend / Full-Stack) routes
into them.

| Skill | Canonical | Domain entry | Slash command |
|---|---|---|---|
| Statistical Intelligence | `skills/statistical-intelligence/SKILL.md` | `domains/shared/statistical-intelligence/SKILL.md` | `/calculate-statistics` |
| Executive Insight Reports | `skills/executive-insight-reports/SKILL.md` | `domains/shared/executive-insight-reports/SKILL.md` | `/create-executive-report` |

**Dependency rule:** Executive Insight Reports MUST call Statistical Intelligence
first whenever it needs KPIs, percentages, trends, or risk scores. Statistical
Intelligence produces the numbers + formulas + chart-ready JSON; Executive
Insight Reports renders them. Charts never show invented numbers.

**Provenance rule (mandatory):** every statistics run writes
`REPORT_GENERATION_TRACE.md` (and `CHART_PROVENANCE.md` for charts); every
executive report carries a per-chart Chart Provenance block, a Chart Provenance
table, and `CHART_PROVENANCE.md` + `REPORT_GENERATION_TRACE.md`. See each skill's
`Chart Provenance & Generation Trace (MANDATORY)` section; report templates at
`skills/executive-insight-reports/templates/`.

Shared domain index: `domains/shared/SKILL.md`. Obsidian nodes:
`_obsidian/STATISTICS_INDEX.md`, `_obsidian/EXECUTIVE_REPORTS_INDEX.md`.
