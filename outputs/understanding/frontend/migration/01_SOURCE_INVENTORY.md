*** Falcon Brain SK — Frontend Component Knowledge Migration ***
*** Agent 1 (Source Inventory) report — generated 2026-05-13 ***

# 01 — Source Inventory

> Read-only audit of all 6 candidate source folders for the frontend-component knowledge migration. Canonical target is `C:\Falcon\Brain Outputs\understanding\frontend` — this report only inspects sources; it does not write into the target tree (except this one file under `migration/`).

---

## 1. Summary Table

| # | Source folder | Exists | `.md` files (recursive) | Component dossiers | Newest mtime | Verdict |
|---|---|---|---|---|---|---|
| 1 | `C:\Falcon\Brain Outputs\component-registry` | YES | 770 | **60** (full 6-file set) | `2026-05-13 22:43` (FALCON_COMPONENT_REGISTRY_DEEP.md) | **PRIMARY winner** — deep dossiers + master + parallel-agents intermediates |
| 2 | `C:\Falcon\Brain Outputs\frontend-understanding` | YES | 9 | 0 | `2026-05-13 22:55` (FINAL_COVERAGE_REPORT.md) | **PRIMARY winner** — newest master narrative reports (Agent-7 canonical) |
| 3 | `C:\Falcon\Brain Outputs\understanding\frontend` | YES | 17 | 3 (4-file partial) | `2026-05-13 20:27` (ANGULAR_AND_TAILWIND_RULES.md) | **LEGACY first-pass** — older, sparser; superseded by sources 1+2 |
| 4 | `C:\Falcon\Brain SK\outputs\component-registry` | YES | 770 | 60 (full 6-file set) | `2026-05-13 22:43` | **EXACT MIRROR** of source 1 (`diff -rq` empty) |
| 5 | `C:\Falcon\Brain SK\outputs\frontend-understanding` | YES | 9 | 0 | `2026-05-13 22:55` | **EXACT MIRROR** of source 2 (`diff -rq` empty) |
| 6 | `C:\Falcon\Brain SK\outputs\understanding\frontend` | YES | 17 | 3 (4-file partial) | `2026-05-13 20:27` | **EXACT MIRROR** of source 3 (`diff -rq` empty) |

**Key observation:** Sources 4-5-6 are byte-identical recursive mirrors of 1-2-3 (different inodes — they are physical copies, not symlinks). The migration only needs to consult Sources 1, 2, 3.

---

## 2. Per-Source Detail (Master Files)

### Source 1 — `C:\Falcon\Brain Outputs\component-registry`

| File | Size | Modified |
|---|---|---|
| `FALCON_COMPONENT_REGISTRY_DEEP.md` | 33,414 B | 2026-05-13 22:43 |

**Subfolders:**
- `components/` — 60 component dossiers (6 canonical files each, 360 files)
- `parallel-agents/` — Agent 1-6 work products (intermediates + per-agent component subsets)

### Source 1 — `parallel-agents/` master files

| File | Size | Modified |
|---|---|---|
| `parallel-agents/SHARED_BRIEFING.md` | 11,084 B | 2026-05-13 21:56 |

**`agent-01-forms/`** (forms scope, 22 component dossiers under `components/`)
- `AGENT_SUMMARY.md` 7,213 B (22:24)
- `COMPONENT_COVERAGE.md` 4,408 B (22:24)
- `UPGRADE_CANDIDATES.md` 14,445 B (22:25)

**`agent-02-data/`** (data/table scope, 10 component dossiers)
- `AGENT_SUMMARY.md` 6,645 B (22:25)
- `COMPONENT_COVERAGE.md` 3,857 B (22:25)
- `UPGRADE_CANDIDATES.md` 14,018 B (22:26)

**`agent-03-layout-navigation/`** (layout+nav scope, 15 component dossiers)
- `AGENT_SUMMARY.md` 7,919 B (22:36)
- `COMPONENT_COVERAGE.md` 3,986 B (22:36)
- `UPGRADE_CANDIDATES.md` 18,197 B (22:37)

