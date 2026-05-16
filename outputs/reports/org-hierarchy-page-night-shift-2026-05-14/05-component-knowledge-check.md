---
title: Org-Hierarchy Page Night-Shift Discovery — Component Knowledge Check
agent: Agent 4 (Component-knowledge)
date: 2026-05-14
falconBranch: polishing-v0.4
falconHead: 6ecd2f2f9a7a078822cfa8f699803014b122258d
scope: 19 Falcon components needed for the new admin-console/.../org-hierarchy-page feature
sources:
  - Brain Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md
  - Brain Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY_DEEP.md
  - Brain Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md
  - Brain Outputs/understanding/frontend/COMPONENT_RELATIONSHIP_MAP.md
  - Brain Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md
  - Brain Outputs/understanding/frontend/_scan-state/component-scan-metadata.json
  - Brain Outputs/understanding/frontend/components/<name>/{DECISION,GAPS_AND_UPGRADES}.md (19 dossiers)
---

# Component Knowledge Check — Org Hierarchy Page

> Inspection-only audit. Zero source edits. All recommendations are READY/USE_WITH_WORKAROUND/UPGRADE_FIRST/AVOID classifications against the latest Brain SK canonical knowledge base, which was generated 2026-05-13T23:55 (~17 hours before this audit) against branch `polishing-v0.4` head `6ecd2f2f`.

---

## 1. Scan-state freshness audit

Source-of-truth file: `_scan-state/component-scan-metadata.json` (commit `6ecd2f2f9a7a078822cfa8f699803014b122258d`, generator `incremental-scan@1.0.0`).

The two consecutive runs at 2026-05-13T23:55 show the same `falconHead` hash across both — the second run skipped all 60 components (0 scanned, 60 skipped, `scanCoveragePct: 100`, `changedPct: 0`), meaning none of the 19 components below has been modified since their `lastScannedAt` timestamp.

| # | Component                              | lastScannedAt              | lastSourceModifiedAt       | changedSinceLastScan | scanReason | skipReason                                                                  |
|---|----------------------------------------|----------------------------|----------------------------|----------------------|------------|-----------------------------------------------------------------------------|
| 1 | falcon-organization-hierarchy-tree-tw  | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.616+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 2 | falcon-tree                            | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.621+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 3 | falcon-tree-panel                      | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.246+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 4 | falcon-tree-table                      | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.622+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 5 | falcon-wizard                          | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.623+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 6 | falcon-stepper                         | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.620+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 7 | falcon-data-table                      | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.614+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 8 | falcon-table                           | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.620+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 9 | falcon-tabs                            | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.621+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 10| falcon-drawer                          | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.615+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 11| falcon-dialog                          | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.614+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 12| falcon-popup                           | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.246+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 13| falcon-confirm-dialog                  | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.614+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 14| falcon-otp                             | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.617+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 15| falcon-otp-send-dialog                 | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.617+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 16| falcon-status-badge                    | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.620+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 17| falcon-mobile-number                   | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.246+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 18| falcon-photo-uploader                  | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.246+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |
| 19| falcon-empty-state                     | 2026-05-13T23:55:14.180+03 | 2026-05-13T23:48:22.615+03 | **false**            | null       | no source changes since lastScannedAt; all required knowledge files present |

### Stale scans

**NONE.** Every one of the 19 components has `changedSinceLastScan: false`, `changedFilesSinceLastScan: []`, and `changeSummary: "no changes since 2026-05-13T23:55:14.180+03:00"`. All required knowledge files (`OVERVIEW.md`, `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`) are present in every dossier folder. The knowledge base is FRESH for all 19 components against the current `polishing-v0.4` HEAD.

> Note: every `lastSourceModifiedAt` timestamp is `2026-05-13T23:48:22.x+03:00` because the workspace was restored from a snapshot 7 minutes before the most recent scan. The git commit dates (under `sourceFileLastGitCommitDates` in the metadata) prove the underlying code stopped changing earlier; `bbf351e1441c054faeb9c30d722e278ed9ecb775` on 2026-05-12T21:40:27 is the youngest commit touching any of these files (the v0.4 polish wave on `*.tokens.css`). No new source has landed since.

---

## 2. Per-component capability table

Legend: USE_AS_IS = ship today; USE_WITH_WORKAROUND = ship today with documented workaround; UPGRADE_FIRST = land the listed upgrades before consumer adoption; AVOID = do not use in new code.

