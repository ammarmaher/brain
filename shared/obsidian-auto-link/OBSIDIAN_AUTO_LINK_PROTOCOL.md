# Obsidian Auto-Link Protocol

Obsidian is the human-readable knowledge interface for Brain SK.
The Git Markdown files are still the source of truth, but Obsidian should automatically open/link the same folder when possible.

## Default behavior

1. Use the Brain SK repository folder as the Obsidian vault when possible.
2. If the vault exists, write/update Obsidian-friendly Markdown notes inside the same repo.
3. Add backlinks between major outputs.
4. Generate an Obsidian index note.
5. If Obsidian is not installed or not available, warn Ammar but continue with Git Markdown.

## Required Obsidian files

Generate or update:

```text
_obsidian/BRAIN_SK_HOME.md
_obsidian/PROJECT_INDEX.md
_obsidian/BUSINESS_INDEX.md
_obsidian/BACKEND_INDEX.md
_obsidian/FRONTEND_INDEX.md
_obsidian/WIKI_INDEX.md
_obsidian/TASK_REPORT_INDEX.md
```

## Auto-link rules

Use Obsidian wiki links where helpful:

```text
[[BUSINESS_RULES_SUMMARY]]
[[API_DTO_DICTIONARY]]
[[FALCON_COMPONENT_REGISTRY]]
[[ARCHITECTURE_RULES]]
[[TASK_REPORT_INDEX]]
```

## Vault detection

TouchBase should check:

- configured `obsidianVaultPath`
- whether that folder exists
- whether it contains `.obsidian/`
- whether it points to or contains Brain SK Markdown files

## If Obsidian is missing

Do not block the task. Generate:

```text
outputs/discovery/obsidian-health.md
```

and include:

- Obsidian status
- expected vault path
- how to open the brain repo as an Obsidian vault
- whether Git Markdown output still succeeded

## Automatic linking requirement

After every scan/report update, update the relevant index note so Ammar can open Obsidian and navigate by domain:

- Business
- Frontend
- Backend
- Full Stack
- Architecture Wiki
- Reports
- Gaps
- Decisions

## Canonical Frontend Knowledge Path

When Obsidian auto-link generates or refreshes the **Frontend** index notes (`FRONTEND_INDEX.md`, `FALCON_COMPONENT_INDEX.md`, and any per-component or per-capability sub-index), all wiki-link targets and resolved relative paths MUST point into the canonical frontend tree:

**Canonical frontend component knowledge path** (read + write):

```text
C:\Falcon\Brain Outputs\understanding\frontend
```

**Component folders** (read + write):

```text
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>
```

**Legacy / import / mirror — do NOT use as active source:**

- `C:\Falcon\Brain Outputs\component-registry`
- `C:\Falcon\Brain Outputs\frontend-understanding`
- `C:\Falcon\Brain SK\outputs\component-registry`
- `C:\Falcon\Brain SK\outputs\frontend-understanding`

When refreshing existing Obsidian indexes that still reference legacy paths, rewrite the link to the canonical equivalent. If a legacy file has no canonical successor yet, keep the legacy link inside a clearly labelled "Legacy" subsection so it does not pollute the active link graph. Config keys: `outputs.frontendUnderstanding` and `outputs.frontendComponents` in `../../config/brain.config.json`.

## Component Scan Reports — Obsidian Link Block

Every time `domains/frontend/component-knowledge/incremental-scan/SKILL.md` produces a run, the auto-link layer must append (additively, never overwrite) links to:

- `_obsidian/FRONTEND_INDEX.md` — under a heading "Latest scan run — `<YYYY-MM-DD-HHmm>`" with:
  - `[COMPONENT_SCAN_REPORT.md](../outputs/reports/component-scans/<run-stamp>/COMPONENT_SCAN_REPORT.md)`
  - `[COMPONENT_SCAN_REPORT.pdf](../outputs/reports/component-scans/<run-stamp>/COMPONENT_SCAN_REPORT.pdf)` (only if the PDF exists)
  - `[COMPONENT_SCAN_DATA.json](../outputs/reports/component-scans/<run-stamp>/COMPONENT_SCAN_DATA.json)`
  - `[COMPONENT_EDIT_HISTORY_TABLE.md](../outputs/reports/component-scans/<run-stamp>/COMPONENT_EDIT_HISTORY_TABLE.md)`
  - `[component-scan-metadata.json](../outputs/understanding/frontend/_scan-state/component-scan-metadata.json)` — only one canonical link; do not duplicate per run

- `_obsidian/FALCON_COMPONENT_INDEX.md` — under a heading "Latest scan run":
  - The same metadata + latest report links so the component dossier index always exposes the freshness state

**Hard constraint:** never touch `_obsidian/.obsidian/` plugin data files (Copilot/autopilot API keys, workspace state). Limit additive edits to the human-readable Markdown indexes listed above.

## Page Learning System — Obsidian Link Block

Every time `domains/frontend/page-learning/SKILL.md` runs (Light or Deep), the auto-link layer must additively refresh:

- `_obsidian/PAGE_KNOWLEDGE_INDEX.md` — per-page links to:
  - `[PAGE_LEARNING.md](../../Brain%20Outputs/understanding/pages/<page>/PAGE_LEARNING.md)`
  - `[LIGHT_LEARNING_EVENTS.md](../../Brain%20Outputs/understanding/pages/<page>/LIGHT_LEARNING_EVENTS.md)`
  - `[PENDING_PAGE_PATTERNS.md](../../Brain%20Outputs/understanding/pages/<page>/PENDING_PAGE_PATTERNS.md)`
  - `[APPROVED_PAGE_PATTERNS.md](../../Brain%20Outputs/understanding/pages/<page>/APPROVED_PAGE_PATTERNS.md)`
  - `[PROMOTION_CANDIDATES.md](../../Brain%20Outputs/understanding/pages/<page>/PROMOTION_CANDIDATES.md)`
  - `[EVIDENCE_INDEX.md](../../Brain%20Outputs/understanding/pages/<page>/EVIDENCE_INDEX.md)`
  - `[COMPONENT_USAGE_DECISIONS.md](../../Brain%20Outputs/understanding/pages/<page>/COMPONENT_USAGE_DECISIONS.md)`
  - `[LEARNING_CHANGE_HISTORY.md](../../Brain%20Outputs/understanding/pages/<page>/LEARNING_CHANGE_HISTORY.md)`

- `_obsidian/PAGES_INDEX.md` — adds a "Learning System" sub-block per page listing the same files.

- `_obsidian/FRONTEND_INDEX.md` — under a heading `## Global Frontend Patterns`, links every file in `Brain Outputs/understanding/frontend/patterns/`.

**Pending-only marker:** when a page has `PENDING_PAGE_PATTERNS.md` non-empty, append `(N pending)` next to the page name in `PAGE_KNOWLEDGE_INDEX.md`. Never auto-promote.

**Hard constraint repeated:** no edits to `_obsidian/.obsidian/`, Copilot `data.json`, plugin workspace files, or any secret file. Page Learning operates on Markdown indexes only.

## PR Review Governance — Obsidian Link Block

Every time the **PR Review Governance Skill** (`skills/pr-review-governance/SKILL.md`)
produces a review, the auto-link layer must additively refresh:

- `_obsidian/PR_REVIEW_INDEX.md` — the canonical PR-review graph node. Add one row
  per review (date · PR/branch · target · domains · decision · report folder) and a
  per-review link block linking the review to:
  - affected page note(s) — `10-Pages/<Page>.md`
  - affected component note(s) — `60-Components/<Component>.md`
  - affected API / DTO — `40-API/` entries / `understanding/backend/<service>/`
  - related gaps — per-page `GAP_REGISTRY.md` / `70-Gaps/`
  - related PRD / wiki docs — `15-PRD/` / `35-Architecture/`
  - the approval decision (`PR_REVIEW_APPROVAL_DECISION.md`)
- Review report files live at
  `Brain Outputs/reports/pr-reviews/<PR-or-branch>-<YYYY-MM-DD>/` (mirrored
  additively into `Brain SK/outputs/reports/pr-reviews/`).

**Hard constraint repeated:** no edits to `_obsidian/.obsidian/`, Copilot
`data.json`, plugin workspace files, or any secret file. PR-review auto-link
operates on the Markdown index only and never overwrites prior review rows.

## Knowledge Graph Vault Structure (2026-05-15)

The Obsidian vault at `C:\Falcon\Brain SK\_obsidian` is organised as the graph/navigation layer over Brain Outputs (the source of truth). Folders:

| Folder | Holds |
|---|---|
| `00-Home/` | Top-level hubs (`AMMAR_BRAIN_HOME.md`, `PAGE_LEARNING_INDEX.md`, `COMPONENT_INDEX.md`, `UI_UX_INDEX.md`, `VALIDATION_INDEX.md`, `API_INDEX.md`, `BUSINESS_INDEX.md`, `GAPS_INDEX.md`, `EVIDENCE_INDEX.md`, `APPROVED_PATTERNS_INDEX.md`) |
| `10-Pages/` | One note per Falcon page — name = `<Page Title>.md` |
| `20-UI-UX/` | UI/UX rule indexes linking into per-page `UI_UX_RULES.md` |
| `30-Validation/` | Validation rule indexes linking into per-page `VALIDATION_RULES.md` |
| `40-API/` | API rule indexes linking into per-page `API_RULES.md` |
| `50-Business/` | Business rule indexes linking into per-page `BUSINESS_RULES.md` |
| `60-Components/` | One note per Falcon component — name = `<Component Title>.md` |
| `70-Gaps/` | Cross-page gap index linking into per-page `GAP_REGISTRY.md` |
| `80-Evidence/` | Cross-page evidence index linking into per-page `EVIDENCE_INDEX.md` |
| `90-Approved-Patterns/` | Approved + globally-promoted pattern index |

Pre-existing vault-root indexes (`AMMAR_BRAIN_HOME.md`, `FRONTEND_INDEX.md`, `FALCON_EYES_INDEX.md`, `PAGE_KNOWLEDGE_INDEX.md`, `PAGES_INDEX.md`, etc.) remain in place for backwards compatibility and are reachable via wiki-links from the `00-Home/` hubs.