**`agent-04-workflow/`** (workflow scope, 14 component dossiers)
- `AGENT_SUMMARY.md` 7,860 B (22:23)
- `COMPONENT_COVERAGE.md` 3,747 B (22:23)
- `UPGRADE_CANDIDATES.md` 11,418 B (22:24)

**`agent-05-theme-tailwind-tokens/`** (theme/tokens scope — 12 master files, no per-component dossiers)
- `AGENT_SUMMARY.md` 14,475 B (22:22)
- `THEME_SSOT_AUDIT.md` 24,288 B (22:08)
- `COMPONENT_TOKEN_FILES_AUDIT.md` 28,290 B (22:11)
- `TOKEN_FLOW_REPORT.md` 22,022 B (22:14)
- `STYLING_RULES_CHEAT_SHEET.md` 20,542 B (22:15)
- `UPGRADE_CANDIDATES.md` 21,275 B (22:07)
- `STATIC_STYLE_RISKS.md` 16,293 B (22:16)
- `DARK_MODE_AUDIT.md` 14,292 B (22:18)
- `NO_CSS_NO_SCSS_COMPLIANCE.md` 11,314 B (22:17)
- `UTILITY_SAFELIST_AUDIT.md` 11,645 B (22:20)
- `TAILWIND_HELPERS_AUDIT.md` 11,246 B (22:12)
- `APP_TAILWIND_AUDIT.md` 11,188 B (22:12)
- `DENSITY_AND_RTL_AUDIT.md` 10,275 B (22:19)
- `COMPONENT_COVERAGE.md` 8,370 B (22:23)

**`agent-06-frontend-architecture-usage/`** (workspace topology — 16 master files, no per-component dossiers)
- `AGENT_SUMMARY.md` 8,588 B (22:06)
- `BARREL_EXPORTS_AUDIT.md` 21,326 B (22:08)
- `ROUTES_AND_MF_AUDIT.md` 16,394 B (22:10)
- `UPGRADE_CANDIDATES.md` 15,245 B (22:19)
- `AUTH_AND_FACADE_PATTERNS.md` 14,706 B (22:13)
- `COMPONENT_USAGE_MATRIX.md` 14,177 B (22:15)
- `WORKSPACE_TOPOLOGY.md` 13,259 B (22:07)
- `MODULE_FEDERATION_PATTERNS.md` 13,181 B (22:12)
- `QUALITY_GATES_AUDIT.md` 12,065 B (22:17)
- `UNUSED_AND_DEPRECATED_COMPONENTS.md` 11,960 B (22:16)
- `IMPORT_PATH_CONVENTIONS.md` 11,059 B (22:09)
- `WRAPPER_IMPORT_DECISION_TREE.md` 10,737 B (22:14)
- `STATE_AND_SIGNAL_PATTERNS.md` 10,838 B (22:11)
- `FORBIDDEN_PATTERNS_OBSERVED.md` 8,448 B (22:17)
- `FEATURE_FOLDER_STRUCTURE.md` 8,394 B (22:09)
- `COMPONENT_COVERAGE.md` 3,291 B (22:06)

### Source 2 — `C:\Falcon\Brain Outputs\frontend-understanding`

> All 9 files self-identify as "Brain SK canonical — Agent 7 merge, 2026-05-13". This is the consolidated narrative tier.

| File | Size | Modified |
|---|---|---|
| `FINAL_COVERAGE_REPORT.md` | 10,880 B | 2026-05-13 22:55 |
| `READINESS_SCORES.md` | 6,954 B | 2026-05-13 22:54 |
| `FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md` | 17,009 B | 2026-05-13 22:54 |
| `FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md` | 24,472 B | 2026-05-13 22:53 |
| `FALCON_THEME_AND_TAILWIND_REPORT.md` | 16,404 B | 2026-05-13 22:51 |
| `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` | 19,219 B | 2026-05-13 22:49 |
| `COMPONENT_UPGRADE_BACKLOG.md` | 32,127 B | 2026-05-13 22:48 |
| `COMPONENT_RELATIONSHIP_MAP.md` | 18,384 B | 2026-05-13 22:46 |
| `FALCON_COMPONENT_CAPABILITY_MATRIX.md` | 15,135 B | 2026-05-13 22:45 |

