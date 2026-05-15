*** Ammar Brain — Home (graph navigation layer) ***
*** Updated 2026-05-15 by Brain SK obsidian-knowledge-graph install ***

# Ammar Brain — Home

> **Architecture rule:** Brain Outputs is the source of truth. Obsidian is the graph/navigation/view layer. Brain SK skills are the writers. Do not duplicate Brain Outputs content here — link instead.
>
> Top-level vault: `C:\Falcon\Brain SK\_obsidian`
> Source-of-truth tree: `C:\Falcon\Brain Outputs\`
> **Canonical knowledge root:** [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). 5 active folders: `frontend/`, `backend/`, `integration/`, `pages/`, `wiki/`. Verification report (2026-05-15): [`reports/understanding-root-verification-2026-05-15`](../../../Brain%20Outputs/reports/understanding-root-verification-2026-05-15/UNDERSTANDING_ROOT_REPORT.md).

## Learning-First Task Routing (read every turn)

> **Permanent rule:** Brain SK must not jump directly into implementation when the user provides screenshots, source pages, visual bugs, or page instructions. It must first create a Light Learning event and load page/component knowledge.

Canonical protocol: [LEARNING_FIRST_TASK_ROUTING](../../protocols/LEARNING_FIRST_TASK_ROUTING.md).

| Mode | Trigger | First step |
|---|---|---|
| 1 — Light Learning Intake | any prompt/screenshot/bug/red X/green tick on a page | `/light-learn` or `/learn-screenshot` |
| 2 — Page implementation | "implement…", "build…", "convert this page…" | Load all 12 page artifacts → plan → code |
| 3 — Bug fix | "fix…", "this is broken…" | Save evidence → map to page/section/component → fix narrow scope |
| 4 — Screenshot comparison | "compare…", "why does this look different…" | `/falcon-eyes-norepair` — no repair unless asked |
| 5 — Deep learning | `deep learn`, `update vault`, `approve this pattern`, `learn this page`, `this is the approved way` | `/deep-learn-page <page>` |
| 6 — Global promotion | `promote this globally` | `/promote-pattern <id>` — page-specific never auto-promotes |

Example phrases:
- "Light learn this screenshot"
- "Deep learn Organization Hierarchy"
- "Approve this table pattern"
- "Promote this to global Falcon table pattern"
- "Run Falcon Eyes, no repair"
- "Run Falcon Eyes and repair only the table"

## Vault layout

| Folder | Holds |
|---|---|
| `00-Home/` | Top-level hubs (this file, brain home) |
| `10-Pages/` | One note per Falcon page (links to its rules, gaps, evidence, components) |
| `15-PRD/` | **One note per PRD module (upstream of pages/components/rules)** |
| `20-UI-UX/` | UI/UX rule indexes pointing into per-page `UI_UX_RULES.md` |
| `30-Validation/` | Validation rule indexes pointing into per-page `VALIDATION_RULES.md` |
| `40-API/` | API/DTO/contract indexes pointing into per-page `API_RULES.md` |
| `45-Backend/` | **One note per backend service (9 services)** |
| `50-Business/` | Business rule indexes pointing into per-page `BUSINESS_RULES.md` |
| `60-Components/` | One note per Falcon component (back-links to pages using it) |
| `70-Gaps/` | Cross-page gap index pointing into per-page `GAP_REGISTRY.md` |
| `80-Evidence/` | Cross-page evidence index pointing into per-page `EVIDENCE_INDEX.md` |
| `90-Approved-Patterns/` | Approved + globally-promoted patterns index |

## PRD-first navigation (upstream of everything)

**PRDs feed Business · Validation · API · Pages · Components · Gaps.** When a task touches a page or component, load the implementing PRD FIRST.

- [[PRD_INDEX]] — 6 modules: [[01 Account Management]] · [[02 User Management]] · [[03 Contract Packaging Charging Billing]] · [[04 Contact Group Management]] · [[05 Templates]] · [[Root Documents]]
- Coverage today: 48.3 % (69/143 effective rows) · 63.0 % including partial
- Drive folder (canonical): `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`
- Refresh: `take latest from PRD`

## Top-level indexes

- [[PRD_INDEX]] — PRD modules (upstream)
- [[BACKEND_INDEX]] — 9 backend services
- [[PAGE_LEARNING_INDEX]] — page-level learning entry point (Light + Deep modes)
- [[FRONTEND_INDEX]] — frontend knowledge hub (registries, scans, patterns)
- [[COMPONENT_INDEX]] — Falcon component catalog (60+ components)
- [[UI_UX_INDEX]] — UI/UX rules across all pages
- [[VALIDATION_INDEX]] — validation rules across all pages
- [[API_INDEX]] — API rules across all pages
- [[BUSINESS_INDEX]] — business rules across all pages
- [[GAPS_INDEX]] — open gaps across all pages
- [[EVIDENCE_INDEX]] — screenshots / quotes / file pointers
- [[APPROVED_PATTERNS_INDEX]] — page-specific approved + globally-promoted patterns
- [[FALCON_EYES_INDEX]] — visual difference QA reports
- [[PAGE_KNOWLEDGE_INDEX]] — legacy page index (page-knowledge skill)
- [[PAGES_INDEX]] — legacy page registry (4-dimension scoring)

## Sister vault detected (NOT switched)

A second configured Obsidian vault exists at `C:\Falcon\falcon-wiki` (the Falcon SoT vault — has `00-MOCs/`, `10-PRD/`, `20-Pages/`, `30-Components/`, etc.). Per Ammar's instruction, this install does NOT switch to it. To switch later, get explicit approval and migrate indexes through the obsidian-auto-link protocol.

## Learning modes

- **Light Learning Intake** — automatic on every prompt/screenshot/bug/correction. Writes `pending` events under `Brain Outputs/understanding/pages/<page>/LIGHT_LEARNING_EVENTS.md`. Never approves.
- **Deep Page Learning** — explicit only. Triggers: `deep learn this page`, `update vault`, `approve this pattern`, `promote this globally`, `learn this page`.

Skill: [page-learning](../../domains/frontend/page-learning/SKILL.md). Approval gate: [APPROVAL_LEARNING_GATE](../../protocols/APPROVAL_LEARNING_GATE.md).

## Hard rules

- Do not duplicate Brain Outputs content here.
- Do not edit `.obsidian/`, Copilot `data.json`, `workspace.json`, plugin config, or any secret file.
- Page-specific rules stay page-specific unless Ammar says `promote this globally`.
- Scorecards count APPROVED entries only.
- Any dimension < 60 % → `NEEDS ATTENTION`.