| # | Component                              | Status         | Primary use in org-hierarchy                                                                 | Key inputs                                                                                                                       | Key outputs                                                                                          | Slots                                                  | Variants                                                       | DUAL-RENDER? | Tokens-file                          | Top gaps |
|---|----------------------------------------|----------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------------|----------------------------------------------------------------|--------------|--------------------------------------|----------|
| 1 | falcon-organization-hierarchy-tree-tw  | NEEDS-UPGRADE  | The exact bespoke org-hierarchy left-rail chrome (root header + section label + recursive tree + sticky 3-dot menu) | `tree`, `selectedId`, `expandedIds`, `rootActions`, `nodeActions`, `sectionLabel`, `showExpand`, `showMoreActions`, `defaultExpandLevel`, `ariaLabel` | `falcon-select`, `falcon-toggle`, `falcon-action`                                                    | none                                                   | density, selectionMode                                         | **Light DOM only**     | organization-hierarchy.tokens.css | No Shadow companion (FOHT-01); no Angular wrapper (FOHT-02); brand registry is CSS-class-driven (FOHT-03); zero verified production adoption (FOHT-05); no specs (FOHT-04) |
| 2 | falcon-tree                            | NEEDS-UPGRADE  | Recursive selection tree WITHOUT the chrome (fallback if we skip tree-panel)                 | `nodes`, `value`, `density`, `selectionMode`, `hoverPath?`, `expanded?`, `searchQuery`, `defaultExpandLevel`                      | `valueChange`, `valuesChange`, `expandChange`, `hoverChange`, `focusChange`                          | none — no per-row template / actions                   | density, selectionMode (single/multi/none)                     | Shadow + Light         | tree.tokens.css                   | **P0** no per-row template / actions slot (UC-W01); no virtualization; no lazy children; no DnD; parallel impl with `<falcon-tree-panel>` |
| 3 | falcon-tree-panel                      | LEGACY-IN-USE  | The currently shipping org-hierarchy left rail in 4 menu files (admin + management consoles) | `root`, `expandedIds`, `selectedId`, `trackBy`, `clientId`, `rootActions`, `nodeActions`, `mode: 'falcon'\|'client'`, `showArrows`, `showActions` | `toggle`, `select`, `action`, `hoverPathChange`                                                      | none — fully baked-in chrome                           | mode (falcon/client)                                           | Angular only           | none (legacy SCSS — rule violation) | Parallel impl to `<falcon-angular-tree>` (UC-W01); SCSS rule violation; `ViewEncapsulation.None`; no keyboard activation for 3-dot trigger; no `disabled(node)` predicate on actions; no `variant` for actions |
| 4 | falcon-tree-table                      | NEEDS-UPGRADE  | Likely NOT the right primitive for the org-hierarchy page (no data columns shown) — included for completeness | `nodes`, `columns`, `expandedIds`, `selectedValue`, `density`, `selectionMode: 'none'\|'radio'`                                  | `falcon-change`, `falcon-expand`, `falcon-row-click`                                                 | per-row Stencil slot `cell-{key}-{nodeId}` (`O(rows×cols)`) | density, selectionMode (none/radio), column types (text/badge/number/radio/custom) | Shadow + Light | tree-table.tokens.css       | No Strategy E projection in Angular wrapper (FTT-01); no multi-select; no row actions; no lazy expand; no sort; no pagination/virtual-scroll |
| 5 | falcon-wizard                          | READY          | Hosts Add Client / Add User / Add Node multi-step flows reached from org-hierarchy menus     | `steps`, `currentStep`, `mode`, `orientation`, `canProceed`, `showDraft`, `showBack`, `showFinish`, `validateStep`, `stepControls`, `nextLabel`, `backLabel`, `finishLabel`, `draftLabel`, `size`, `useTailwind` | `next`, `back`, `finish`, `draft`, `stepChange`, `stepValidationFail`                                | `slot="header"`, `slot="step-{index}"`, `slot="footer-extra"` | mode, orientation                                              | Shadow + Light         | wizard.tokens.css                 | `step.status` field defined but not visualized (P0 UC-Z01); no `Skip` button for optional steps; no `disabled`/`busy` overall flags; no `reset()` method; async-validator awaiting in `stepControls` bridge (UC-Z06) |
| 6 | falcon-stepper                         | READY          | Progress indicator inside `<falcon-angular-wizard>` (composed automatically)                 | `steps`, `activeValue`, `completedValues`, `mode`, `orientation`, `size`, `labelPosition`, `showStepNumbers`, `showCheckOnComplete`, `disabled`, `helperText`, `errorMessage`, `groupLabel` | `valueChange`, `stepClick`, `stepComplete`                                                           | per-step `slot="content-{value}"`                      | mode (linear/non-linear), orientation, size                    | Shadow + Light         | stepper.tokens.css                | Production wizards still use the LEGACY bespoke stepper (P0-02 / UC-W02); `labelPosition` default differs Shadow vs Light; no per-step custom-dot/label slot; no dark-mode tokens; missing `aria-orientation` |
| 7 | falcon-data-table                      | READY          | Right-side list of nodes/users/services with sort + pagination + row-action `⋮` menu        | `data`, `columns`, `rowMenuItems`/`rowActions`, `paginator`, `lazy`, `totalRecords`, `loading`, `sortMode`, `selectable`, `selectionMode`, `globalFilterFields`, `tableStyleClass`, `rootClass`, `rowStyleClass`, `density` (Stencil only) | `selectionChange`, `sortChange`, `lazyLoad`, `rowAction`, `rowMenuAction`, `globalFilterChange`     | `[falconDataTableCell]`, `[falconDataTableHeaderCell]`, `[falconDataTableEmpty]`, `[falconDataTableLoading]` Angular directives | dense/compact via Stencil density; sort modes; selection modes; responsive layout | **Light DOM only** (Strategy E projection wrapper) | data-table.tokens.css            | Inherits `pi pi-ellipsis-v` PrimeIcon from `<falcon-table>` core (P0-03 / FT-01); no `(multiSortChange)` output (P1-12); `[density]` not bridged on wrapper (P2-03); placeholder `[reorderableColumns]`/`[resizableColumns]` non-functional (UC-P2-04) |
| 8 | falcon-table                           | NEEDS-UPGRADE  | Substrate for `<falcon-angular-data-table>` (do NOT use directly)                            | `rows`, `columns`, `selectable`, `sortMode`, `paginated`, `pageSize`, `density`, `striped`, `hoverable`, `loading`, `lazy`, `totalRecords`, `globalFilterFields`, `responsiveLayout` | `falcon-row-click`, `falcon-row-select`, `falcon-sort`, `falcon-multi-sort`, `falcon-page-change`, `falcon-lazy-load`, `falcon-global-filter-change`, `falcon-cells-mounted` | Stencil Light DOM `data-cell-mount` mount-points (Strategy E only) | density, sortMode, selectionMode, responsiveLayout, lazy mode    | Shadow + Light         | table.tokens.css                  | **P0** `pi pi-ellipsis-v` at `falcon-table.tsx:655` (FT-01); **P0** sortable headers respond to click only — no keyboard activation (FT-02); no grid keyboard nav per WAI-ARIA (FT-03); hardcoded English placeholders/aria-labels (FT-04) |
| 9 | falcon-tabs                            | READY          | Page-level tab switch between Org Hierarchy / Settings / Apps / Comm Channels                | `tabs`, `mode: 'navigation'\|'radio-cards'`, `selectedValue`, `size`, `orientation`, `ariaLabel`, `helperText`, `errorMessage`, `useTailwind`, `rootClass` | `selectedValueChange`, `focus`                                                                       | `slot="panel-<value>"` per tab; `<ng-template falconTabActions="value">` per-tab header-end actions | mode (navigation/radio-cards), orientation, size              | Shadow + Light         | tabs.tokens.css                   | **P0** `falconTabActions` MutationObserver hack is fragile (UP-3-01 — already flagged); no `<slot name="header-start">`; no per-tab badge slot; no `iconUrl` for SVG icons; no `[lazy]` panel render; no `[scrollable]` for many tabs |
| 10| falcon-drawer                          | READY          | Right-anchored side panel for Add/Edit Node, User Inspector, Filter panels                   | `open`, `position: 'top'\|'right'\|'bottom'\|'left'`, `size`, `closable`, `dismissable`, `modal`, `header`, `ariaLabel`, `useTailwind`, `rootClass` | `drawerShow`, `drawerHide`, `openChange`                                                             | default body slot; `slot="header"`; `slot="footer"`     | position (4), size                                              | Shadow + Light         | drawer.tokens.css                 | `closeAriaLabel` exists on Stencil but not bridged on wrapper (UP-3-06); no `header-actions` slot between title and ×; no `canClose` predicate; no exit transition; `dismissable` vs `dismissible` spelling drift |
| 11| falcon-dialog                          | DEPRECATED     | Substrate only — do not use directly in new code                                             | `open`, `title`, `description`, `size`, `closable`, `closeOnBackdrop`, `closeOnEsc`, `dismissible`, `severity`, `position`, `errorMessage`, `ariaLabel` | `falconOpen`, `falconClose`, `falconConfirm`, `falconCancel`, `openChange`                            | default body; `slot="header"`; `slot="footer"`          | size (5), position (3), severity (4)                            | Shadow + Light         | dialog.tokens.css                 | Missing `@deprecated` JSDoc (UP-3-07); dead `errorMessage` prop; `falconConfirm`/`falconCancel` events fire from no built-in button; `position="side-right"` conceptually belongs to drawer |
| 12| falcon-popup                           | NEEDS-UPGRADE  | The 4 canonical decisions: error / delete / unsaved / save (e.g. "Delete this node?", "You have unsaved changes") | `open`, `variant: 'error'\|'delete'\|'unsaved'\|'save'`, `name`, `iconBg`, `iconColor`, `glossy`, `titleOverride`, `messageOverride`, `hintOverride`, `confirmLabelOverride`, `cancelLabelOverride` | `confirm`, `cancel`                                                                                   | **none** — fully prop-driven                            | variant (4)                                                     | **Angular only**       | none (no token file — UP-3-10)    | **P0-01 / UP-3-02** — no focus trap (WCAG violation); no `loading`/`confirmDisabled` for async confirms; inline SVG icons (should compose `<falcon-angular-icon>`); no body slot for rich content; no token file |
| 13| falcon-confirm-dialog                  | READY (under-leveraged) | Non-canonical Approve/Reject style confirmations ("Activate?"/"Deactivate this user?")    | `open`, `title`, `message`, `icon`, `acceptLabel`, `rejectLabel`, `severity: 'info'\|'success'\|'warning'\|'danger'`, `size`, `position`, `closable`, `closeOnBackdrop`, `closeOnEsc` | `accept`, `reject`, `openChange`                                                                      | default body slot for additional context                | severity (4), size                                              | Shadow + Light         | confirm-dialog.tokens.css         | Internal raw `<button>` instead of `<falcon-angular-button>` (UP-3-17); no `loading`/`acceptDisabled`/`rejectDisabled`; icon is CSS class string (should use `<falcon-angular-icon>`); no production consumer yet |
| 14| falcon-otp                             | READY          | OTP entry inside the OTP send-verify dialog (composed by `falcon-otp-send-dialog`)           | `value`, `length: number` (default 6), `mask`, `autoFocus`, `disabled`, `inputType`, `pattern`                                  | `valueChange` (via CVA), `falcon-blur` — but **wrapper does not re-emit `complete` event (G1)**       | none                                                   | length, mask                                                    | Shadow + Light         | otp.tokens.css                    | Wrapper `(falconComplete)` not re-emitted (G1 — minor); no method proxies for `clear()`/`setFocus()` (G3); SMS auto-fill not verified on Stencil (G4); no built-in validator |
| 15| falcon-otp-send-dialog                 | NEEDS-UPGRADE  | "Verify your phone" / "Verify your email" flow when adding/editing node or user              | `open`, `mode: 'channel'\|'verify'`, `step`, `channel: 'email'\|'sms'\|'both'`, `email`, `phone`, `duration`, `useTailwind`     | `send`, `verify`, `resend`, `channel-change`, `openChange`, plus 2 more — 7 outputs total            | none                                                   | step (1/2), channel (3)                                         | Shadow + Light         | otp-send-dialog.tokens.css        | **No resend cooldown** (G4 — every OTP flow needs 30-60s); no code-expired state (G5); no help link slot; no method proxies; translate-key support absent |
| 16| falcon-status-badge                    | READY (under-leveraged) | Status pill cells in the data-table ("Active", "Inactive", "Pending", "Locked", etc.)     | `severity`, `label`, `size`, `dot`, `useTailwind`, `rootClass`                                                                  | none                                                                                                  | Stencil default slot (NOT bridged on Angular wrapper — gap) | severity (9 → 4 buckets), size                                  | Shadow + Light         | status-badge.tokens.css           | Wrapper missing `<ng-content>` (FSB-03) + `[ariaLabel]` (FSB-04); zero production adoption — both consoles hand-roll `bg-falcon-{color}-50 text-falcon-{color}-700` chips (FSB-01 / UC-P1-09); type is re-declared in wrapper instead of imported (UC-P3-06) |
| 17| falcon-mobile-number                   | LEGACY (compile-compat) | Used today inside add-client / add-user wizards (5 known consumers)                       | `labelKey`, `required`, `defaultCountry`, `error`, `errorMessageKey`, `requiredErrorMessageKey`, `useCustomStyle` (3 silent no-op inputs) | CVA + Validator (no Outputs surfaced)                                                                | none                                                   | n/a                                                              | Angular only           | none                              | **AVOID for new code** — Wave 2 façade; 3 inputs are silent no-ops; ISO2-to-dial map covers only 25 countries; no country-change Output; SCSS rule violation; legacy at `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/` |
| 18| falcon-photo-uploader                  | LEGACY (in-use)         | Avatar uploader inside Add Client / Add User wizards (6+ step templates)                  | `[(photo)]` data URL, `labelKey`, `subLabelKey`, `dragHintKey`, `uploadBtnKey`, `accept`, `maxBytes`                            | `photoChange`, `fileSelected`                                                                         | none                                                   | n/a                                                              | Angular only           | none (legacy SCSS — rule violation) | **AVOID for new code** — Wave 23 legacy; SCSS rule violation; silent file-size rejection; no remote URL preview (data URL only); no CVA; no `role="button"` / a11y on dropzone; should migrate to `<falcon-angular-single-uploader>` with `--falcon-single-uploader-tile-radius: 50%` token override (P1-10 / UC-L04) |
| 19| falcon-empty-state                     | READY                   | Empty list cell when the org node has no children / search returns nothing                | `iconName`, `titleText`, `descriptionText`, `size`, `useTailwind`, `rootClass`                                                  | (no Outputs — presentational)                                                                         | `slot="action"` (named) — default slot for icon/title/description override on Stencil | size                                                            | Shadow + Light         | empty-state.tokens.css            | Not auto-composed inside `<falcon-table>` core empty cell (FES-01) — must project via `<ng-template falconDataTableEmpty>`; no illustration slot (icon only); no `[ariaLabel]` on wrapper; no `[variant]` (empty/error/success/info); zero production adoption |