### Required links on every page note (`10-Pages/<Page>.md`)

| Required link | Target |
|---|---|
| UI/UX rules | `Brain Outputs/understanding/pages/<page>/UI_UX_RULES.md` |
| Validation rules | `Brain Outputs/understanding/pages/<page>/VALIDATION_RULES.md` |
| API rules | `Brain Outputs/understanding/pages/<page>/API_RULES.md` |
| Business rules | `Brain Outputs/understanding/pages/<page>/BUSINESS_RULES.md` |
| Falcon components used | wiki-links to `60-Components/<Component>.md` |
| Gaps | `Brain Outputs/understanding/pages/<page>/GAP_REGISTRY.md` |
| Evidence | `Brain Outputs/understanding/pages/<page>/EVIDENCE_INDEX.md` |
| Approved page patterns | `Brain Outputs/understanding/pages/<page>/APPROVED_PAGE_PATTERNS.md` |
| Pending page patterns | `Brain Outputs/understanding/pages/<page>/PENDING_PAGE_PATTERNS.md` |
| Promotion candidates | `Brain Outputs/understanding/pages/<page>/PROMOTION_CANDIDATES.md` |
| Page scorecard | `Brain Outputs/understanding/pages/<page>/PAGE_SCORECARD.md` |
| Latest reports | `Brain SK/outputs/reports/<...>` |
| Global frontend patterns | `Brain SK/outputs/understanding/frontend/patterns/<PATTERN>.md` |
| Tests | output of `test-case-authoring` skill when available |

### Required links on every component note (`60-Components/<Component>.md`)

- Pages using it — wiki-links to `10-Pages/<Page>.md`
- Gaps — `Brain Outputs/understanding/pages/<page>/GAP_REGISTRY.md` filtered by component
- Approved patterns (page-level + global)
- Component knowledge dossier — `Brain Outputs/understanding/frontend/components/<component>/` (OVERVIEW / API / USAGE / TOKENS / GAPS_AND_UPGRADES / DECISION)
- Falcon Eyes visual reports when present

### Evidence entry rule

Every screenshot/report appended to any `EVIDENCE_INDEX.md` MUST link: page, section, component, rule/gap id, and (when applicable) source/destination/diff image paths under `Brain Outputs/reports/falcon-eyes/<run>/sections/<section>/`.

### Gap entry rule

Every gap appended to any `GAP_REGISTRY.md` MUST carry: page, component, evidence, status (`open · in-progress · resolved · accepted-debt`), next action, and category (`UI/UX · Validation · API · Business · Component · Source-Truth`).

### Do-not-duplicate rule

Obsidian must not become a competing source of truth. Notes hold the graph (links + minimal context). Rule content lives in Brain Outputs.

### Sister vault (NOT switched)

A second configured Obsidian vault exists at `C:\Falcon\falcon-wiki`. This protocol does NOT switch to it without explicit Ammar approval. Cross-vault graph queries are out of scope until decided.

## Statistics & Executive Reports — Obsidian Link Block

Brain SK has two shared reporting skills with dedicated graph nodes:

- `_obsidian/STATISTICS_INDEX.md` — **Statistical Intelligence** graph node
- `_obsidian/EXECUTIVE_REPORTS_INDEX.md` — **Executive Insight Reports** graph node

Every time the **Statistical Intelligence** skill (`skills/statistical-intelligence/SKILL.md`)
produces a statistics run, the auto-link layer must additively refresh
`_obsidian/STATISTICS_INDEX.md` — add one entry per run linking:

- `[STATISTICS_REPORT.md](../../Brain%20Outputs/reports/statistics/<stats-name>-<YYYY-MM-DD-HHmm>/STATISTICS_REPORT.md)`
- `STATISTICS_DATA.json`, `KPI_SUMMARY.md`, `FORMULAS_USED.md`, `RISK_SCORECARD.md` in the same run folder
- related page note(s) (`10-Pages/<Page>.md`), the PR-review node, the Falcon Eyes node when relevant

Every time the **Executive Insight Reports** skill (`skills/executive-insight-reports/SKILL.md`)
produces a report, the auto-link layer must additively refresh
`_obsidian/EXECUTIVE_REPORTS_INDEX.md` — add one entry per report linking:

- `[EXECUTIVE_REPORT.md](../../Brain%20Outputs/reports/executive-insights/<report-name>-<YYYY-MM-DD-HHmm>/EXECUTIVE_REPORT.md)`
- the `EXECUTIVE_REPORT.html` / `.pdf` when present
- the statistics run it consumed (its `_obsidian/STATISTICS_INDEX.md` entry)
- related page / PR-review / Falcon Eyes / component nodes

Both skills also keep `_obsidian/AMMAR_BRAIN_HOME.md` linking the two index notes
under its **Indexes** section.

**Hard constraint repeated:** no edits to `_obsidian/.obsidian/`, Copilot
`data.json`, plugin workspace files, or any secret file. Statistics / executive
auto-link operates on the Markdown index notes only and never overwrites prior
run rows (additive only).
