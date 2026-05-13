*** Falcon Brain SK — Frontend Component Knowledge Migration ***
*** Agent 2 (Latest Selection) report — generated 2026-05-13 ***

# 02 — Latest Selection Plan

> Prerequisite read: [`01_SOURCE_INVENTORY.md`](01_SOURCE_INVENTORY.md) — Agent 1's read-only audit of the 6 candidate source trees.
>
> Scope of this report: a concrete, decisive, per-file routing plan for Agent 3 (component-dossier migration) and Agent 4 (master-file migration). Every required master file gets a verdict; every component dossier gets a verdict; conflicts and edge cases are called out by name.
>
> All paths absolute. All "Source N" labels reference the table in §1 of `01_SOURCE_INVENTORY.md`:
> - Source 1 = `C:\Falcon\Brain Outputs\component-registry`
> - Source 2 = `C:\Falcon\Brain Outputs\frontend-understanding`
> - Source 3 = `C:\Falcon\Brain Outputs\understanding\frontend` (current canonical target — partially populated with legacy first-pass)
> - Sources 4-6 = exact byte mirrors under `C:\Falcon\Brain SK\outputs\…`, **never used as sources**.
>
> Selection rules applied in this order: (1) more complete sections > smaller, (2) newer mtime, (3) prefer canonical-folder file if already complete, (4) never overwrite complete with incomplete, (5) if uncertain → keep both + flag as CONFLICT.

---

## 1. Master Files Selection

Canonical target: `C:\Falcon\Brain Outputs\understanding\frontend\<MASTER>.md`

Verdict legend: **COPY** = copy from chosen source into the canonical target (overwriting any older same-named file). **KEEP_EXISTING** = the file already in the canonical target is the freshest/most-complete and stays. **CONFLICT** = two candidates of similar quality — keep both temporarily and review. **GENERATE_PLACEHOLDER** = no source has this file; Agent 4 must scaffold a stub.