---

## 3. Detailed dossier

### 1) `falcon-organization-hierarchy-tree-tw`

**What it does:** Bespoke Light-DOM Stencil tag rendering the EXACT org-hierarchy chrome (pinned root header + sticky 3-dot context menu + recursive child list + brand-bubble visuals). Object-prop binding via `@ViewChild` because there is no Angular wrapper. Method `selectAndScrollTo(id)` for imperative selection+scroll.

**Key props:** `tree`, `selectedId`, `expandedIds`, `rootActions`, `nodeActions`, `sectionLabel`, `showExpand`, `showMoreActions`, `defaultExpandLevel`, `ariaLabel`. Events: `falcon-select`, `falcon-toggle`, `falcon-action`. Public methods: `selectAndScrollTo`, `expandAll`, `collapseAll`, `closeContextMenu`.

**Behavior contract:** Single floating ctx menu re-anchored per click. Document-level listeners (Escape/mousedown/scroll/resize) handle ctx-menu dismissal. Sticky menu button uses `position: sticky; inset-inline-end:` — unique pattern. ARIA tree roles with `level`/`posinset`/`setsize`. Brand styling resolves `node.brand: string` to `client-logo bank-{value}` CSS classes that depend on consumer-side CSS.

**Custom-cell/slot/template support:** NONE. Zero slots. Behavior fully prop-driven.

**Known gaps (from GAPS_AND_UPGRADES.md):**
- **FOHT-01 (P1)** — Ship Shadow DOM companion. This is the ONLY Falcon component without a Shadow pair.
- **FOHT-02 (P1)** — Ship Angular wrapper (`<falcon-angular-organization-hierarchy-tree>`).
- **FOHT-03 (P2)** — Brand registry is class-name-driven; promote to tokens.
- **FOHT-04 (P1)** — No Stencil unit tests (lazy, ctx menu, hover-path, keyboard).
- **FOHT-05 (P1)** — No production adoption verified (grep returned no hits in admin/management org-hierarchy menus).

**Recommendation: USE_WITH_WORKAROUND.** Visually correct and prop-rich, but without a wrapper Angular consumers must reach the Stencil tag with `@ViewChild` + `el.tree = ...` in `ngAfterViewInit`. Per the FOHT-05 finding, the existing admin/management org-hierarchy menus use a different implementation (likely the legacy `<falcon-tree-panel>` per the relationship map). If the new feature truly needs THIS chrome, write a thin per-project Angular wrapper as a workaround and treat FOHT-01/02/03 as a follow-up wave.

---

### 2) `falcon-angular-tree`

**What it does:** Recursive expandable tree (Shadow + Light Stencil + Angular wrapper) mirroring the V0.2 React reference NodeRow + ClientsTree. Hover-path highlighting, rail SVG pseudo-elements, chevron + indicator children, focus mode with 2px teal ring + halo, programmatic `scrollIntoView`, 18px indentation rail, expand/collapse transitions. CVA for selection.

**Key props:** `nodes`, `value`, `density`, `selectionMode: 'none' | 'single' | 'multi'`, `hoverPath?`, `expanded?`, `searchQuery`, `defaultExpandLevel`, `helperText`, `errorMessage`, `groupLabel`, `ariaLabel`, `disabled`. 5 Outputs: `valueChange`, `valuesChange`, `expandChange`, `hoverChange`, `focusChange`. 5 Method proxies: `selectAndScrollTo`, `expandTo`, `expandAll`, `collapseAll`, `focusNode`.

**Behavior contract:** Row structure (rails + chevron + multi-check + initials chip + icon + label + badge) is fixed. Search is case-insensitive substring only. `flattenTree` is called every render (no memoization). Smooth scroll on programmatic select uses `requestAnimationFrame`. Multi-mode does NOT cascade to children.

**Custom-cell/slot/template support:** **NONE.** No row template. No per-row action slot. This is the headline gap — it's precisely why `<falcon-tree-panel>` was reinvented as a parallel implementation.

**Known gaps:**
- **(P0) UC-W01** — Per-row template / per-row action slot. Blocks tree-panel convergence.
- (P1) No virtualization — flat DOM for 1000+ nodes.
- (P1) No lazy children loader (`loadChildren?: (parentId) => Promise<FalconTreeNode[]>`).
- (P1) No drag-and-drop.
- (P1) No "select self + cascading descendants" mode for multi-select.
- (P2) Initials chip always renders even with `node.icon` set.
- (P2) Search is case-insensitive substring only — no custom predicate.

**Recommendation: USE_WITH_WORKAROUND for plain selection trees / UPGRADE_FIRST if the org-hierarchy menu wants 3-dot actions on each row.** If the new feature needs per-row 3-dot menus and a chrome around the tree, use `<falcon-tree-panel>` (item 3 below) until UC-W01 lands. For plain hierarchical selection without actions, `<falcon-angular-tree>` is correct and additive.

---

### 3) `falcon-tree-panel` (LEGACY-IN-USE)

**What it does:** Bespoke Angular component rendering the full org-hierarchy left rail chrome (`aside` + root row + section label + recursive `<falcon-tree-node>` body + per-row + root 3-dot menus). The 4 production menu files currently consume this. Composes `<falcon-angular-menu>` for the 3-dot popup with the external-anchor `showAt()` mode — single shared menu instance, dynamic items per row.

**Key props:** `root`, `expandedIds`, `selectedId`, `trackBy`, `clientId`, `clientsLabelKey`, `rootActions: FalconTreeAction[]`, `nodeActions: FalconTreeAction[]`, `mode: 'falcon' | 'client'`, `showArrows`, `showActions`. 4 Outputs: `toggle`, `select`, `action`, `hoverPathChange`.

**Behavior contract:** Chevron-overlap auto-scroll is invisible to consumer — the panel scrolls right when chevron overlaps the sticky 3-dot button. `ViewEncapsulation.None` is on by design so menu overlay's `styleClass` selectors can reach DOM (a leakage risk). Single-select only.