### Source 3 — `C:\Falcon\Brain Outputs\understanding\frontend` (LEGACY first-pass)

> Older 20:17–20:27 timeslot — superseded by Sources 1+2 (which generated their data in the 21:56–22:55 timeslot).

| File | Size | Modified |
|---|---|---|
| `FALCON_COMPONENT_REGISTRY.md` | 34,765 B | 2026-05-13 20:22 |
| `ANGULAR_AND_TAILWIND_RULES.md` | 12,630 B | 2026-05-13 20:27 |
| `FRONTEND_STRUCTURE_REPORT.md` | 14,941 B | 2026-05-13 20:20 |
| `TAILWIND_TOKEN_MAP.md` | 11,037 B | 2026-05-13 20:19 |
| `FRONTEND_WORKSPACE_MAP.md` | 9,946 B | 2026-05-13 20:18 |

Subfolder `components/` — 3 dossiers (`falcon-dropdown`, `falcon-input`, `falcon-table`) with **only 4 of the 6 canonical files** each (no TOKENS.md, no DECISION.md).

---

## 3. Per-Source Component Inventory (6-Canonical-File Audit)

### Source 1 / Source 4 — `component-registry/components/`

**60 component folders, every one has all 6 canonical files** (`OVERVIEW.md`, `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`). Full dossiers, generated 22:40 batch.

Component names (alphabetical):

| # | Component | OVERVIEW | API | USAGE | TOKENS | GAPS | DECISION |
|---|---|---|---|---|---|---|---|
| 1 | falcon-accordion | YES | YES | YES | YES | YES | YES |
| 2 | falcon-avatar | YES | YES | YES | YES | YES | YES |
| 3 | falcon-badge | YES | YES | YES | YES | YES | YES |
| 4 | falcon-button | YES | YES | YES | YES | YES | YES |
| 5 | falcon-calendar | YES | YES | YES | YES | YES | YES |
| 6 | falcon-calendar-legacy | YES | YES | YES | YES | YES | YES |
| 7 | falcon-card | YES | YES | YES | YES | YES | YES |
| 8 | falcon-checkbox | YES | YES | YES | YES | YES | YES |
| 9 | falcon-checkbox-group | YES | YES | YES | YES | YES | YES |
| 10 | falcon-combobox | YES | YES | YES | YES | YES | YES |
| 11 | falcon-confirm-dialog | YES | YES | YES | YES | YES | YES |
| 12 | falcon-data-table | YES | YES | YES | YES | YES | YES |
| 13 | falcon-date-picker | YES | YES | YES | YES | YES | YES |
| 14 | falcon-dialog | YES | YES | YES | YES | YES | YES |
| 15 | falcon-drawer | YES | YES | YES | YES | YES | YES |
| 16 | falcon-dropdown | YES | YES | YES | YES | YES | YES |
| 17 | falcon-email-field | YES | YES | YES | YES | YES | YES |
| 18 | falcon-empty-state | YES | YES | YES | YES | YES | YES |
| 19 | falcon-filter-panel | YES | YES | YES | YES | YES | YES |
| 20 | falcon-form-field | YES | YES | YES | YES | YES | YES |
| 21 | falcon-grid-input | YES | YES | YES | YES | YES | YES |
| 22 | falcon-icon | YES | YES | YES | YES | YES | YES |
| 23 | falcon-input | YES | YES | YES | YES | YES | YES |
| 24 | falcon-input-number | YES | YES | YES | YES | YES | YES |
| 25 | falcon-menu | YES | YES | YES | YES | YES | YES |
| 26 | falcon-message-host | YES | YES | YES | YES | YES | YES |
| 27 | falcon-mobile-number | YES | YES | YES | YES | YES | YES |
| 28 | falcon-multi-select | YES | YES | YES | YES | YES | YES |
| 29 | falcon-multiselect-legacy | YES | YES | YES | YES | YES | YES |
| 30 | falcon-notification | YES | YES | YES | YES | YES | YES |
| 31 | falcon-organization-hierarchy-tree-tw | YES | YES | YES | YES | YES | YES |
| 32 | falcon-otp | YES | YES | YES | YES | YES | YES |
| 33 | falcon-otp-send-dialog | YES | YES | YES | YES | YES | YES |
| 34 | falcon-paginator | YES | YES | YES | YES | YES | YES |
| 35 | falcon-password | YES | YES | YES | YES | YES | YES |
| 36 | falcon-phone-field | YES | YES | YES | YES | YES | YES |
| 37 | falcon-photo-uploader | YES | YES | YES | YES | YES | YES |
| 38 | falcon-popup | YES | YES | YES | YES | YES | YES |
| 39 | falcon-radio | YES | YES | YES | YES | YES | YES |
| 40 | falcon-radio-group | YES | YES | YES | YES | YES | YES |
| 41 | falcon-search-input | YES | YES | YES | YES | YES | YES |
| 42 | falcon-select | YES | YES | YES | YES | YES | YES |
| 43 | falcon-single-uploader | YES | YES | YES | YES | YES | YES |
| 44 | falcon-status-badge | YES | YES | YES | YES | YES | YES |
| 45 | falcon-stepper | YES | YES | YES | YES | YES | YES |
| 46 | falcon-stepper-legacy | YES | YES | YES | YES | YES | YES |
| 47 | falcon-switch | YES | YES | YES | YES | YES | YES |
| 48 | falcon-table | YES | YES | YES | YES | YES | YES |
| 49 | falcon-tabs | YES | YES | YES | YES | YES | YES |
| 50 | falcon-tag | YES | YES | YES | YES | YES | YES |
| 51 | falcon-textarea | YES | YES | YES | YES | YES | YES |
| 52 | falcon-toast | YES | YES | YES | YES | YES | YES |
| 53 | falcon-tooltip | YES | YES | YES | YES | YES | YES |
| 54 | falcon-tree | YES | YES | YES | YES | YES | YES |
| 55 | falcon-tree-panel | YES | YES | YES | YES | YES | YES |
| 56 | falcon-tree-table | YES | YES | YES | YES | YES | YES |
| 57 | falcon-uploader | YES | YES | YES | YES | YES | YES |
| 58 | falcon-wizard | YES | YES | YES | YES | YES | YES |
| 59 | send-credentials-popup | YES | YES | YES | YES | YES | YES |
| 60 | shared-directives | YES | YES | YES | YES | YES | YES |