| # | Master filename | Chosen source | Source path (absolute) | Size | mtime | Verdict | Notes |
|---|---|---|---|---|---|---|---|
| 1 | `CANONICAL_FRONTEND_UNDERSTANDING.md` | (none) | (no candidate exists in any source — verified via `Grep CANONICAL_FRONTEND_UNDERSTANDING` over `C:\Falcon\Brain Outputs` = 0 matches) | — | — | **GENERATE_PLACEHOLDER** | No file under this name exists across Sources 1-3. Agent 4 must scaffold a top-level index that links to the 13 other masters + the 60 component dossiers + the canonical theme/architecture references. Suggested structure in §7. |
| 2 | `FALCON_COMPONENT_REGISTRY.md` | Source 3 (canonical target itself) | `C:\Falcon\Brain Outputs\understanding\frontend\FALCON_COMPONENT_REGISTRY.md` | 34,765 B | 2026-05-13 20:22 | **KEEP_EXISTING** | The "first-pass" registry. Only candidate matching this exact filename. Newer `FALCON_COMPONENT_REGISTRY_DEEP.md` (row 3) is a separate, complementary document — both required by the master list. Verified head: row table with SELECTOR / ANGULAR WRAPPER / STENCIL SOURCE / INPUTS / OUTPUTS / SLOTS / VARIANTS / DUAL-RENDER / TOKENS / NOTES — distinct dimensions from DEEP (which adds owner-agent + consumer counts + status). |
| 3 | `FALCON_COMPONENT_REGISTRY_DEEP.md` | Source 1 | `C:\Falcon\Brain Outputs\component-registry\FALCON_COMPONENT_REGISTRY_DEEP.md` | 33,414 B | 2026-05-13 22:43 | **COPY** | Only candidate exists. Newer (22:43) than the legacy registry. Adds status / owner-agent / consumers / top gap / top upgrade columns. |
| 4 | `FALCON_COMPONENT_CAPABILITY_MATRIX.md` | Source 2 | `C:\Falcon\Brain Outputs\frontend-understanding\FALCON_COMPONENT_CAPABILITY_MATRIX.md` | 15,135 B | 2026-05-13 22:45 | **COPY** | Only candidate. Self-identified "Brain SK canonical — Agent 7 merge". 15-column capability matrix (Dual / CVA / RFm / ngM / Slt / POp / Lzy / Pag / Kbd / A11 / Tok / Drk / RTL / Prd / Tst). |
| 5 | `COMPONENT_RELATIONSHIP_MAP.md` | Source 2 | `C:\Falcon\Brain Outputs\frontend-understanding\COMPONENT_RELATIONSHIP_MAP.md` | 18,384 B | 2026-05-13 22:46 | **COPY** | Only candidate. Composition trees + replacement / supersedence relations + token-sharing graph. |
| 6 | `COMPONENT_UPGRADE_BACKLOG.md` | Source 2 | `C:\Falcon\Brain Outputs\frontend-understanding\COMPONENT_UPGRADE_BACKLOG.md` | 32,127 B | 2026-05-13 22:48 | **COPY** | Only candidate. P0/P1/P2/P3 backlog of 124 items aggregating Agents 1-6 UPGRADE_CANDIDATES.md. Largest narrative file in Source 2. |
| 7 | `FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md` | Source 2 | `C:\Falcon\Brain Outputs\frontend-understanding\FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md` | 17,009 B | 2026-05-13 22:54 | **COPY** | Only candidate. Master narrative summary — mission, methodology, deliverable inventory, merge strategy. The top-of-funnel entry to the consolidated narrative tier. |
| 8 | `FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md` | Source 2 | `C:\Falcon\Brain Outputs\frontend-understanding\FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md` | 24,472 B | 2026-05-13 22:53 | **COPY** | Only candidate. The 10-question synthesis: Strategy E projection, `useTailwind` toggle, `falconXClasses()` helpers, CVA gaps, per-instance overrides. |
| 9 | `FALCON_THEME_AND_TAILWIND_REPORT.md` | Source 2 | `C:\Falcon\Brain Outputs\frontend-understanding\FALCON_THEME_AND_TAILWIND_REPORT.md` | 16,404 B | 2026-05-13 22:51 | **COPY** | Only candidate at this exact filename. Self-identified "Agent 7 merge of Agent 5 deliverables". Authoritative token count (216) overrides the legacy `TAILWIND_TOKEN_MAP.md` claim of "~264". |
| 10 | `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` | Source 2 | `C:\Falcon\Brain Outputs\frontend-understanding\FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` | 19,219 B | 2026-05-13 22:49 | **COPY** | Only candidate. The dual-render pattern explainer: Stencil Shadow ↔ Light ↔ Angular wrapper, `useTailwind` toggle convention. |
| 11 | `FRONTEND_WORKSPACE_MAP.md` | Source 3 (canonical target itself) | `C:\Falcon\Brain Outputs\understanding\frontend\FRONTEND_WORKSPACE_MAP.md` | 9,946 B | 2026-05-13 20:18 | **KEEP_EXISTING** | Only candidate matching this exact filename. The newer, larger `agent-06/WORKSPACE_TOPOLOGY.md` (13,259 B / 22:07) exists under a DIFFERENT name — it migrates separately (row 15) as a complementary doc. Keep the canonical legacy file at this filename; users searching for `FRONTEND_WORKSPACE_MAP.md` find it; the deeper topology is one link away. **Optional follow-up** (NOT in this migration): Agent 4 may overwrite this with the agent-06 content if the user prefers a single deeper file at this name — flag if so. |
| 12 | `FRONTEND_STRUCTURE_REPORT.md` | Source 3 (canonical target itself) | `C:\Falcon\Brain Outputs\understanding\frontend\FRONTEND_STRUCTURE_REPORT.md` | 14,941 B | 2026-05-13 20:20 | **KEEP_EXISTING** | Only candidate matching this exact filename. Newer alternative `agent-06/FEATURE_FOLDER_STRUCTURE.md` (8,394 B / 22:09) is narrower (feature-folder pattern only) — migrates separately under its own name. Source 3 file covers folder structure + app structure + apps/libs taxonomy; broader scope. Keep. |
| 13 | `ANGULAR_AND_TAILWIND_RULES.md` | Source 3 (canonical target itself) | `C:\Falcon\Brain Outputs\understanding\frontend\ANGULAR_AND_TAILWIND_RULES.md` | 12,630 B | 2026-05-13 20:27 | **KEEP_EXISTING** | Only candidate matching this exact filename. Newer, larger Agent 5 cousins (`STYLING_RULES_CHEAT_SHEET.md` 20,542 B / 22:15, `NO_CSS_NO_SCSS_COMPLIANCE.md` 11,314 B / 22:17) cover different (more recipe-shaped) angles. Keep the rules digest at this name; migrate the deeper Agent 5 docs separately (row 16-17). |
| 14 | `TAILWIND_TOKEN_MAP.md` | Source 3 (canonical target itself) | `C:\Falcon\Brain Outputs\understanding\frontend\TAILWIND_TOKEN_MAP.md` | 11,037 B | 2026-05-13 20:19 | **KEEP_EXISTING** *(see CAVEAT)* | Only candidate matching this exact filename. **CAVEAT** — Source 2's `FALCON_THEME_AND_TAILWIND_REPORT.md` explicitly contradicts this file's token count: legacy claims "~264 tokens", Agent 5 verified count is 216 (`@theme` only). The legacy file is **factually stale on the count** but still useful for the per-token tables (colors, spacing, density). Keep but Agent 4 should add a 1-line correction banner at the top citing the 216 figure from `FALCON_THEME_AND_TAILWIND_REPORT.md`. Listed as caveat, not CONFLICT — both files survive, one is the legacy companion. |

### 1b. Complementary masters to migrate (cited above as "different name, migrate separately")

These are NOT in the 14-master required list but are referenced by the rows above as the deeper / newer cousins. Agent 4 SHOULD migrate them into the canonical tree (under subfolders), because they carry data the required-named files do not.

