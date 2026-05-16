---
type: hub
purpose: master-component-view
created: 2026-05-16
tier: 1
canonical-source: C:\Falcon\Brain Outputs\understanding\frontend\components\
---

*** Falcon Component Atlas ***
*** All 62 Falcon components, one view, fully cross-referenced ***
*** Tier 1 deliverable of FRONTEND_KNOWLEDGE_PATH ***

# 🗺 Component Atlas

> The single page where you can see **every Falcon component**, its dossier completeness, its usage in pages, its dependencies on other components, and its activity status. Everything in this Atlas is generated from machine-readable data; refresh it by re-running the Tier 1 scripts.

## Quick stats

| Metric | Value |
|---|---|
| Total components | **62** |
| Dossiers complete (6-file canonical) | **62 / 62 ✅** |
| Active (touched <30 days) | 54 |
| Stable (30-90 days) | 2 |
| Orphan (>90 days) | 2 |
| Unmapped (no source in `libs/falcon-ui-core/src/components/`) | 11 — live in other libs |
| Total `<falcon-*>` references in app code | **785** across **413 files** |
| Unique `falcon-*` tags found in the wild | **187** (62 canonical + 125 variants/wrappers) |
| Internal compose edges | **~70** |

## 4 lenses on every component

For each of the 62 components, this Atlas links four data sources:

1. **Dossier** — `Brain Outputs/understanding/frontend/components/<name>/` (6 files: OVERVIEW · API · USAGE · TOKENS · GAPS · DECISION)
2. **Usage** — [Component → Page Usage Matrix](../../../Brain%20Outputs/understanding/frontend/COMPONENT_USAGE_MATRIX.md)
3. **Dependencies** — [Component Dependency Graph](../../../Brain%20Outputs/understanding/frontend/COMPONENT_DEPENDENCY_GRAPH.md)
4. **History** — [Component Evolution Timeline](../../../Brain%20Outputs/understanding/frontend/COMPONENT_EVOLUTION_TIMELINE.md)

## The 62 components

Grouped by category and ordered alphabetically within group.

### 🟦 Dialogs / Overlays (12)

| Component | Status | Highlights |
|---|---|---|
| [[Falcon Alert Dialog]] / `<falcon-alert-dialog>` | 🟢 active | Composite — wraps `falcon-dialog`. 8 refs in 5 files. Most recent: Wave 16. **OVERVIEW shipped today.** |
| [[Falcon Confirm Dialog]] / `<falcon-confirm-dialog>` | 🟢 active | Legacy — being replaced by alert-dialog. Migrate consumers. |
| [[Falcon Dialog]] / `<falcon-dialog>` | 🟢 active | Primitive. Used by alert-dialog + insufficient-balance-dialog. 7 commits. |
| [[Falcon Drawer]] / `<falcon-drawer>` | 🟢 active | Slide-out panel. 4 commits. |
| [[Falcon Insufficient Balance Dialog]] / `<falcon-insufficient-balance-dialog>` | 🟢 active | App-wrapper around alert-dialog (Add Client payment step) |
| [[Falcon Menu]] / `<falcon-menu>` | 🟢 active | 6 commits, body-portal pattern |
| [[Falcon Notification]] / `<falcon-notification>` | 🟢 active | 2 commits, inline + stack variants |
| [[Falcon OTP Send Dialog]] / `<falcon-otp-send-dialog>` | 🟢 active | App-wrapper for OTP send. Used by falcon-button hover-trigger? (graph anomaly — investigate) |
| [[Falcon Popup]] / `<falcon-popup>` | 🟢 active | 5 commits, popover-portal foundation |
| [[Falcon Send Credentials Popup]] / `<send-credentials-popup>` | active | Domain-specific. Owns its SCSS (PATTERN-04 blocker) |
| [[Falcon Toast]] / `<falcon-toast>` | active | Post-action feedback. _Tokens dossier in place._ |
| [[Falcon Tooltip]] / `<falcon-tooltip>` | active | Hover info. 4 commits. |

### 🟪 Form Inputs (15)