### Source 1 / Source 4 — `component-registry/parallel-agents/agent-NN/components/` (intermediates)

These per-agent component dossiers are the **inputs** to the consolidated `component-registry/components/` set. Sampled `falcon-input` in agent-01 — file sizes match the consolidated tier byte-for-byte (likely cp/mv).

| Agent | Components | Notable |
|---|---|---|
| `agent-01-forms` | 22 | forms input cluster (input, password, otp, mobile-number, phone-field, email-field, dropdown, select, multi-select, combobox, checkbox, checkbox-group, radio, radio-group, switch, search-input, textarea, calendar, date-picker, otp-send-dialog, form-field, grid-input, input-number — 22) |
| `agent-02-data` | 10 | data/table cluster (badge, data-table, empty-state, filter-panel, organization-hierarchy-tree-tw, paginator, status-badge, table, tag, tree-table) |
| `agent-03-layout-navigation` | 15 | layout+nav (accordion, avatar, button, card, confirm-dialog, dialog, drawer, icon, menu, message-host, notification, popup, tabs, toast, tooltip) |
| `agent-04-workflow` | 14 | workflow cluster — includes one component (`falcon-form-field-legacy`) **not in** the consolidated `components/` set (calendar-legacy, form-field-legacy, mobile-number, multiselect-legacy, photo-uploader, single-uploader, stepper, stepper-legacy, tree, tree-panel, uploader, wizard, send-credentials-popup, shared-directives) |
| `agent-05-theme-tailwind-tokens` | 0 | no per-component dossiers — 12 cross-cutting audit reports |
| `agent-06-frontend-architecture-usage` | 0 | no per-component dossiers — 16 workspace audit reports |