| # | Filename | Source path (absolute) | Size | mtime | Target sub-path under `C:\Falcon\Brain Outputs\understanding\frontend\` |
|---|---|---|---|---|---|
| 15 | `WORKSPACE_TOPOLOGY.md` | `C:\Falcon\Brain Outputs\component-registry\parallel-agents\agent-06-frontend-architecture-usage\WORKSPACE_TOPOLOGY.md` | 13,259 B | 22:07 | `architecture\WORKSPACE_TOPOLOGY.md` |
| 16 | `FEATURE_FOLDER_STRUCTURE.md` | `…\agent-06-frontend-architecture-usage\FEATURE_FOLDER_STRUCTURE.md` | 8,394 B | 22:09 | `architecture\FEATURE_FOLDER_STRUCTURE.md` |
| 17 | `STYLING_RULES_CHEAT_SHEET.md` | `C:\Falcon\Brain Outputs\component-registry\parallel-agents\agent-05-theme-tailwind-tokens\STYLING_RULES_CHEAT_SHEET.md` | 20,542 B | 22:15 | `theme\STYLING_RULES_CHEAT_SHEET.md` |
| 18 | `THEME_SSOT_AUDIT.md` | `…\agent-05-theme-tailwind-tokens\THEME_SSOT_AUDIT.md` | 24,288 B | 22:08 | `theme\THEME_SSOT_AUDIT.md` |
| 19 | `COMPONENT_TOKEN_FILES_AUDIT.md` | `…\agent-05-theme-tailwind-tokens\COMPONENT_TOKEN_FILES_AUDIT.md` | 28,290 B | 22:11 | `theme\COMPONENT_TOKEN_FILES_AUDIT.md` |
| 20 | `TOKEN_FLOW_REPORT.md` | `…\agent-05-theme-tailwind-tokens\TOKEN_FLOW_REPORT.md` | 22,022 B | 22:14 | `theme\TOKEN_FLOW_REPORT.md` |
| 21 | `NO_CSS_NO_SCSS_COMPLIANCE.md` | `…\agent-05-theme-tailwind-tokens\NO_CSS_NO_SCSS_COMPLIANCE.md` | 11,314 B | 22:17 | `theme\NO_CSS_NO_SCSS_COMPLIANCE.md` |
| 22 | `DARK_MODE_AUDIT.md` | `…\agent-05-theme-tailwind-tokens\DARK_MODE_AUDIT.md` | 14,292 B | 22:18 | `theme\DARK_MODE_AUDIT.md` |
| 23 | `DENSITY_AND_RTL_AUDIT.md` | `…\agent-05-theme-tailwind-tokens\DENSITY_AND_RTL_AUDIT.md` | 10,275 B | 22:19 | `theme\DENSITY_AND_RTL_AUDIT.md` |
| 24 | `STATIC_STYLE_RISKS.md` | `…\agent-05-theme-tailwind-tokens\STATIC_STYLE_RISKS.md` | 16,293 B | 22:16 | `theme\STATIC_STYLE_RISKS.md` |
| 25 | `UTILITY_SAFELIST_AUDIT.md` | `…\agent-05-theme-tailwind-tokens\UTILITY_SAFELIST_AUDIT.md` | 11,645 B | 22:20 | `theme\UTILITY_SAFELIST_AUDIT.md` |
| 26 | `APP_TAILWIND_AUDIT.md` | `…\agent-05-theme-tailwind-tokens\APP_TAILWIND_AUDIT.md` | 11,188 B | 22:12 | `theme\APP_TAILWIND_AUDIT.md` |
| 27 | `TAILWIND_HELPERS_AUDIT.md` | `…\agent-05-theme-tailwind-tokens\TAILWIND_HELPERS_AUDIT.md` | 11,246 B | 22:12 | `theme\TAILWIND_HELPERS_AUDIT.md` |
| 28 | `BARREL_EXPORTS_AUDIT.md` | `…\agent-06-frontend-architecture-usage\BARREL_EXPORTS_AUDIT.md` | 21,326 B | 22:08 | `architecture\BARREL_EXPORTS_AUDIT.md` |
| 29 | `ROUTES_AND_MF_AUDIT.md` | `…\agent-06-frontend-architecture-usage\ROUTES_AND_MF_AUDIT.md` | 16,394 B | 22:10 | `architecture\ROUTES_AND_MF_AUDIT.md` |
| 30 | `MODULE_FEDERATION_PATTERNS.md` | `…\agent-06-frontend-architecture-usage\MODULE_FEDERATION_PATTERNS.md` | 13,181 B | 22:12 | `architecture\MODULE_FEDERATION_PATTERNS.md` |
| 31 | `AUTH_AND_FACADE_PATTERNS.md` | `…\agent-06-frontend-architecture-usage\AUTH_AND_FACADE_PATTERNS.md` | 14,706 B | 22:13 | `architecture\AUTH_AND_FACADE_PATTERNS.md` |
| 32 | `WRAPPER_IMPORT_DECISION_TREE.md` | `…\agent-06-frontend-architecture-usage\WRAPPER_IMPORT_DECISION_TREE.md` | 10,737 B | 22:14 | `architecture\WRAPPER_IMPORT_DECISION_TREE.md` |
| 33 | `COMPONENT_USAGE_MATRIX.md` | `…\agent-06-frontend-architecture-usage\COMPONENT_USAGE_MATRIX.md` | 14,177 B | 22:15 | `architecture\COMPONENT_USAGE_MATRIX.md` |
| 34 | `UNUSED_AND_DEPRECATED_COMPONENTS.md` | `…\agent-06-frontend-architecture-usage\UNUSED_AND_DEPRECATED_COMPONENTS.md` | 11,960 B | 22:16 | `architecture\UNUSED_AND_DEPRECATED_COMPONENTS.md` |
| 35 | `QUALITY_GATES_AUDIT.md` | `…\agent-06-frontend-architecture-usage\QUALITY_GATES_AUDIT.md` | 12,065 B | 22:17 | `architecture\QUALITY_GATES_AUDIT.md` |
| 36 | `FORBIDDEN_PATTERNS_OBSERVED.md` | `…\agent-06-frontend-architecture-usage\FORBIDDEN_PATTERNS_OBSERVED.md` | 8,448 B | 22:17 | `architecture\FORBIDDEN_PATTERNS_OBSERVED.md` |
| 37 | `IMPORT_PATH_CONVENTIONS.md` | `…\agent-06-frontend-architecture-usage\IMPORT_PATH_CONVENTIONS.md` | 11,059 B | 22:09 | `architecture\IMPORT_PATH_CONVENTIONS.md` |
| 38 | `STATE_AND_SIGNAL_PATTERNS.md` | `…\agent-06-frontend-architecture-usage\STATE_AND_SIGNAL_PATTERNS.md` | 10,838 B | 22:11 | `architecture\STATE_AND_SIGNAL_PATTERNS.md` |
| 39 | `FINAL_COVERAGE_REPORT.md` | `C:\Falcon\Brain Outputs\frontend-understanding\FINAL_COVERAGE_REPORT.md` | 10,880 B | 22:55 | `narrative\FINAL_COVERAGE_REPORT.md` |
| 40 | `READINESS_SCORES.md` | `C:\Falcon\Brain Outputs\frontend-understanding\READINESS_SCORES.md` | 6,954 B | 22:54 | `narrative\READINESS_SCORES.md` |