| Component | Status | Highlights |
|---|---|---|
| [[Falcon Calendar]] | 🟢 active | 6 commits, V0.2 token-aligned |
| [[Falcon Calendar Legacy]] | ⚪ unmapped | Lives in `libs/falcon/src/shared-ui/`, not `libs/falcon-ui-core/` |
| [[Falcon Checkbox]] | 🟢 active | 4 commits |
| [[Falcon Checkbox Group]] | 🟢 active | 4 commits |
| [[Falcon Combobox]] | 🟢 active | 2 commits |
| [[Falcon Date Picker]] | 🟢 active | 7 commits, calendar-portal alignment |
| [[Falcon Dropdown]] | 🟢 active | 7 commits, popup-portal user |
| [[Falcon Email Field]] | 🟢 active | 4 commits |
| [[Falcon Grid Input]] | 🟢 active | 1 commit — Wave 14 |
| [[Falcon Input]] | 🟢 active | 5 commits — the OG dual-render component |
| [[Falcon Input Number]] | 🟢 active | 3 commits |
| [[Falcon Mobile Number]] | ⚪ unmapped | `libs/falcon/src/shared-ui/` |
| [[Falcon Multi Select]] | 🟢 active | 9 commits |
| [[Falcon Multiselect Legacy]] | ⚪ unmapped | `libs/falcon/src/shared-ui/` |
| [[Falcon OTP]] | 🟢 active | 4 commits, animated input grid |
| [[Falcon Password]] | 🟢 active | 4 commits, masked + strength meter |
| [[Falcon Phone Field]] | 🟢 active | 7 commits |
| [[Falcon Radio]] | 🟢 active | 5 commits |
| [[Falcon Radio Group]] | 🟢 active | 4 commits |
| [[Falcon Search Input]] | 🟢 active | 1 commit — Wave 14 |
| [[Falcon Select]] | 🟢 active | 1 commit — Wave 14 |
| [[Falcon Textarea]] | active | _check timeline_ |

### 🟩 Data display (9)

| Component | Status | Highlights |
|---|---|---|
| [[Falcon Data Table]] | 🟢 active | **8 commits** — most-changed component this sprint. Dossier just refreshed (5 files updated). 50%+ work in progress. |
| [[Falcon Empty State]] | 🟢 active | 1 commit — Wave 14. The `falcon-empty-data` strategy run lives in `Brain Outputs/strategies/falcon-component-creation/runs/2026-05-14_falcon-empty-data/`. |
| [[Falcon Paginator]] | 🟢 active | 4 commits |
| [[Falcon Status Badge]] | active | Used by falcon-badge |
| [[Falcon Table]] | active | Different from data-table — legacy? |
| [[Falcon Tag]] | active | Inline pill UI |
| [[Falcon Tree]] | active | Generic tree |
| [[Falcon Tree Panel]] | active | Panel-wrapped tree |
| [[Falcon Tree Table]] | active | Hierarchical table |
| [[Falcon Organization Hierarchy Tree TW]] / `<falcon-organization-hierarchy-tree-tw>` | 🟢 active | 2 commits, the org-hierarchy specific tree |

### 🟧 Layout / Structural (9)

| Component | Status | Highlights |
|---|---|---|
| [[Falcon Accordion]] | 🟢 active | 4 commits |
| [[Falcon Card]] | 🟢 active | 3 commits |
| [[Falcon Filter Panel]] | 🟢 active | 1 commit — Wave 14 |
| [[Falcon Form Field]] | ⚪ unmapped | `libs/falcon/src/shared-ui/` — SCSS deleted in this morning's PATTERN-04 sweep |
| [[Falcon Stepper]] | active | The wizard step indicator |
| [[Falcon Stepper Legacy]] | ⚪ unmapped | _legacy stepper, replaced_ |
| [[Falcon Tabs]] | active | Tab bar |
| [[Falcon Wizard]] | active | Multi-step form orchestrator |

### 🟡 Primitives (6)

| Component | Status | Highlights |
|---|---|---|
| [[Falcon Avatar]] | 🟢 active | 1 commit, composes falcon-icon |
| [[Falcon Badge]] | 🟢 active | 1 commit, composes falcon-icon + falcon-status-badge |
| [[Falcon Button]] | 🟢 active | **7 commits**, 31 refs in 26 files — most-used UI primitive |
| [[Falcon Icon]] | 🟢 active | 1 commit. Lowest in compose tree — every other component uses it. |
| [[Falcon Photo Uploader]] | ⚪ unmapped | `libs/falcon/src/shared-ui/` |
| [[Falcon Single Uploader]] | 🟢 active | 5 commits, PrimeNG removal survivor |
| [[Falcon Switch]] | active | On/off toggle |

### ⚪ Misc / Shared (3)

| Component | Status | Highlights |
|---|---|---|
| [[Falcon Message Host]] | ⚪ unmapped | `libs/falcon/src/shared-ui/` |
| [[Falcon Uploader]] | active | Generic file uploader |
| [[Shared Directives]] | active | Cross-cutting directives bag (not a single component) |

## Insights from the Atlas

### 🏆 Most-used components (by reference count)

1. `<falcon-button>` — 31 refs across 26 files (the universal interaction primitive)
2. `<falcon-calendar>` — 15 refs across 12 files
3. `<falcon-badge>` — 11 refs across 8 files
4. `<falcon-accordion>` — 10 refs across 8 files
5. `<falcon-card>` — 9 refs across 7 files

### 🏆 Most-active components (by commit count this sprint)

1. `falcon-multi-select` — 9 commits
2. `falcon-data-table` — 8 commits
3. `falcon-button` — 7 commits (also among most-used)
4. `falcon-date-picker` — 7 commits
5. `falcon-dialog` — 7 commits
6. `falcon-dropdown` — 7 commits
7. `falcon-phone-field` — 7 commits