**Custom-cell/slot/template support:** **NONE.** Fully baked-in chrome. No `<ng-content select="[slot=root-row]">`, no section-label slot.

**Known gaps:**
- **(P0) UC-W01 / Item 1** — Parallel implementation to `<falcon-angular-tree>` — convergence required.
- **(P0)** Legacy SCSS files violate the no-SCSS project rule.
- **(P0)** `ViewEncapsulation.None` leakage risk.
- (P1) No keyboard activation for 3-dot trigger (mouse only — blocker for AT users).
- (P1) No `disabled?: (node) => boolean` predicate on `FalconTreeAction`.
- (P1) No `variant?: 'default' | 'highlighted' | 'destructive' | 'warning'` on `FalconTreeAction`.
- (P2) No multi-selection.

**Recommendation: USE_AS_IS today for the new org-hierarchy left rail.** This is the production-tested primitive used by all 4 existing org-hierarchy menus. The declarative `FalconTreeAction[]` API is the canonical pattern. ACCEPT the technical debt that convergence with `<falcon-angular-tree>` is queued; do not invest in fixing the SCSS/encapsulation issues per-page. When UC-W01 lands, ONE wave migrates all 5 consumers (4 existing + the new feature).

---

### 4) `falcon-angular-tree-table`

**What it does:** Tree-shaped tabular component. CSS Grid table with recursive expandable rows and per-row data columns. Mirrors wallet's `multi-2..multi-5` patterns from React V0.2 reference. CVA on `selectedValue` for radio mode.

**Key props:** `nodes`, `columns: FalconTreeColumn[]`, `expandedIds`, `selectedValue`, `density`, `selectionMode: 'none' | 'radio'`, `disabled`, `helperText`, `errorMessage`, `groupLabel`, `ariaLabel`, `radioName`, `useTailwind`, `rootClass`. 3 Outputs: `falcon-change`, `falcon-expand`, `falcon-row-click`. Column types: `text`, `badge`, `number`, `radio`, `custom`.

**Behavior contract:** Per-row Stencil slot `cell-{columnKey}-{nodeId}` for `column.type='custom'`. Grid template is inline-style computed from `columns`. `selectedValue` @Watch is a no-op — render reads selection directly.

**Custom-cell/slot/template support:** **PARTIAL.** Stencil per-row slots only (`O(rows × cols)` markup at the consumer). Angular wrapper does NOT use Strategy E projection (FTT-01) — `<ng-template>` cannot be projected like in `<falcon-data-table>`.

**Known gaps:**
- **(P1) FTT-01** — Adopt Strategy E projection in Angular wrapper (mirror `<falcon-data-table>`).
- (P2) No multi-select.
- (P2) `'badge'` column type is generic — doesn't compose `<falcon-status-badge>` or `<falcon-tag>`.
- (P2) No `'currency'`/`'date'`/`'avatar'` column types.
- (P2) No row-action `⋮` menu.
- (P2) No pagination / virtual scroll.
- (P2) No lazy expand.
- (P1) FTT-07 — No utils unit tests.

**Recommendation: AVOID for the org-hierarchy page.** The org-hierarchy left rail does NOT need data columns alongside tree rows. If the right-hand list is tabular (users-of-this-node, services, etc.), use `<falcon-angular-data-table>` (flat) for that — keep the tree and the table as separate primitives. Use `<falcon-angular-tree-table>` only if there's a genuine wallet-style "tree with columns" requirement, and accept FTT-01 workaround.

---

### 5) `falcon-angular-wizard`

**What it does:** Multi-step workflow shell composing `<falcon-angular-stepper>` + per-step body slots + Next/Back/Finish/Save Draft footer + Reactive-Forms `stepControls` validation bridge. Header slot above stepper, footer-extra slot for ad-hoc footer content.

**Key props:** `steps`, `currentStep` (two-way), `mode`, `orientation`, `canProceed`, `showDraft`, `showBack`, `showFinish`, `nextLabel`, `backLabel`, `finishLabel`, `draftLabel`, `size`, `validateStep`, `stepControls`, `useTailwind`, `rootClass`. 6 Outputs: `next`, `back`, `finish`, `draft`, `stepChange`, `stepValidationFail`.

**Behavior contract:** Footer button order is fixed (Back | extra | Draft | Next/Finish). `currentStep` is 0-indexed. `validateStep` takes precedence over `stepControls` if both are provided. `stepControls` derived validator reads `ctrl.valid` synchronously — `PENDING` async validators are NOT awaited (UC-Z06).

**Custom-cell/slot/template support:** **GOOD.** Three real CSS-Shadow slots — `slot="header"`, `slot="step-{index}"` per step, `slot="footer-extra"`. Angular consumers project via `<ng-content select="[slot=…]">`.

**Known gaps:**
- **(P0) UC-Z01** — `step.status` field defined but not visualized via embedded stepper.
- (P1) No `Skip` button for optional steps (UC-Z02).
- (P2) No `disabled?: boolean` / `busy?: boolean` overall flags (UC-Z04).
- (P2) No `reset()` method for post-submit reuse (UC-Z05).
- (P1) Async-validator awaiting in `stepControls` bridge (UC-Z06).
- (P1) No per-step `slot="header-{index}"` (UC-Z03).

**Recommendation: USE_AS_IS for any NEW wizard reached from the org-hierarchy page** (Add Client, Add User, Add Node). Document the FOUR pieces of consumer-side discipline: (1) `stepControls` for sync validation; (2) `<falcon-angular-popup variant="unsaved">` for cancel-with-dirty-state; (3) 0-indexed `currentStep`; (4) async validator workaround via custom `validateStep` until UC-Z06 lands. **CRITICAL:** the existing 4 org-hierarchy wizards still use the LEGACY bespoke `<falcon-stepper>` (P0-02). The new feature should land directly on `<falcon-angular-wizard>` and become its first production consumer.

---

### 6) `falcon-angular-stepper`

**What it does:** Visual progress indicator with 18px solid-fill dots and 4px teal fill-track. Per-step states: upcoming/active/completed/error/disabled. Heavy Studio-customisable surface (14 token categories ≈ 70+ CSS variables; per-step shape/size/animation toggle/label position).

**Key props:** `steps`, `activeValue`, `completedValues`, `mode`, `orientation`, `size`, `labelPosition`, `showStepNumbers`, `showCheckOnComplete`, `disabled`, `helperText`, `errorMessage`, `groupLabel`, `ariaLabel`, `useTailwind`, `rootClass`. 3 Outputs: `valueChange`, `stepClick`, `stepComplete`. 3 Method proxies: `next`, `prev`, `goTo`.

**Behavior contract:** `steps[]` is reference-tracked — replace the array, don't mutate. Per-step `slot="content-{value}"` is rendered as the panel body. Dot inner content is hardcoded {number, check SVG, pulse, font icon}.

**Custom-cell/slot/template support:** **PARTIAL.** One slot per step value (`content-{value}`). No per-step dot/label/error template slots.

**Known gaps:**
- **(P0) UC-W02 / Item 1** — Production wizards still use LEGACY bespoke stepper. Migrate before new features.
- `labelPosition` default differs between Shadow (`'top-center'`) and Light (`'bottom-center'`) — visual inconsistency.
- No per-step custom-dot slot.
- No per-step custom-label slot.
- No inline error-message rendering (dot turns red but message not shown).
- No dark-mode token overrides.
- No `aria-orientation` for vertical mode.
- (P2) No density (compact mode reducing vertical gap).

**Recommendation: USE_AS_IS via `<falcon-angular-wizard>` composition.** Don't render `<falcon-angular-stepper>` directly in org-hierarchy page templates — always compose via `<falcon-angular-wizard>` so the Next/Back/Finish/Validation flow is consistent.

---

### 7) `falcon-angular-data-table`

**What it does:** The CANONICAL Angular data-table. 672 LOC + cell directive. Composes `<falcon-table-tw>` (Stencil Light) via Strategy E projection. Listens for `falcon-cells-mounted` event and mounts Angular `EmbeddedViewRef`s from projected `<ng-template falconDataTableCell>` templates into the Light-DOM cells. Heavy production deployment in both admin + management consoles.