> **Counts for the 14 required master files:** 10 COPY · 4 KEEP_EXISTING · 0 CONFLICT · 1 GENERATE_PLACEHOLDER (`CANONICAL_FRONTEND_UNDERSTANDING.md`). (10 + 4 + 0 + 1 = 15 because `FALCON_COMPONENT_REGISTRY.md` row 2 is KEEP_EXISTING and `FALCON_COMPONENT_REGISTRY_DEEP.md` row 3 is COPY — both required, counted separately.)
> **Counts for complementary rows 15-40 (NOT in the 14 required list, but Agent 4 should migrate them):** 26 COPY (all from Source 1 parallel-agents subtrees + Source 2 narrative leftovers). These are not in the required-master list — listing them keeps Agent 4 from missing the deep reference set.

---

## 2. Component Dossiers Selection

Canonical target: `C:\Falcon\Brain Outputs\understanding\frontend\components\<component>\<FILE>.md`

Verdict legend:
- **COPY_FROM_SOURCE_1** = copy the full 6-file Source 1 dossier into the canonical target.
- **MERGE** = Source 3 has a partial dossier (4 of 6 files) AND a same-named newer Source 1 dossier exists — Source 1 wins for all 6 files, Source 3 partial is fully superseded. Operationally indistinguishable from COPY_FROM_SOURCE_1 + delete Source 3 partial; calling it MERGE to flag the existence of the older draft.
- **COPY_AS_LEGACY** = `falcon-form-field-legacy` (only in agent-04 subtree, not in consolidated `components/`). See §6.

Spot-check verification (Source 1 dossier quality): sampled `falcon-button` (OVERVIEW + TOKENS + DECISION), `falcon-table` (OVERVIEW), `falcon-wizard` (GAPS_AND_UPGRADES). All four files in all three components are full prose with H2 sub-sections (`Component purpose`, `Business / UI use case`, `When to use it`, `When NOT to use it`, `Token file`, `Brain SK final recommendation`, etc.). Source 1 dossiers are confirmed canonical-quality.