### 🏗 Composition leaders (most-imported = foundational)

From the dependency graph:

1. `falcon-icon` — imported by most other components (avatar, badge, button visual variants)
2. `falcon-dialog` — composed by alert-dialog, confirm-dialog, insufficient-balance-dialog
3. `falcon-popup` — composed by dropdown, date-picker, multi-select (via popover-portal)
4. `falcon-input` — composed by email-field, phone-field, password, mobile-number

### 🚨 The 11 "unmapped" components

Components that exist in the dossier but don't have a source folder at `libs/falcon-ui-core/src/components/<name>/`. They live in alternative locations:

| Component | Likely real location |
|---|---|
| `falcon-calendar-legacy` | `libs/falcon/src/shared-ui/lib/components/...` |
| `falcon-form-field` | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/` (this morning's PATTERN-04 removed the SCSS here) |
| `falcon-message-host` | `libs/falcon/src/shared-ui/lib/components/...` |
| `falcon-mobile-number` | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/` (PATTERN-04 SCSS removed today) |
| `falcon-multiselect-legacy` | `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/` |
| `falcon-photo-uploader` | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/` |
| `falcon-stepper-legacy` | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` |
| `falcon-uploader` | _check libs/falcon/src/shared-ui/_ |
| `falcon-switch` | _check libs/falcon/src/shared-ui/_ |
| `falcon-table` | _check libs/falcon/src/shared-ui/_ |
| `falcon-tag` | _check libs/falcon/src/shared-ui/_ |

**Action item:** the next time the timeline script runs, it should also look at `libs/falcon/src/shared-ui/lib/components/` as a secondary source path. This is a known **gap in the Tier 1 script** — easy fix when needed.

### 🔍 Tag variants in the wild

The audit found **125 wrapper-tag variants** beyond the 62 canonical components. Most are `<falcon-angular-X>` (the Angular wrapper) of canonical components. The unmatched ones — `<falcon-angular-custom-table-footer>`, `<falcon-angular-empty-data>`, `<falcon-angular-notification-stack>` — suggest there are **3 additional components consumed in the wild without dossiers**:

| Tag | Suggested dossier name |
|---|---|
| `<falcon-angular-custom-table-footer>` | `falcon-custom-table-footer` |
| `<falcon-angular-empty-data>` | `falcon-empty-data` (the dossier exists as part of falcon-empty-state migration or strategy run) |
| `<falcon-angular-notification-stack>` | `falcon-notification-stack` (notification with stack variant) |

**Action item:** confirm these aren't internal sub-components, and if standalone, create dossier folders.

## How to extend this Atlas

When a new component is added:

1. Create its 6-file dossier under `Brain Outputs/understanding/frontend/components/<name>/`
2. Rerun the Tier 1 scripts:
   - `bash regen-usage-matrix.sh` → updates COMPONENT_USAGE_MATRIX.md
   - `bash regen-dep-graph.sh` → updates COMPONENT_DEPENDENCY_GRAPH.md
   - `bash regen-timeline.sh` → updates COMPONENT_EVOLUTION_TIMELINE.md
3. Add a row to this Atlas under the appropriate category section
4. Commit + push to the brain repo

When a component is deprecated:

1. Update its `DECISION.md` to `status: deprecated` + add deprecation date
2. Move row in the Atlas to a "🗿 Deprecated" section
3. Don't delete the dossier — preserve history

## Tier 2 readiness

With the Atlas in place, the next big knowledge wins are:

- **Token Taxonomy** (Tier 2, Step 9) — resolves the R-NOOR-003 puzzle from this morning
- **Module Federation Topology** (Tier 2, Step 7) — explains how the 3 apps work together
- **State Management Architecture** (Tier 2, Step 8) — signals vs services vs facades

Trigger any of these via the standard "build the X" phrase to the orchestrator.

## Related

- [FRONTEND_KNOWLEDGE_PATH](../../../Brain%20Outputs/understanding/frontend/FRONTEND_KNOWLEDGE_PATH.md) — the master roadmap
- [Component Usage Matrix](../../../Brain%20Outputs/understanding/frontend/COMPONENT_USAGE_MATRIX.md)
- [Component Dependency Graph](../../../Brain%20Outputs/understanding/frontend/COMPONENT_DEPENDENCY_GRAPH.md)
- [Component Evolution Timeline](../../../Brain%20Outputs/understanding/frontend/COMPONENT_EVOLUTION_TIMELINE.md)
- [[Frontend Components Index]] — the older flat index (still useful)
- [[RULES_INDEX]] — the rulebook hub
- [[AMMAR_BRAIN_HOME]]

## Tags

#type/hub #frontend #component-atlas #tier-1 #knowledge-graph
