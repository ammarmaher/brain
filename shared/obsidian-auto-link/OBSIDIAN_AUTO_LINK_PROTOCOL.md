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