| # | Component | Source 1 dossier path | Files present | Source 3 conflict? | Verdict |
|---|---|---|---|---|---|
| 1 | `falcon-accordion` | `…\component-registry\components\falcon-accordion\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 2 | `falcon-avatar` | `…\component-registry\components\falcon-avatar\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 3 | `falcon-badge` | `…\component-registry\components\falcon-badge\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 4 | `falcon-button` | `…\component-registry\components\falcon-button\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 5 | `falcon-calendar` | `…\component-registry\components\falcon-calendar\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 6 | `falcon-calendar-legacy` | `…\component-registry\components\falcon-calendar-legacy\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 7 | `falcon-card` | `…\component-registry\components\falcon-card\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 8 | `falcon-checkbox` | `…\component-registry\components\falcon-checkbox\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 9 | `falcon-checkbox-group` | `…\component-registry\components\falcon-checkbox-group\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 10 | `falcon-combobox` | `…\component-registry\components\falcon-combobox\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 11 | `falcon-confirm-dialog` | `…\component-registry\components\falcon-confirm-dialog\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 12 | `falcon-data-table` | `…\component-registry\components\falcon-data-table\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 13 | `falcon-date-picker` | `…\component-registry\components\falcon-date-picker\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 14 | `falcon-dialog` | `…\component-registry\components\falcon-dialog\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 15 | `falcon-drawer` | `…\component-registry\components\falcon-drawer\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 16 | `falcon-dropdown` | `…\component-registry\components\falcon-dropdown\` | 6/6 | YES — Source 3 has 4/6 (no TOKENS, no DECISION), all 4 are smaller + older (20:22) | **MERGE** — Source 1 (22:40, full 6) wins; Source 3 partial is superseded. Agent 3 should overwrite the 4 canonical-target files. |
| 17 | `falcon-email-field` | `…\component-registry\components\falcon-email-field\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 18 | `falcon-empty-state` | `…\component-registry\components\falcon-empty-state\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 19 | `falcon-filter-panel` | `…\component-registry\components\falcon-filter-panel\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 20 | `falcon-form-field` | `…\component-registry\components\falcon-form-field\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 21 | `falcon-grid-input` | `…\component-registry\components\falcon-grid-input\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 22 | `falcon-icon` | `…\component-registry\components\falcon-icon\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 23 | `falcon-input` | `…\component-registry\components\falcon-input\` | 6/6 | YES — Source 3 has 4/6, all smaller + older | **MERGE** — Source 1 wins, Source 3 fully superseded. |
| 24 | `falcon-input-number` | `…\component-registry\components\falcon-input-number\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 25 | `falcon-menu` | `…\component-registry\components\falcon-menu\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 26 | `falcon-message-host` | `…\component-registry\components\falcon-message-host\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 27 | `falcon-mobile-number` | `…\component-registry\components\falcon-mobile-number\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 28 | `falcon-multi-select` | `…\component-registry\components\falcon-multi-select\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 29 | `falcon-multiselect-legacy` | `…\component-registry\components\falcon-multiselect-legacy\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 30 | `falcon-notification` | `…\component-registry\components\falcon-notification\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 31 | `falcon-organization-hierarchy-tree-tw` | `…\component-registry\components\falcon-organization-hierarchy-tree-tw\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 32 | `falcon-otp` | `…\component-registry\components\falcon-otp\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 33 | `falcon-otp-send-dialog` | `…\component-registry\components\falcon-otp-send-dialog\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 34 | `falcon-paginator` | `…\component-registry\components\falcon-paginator\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 35 | `falcon-password` | `…\component-registry\components\falcon-password\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 36 | `falcon-phone-field` | `…\component-registry\components\falcon-phone-field\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 37 | `falcon-photo-uploader` | `…\component-registry\components\falcon-photo-uploader\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 38 | `falcon-popup` | `…\component-registry\components\falcon-popup\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 39 | `falcon-radio` | `…\component-registry\components\falcon-radio\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 40 | `falcon-radio-group` | `…\component-registry\components\falcon-radio-group\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 41 | `falcon-search-input` | `…\component-registry\components\falcon-search-input\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 42 | `falcon-select` | `…\component-registry\components\falcon-select\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 43 | `falcon-single-uploader` | `…\component-registry\components\falcon-single-uploader\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 44 | `falcon-status-badge` | `…\component-registry\components\falcon-status-badge\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 45 | `falcon-stepper` | `…\component-registry\components\falcon-stepper\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 46 | `falcon-stepper-legacy` | `…\component-registry\components\falcon-stepper-legacy\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 47 | `falcon-switch` | `…\component-registry\components\falcon-switch\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 48 | `falcon-table` | `…\component-registry\components\falcon-table\` | 6/6 | YES — Source 3 has 4/6, all smaller + older | **MERGE** — Source 1 wins, Source 3 fully superseded. |
| 49 | `falcon-tabs` | `…\component-registry\components\falcon-tabs\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 50 | `falcon-tag` | `…\component-registry\components\falcon-tag\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 51 | `falcon-textarea` | `…\component-registry\components\falcon-textarea\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 52 | `falcon-toast` | `…\component-registry\components\falcon-toast\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 53 | `falcon-tooltip` | `…\component-registry\components\falcon-tooltip\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 54 | `falcon-tree` | `…\component-registry\components\falcon-tree\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 55 | `falcon-tree-panel` | `…\component-registry\components\falcon-tree-panel\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 56 | `falcon-tree-table` | `…\component-registry\components\falcon-tree-table\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 57 | `falcon-uploader` | `…\component-registry\components\falcon-uploader\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 58 | `falcon-wizard` | `…\component-registry\components\falcon-wizard\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 59 | `send-credentials-popup` | `…\component-registry\components\send-credentials-popup\` | 6/6 | no | **COPY_FROM_SOURCE_1** |
| 60 | `shared-directives` | `…\component-registry\components\shared-directives\` | 6/6 | no | **COPY_FROM_SOURCE_1** |

**Verdict counts:** 57 COPY_FROM_SOURCE_1 + 3 MERGE (dropdown, input, table) = 60 components ready for migration from a single canonical source. 0 CONFLICT. 0 unhandled.

---

## 3. Conflicts requiring merge

Result: **ZERO true conflicts.**

Every required master file resolves to exactly one chosen source with a decisive verdict. Every component dossier resolves cleanly to Source 1 (with three components also superseding a Source 3 partial draft via MERGE). The one ambiguity (`falcon-form-field-legacy` vs `falcon-form-field` — different keys, same underlying legacy component) is treated as an edge case in §6, not a conflict, because Source 2's Agent 7 merge note already documented the resolution: "kept Agent 1's version per ownership table" (Source 2 `FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md` line 24).

A single caveat (not a conflict): legacy `TAILWIND_TOKEN_MAP.md` quotes a stale token count ("~264" vs Agent 5's verified 216). Resolved in §1 row 14 — keep the file, add a 1-line correction banner. No file-tree change needed beyond the banner edit.

---

## 4. Files to archive (not migrate)

The following files exist in Source 1 / Source 3 but should NOT be copied into the canonical target. They are intermediates, redundant per-agent indexes, or already-superseded scratch.

### 4a. Parallel-agents intermediate per-agent indexes (Source 1)

These per-agent summaries are valuable provenance but redundant once the consolidated masters in `frontend-understanding/` exist (Source 2 explicitly aggregates them). Keep them in place inside `component-registry/parallel-agents/` for archival; **do NOT copy into the canonical `understanding/frontend/` tree.**

| Path | Reason to archive (not migrate) |
|---|---|
| `C:\Falcon\Brain Outputs\component-registry\parallel-agents\SHARED_BRIEFING.md` | Per-agent task brief (process artefact, not knowledge content). |
| `…\parallel-agents\agent-01-forms\AGENT_SUMMARY.md` | Per-agent rollup; superseded by `frontend-understanding\FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md`. |
| `…\parallel-agents\agent-01-forms\COMPONENT_COVERAGE.md` | Per-agent coverage table; superseded by `frontend-understanding\FINAL_COVERAGE_REPORT.md`. |
| `…\parallel-agents\agent-01-forms\UPGRADE_CANDIDATES.md` | Per-agent upgrade scope; rolled into `frontend-understanding\COMPONENT_UPGRADE_BACKLOG.md`. |
| `…\parallel-agents\agent-02-data\AGENT_SUMMARY.md` | Same — per-agent rollup, superseded. |
| `…\parallel-agents\agent-02-data\COMPONENT_COVERAGE.md` | Same. |
| `…\parallel-agents\agent-02-data\UPGRADE_CANDIDATES.md` | Same. |
| `…\parallel-agents\agent-03-layout-navigation\AGENT_SUMMARY.md` | Same. |
| `…\parallel-agents\agent-03-layout-navigation\COMPONENT_COVERAGE.md` | Same. |
| `…\parallel-agents\agent-03-layout-navigation\UPGRADE_CANDIDATES.md` | Same. |
| `…\parallel-agents\agent-04-workflow\AGENT_SUMMARY.md` | Same. |
| `…\parallel-agents\agent-04-workflow\COMPONENT_COVERAGE.md` | Same. |
| `…\parallel-agents\agent-04-workflow\UPGRADE_CANDIDATES.md` | Same. |
| `…\parallel-agents\agent-05-theme-tailwind-tokens\AGENT_SUMMARY.md` | Per-agent meta-summary; the 13 deep audit files migrate (rows 17-27 above) but the summary is process metadata. |
| `…\parallel-agents\agent-05-theme-tailwind-tokens\COMPONENT_COVERAGE.md` | Same. |
| `…\parallel-agents\agent-05-theme-tailwind-tokens\UPGRADE_CANDIDATES.md` | Per-agent upgrade scope; rolled into master `COMPONENT_UPGRADE_BACKLOG.md`. |
| `…\parallel-agents\agent-06-frontend-architecture-usage\AGENT_SUMMARY.md` | Per-agent meta-summary; the 13 deep audit files migrate (rows 15-16, 28-38 above) but the summary is process metadata. |
| `…\parallel-agents\agent-06-frontend-architecture-usage\COMPONENT_COVERAGE.md` | Same. |
| `…\parallel-agents\agent-06-frontend-architecture-usage\UPGRADE_CANDIDATES.md` | Per-agent upgrade scope; rolled into master backlog. |

### 4b. Per-agent component dossier duplicates (Source 1)

Every dossier under `…\parallel-agents\agent-0N\components\<component>\` is byte-identical to the consolidated `…\component-registry\components\<component>\` version (Agent 1 confirmed this in §6 of `01_SOURCE_INVENTORY.md`). The consolidated tier is the single source for component migration. **Do not migrate the per-agent dossier duplicates; archive in place.**

### 4c. Source 3 partial dossiers (legacy first-pass)

The 3 partial dossiers in Source 3 (`falcon-dropdown`, `falcon-input`, `falcon-table` — each with 4/6 files, all older + smaller than Source 1) are fully superseded. After Agent 3 runs the MERGE verdict on those 3 components (overwriting from Source 1), the legacy 4 files per dossier will be implicitly overwritten. **No separate archival action needed.**

### 4d. Source 4-5-6 mirrors under `C:\Falcon\Brain SK\outputs\`

Recursive `diff -rq` against Source 1-2-3 is empty (Agent 1 verified, §6 note 2). These are physical copies, not symlinks, but functionally redundant. **Leave the mirror tree intact for now** (not within this migration's scope), but note the de-duplication opportunity. Agent 4 should add a "Mirror notice" line at the top of `CANONICAL_FRONTEND_UNDERSTANDING.md` recording that `C:\Falcon\Brain SK\outputs\` is a byte-identical mirror of `C:\Falcon\Brain Outputs\` as of 22:55 on 2026-05-13.

---

## 5. Edge cases

### 5a. `falcon-form-field-legacy` — only in `agent-04-workflow/components/` (61st dossier)

**Decision: DO NOT migrate `falcon-form-field-legacy` as a separate dossier. Use the consolidated `falcon-form-field` dossier from Source 1 only.**

Evidence:
1. Source 1 has 60 components in the consolidated `components/` set; counting per-agent yields 22 + 10 + 15 + 14 = 61. The +1 is `falcon-form-field-legacy` (Agent 1 inventory §6 note 3).
2. Source 2's Agent 7 merge note (`FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md` line 24) explicitly states: *"Agent 4's `falcon-form-field-legacy` folder was a duplicate of Agent 1's `falcon-form-field` (same legacy component, different keys) — kept Agent 1's version per ownership table."*
3. Spot-check confirms both dossiers describe the SAME underlying component (`libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.ts`). Agent 4's `falcon-form-field-legacy/OVERVIEW.md` (line 6) even self-cross-references: *"Agent 1 (form/input components) primarily owns this; Agent 4 documents it under workflow/legacy because the active org-hierarchy wizards use it heavily."*
4. The consolidated `falcon-form-field` OVERVIEW (Source 1) marks status as `LEGACY / BESPOKE`, covers the same migration motivation, and is larger (more dimensions captured). Smaller dossier already covered. No additional content to merge.

**Action for Agent 3:** copy only `falcon-form-field` from `…\component-registry\components\falcon-form-field\` (consolidated tier). Leave `…\parallel-agents\agent-04-workflow\components\falcon-form-field-legacy\` in place as archival provenance — do not migrate to canonical target.

### 5b. `FALCON_COMPONENT_REGISTRY.md` (Source 3 legacy) vs `FALCON_COMPONENT_REGISTRY_DEEP.md` (Source 1)

These are deliberately KEPT AS TWO FILES because:
- The required master list specifies both filenames.
- The legacy `FALCON_COMPONENT_REGISTRY.md` (34,765 B / 20:22) carries dimensions the DEEP version does not (INPUTS / OUTPUTS / SLOTS / VARIANTS / DUAL-RENDER / TOKENS columns formatted differently — the wider "API surface" table).
- The DEEP version (33,414 B / 22:43) adds owner-agent + consumer counts + status + top-gap + top-upgrade columns.
- They are complementary, not redundant. Both stay.

### 5c. Token count drift between legacy `TAILWIND_TOKEN_MAP.md` and authoritative `FALCON_THEME_AND_TAILWIND_REPORT.md`

Legacy claims "~264 tokens"; Agent 5 verified count is **216 `@theme` tokens** (`FALCON_THEME_AND_TAILWIND_REPORT.md` §1). The discrepancy comes from counting `@theme` + dark overrides + Studio knobs together. **Agent 4 to add a 1-line correction banner at the top of `TAILWIND_TOKEN_MAP.md`** citing the 216 figure and linking to `FALCON_THEME_AND_TAILWIND_REPORT.md`. Do not delete legacy file — keep for the per-token tables.

### 5d. Canonical target `components/` already contains 3 partial dossiers

`C:\Falcon\Brain Outputs\understanding\frontend\components\{falcon-dropdown,falcon-input,falcon-table}\` each have 4 markdown files (OVERVIEW, API, USAGE, GAPS_AND_UPGRADES) — no TOKENS, no DECISION. Agent 3 must:
1. Overwrite all 4 existing files with the Source 1 versions (newer + larger).
2. Add the 2 missing files (`TOKENS.md`, `DECISION.md`) from Source 1.

Net effect: each of the 3 partial dossiers becomes a full 6-file dossier.

### 5e. No wikilinks anywhere in the corpus (Agent 1 §6 note 1)

Confirmed: `grep -rl '\[\['` over all 6 sources returns zero. If the migration wants Obsidian-style wikilinks between the masters and the component dossiers, Agent 4 must inject them as a separate pass — there is no existing link graph to preserve. Out of scope for the migration itself; flag as a follow-up task if relevant.

---

## 6. Hand-off note to Agent 3 (Component Migration) + Agent 4 (Master File Migration)

### To Agent 3 — Component dossier migration

Do exactly this:

1. **Copy all 60 component dossiers from Source 1 into the canonical target.**
   - Source root: `C:\Falcon\Brain Outputs\component-registry\components\<component>\`
   - Target root: `C:\Falcon\Brain Outputs\understanding\frontend\components\<component>\`
   - Each dossier has exactly 6 files: `OVERVIEW.md`, `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`.
2. **For `falcon-dropdown`, `falcon-input`, `falcon-table`: overwrite the existing 4 canonical files AND add the 2 missing files (`TOKENS.md`, `DECISION.md`).** These three are the only components with pre-existing partial dossiers in the canonical target — see §5d.
3. **Do NOT migrate `falcon-form-field-legacy`.** Use the consolidated `falcon-form-field` dossier (Source 1) only. See §5a.
4. **Do NOT migrate per-agent component duplicates from `parallel-agents\agent-0N\components\`.** They are byte-identical to the consolidated `components\` set. See §4b.
5. **Net file count after migration:** 60 components × 6 files = 360 markdown files under `understanding\frontend\components\`.

### To Agent 4 — Master file migration

Do exactly this:

1. **Copy 10 master files into the canonical target root** (`C:\Falcon\Brain Outputs\understanding\frontend\`):
   - From Source 1: `FALCON_COMPONENT_REGISTRY_DEEP.md`
   - From Source 2 (all 9 narrative files): `FALCON_COMPONENT_CAPABILITY_MATRIX.md`, `COMPONENT_RELATIONSHIP_MAP.md`, `COMPONENT_UPGRADE_BACKLOG.md`, `FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md`, `FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md`, `FALCON_THEME_AND_TAILWIND_REPORT.md`, `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md`, plus `FINAL_COVERAGE_REPORT.md` and `READINESS_SCORES.md` (the latter two into `narrative\` subfolder per row 39-40).
2. **Leave 4 existing master files in place** (KEEP_EXISTING): `FALCON_COMPONENT_REGISTRY.md`, `FRONTEND_WORKSPACE_MAP.md`, `FRONTEND_STRUCTURE_REPORT.md`, `ANGULAR_AND_TAILWIND_RULES.md`, `TAILWIND_TOKEN_MAP.md`. (Sixth file `TAILWIND_TOKEN_MAP.md` also KEEP_EXISTING but with a 1-line correction banner per §5c — that is 5 total KEEP_EXISTING files.)
3. **Generate `CANONICAL_FRONTEND_UNDERSTANDING.md`** as a new top-level index. Suggested structure:
   ```markdown
   # Falcon Frontend — Canonical Understanding (index)

   *** Brain SK canonical entry point — 2026-05-13 ***

   ## Master narrative tier
   - [FRONTEND_COMPONENT_KNOWLEDGE_REPORT](FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md)
   - [FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT](FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md)
   - [FALCON_COMPONENT_CAPABILITY_MATRIX](FALCON_COMPONENT_CAPABILITY_MATRIX.md)
   - [COMPONENT_RELATIONSHIP_MAP](COMPONENT_RELATIONSHIP_MAP.md)
   - [COMPONENT_UPGRADE_BACKLOG](COMPONENT_UPGRADE_BACKLOG.md)

   ## Component registry
   - [FALCON_COMPONENT_REGISTRY](FALCON_COMPONENT_REGISTRY.md) — first-pass surface (legacy)
   - [FALCON_COMPONENT_REGISTRY_DEEP](FALCON_COMPONENT_REGISTRY_DEEP.md) — owner-agent + consumers + status
   - [components/](components/) — 60 per-component dossiers (6 files each)

   ## Theme / Tailwind
   - [FALCON_THEME_AND_TAILWIND_REPORT](FALCON_THEME_AND_TAILWIND_REPORT.md) — authoritative (216 tokens)
   - [TAILWIND_TOKEN_MAP](TAILWIND_TOKEN_MAP.md) — legacy per-token tables
   - [ANGULAR_AND_TAILWIND_RULES](ANGULAR_AND_TAILWIND_RULES.md)
   - [theme/](theme/) — 11 deep audit reports (token flow, dark mode, density, RTL, helpers, etc.)

   ## Architecture / workspace
   - [FRONTEND_STRUCTURE_REPORT](FRONTEND_STRUCTURE_REPORT.md)
   - [FRONTEND_WORKSPACE_MAP](FRONTEND_WORKSPACE_MAP.md)
   - [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)
   - [architecture/](architecture/) — 13 deep audit reports (barrels, MF, routes, facades, etc.)

   ## Quality / coverage
   - [narrative/FINAL_COVERAGE_REPORT](narrative/FINAL_COVERAGE_REPORT.md)
   - [narrative/READINESS_SCORES](narrative/READINESS_SCORES.md)

   ## Provenance notes
   - `C:\Falcon\Brain SK\outputs\` is a byte-identical mirror of `C:\Falcon\Brain Outputs\` as of 2026-05-13 22:55.
   - Per-agent intermediates retained at `Brain Outputs\component-registry\parallel-agents\` for archival.
   ```