**Coverage check vs consolidated `components/`:** 22 + 10 + 15 + 14 = 61. Consolidated set is 60. The single delta is `falcon-form-field-legacy` (present in `agent-04-workflow/components/` but not in `component-registry/components/`). Worth investigating before any migration drop.

### Source 2 — `frontend-understanding/` (no component subfolder)

This source contains only consolidated master narrative reports — no per-component dossiers.

### Source 3 — `understanding/frontend/components/` (LEGACY first-pass)

3 component folders, each with only 4 of the 6 canonical files.

| # | Component | OVERVIEW | API | USAGE | TOKENS | GAPS | DECISION |
|---|---|---|---|---|---|---|---|
| 1 | falcon-dropdown | YES | YES | YES | **NO** | YES | **NO** |
| 2 | falcon-input | YES | YES | YES | **NO** | YES | **NO** |
| 3 | falcon-table | YES | YES | YES | **NO** | YES | **NO** |

All three are first-pass drafts from the 20:17–20:27 timeslot — strictly smaller than the corresponding Source 1 dossiers (e.g. `falcon-input/API.md` is 5,828 B in Source 3 vs 8,335 B in Source 1).

---

## 4. Duplicate File Map

Same filename appearing across sources, with the **freshest path bolded**. Brain SK mirrors (sources 4-5-6) collapse into 1-2-3 because they are byte-identical.

| Filename | Source 1 path / mtime | Source 2 path / mtime | Source 3 path / mtime | Freshest |
|---|---|---|---|---|
| `FALCON_COMPONENT_REGISTRY_DEEP.md` | **`Brain Outputs\component-registry\FALCON_COMPONENT_REGISTRY_DEEP.md` (22:43)** | — | — | Source 1 only |
| `FALCON_COMPONENT_REGISTRY.md` | — | — | `Brain Outputs\understanding\frontend\FALCON_COMPONENT_REGISTRY.md` (20:22) | Source 3 only (older, legacy first-pass — superseded by `FALCON_COMPONENT_REGISTRY_DEEP.md` in Source 1) |
| `FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md` | — | **`Brain Outputs\frontend-understanding\FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md` (22:54)** | — | Source 2 only |
| `FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md` | — | **`Brain Outputs\frontend-understanding\FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md` (22:53)** | — | Source 2 only |
| `FALCON_COMPONENT_CAPABILITY_MATRIX.md` | — | **`Brain Outputs\frontend-understanding\FALCON_COMPONENT_CAPABILITY_MATRIX.md` (22:45)** | — | Source 2 only |
| `COMPONENT_RELATIONSHIP_MAP.md` | — | **`Brain Outputs\frontend-understanding\COMPONENT_RELATIONSHIP_MAP.md` (22:46)** | — | Source 2 only |
| `COMPONENT_UPGRADE_BACKLOG.md` | — | **`Brain Outputs\frontend-understanding\COMPONENT_UPGRADE_BACKLOG.md` (22:48)** | — | Source 2 only |
| `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` | — | **`Brain Outputs\frontend-understanding\FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` (22:49)** | — | Source 2 only |
| `FALCON_THEME_AND_TAILWIND_REPORT.md` | — | **`Brain Outputs\frontend-understanding\FALCON_THEME_AND_TAILWIND_REPORT.md` (22:51)** | — | Source 2 only |
| `FINAL_COVERAGE_REPORT.md` | — | **`Brain Outputs\frontend-understanding\FINAL_COVERAGE_REPORT.md` (22:55)** | — | Source 2 only |
| `READINESS_SCORES.md` | — | **`Brain Outputs\frontend-understanding\READINESS_SCORES.md` (22:54)** | — | Source 2 only |
| `TAILWIND_TOKEN_MAP.md` | (theme audit covered by `agent-05-theme-tailwind-tokens/THEME_SSOT_AUDIT.md` 22:08) | (theme covered by `FALCON_THEME_AND_TAILWIND_REPORT.md` 22:51) | `Brain Outputs\understanding\frontend\TAILWIND_TOKEN_MAP.md` (20:19) | Source 3 stand-alone, but **superseded** by Source 2's `FALCON_THEME_AND_TAILWIND_REPORT.md` |
| `ANGULAR_AND_TAILWIND_RULES.md` | — | — | `Brain Outputs\understanding\frontend\ANGULAR_AND_TAILWIND_RULES.md` (20:27) | Source 3 only — no direct equivalent in 1/2 (rules cheat sheet lives in `agent-05/STYLING_RULES_CHEAT_SHEET.md` 22:15, which is broader) |
| `FRONTEND_STRUCTURE_REPORT.md` | — | — | `Brain Outputs\understanding\frontend\FRONTEND_STRUCTURE_REPORT.md` (20:20) | Source 3 only — closest equivalents are `agent-06/FEATURE_FOLDER_STRUCTURE.md` (22:09) and `agent-06/WORKSPACE_TOPOLOGY.md` (22:07) |
| `FRONTEND_WORKSPACE_MAP.md` | — | — | `Brain Outputs\understanding\frontend\FRONTEND_WORKSPACE_MAP.md` (20:18) | Source 3 only — closest equivalent is `agent-06/WORKSPACE_TOPOLOGY.md` (22:07) (newer and larger 13,259 B vs 9,946 B) |