**Key props:** `data`, `columns: ColumnDef[]`, `rowMenuItems` / `boundMenuItems` / `rowActions` (three input shapes), `paginator`, `pageSize`, `rowsPerPageOptions`, `lazy`, `totalRecords`, `loading`, `sortMode`, `selectable`, `selectionMode`, `globalFilterFields`, `globalFilterValue`, `showGlobalFilter`, `striped`, `hoverable`, `bordered`, `scrollable`, `scrollHeight`, `tableStyleClass`, `rootClass`, `rowStyleClass`, `stickyActions`, `responsiveLayout`, `emptyMessage` / `emptyMessageKey`, `currentPageReportTemplate` (hardcoded inside), `paginatorTemplate` (hardcoded inside), `density` (Stencil-only — wrapper gap UC-P2-03). 6 Outputs: `selectionChange`, `sortChange`, `lazyLoad`, `rowAction`, `rowMenuAction` (alias), `globalFilterChange`.

**Behavior contract:** Hardcoded to Light DOM (`[useTailwind]` is API-symmetry only). Internal `<falcon-angular-menu>` uses `[appendTo]="'body'"` for row-actions to escape clipping. Three menu-input shapes with strict precedence (`rowActions` > `boundMenuItems` > `rowMenuItems`).

**Custom-cell/slot/template support:** **EXCELLENT — Strategy E.** Four projection directives: `[falconDataTableCell="field"]`, `[falconDataTableHeaderCell="field"]`, `[falconDataTableEmpty]`, `[falconDataTableLoading]`. Inline `ColumnDef.template` / `ColumnDef.headerTemplate` also supported (inline precedence over projected).