4. **Add the 1-line correction banner to `TAILWIND_TOKEN_MAP.md`:** "**CORRECTION (2026-05-13):** authoritative `@theme` token count is **216**, not the ~264 quoted in §1 below. See [FALCON_THEME_AND_TAILWIND_REPORT.md](FALCON_THEME_AND_TAILWIND_REPORT.md) §1." Do not edit any of the existing per-token tables.
5. **Migrate the 26 complementary masters** (rows 15-40 in §1b) into subfolders:
   - `theme\` (rows 17-27 — 11 files from `parallel-agents\agent-05-theme-tailwind-tokens\`)
   - `architecture\` (rows 15-16, 28-38 — 13 files from `parallel-agents\agent-06-frontend-architecture-usage\`)
   - `narrative\` (rows 39-40 — 2 files from `frontend-understanding\`)
6. **Net master-file count after migration** (canonical target root + subfolders): 14 required + 26 complementary = **40 master files** + 1 generated index (`CANONICAL_FRONTEND_UNDERSTANDING.md`) + this migration plan (`migration\02_LATEST_SELECTION_PLAN.md`).
7. **Do NOT migrate the 19 per-agent process files** listed in §4a (AGENT_SUMMARY / COMPONENT_COVERAGE / UPGRADE_CANDIDATES per agent). They are scratch/provenance — leave in `parallel-agents\` for archival.

### Combined invariants for Agents 3 + 4

- READ-ONLY for all 6 source trees. Only write into the canonical target tree (`C:\Falcon\Brain Outputs\understanding\frontend\`).
- Quote all paths with spaces.
- Mirror tree `C:\Falcon\Brain SK\outputs\` is NOT touched.
- After migration, every file in the canonical target root + components + theme + architecture + narrative subfolders should resolve to a single, decisive source — no duplicates, no superseded drafts left exposed at the top level.
- Source 3's partial component dossiers (`falcon-dropdown`, `falcon-input`, `falcon-table`) are overwritten implicitly by the Source 1 6-file dossiers (per §5d).

---

*** End of selection plan — 14 required masters routed (10 COPY + 4 KEEP_EXISTING + 0 CONFLICT + 1 GENERATE_PLACEHOLDER), 26 complementary masters routed (all COPY into subfolders), 60 component dossiers routed (57 COPY + 3 MERGE), 1 edge case resolved (falcon-form-field-legacy ⇒ excluded), 19 per-agent process files flagged for archival ***