**Component-dossier files** (six canonical) for `falcon-dropdown`, `falcon-input`, `falcon-table` exist in both Source 1 (full 6) and Source 3 (partial 4):

| Component | File | Source 1 size / mtime | Source 3 size / mtime | Freshest & most complete |
|---|---|---|---|---|
| falcon-input | OVERVIEW.md | **5,941 B / 22:40** | 3,840 B / 20:22 | Source 1 |
| falcon-input | API.md | **8,335 B / 22:40** | 5,828 B / 20:23 | Source 1 |
| falcon-input | USAGE.md | **7,354 B / 22:40** | 4,597 B / 20:23 | Source 1 |
| falcon-input | GAPS_AND_UPGRADES.md | **7,831 B / 22:40** | 3,825 B / 20:23 | Source 1 |
| falcon-input | TOKENS.md | **7,688 B / 22:40** | (missing) | Source 1 only |
| falcon-input | DECISION.md | **7,791 B / 22:40** | (missing) | Source 1 only |
| falcon-dropdown | (4 of 6) | **all newer in Source 1** | older | Source 1 |
| falcon-table | (4 of 6) | **all newer in Source 1** | older | Source 1 |

---

## 5. Recommendation

### Winner — Master files

**Source 2 (`Brain Outputs\frontend-understanding`)** for all the 9 Agent-7 narrative/synthesis reports — newest (22:45–22:55), self-identified as "Brain SK canonical", widest coverage:
- `FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md`
- `FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md`
- `FALCON_COMPONENT_CAPABILITY_MATRIX.md`
- `COMPONENT_RELATIONSHIP_MAP.md`
- `COMPONENT_UPGRADE_BACKLOG.md`
- `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md`
- `FALCON_THEME_AND_TAILWIND_REPORT.md`
- `FINAL_COVERAGE_REPORT.md`
- `READINESS_SCORES.md`