**Known gaps:**
- Inherits **(P0) FT-01** — `pi pi-ellipsis-v` PrimeIcon row-action button from `<falcon-table>` core.
- **(P1) FDT-01** — No `(multiSortChange)` output (multi-sort non-functional from consumer's view).
- **(P2) UC-P2-03** — `[density]` not bridged on the wrapper.
- **(P2) UC-P2-04** — Placeholder `[reorderableColumns]` / `[resizableColumns]` inputs do nothing.
- (P1) FDT-02 — No specs for Strategy E orchestrator.

**Recommendation: USE_AS_IS for the org-hierarchy page right-hand list.** This is the most production-mature wrapper in Falcon UI core. The known gaps don't block usage. Follow the canonical pattern from `DECISION.md`: typed `ColumnDef[]`, projected `<ng-template falconDataTableCell="status">` rendering `<falcon-angular-status-badge>`, `[lazy]` + `[totalRecords]` + `(lazyLoad)` for server-side pagination, `<ng-template falconDataTableEmpty>` rendering `<falcon-angular-empty-state>`.

---

### 8) `falcon-angular-table`

**What it does:** Substrate behind `<falcon-angular-data-table>`. 685 LOC Stencil Shadow + 810 LOC Light. Native `<table>` with sortable headers (single + multi via Shift/Meta/Ctrl), row selection (single/multi/none), skeleton-loading body, empty-state cell, pagination footer (composes `<falcon-paginator>`), frozen columns + sticky-actions, scrollable sticky thead, global filter strip, lazy server-side mode. ARIA `role=grid` + `aria-rowcount` + per-th `aria-sort` + per-tr `aria-selected`.

**Recommendation: AVOID direct usage.** Per its own `DECISION.md` and `@deprecated` JSDoc on the basic wrapper. Always reach `<falcon-angular-data-table>` instead. Mentioned in this audit because it's the substrate the data-table builds on — important for understanding `(multiSortChange)` and `[density]` lineage.

**Critical inherited gaps relevant to data-table:**
- **(P0) FT-01** — `pi pi-ellipsis-v` PrimeIcon at `falcon-table.tsx:655`.
- **(P0) FT-02** — Sortable headers respond to click only (no keyboard activation).
- **(P1) FT-03** — `role="grid"` implies arrow-key nav per WAI-ARIA, not implemented.
- **(P1) FT-04** — Hardcoded English `'Search…'` placeholder and `'Search'` aria-label.

---

### 9) `falcon-angular-tabs`

**What it does:** Page-section navigation with associated bodies (Org Hierarchy / Settings / Apps / Comm Channels pattern). Two modes: `navigation` (tablist + sliding underline + panel slot per value) and `radio-cards` (radio group of icon/title/sub-description cards). Per-tab header-end action area via `falconTabActions` directive.

**Key props:** `tabs: FalconTabOption[]`, `value` (two-way), `mode: 'navigation' | 'radio-cards'`, `size`, `orientation`, `ariaLabel`, `helperText`, `errorMessage`, `useTailwind`, `rootClass`. Per-option `value`, `label`, `disabled`, `icon`, `helperText`. Output: `valueChange`, `focus`.

**Behavior contract:** Active tab auto-selects on `componentWillLoad` when `selectedValue=null`. Sliding underline 220ms transition. Keyboard nav: Arrow*, Home, End, Enter, Space.

**Custom-cell/slot/template support:** **GOOD but FRAGILE.** Stencil `slot="panel-<value>"` per tab in navigation mode. Angular `<ng-template falconTabActions="<value>">` per-tab header-end action area — currently implemented via MutationObserver lift (UP-3-01) which is fragile to orientation switches and overflow:hidden parents.

**Known gaps:**
- **(P0) UP-3-01** — Replace `falconTabActions` MutationObserver with real `<slot name="header-end">`.
- No `<slot name="header-start">` for symmetry.
- No `<slot name="badge-<value>">` per tab.
- No `iconUrl` for SVG icons (CSS class string only).
- No `[lazy]="true"` for panel rendering.
- No `[scrollable]` for many tabs.
- No `[variant]="'underline' | 'pill' | 'filled'"`.

**Recommendation: USE_AS_IS for the page-level tab strip.** Works today for all production consumers. If the new org-hierarchy page needs per-tab action buttons, use `falconTabActions` — it ships today and the MutationObserver fragility is queued for a follow-up wave.

---

### 10) `falcon-angular-drawer`

**What it does:** Side-anchored sliding sheet for detail/work flows. Right/left/top/bottom positions; 3 sizes per position; modal blur backdrop or non-modal mode; full-height body slot with `header` and `footer` slots.

**Key props:** `open` (two-way via `openChange`), `position: 'top' | 'right' | 'bottom' | 'left'`, `size`, `closable`, `dismissable`, `modal`, `header`, `ariaLabel`, `useTailwind`, `rootClass`. 3 Outputs: `drawerShow`, `drawerHide`, `openChange`.

**Behavior contract:** DOM unmounts on close (no exit animation). Focus trap is non-configurable. Backdrop is blur-based when `modal=true`.

**Custom-cell/slot/template support:** **GOOD.** Default body slot, `slot="header"`, `slot="footer"`.

**Known gaps:**
- (P1) UP-3-06 — `closeAriaLabel` exists on Stencil but not bridged on Angular wrapper.
- No `header-actions` slot between title and × button.
- No `canClose` predicate for gated dismissal.
- No exit transition.
- `dismissable` vs `dismissible` spelling drift with `<falcon-angular-dialog>`.

**Recommendation: USE_AS_IS for Edit-Node side panels, User Inspector, Filter panels.** Default to `position="right"` + `size="md"` + `modal="true"` + `slot="header"` for title + `slot="footer"` for ghost-Cancel + primary-Save buttons.

---

### 11) `falcon-angular-dialog`

**Status: DEPRECATED — substrate only.**

**Recommendation: AVOID direct usage.** Use `<falcon-angular-popup>` for the 4 canonical action flows (error/delete/unsaved/save) or `<falcon-angular-confirm-dialog>` for OK/Cancel prompts. Use `<falcon-angular-drawer>` for side-anchored sheets. Only fall back to `<falcon-angular-dialog>` for genuinely bespoke modal bodies — flag in code review when this happens.

---

### 12) `falcon-angular-popup`

**What it does:** Action-required modal with 4 canonical variants — `error`, `delete`, `unsaved`, `save`. ARIA `role=dialog` + `aria-modal=true`. `name` interpolation for delete variant ("Delete `{name}`?"). 5 `*Override` props for per-page string overrides.

**Key props:** `open`, `variant: 'error' | 'delete' | 'unsaved' | 'save'`, `name`, `iconBg`, `iconColor`, `glossy`, `titleOverride`, `messageOverride`, `hintOverride`, `confirmLabelOverride`, `cancelLabelOverride`. 2 Outputs: `confirm`, `cancel`.

**Behavior contract:** Fully prop-driven — no slots. Footer always has exactly 2 buttons (Cancel + Confirm). Single render path (no `useTailwind` toggle). Re-implements modal scaffolding internally (does NOT compose dialog — anti-pattern documented).

**Custom-cell/slot/template support:** **NONE.** Pure prop API.

**Known gaps:**
- **(P0-01 / UP-3-02) — NO FOCUS TRAP.** Verified WCAG violation.
- (P1) No `loading` / `confirmDisabled` for async confirm work (UP-3-11).
- (P1) No token file (UP-3-10) — per-instance customisation impossible.
- (P1) Inline SVG icons (should compose `<falcon-angular-icon>` per UP-3-08).
- (P1) UC-W03 — No slot-friendly variant (blocks `send-credentials-popup` retirement).

**Recommendation: USE_WITH_WORKAROUND.** For the org-hierarchy page's "Delete this node?", "You have unsaved changes", "Save changes?" flows. Document the focus-trap gap loudly in code review and pair with a manual `setFocus` callback if a11y review flags it. Wait on UC-W03 if you need a custom body shape — until then, fall back to `<falcon-angular-confirm-dialog>` for non-canonical confirms.

---

### 13) `falcon-angular-confirm-dialog`

**What it does:** Composes `<falcon-angular-dialog>` for non-canonical OK/Cancel confirmations. Severity drives accent. `(reject)` event fires for ALL dismissal paths (backdrop, Esc, ×, reject button).

**Key props:** `open`, `title`, `message`, `icon`, `acceptLabel`, `rejectLabel`, `severity: 'info' | 'success' | 'warning' | 'danger'`, `size`, `position`, `closable`, `closeOnBackdrop`, `closeOnEsc`, `useTailwind`, `rootClass`. 3 Outputs: `accept`, `reject`, `openChange`. Default body slot.

**Behavior contract:** Composes `<falcon-angular-dialog>`. Internal raw `<button>` for accept/reject (should be `<falcon-angular-button>` per UP-3-17). Icon is CSS class string.

**Custom-cell/slot/template support:** **PARTIAL.** Default body slot for additional context below the message.

**Known gaps:**
- (P1) UP-3-17 — Replace internal raw `<button>` with `<falcon-angular-button>`.
- No `loading` / `acceptDisabled` / `rejectDisabled` inputs.
- No tertiary button slot.
- No `aria-describedby-id` for explicit a11y wiring.
- Zero production adoption today.

**Recommendation: USE_AS_IS for Approve/Reject style flows.** ("Approve this client?", "Activate this node?", "Reject this user?"). Treat `(reject)` as the universal cancel handler.

---

### 14) `falcon-angular-otp`

**What it does:** N-digit OTP/PIN entry with auto-advance, backspace-retreat, paste-fill, keyboard nav. CVA. Auto-focus mode. Mask mode for PINs.

**Key props:** `value` (CVA), `length: number` (default 6), `mask`, `autoFocus`, `disabled`, `inputType`, `pattern`. **Outputs:** value via CVA + `falcon-blur` from Stencil — wrapper does NOT re-emit a `(falconComplete)` event (G1 gap).

**Custom-cell/slot/template support:** None.

**Known gaps:**
- (P1) G1 — Wrapper doesn't surface a `(falconComplete)` Output. Consumers detect completion via length check (workaround).
- No method proxies (`clear()`, `setFocus()`).
- SMS auto-fill attribute not verified on Stencil core.
- No built-in length validator.

**Recommendation: USE_AS_IS, composed inside `<falcon-angular-otp-send-dialog>`.** Don't render `<falcon-angular-otp>` directly on the org-hierarchy page — it should appear only inside the send-verify dialog.

---

### 15) `falcon-angular-otp-send-dialog`

**What it does:** 2-step "Send OTP → Verify code" dialog. Composes `<falcon-angular-dialog>` + `<falcon-angular-radio-group>` (channel chooser) + `<falcon-angular-otp>` (code boxes) + `<falcon-angular-button>` (action row).

**Key props:** `open`, `mode: 'channel' | 'verify'`, `step`, `channel: 'email' | 'sms' | 'both'`, `email`, `phone`, `duration`, `useTailwind`, 17 inputs total. 7 Outputs: `send`, `verify`, `resend`, `channel-change`, `openChange`, + 2 more.

**Behavior contract:** Step 1 channel chooser, Step 2 OTP boxes + resend. Parent owns API calls and validation. **No resend cooldown built-in** — every consumer wires the 30-60s timer externally.

**Custom-cell/slot/template support:** None.

**Known gaps:**
- (P1) G4 / P1-06 — No resend cooldown.
- No code-expired state (G5).
- No method proxies for `open()`/`close()`.
- No help link slot (G8).
- No translate-key support.

**Recommendation: USE_WITH_WORKAROUND.** For "Verify phone before adding a node" / "Verify email before adding a user" flows. Wire the resend cooldown timer in the consuming page (signal + RxJS interval) until G4 lands.

---

### 16) `falcon-angular-status-badge`

**What it does:** Workflow state pill — distinct from `<falcon-badge>` (generic count) and `<falcon-tag>` (generic chip). 9 severities → 4 visual buckets (success/warning/danger/info+secondary). Dot-only mode for compact use.

**Key props:** `severity: FalconStatusBadgeSeverity`, `label`, `size`, `dot`, `useTailwind`, `rootClass`. No outputs (presentational).

**Behavior contract:** Severity → bucket mapping is fixed in tokens. Stencil has a default content slot — Angular wrapper does NOT expose `<ng-content>` (FSB-03 gap).

**Custom-cell/slot/template support:** **PARTIAL.** Stencil default slot, but wrapper doesn't bridge it.

**Known gaps:**
- (P1) UC-P1-09 / FSB-01 — Refactor admin+management consoles to compose this (they hand-roll `bg-falcon-{color}-50 text-falcon-{color}-700` chips today).
- (P2) FSB-03 — Wrapper missing `<ng-content>` for richer label.
- (P2) FSB-04 — Wrapper missing `[ariaLabel]` input (P1-44).
- (P3) UC-P3-06 — Wrapper re-declares `FalconStatusBadgeSeverity` instead of importing.

**Recommendation: USE_AS_IS for status cells in the right-hand data-table.** Always use this for workflow state — never hand-roll Tailwind color chips. The org-hierarchy page can be the FIRST production consumer.

---

### 17) `falcon-mobile-number` (LEGACY FACADE)

**Status: REFERENCE-ONLY / AVOID for new code.**

**Recommendation: AVOID.** Wave 2 facade for compile compat only. 3 inputs are silent no-ops. ISO2-to-dial map covers only 25 countries. For the new org-hierarchy page's phone fields, use `<falcon-angular-phone-field>` directly (CVA + Validator + complete country list + searchable country dropdown + verify button). The existing 5 consumers will migrate in their own wave (P1-09 / UC-L01).

---

### 18) `falcon-photo-uploader` (LEGACY BESPOKE)

**Status: LEGACY-IN-USE / AVOID for new code.**

**Recommendation: AVOID.** Wave 23 legacy with SCSS rule violation, silent file-size rejection, no remote URL preview (data URL only), no CVA, no a11y on dropzone. For the new org-hierarchy page's avatar uploaders (Add Client/Add User wizards reached from the page), use `<falcon-angular-single-uploader>` with `previewMode="thumbnail"` and a per-instance `--falcon-single-uploader-tile-radius: 50%` token override (P1-10 / UC-L04). The existing 6 wizard step templates will migrate in their own wave.

---

### 19) `falcon-angular-empty-state`

**What it does:** Empty-state primitive — icon top → title → description → action slot. Composed inside `<ng-template falconDataTableEmpty>` projection for the data-table empty cell. Standalone use for empty lists / first-run pages.

**Key props:** `iconName`, `titleText`, `descriptionText`, `size`, `useTailwind`, `rootClass`. No outputs (presentational).

**Behavior contract:** Pre-translated strings only — translate `titleText`/`descriptionText` at the consumer. `role="img"` + `aria-label={titleText}` on the root.

**Custom-cell/slot/template support:** **GOOD.** Stencil named slot `<slot name="action">` projected through `<ng-content select="[slot=action]">` on the wrapper.

**Known gaps:**
- (P2) FES-01 — Not auto-composed inside `<falcon-table>` core empty cell. Must project via `<ng-template falconDataTableEmpty>`.
- (P3) FES-02 — No illustration slot (icon only).
- (P3) FES-03 — Action layout (row vs column) is fixed.
- (P3) FES-04 — No `[variant]="'empty' | 'error' | 'success' | 'info'"`.
- (P3) FES-05 — No `[ariaLabel]` on Angular wrapper.

**Recommendation: USE_AS_IS for the data-table empty cell.** Project `<ng-template falconDataTableEmpty>` with `<falcon-angular-empty-state iconName="..." titleText="..." descriptionText="..."><falcon-angular-button slot="action">Add Node</falcon-angular-button></falcon-angular-empty-state>`. This is the canonical pattern from the data-table dossier and the org-hierarchy page can become the first production consumer.

---

## 4. Cross-cutting issues

These themes from `COMPONENT_UPGRADE_BACKLOG.md` affect 3+ of the 19 components and should be considered when planning the wave.

### Theme A — **Reusability through projection** (affects 5 of 19)
- **(P0) UC-W01** — Per-row template / action slot on `<falcon-angular-tree>`. Blocker for tree-panel convergence.
- **(P1) FTT-01** — Strategy E projection in `<falcon-angular-tree-table>`. `<falcon-data-table>` is the only Strategy E exemplar today.
- **(P1) P1-01 — Universal `FalconOptionTemplateDirective`** — biggest reusability win across dropdown/multi-select/combobox/radio-group/checkbox-group/phone-field/menu (not all in this list, but affects how the wizards inside the org-hierarchy page compose).

**Recommendation:** when the org-hierarchy wave touches `<falcon-angular-tree>` for row actions, plan that work to UNBLOCK UC-W01 (per-row template + action slot) so the tree-panel can converge soon after. Single wave, double benefit.

### Theme B — **PrimeIcons residuals in Stencil cores** (affects 2 directly, 1 inherited)
- **(P0) FT-01** — `pi pi-ellipsis-v` at `falcon-table.tsx:655` — inherited by `<falcon-angular-data-table>` row-action button.
- (P0) UC-W04 / P0-04 — `pi pi-cloud-upload` in `<falcon-uploader>` and `<falcon-single-uploader>` (relevant if migration to `falcon-angular-single-uploader` happens before this is fixed).

**Recommendation:** the org-hierarchy page must not ship NEW `pi pi-*` usages. Document the inherited gap and trust the upcoming P0-03/P0-04 Stencil-core fixes.

### Theme C — **WCAG / a11y completeness** (affects 5 of 19)
- **(P0-01) Popup focus trap.** All "Delete?", "Unsaved changes?" usages on the new page inherit the gap.
- (P0) FT-02 — Keyboard activation for sortable column headers.
- (P1) FT-03 — Grid keyboard nav per WAI-ARIA grid contract.
- (P1) UP-3-06 — `closeAriaLabel` not bridged on drawer/dialog wrappers.
- (P1) Tree-panel — no keyboard activation for 3-dot trigger.

**Recommendation:** before A11Y review, document each inherited gap in the feature's README so the auditor understands which gaps are library-wide (queued for P0-01/FT-02/FT-03 waves) and which are page-specific (needing local fixes).

### Theme D — **Legacy still in use vs modern queued** (affects 4 of 19)
- `<falcon-tree-panel>` (LEGACY) is used by 4 production menu files; `<falcon-angular-tree>` is READY but lacks UC-W01.
- `<falcon-stepper>` (LEGACY bespoke) is used by 4 wizards; `<falcon-angular-stepper>` is READY but no production consumer.
- `<falcon-mobile-number>` (LEGACY façade) is used by 5 files; `<falcon-angular-phone-field>` is READY.
- `<falcon-photo-uploader>` (LEGACY bespoke) is used by 6 wizard templates; `<falcon-angular-single-uploader>` is READY.

**Recommendation:** the new org-hierarchy page should LAND ON THE MODERN PRIMITIVES where the legacy is purely "we haven't migrated yet" (stepper, mobile-number, photo-uploader). For the tree, USE THE LEGACY `<falcon-tree-panel>` until UC-W01 lands, because the modern tree literally lacks the per-row 3-dot menus the page needs.

### Theme E — **Slot/template ergonomic gaps on wrappers** (affects 4 of 19)
- `<falcon-angular-status-badge>` — no wrapper `<ng-content>` (FSB-03) or `[ariaLabel]` (FSB-04).
- `<falcon-angular-empty-state>` — no `[ariaLabel]` on wrapper (FES-05).
- `<falcon-angular-tree>` — no row/actions slot at all (UC-W01).
- `<falcon-angular-popup>` — fully prop-driven, no slots (UC-W03 for slot-friendly variant).

**Recommendation:** when consuming these primitives in the org-hierarchy page, prefer `[label]` / `[titleText]` over slots until the slot gaps close.

### Theme F — **Token discipline gaps** (affects 3 of 19)
- `<falcon-angular-popup>` — no own token file (UP-3-10).
- `<falcon-angular-tree-panel>` — no own tokens (legacy SCSS rule violation).
- `<falcon-photo-uploader>` — no tokens at all.

**Recommendation:** any per-instance visual tweak in the org-hierarchy page should target the tree.tokens.css surface (which IS rich) — not the popup or photo-uploader, where there's no contract.

---

## 5. Component readiness summary

Sorted by readiness score (higher = ready for new use today). Blockers list shows the P0/P1 gaps relevant to the new feature.

| Component                              | Ready % | Blockers                                                                                   | Suggested next action                                                                                              |
|----------------------------------------|---------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| falcon-angular-empty-state             | 95%     | None for our usage                                                                         | USE_AS_IS — first production consumer for the data-table empty cell                                               |
| falcon-angular-status-badge            | 90%     | FSB-04 ariaLabel parity on wrapper                                                          | USE_AS_IS — first production consumer for status cells. Pass `[label]` until FSB-03 ships.                         |
| falcon-angular-drawer                  | 88%     | UP-3-06 closeAriaLabel on wrapper (i18n)                                                    | USE_AS_IS — right-anchored side panels for Add/Edit Node                                                          |
| falcon-angular-data-table              | 85%     | Inherited FT-01 `pi pi-ellipsis-v`; FDT-01 multiSortChange; UC-P2-03 density on wrapper      | USE_AS_IS — right-hand list with Strategy E cells. Trust upstream P0-03 fix for the icon.                          |
| falcon-angular-confirm-dialog          | 80%     | UP-3-17 raw `<button>` (no loading state)                                                  | USE_AS_IS — Approve/Reject style confirms                                                                        |
| falcon-angular-wizard                  | 78%     | UC-Z01 step.status not visualized; UC-Z06 async-validator awaiting                          | USE_AS_IS — Add Client / Add User / Add Node wizards. First production consumer.                                  |
| falcon-angular-stepper                 | 78%     | Composed via wizard; labelPosition default drift                                            | USE_AS_IS via wizard composition                                                                                  |
| falcon-angular-tabs                    | 75%     | UP-3-01 falconTabActions MutationObserver fragility                                         | USE_AS_IS — page-level tab strip. Document fragility for the wave's follow-up.                                    |
| falcon-angular-otp                     | 72%     | G1 wrapper doesn't re-emit complete; G3 method proxies                                      | USE_AS_IS, composed inside otp-send-dialog                                                                       |
| falcon-tree-panel (LEGACY)             | 70%     | UC-W01 parallel impl risk; SCSS rule violation; no keyboard 3-dot                          | **USE_AS_IS for the org-hierarchy left rail.** Production-tested. Tech debt accepted.                              |
| falcon-angular-popup                   | 65%     | **P0-01 NO FOCUS TRAP**; no loading/confirmDisabled; no token file                          | **USE_WITH_WORKAROUND** — document the focus-trap gap in A11Y review notes                                         |
| falcon-angular-otp-send-dialog         | 65%     | G4 no resend cooldown; G5 no code-expired state                                             | USE_WITH_WORKAROUND — wire resend cooldown in consumer                                                            |
| falcon-organization-hierarchy-tree-tw  | 50%     | FOHT-01 no Shadow; FOHT-02 no Angular wrapper; FOHT-03 brand registry class-driven; FOHT-05 zero production adoption | **USE_WITH_WORKAROUND** — write thin per-project Angular wrapper OR fall back to `<falcon-tree-panel>` (same behavioral contract) |
| falcon-angular-tree                    | 40%     | **UC-W01 no row template / actions slot** — blocks 3-dot menu UX                            | UPGRADE_FIRST if 3-dot menus needed, OR use `<falcon-tree-panel>`                                                  |
| falcon-angular-tree-table              | 35%     | FTT-01 no Strategy E in wrapper; no multi-select; no row actions                            | **AVOID** for org-hierarchy — no data columns required                                                            |
| falcon-angular-dialog                  | n/a (DEPRECATED) | —                                                                                | **AVOID** direct usage                                                                                            |
| falcon-angular-table                   | n/a (substrate)  | FT-01 PrimeIcon; FT-02 keyboard sort; FT-03 grid nav                                | **AVOID** direct usage (use data-table instead)                                                                   |
| falcon-mobile-number (LEGACY)          | n/a (avoid) | All inputs silent no-ops; SCSS rule; 25-country limit                                  | **AVOID** — use `<falcon-angular-phone-field>` directly                                                            |
| falcon-photo-uploader (LEGACY)         | n/a (avoid) | SCSS rule; silent file-size rejection; no CVA; no remote preview                       | **AVOID** — use `<falcon-angular-single-uploader>` + circular mask token                                          |

### Totals
- **READY (use today as-is):** 9 → empty-state, status-badge, drawer, data-table, confirm-dialog, wizard, stepper, tabs, otp
- **USE_WITH_WORKAROUND:** 4 → tree-panel (legacy but production-tested), popup (focus-trap gap), otp-send-dialog (cooldown gap), organization-hierarchy-tree-tw (no wrapper)
- **UPGRADE_FIRST (or AVOID until upgrade):** 2 → tree (needs UC-W01), tree-table (needs FTT-01 + use case doesn't apply here)
- **AVOID (deprecated / legacy / substrate):** 4 → dialog (DEPRECATED), table (substrate — use data-table), mobile-number (legacy), photo-uploader (legacy)

---

## 6. Recommendations for the wave plan — cascade points

> "If we touch component X, also fix Y per backlog item Z" — avoid repeated trips into shared libs.

1. **If the wave invests in `<falcon-angular-tree>` row-template + actions slot (UC-W01):**
   - **ALSO** plan the convergence of `<falcon-tree-panel>` to compose `<falcon-angular-tree>` (relationship-map §1).
   - **ALSO** consider promoting `<falcon-organization-hierarchy-tree-tw>` to a paired Shadow + Light component (P2-25 / FOHT-01) — these three trees share rail/spacing tokens and converging the row API once helps all three.
   - **Cascade:** UC-W01 → tree-panel convergence → org-hierarchy-tree-tw Shadow promotion.

2. **If the wave touches `<falcon-angular-data-table>` for any reason:**
   - **ALSO** fix **FT-01** (`pi pi-ellipsis-v` row-action icon at `falcon-table.tsx:655`) — single source edit, P0.
   - **ALSO** add **FT-02** keyboard activation on sortable headers — single source edit, P0.
   - **ALSO** add **FDT-01** `(multiSortChange)` Output — additive, P1.
   - **ALSO** bridge **UC-P2-03** `[density]` on the Angular wrapper — additive, P2.
   - **Cascade:** one data-table touch = 4 backlog items closed.

3. **If the wave migrates the legacy stepper to `<falcon-angular-stepper>` (P0-02):**
   - **ALSO** wire **UC-Z01** `step.status` visualization in `<falcon-angular-wizard>` because the new feature wizards will be the first production consumers and will expose the gap immediately.
   - **ALSO** harmonize `labelPosition` default (Shadow `'top-center'` vs Light `'bottom-center'`).
   - **ALSO** consider **UC-Z06** async-validator awaiting if any wizard step uses `FalconCheckExistsDirective`.
   - **Cascade:** P0-02 → UC-Z01 + UC-Z06 + labelPosition fix.

4. **If the wave touches `<falcon-angular-popup>` for focus-trap fix (P0-01 / UP-3-02):**
   - **ALSO** introduce the **UP-3-10** `popup.tokens.css` file — currently the ONLY Falcon UI component without a dedicated token file.
   - **ALSO** add **UP-3-11** `loading` / `confirmDisabled` for async confirms.
   - **ALSO** swap inline SVG icons for `<falcon-angular-icon>` per **UP-3-08**.
   - **ALSO** compose `<falcon-angular-dialog>` internally to inherit focus trap rather than re-implementing.
   - **Cascade:** one popup pass = focus trap + token file + loading state + icon composition.

5. **If the wave migrates legacy `<falcon-mobile-number>` / `<falcon-photo-uploader>` consumers (P1-09 / P1-10):**
   - These are independent — do them together to delete two legacy folders in one wave.
   - **ALSO** capture the photo-uploader migration's circular-mask token override (`--falcon-single-uploader-tile-radius: 50%`) as a documented Falcon Studio preset.
   - **Cascade:** P1-09 + P1-10 + Studio circular-avatar preset.

6. **If the wave adds the new org-hierarchy page as the first production consumer of `<falcon-angular-status-badge>`:**
   - **ALSO** refactor admin/management consoles to consume the same primitive (**FSB-01 / UC-P1-09**) — same Tailwind chip patterns hand-rolled in 2 places.
   - **ALSO** add `[ariaLabel]` on the wrapper (**FSB-04** / part of **P1-44** ariaLabel parity sweep across status-badge/badge/empty-state/tag).
   - **Cascade:** new consumer adoption + 2 legacy consumer refactors + ariaLabel sweep.

7. **If the wave uses `<falcon-angular-empty-state>` for the new data-table empty cell:**
   - **ALSO** wire **FES-01** auto-composition inside `<falcon-table>` core so future tables get the empty state without a projection directive.
   - **Cascade:** first production consumer + FES-01 substrate fix.

8. **If the wave touches `<falcon-angular-tabs>` for the page-level tab strip:**
   - **ALSO** plan the **UP-3-01** real `<slot name="header-end">` replacement for the MutationObserver hack — additive, single Stencil change.
   - **Cascade:** new consumer adoption + UP-3-01 fragility fix.

---

## 7. Confidence score

Based on the per-component readiness percentages and the relative weight of each component in the org-hierarchy page UI:

**Implementable with CURRENT Falcon components today (no library upgrades):** **~72%**

Coverage achievable with documented workarounds:
- Page-level tab strip — `<falcon-angular-tabs>` (READY)
- Left-side org-hierarchy tree with chrome + 3-dot menus — `<falcon-tree-panel>` (LEGACY but production-tested)
- Right-side node-detail list — `<falcon-angular-data-table>` (READY, inherits known FT-01 icon gap)
- Side detail panel — `<falcon-angular-drawer>` (READY)
- Status cells — `<falcon-angular-status-badge>` (READY, gain a new first-production consumer)
- Empty cell — `<falcon-angular-empty-state>` (READY)
- Confirmation popups — `<falcon-angular-popup>` (USE_WITH_WORKAROUND — focus-trap caveat) and `<falcon-angular-confirm-dialog>` (READY)
- Add Client / Add User / Add Node wizards — `<falcon-angular-wizard>` (READY, will be first production consumer)
- Phone / OTP / Avatar inside wizards — `<falcon-angular-phone-field>` / `<falcon-angular-otp-send-dialog>` / `<falcon-angular-single-uploader>` (modern primitives, sidestep the 3 legacy ones)

**Needs new bespoke per-page Angular code (NOT in the Falcon library):** **~13%**

- Thin Angular wrapper for `<falcon-organization-hierarchy-tree-tw>` IF the page wants its specific chrome (alternative: don't use it — `<falcon-tree-panel>` covers the same behavioral contract, eliminating this need).
- Resend cooldown timer for `<falcon-angular-otp-send-dialog>` (G4 workaround) — small RxJS interval signal in the consumer.
- Manual focus-trap implementation for `<falcon-angular-popup>` IF the A11Y review insists (P0-01 workaround).
- Per-page composition of search input + filter panel ABOVE the data-table (no `<falcon-angular-search-input>` projection inside the table per UC-P2-10).

**Requires library upgrades to ship cleanly:** **~15%**

- **(P0)** UC-W01 — `<falcon-angular-tree>` row template + actions slot, IF the page wants to use the modern tree instead of the legacy tree-panel.
- **(P0)** P0-01 — `<falcon-angular-popup>` focus trap (WCAG blocker for any serious A11Y certification of the page).
- **(P0)** FT-01 — `pi pi-ellipsis-v` PrimeIcon row-action icon in `<falcon-table>` core.
- **(P1)** FOHT-01/02 — Shadow companion + Angular wrapper for `<falcon-organization-hierarchy-tree-tw>` (only required if we commit to that specific chrome over `<falcon-tree-panel>`).
- **(P1)** FSB-04 — `[ariaLabel]` on status-badge wrapper.

### Final confidence verdict

**The org-hierarchy page can ship at ~72% library-coverage today with documented workarounds.** A targeted upgrade wave landing the 4 P0 backlog items (UC-W01, P0-01, FT-01, P0-02 wizard migration) plus the 3 cascade items (UC-Z01, FSB-04, FES-01) raises coverage to **~95%** for the new page and concurrently unblocks 4 other waves on the platform roadmap (tree-panel convergence, popup token file, data-table multi-sort, admin/management status-chip refactor).