**Source 1 (`Brain Outputs\component-registry`)** for:
- `FALCON_COMPONENT_REGISTRY_DEEP.md` (the deep registry index)
- All of `parallel-agents/agent-05-theme-tailwind-tokens/*.md` (14 cross-cutting theme/token audit reports — broader and newer than Source 3's `TAILWIND_TOKEN_MAP.md`)
- All of `parallel-agents/agent-06-frontend-architecture-usage/*.md` (16 workspace audit reports — supersedes Source 3's `FRONTEND_STRUCTURE_REPORT.md` and `FRONTEND_WORKSPACE_MAP.md`)

**Source 3 (`Brain Outputs\understanding\frontend`)** is **not the winner for any file** — every Source 3 master file is older than the corresponding Source 1/2 file and is functionally superseded. The one file Source 3 contains that has no direct same-named successor is `ANGULAR_AND_TAILWIND_RULES.md` (20:27); however, the rules content is also covered by `agent-05/STYLING_RULES_CHEAT_SHEET.md` (22:15) and `agent-05/NO_CSS_NO_SCSS_COMPLIANCE.md` (22:17). The Source 3 file may still be worth retaining as a short, focused rules digest — recommend manual review during migration to decide whether to promote, merge, or retire it.

### Winner — Component dossiers

**Source 1 (`Brain Outputs\component-registry\components`)** — 60 components × 6 canonical files = 360 dossier files, all generated 22:40 in one batch, all six files present in every dossier. This is unambiguously the canonical component dossier tier.

Source 3's 3-component subset (`falcon-dropdown`, `falcon-input`, `falcon-table`, each only 4 of 6 files, all older and smaller) is fully superseded.

### Brain Outputs vs Brain SK mirrors

Brain SK (sources 4-5-6) carries **zero additional content** vs Brain Outputs (sources 1-2-3). After migration, one of the two trees can be deprecated to remove duplication. Recommend keeping Brain Outputs (the path used in the canonical target hierarchy) and archiving Brain SK\outputs if storage matters — but that is a separate decision outside this inventory's read-only scope.

---

## 6. Notes / Anomalies

1. **No Obsidian-style wikilinks anywhere.** `grep -rl '\[\['` across all masters, all parallel-agents, and all component dossiers returned zero matches. The corpus uses plain Markdown headings + backtick-paths only — no `[[wikilink]]` cross-references. Any wiki-link injection during migration will be a net-new operation.

2. **Brain Outputs and Brain SK are exact byte-for-byte mirrors.** Recursive `diff -rq` returns empty for component-registry, frontend-understanding, and understanding/frontend pairs. Inodes differ — they are two physical trees, not symlinks/junctions. Likely a side-effect of an earlier "Brain SK consolidation" copy operation. Migration only needs to act on the Brain Outputs side.

3. **Component count delta — 60 vs 61.** The consolidated `component-registry/components/` set has 60 dossiers. Counting unique components across `parallel-agents/agent-01..04/components/`: 22 + 10 + 15 + 14 = 61. The extra is `falcon-form-field-legacy` in `agent-04-workflow/components/falcon-form-field-legacy/` (full 6-file dossier, sizes 2,239 / 3,245 / 2,477 / 2,548 / 1,143 / 2,814 B, mtime 22:19–22:20). It did **not** make it into the consolidated `component-registry/components/` tier. Could be intentional (rolled into `falcon-form-field`) or an oversight — flag for the migration plan to confirm.

4. **Source 3's three component dossiers are missing TOKENS.md and DECISION.md across the board.** Not a partial Source 1 — a strictly earlier draft pass. Safe to retire after Source 1 dossiers are promoted.

5. **Empty result for wikilink search confirms a clean Markdown corpus.** Migration step that injects `[[wikilinks]]` between masters / components / agent reports will need to operate against the full file set with no existing link graph to preserve.

6. **Parallel-agents intermediates and consolidated `components/` dossiers share identical byte sizes** for sampled files (`falcon-input/API.md` is 8,335 B in both `agent-01-forms/components/falcon-input/` and `component-registry/components/falcon-input/`). The consolidated tier was assembled by copy from the parallel-agents tier — duplicates exist but data is consistent. Recommend the migration consume from the consolidated `components/` (single source) rather than crawling parallel-agents per-component dossiers, unless intermediate provenance matters.

7. **Newest mtime across the whole corpus:** `2026-05-13 22:55:40` (`frontend-understanding/FINAL_COVERAGE_REPORT.md`) — confirms the Agent-7 merge wave finished after the 22:40 component-dossier batch and after the 22:43 deep-registry master. So Source 2's narrative tier sits at the apex of the build pipeline and is the canonical "latest knowledge" tier.

8. **Migration folder created.** `C:\Falcon\Brain Outputs\understanding\frontend\migration\` was newly created to host this report — it did not exist before.

9. **Source 3 mtimes are clean (20:17–20:27 window), not suspicious.** They simply reflect an earlier first-pass build cycle that was later expanded into Source 1+2. The 2-hour gap between the 20:xx Source 3 burst and the 21:56+ Source 1+2 burst is consistent with a build-rebuild cycle, not data corruption.

---

*** End of inventory — 6 sources audited, 770 dossier files + 51 master files + 28 parallel-agent reports catalogued ***
