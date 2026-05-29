---
scope: cross-cutting / workspace-wide
architect: A5
date: 2026-05-16
total_findings: 152
in_scope_folders:
  - libs/falcon-ui-core/src
  - libs/falcon/src
  - libs/falcon-theme/src
  - libs/falcon-ui-tokens/src
  - apps/admin-console/src
  - apps/host-shell/src
  - apps/management-console/src
excluded:
  - libs/falcon-ui-react/**
  - libs/falcon-ui-vue/**
  - libs/falcon-ui-showcase-data/**
  - libs/falcon-studio/**
  - libs/sdk/**
  - demos/**
  - node_modules / dist / .nx / .angular / .stencil / loader / __tests__ / __mocks__ / *.spec.* / *.stories.*
---

# Cross-Cutting Audit

Workspace audit for systemic issues that span libraries + all three apps. Cross-references the Token Registry (`02-token-registry-quick-grep.txt`) and the Rules Digest (`01-rules-digest.md`). Severity flags below the **Summary** map each finding to the strictest source rule (R-01 .. R-38).

---

## CC1 — Hardcoded z-index hunt

**Rule:** R-04 (P0) — *No hand-typed numeric `z-index` values anywhere. All overlay/portal stacking uses the canonical ladder defined in `overlay.tokens.css`. Tier order: toast 1300 > drawer/dialog 1200 > overlay 1100→1400 (popovers).*

**Total hits:** 25 (in-scope only — demos excluded).

### Detailed table

| # | File:line | Quote | Classification | Suggested replacement |
|---|---|---|---|---|
| 1 | `libs/falcon-ui-tokens/src/components/dialog.tokens.css:159` | `--falcon-dialog-z-index: 1200;` | **Compliant** | Token definition — canonical ladder. |
| 2 | `libs/falcon-ui-tokens/src/components/calendar.tokens.css:47` | `--falcon-calendar-z-index: 60;` | **Compliant (token def)** | Token def itself OK; verify consumers use it (calendar drops below drawer — intentional inline-popover tier). |
| 3 | `libs/falcon-ui-tokens/src/components/calendar.tokens.css:152` | `--falcon-calendar-popover-z-index: 200;` | **Compliant (token def)** | Token def OK; in-flow popover tier. |
| 4 | `libs/falcon-ui-tokens/src/components/combobox.tokens.css:100` | `--falcon-combobox-panel-z-index: 100;` | **Compliant (token def)** | Token def OK; verify ladder: should be ≥1100 if it must rise above drawers — currently below. **Investigate.** |
| 5 | `libs/falcon-ui-tokens/src/components/dropdown.tokens.css:160` | `--falcon-dropdown-panel-z-index: 100;` | **Compliant (token def)** | Same investigation note as combobox — 100 is below dialog 1200. |
| 6 | `libs/falcon-ui-tokens/src/components/drawer.tokens.css:98` | `--falcon-drawer-z-index: 1200;` | **Compliant** | Canonical ladder. |
| 7 | `libs/falcon-ui-tokens/src/components/menu.tokens.css:62` | `--falcon-menu-panel-z-index: 1100;` | **Compliant** | Canonical ladder. |
| 8 | `libs/falcon-ui-tokens/src/components/phone-field.tokens.css:160` | `--falcon-phone-field-panel-z-index: 200;` | **Compliant (token def)** | In-flow popover tier — same as combobox. **Investigate.** |
| 9 | `libs/falcon-ui-tokens/src/components/overlay.tokens.css:25` | `--falcon-overlay-z-index: 1400;` | **Compliant** | Canonical ladder root token. |
| 10 | `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css:144` | `--falcon-org-hierarchy-ctx-menu-z-index: 9999;` | **Removable** | `9999` is a non-canonical magic number. Replace with `var(--falcon-overlay-z-index)` (1400) — context menus should sit at overlay tier. |
| 11 | `libs/falcon-ui-tokens/src/components/table.tokens.css:51` | `--falcon-table-header-sticky-z-index: 2;` | **Compliant (in-stacking-context)** | Local stacking value for sticky header — not in overlay ladder. |
| 12 | `libs/falcon-ui-tokens/src/components/multi-select.tokens.css:157` | `--falcon-multi-select-panel-z-index: 100;` | **Compliant (token def)** | Same as combobox / dropdown — **Investigate.** |
| 13 | `libs/falcon-ui-tokens/src/components/tooltip.tokens.css:77` | `--falcon-tooltip-z-index: 1100;` | **Compliant** | Canonical ladder. |
| 14 | `libs/falcon-ui-tokens/src/components/toast.tokens.css:108` | `--falcon-toast-host-z-index: 1300;` | **Compliant** | Canonical ladder. |
| 15 | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css:89` | `z-index: 0;` | **Compliant (in-stacking-context)** | `::before` icon background — local stacking. |
| 16 | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css:94` | `z-index: 1;` | **Compliant (in-stacking-context)** | Icon SVG over its `::before` background — local stacking. |
| 17 | `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.css:249` | `z-index: 2;` | **Needs investigation** | Hardcoded numeric in lib CSS — should reference `--falcon-table-header-sticky-z-index` if it is sticky-header related, otherwise stays local. |
| 18 | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.css:204` | `z-index: 2;` | **Needs investigation** | Chevron stacking — likely local; consider adding `--falcon-tree-chevron-z-index` token. |
| 19 | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.css:198` | `z-index: 5;` | **Removable** | Loading overlay — should use `var(--falcon-overlay-z-index)` or a `--falcon-table-loading-overlay-z-index` token. Currently below sticky header (2) and many other layers — definitely wrong if drawer is open. |
| 20 | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.css:82` | `z-index: 2;` | **Compliant (in-stacking-context)** | Stepper circle above connector line — local stacking. |
| 21 | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.css:287` | `z-index: 1;` | **Compliant (in-stacking-context)** | Sticky "select all" header inside scrollable panel — local stacking. |
| 22 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html:78` | `class="user-menu absolute top-[calc(100%+8px)] end-0 w-[260px] z-[200] ..."` | **Removable** | User menu dropdown overlay — replace `z-[200]` with `z-[var(--falcon-menu-panel-z-index)]` or simply use `<falcon-menu>` skeleton (Library-first violation — see CC4). |
| 23 | `libs/falcon-ui-core/src/tailwind/tree-table-tailwind-classes.ts:242` | `'inline-flex items-center justify-center shrink-0 relative z-[2] ' + ...` | **Needs investigation** | Tailwind class-string Mirror of `.falcon-tree-chevron z-index:2`. Mirrors lib Shadow CSS — keep in sync, or both move to a token. |
| 24 | `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts:170` | `'absolute inset-0 flex items-center justify-center z-[5] ' + ...` | **Removable** | Mirror of `.falcon-table-loading z-index:5` — same issue as #19; needs a token. |
| 25 | `libs/falcon-ui-core/src/tailwind/stepper-tailwind-classes.ts:115` | `'z-[2]',` | **Compliant (in-stacking-context)** | Tailwind mirror of stepper circle. |
| 26 | `libs/falcon-ui-core/src/tailwind/multi-select-tailwind-classes.ts:320` | `'sticky top-0 z-[1] ' + ...` | **Compliant (in-stacking-context)** | Tailwind mirror of sticky "select all" header. |
| 27 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html:1` | `<div class="absolute bottom-3.5 end-3.5 z-[5] ..."` | **Needs investigation** | Chart-toolbar floats above chart canvas — local stacking against pan/zoom layer. Likely OK; consider token. |
| 28 | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:308` | `class={\`fixed inset-0 z-[1000] flex items-center justify-center ...\`}` | **Removable** | Fixed-position dialog backdrop — must use `var(--falcon-dialog-z-index)` (1200) per ladder. |
| 29 | `libs/falcon-ui-core/src/components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree-tw.tsx:784` | `class="... z-[2]"` | **Compliant (in-stacking-context)** | Local row-action stacking — small offset, not overlay. |

### Style-attribute z-index hits (`style="z-index: ..."`)

None found in scope.

### `[style.z-index]` Angular binding hits

None found in scope.

### Summary
- **Compliant (token def or local stacking context):** 17
- **Removable (replace with token / canonical ladder):** 6
  - `--falcon-org-hierarchy-ctx-menu-z-index: 9999`
  - `falcon-table.css:198 z-index: 5`
  - `topbar.component.html:78 z-[200]`
  - `table-tailwind-classes.ts:170 z-[5]`
  - `falcon-insufficient-balance-dialog-tw.tsx:308 z-[1000]`
  - (the `9999` is the single highest-priority finding — context menus must align with overlay tier 1400, not exceed it)
- **Needs investigation:** 6
  - dropdown / combobox / multi-select / phone-field panel-z-index = 100 (token-defined but well below dialog 1200 — confirm intended ordering when both are open, or rename to clearly indicate "in-flow popover" vs "viewport overlay")
  - `falcon-tree-table.css:249` and `falcon-tree.css:204` are bare `z-index: 2` candidates for tokenization
  - `tree-table-tailwind-classes.ts:242` and `falcon-chart-toolbar.component.html:1` are local stacking but inconsistent with rest

---

## CC2 — PrimeNG / PrimeIcons residue

**Rule:** R-01 (P0) — *Zero imports from `primeng/*`, zero `<p-*>` template tags, zero `pi pi-*` icon classes, zero `aura-*` themes.*

**Total hits:** 1 (expected: 0). 1 stray comment reference, no actual import/usage.

| # | File:line | Quote | Type |
|---|---|---|---|
| 1 | `libs/falcon/src/shared-ui/lib/directives/falcon-form-validate.directive.ts:45` | `// IMPORTANT: Use bubbling events from the FORM so it catches PrimeNG internal inputs` | Stale comment reference — left over from pre-purge era. Update comment to remove PrimeNG mention (the bubbling logic still applies for Falcon shadow/native inputs). |

**Status:** Zero functional PrimeNG / PrimeIcons / Aura residue. The R-01 program is **completely clean** at code level; only one orphaned comment remains.

---

## CC3 — SCSS / component CSS / styleUrls

**Rule:** R-02 (P0) — *No SCSS files, no `styles:` / `styleUrl:` / `styleUrls:` on Angular components, no `style="..."` attributes in templates. The canonical theme entry (Tailwind v4 `@theme` in `falcon.theme.css`) is the SOLE CSS file allowed.*

### Totals

| Category | Count | Expected |
|---|---|---|
| `.scss` files in libs (in scope) | 8 | 0 |
| `.scss` files in apps (in scope) | 13 | 0 |
| `.component.css` files in libs | 30 (all under `libs/falcon-ui-core/src/angular-wrapper/components/` + 1 in `falcon-studio` excluded) | see notes |
| `.component.css` files in apps | 0 | 0 |
| `styleUrls: [` (Angular array form) in TS | 17 | 0 |
| `styleUrl:` (single string form) in TS | 31 | 0 (per R-02) — but see notes |

### Notes on the 30 `falcon-ui-core` angular-wrapper `.component.css` files

These files are all 1–15 lines of `:host { display: block; width: 100%; }`-style shims. Per **MEMORY entry** `project_falcon_ui_core_layout_traps` Trap #1, an Angular wrapper around a Stencil custom element with `shadow: false` defaults to `display: inline` and produces a ~24px post-block line-box if the host isn't explicitly set. These shims are **load-bearing** for Angular's component-side rendering, mirrored to the Stencil Shadow side. The rule digest (R-02) does forbid `styleUrl:` strictly; however, this is a known, audited exception that should be re-grandfathered explicitly in the rule digest or migrated to inline `styles: ['']` blocks (only one rule then bends, not two).

**Recommendation:** Either (a) carve out a documented R-02 exception "Angular wrappers around `shadow: false` Stencil components may use a `:host { display: block }` shim" or (b) migrate every angular-wrapper `.component.css` to inline `styles: [':host { display: block }']`. Either way, this should be a single decision applied across all 30 files.

### `.scss` files in libs (8) — all P0 violations

| # | File |
|---|---|
| 1 | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.scss` |
| 2 | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.scss` |
| 3 | `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.scss` |
| 4 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.scss` |
| 5 | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper.component.scss` |
| 6 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss` |
| 7 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.scss` |
| 8 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.scss` |

### `.scss` files in apps (13) — all P0 violations

| # | File |
|---|---|
| 1 | `apps/admin-console/src/styles.scss` |
| 2 | `apps/host-shell/src/styles.scss` |
| 3 | `apps/management-console/src/styles.scss` |
| 4 | `apps/host-shell/src/app/layout/layout.component.scss` |
| 5 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.scss` |
| 6 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.scss` |
| 7 | `apps/host-shell/src/app/features/dashboard/dashboard.component.scss` |
| 8 | `apps/host-shell/src/app/features/not-found/not-found.component.scss` |
| 9 | `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` |
| 10 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` |
| 11 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.scss` |
| 12 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.scss` |
| 13 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.scss` |

Notes:
- The three `apps/*/src/styles.scss` files are app entry stylesheets; per the rule digest, only `falcon.theme.css` is allowed. **Recommendation:** rename to `.css` and ensure they only `@import "tailwindcss"` + the canonical theme — no Sass features.
- The host-shell auth flow + layout/topbar/sidebar all carry SCSS — these are pre-Tailwind migration artifacts. Each is a candidate for a focused fix wave.
- The Falcon library `shared-ui` SCSS files (8) shouldn't exist at all — these were the v1-era shared components and predate the Stencil + tailwind migration. Sister `falcon-ui-core` Stencil + `-tw` variants generally exist (`<falcon-stepper>`, `<falcon-form-field>` via `<falcon-input>`, `<falcon-multi-select>`, `<falcon-single-uploader>`, `<falcon-tree>`). **Candidate path:** retire the SCSS-backed shared-ui versions in favor of `falcon-ui-core` (or wrap), per R-07 / R-12.

### `styleUrls: [...]` table

| # | File:line | URL referenced |
|---|---|---|
| 1 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts:37` | `./topbar.component.scss` |
| 2 | `apps/host-shell/src/app/layout/layout.component.ts:29` | `./layout.component.scss` |
| 3 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts:78` | `./sidebar.component.scss` |
| 4 | `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.component.ts:30` | `./showcase.css` |
| 5 | `apps/host-shell/src/app/features/dashboard/dashboard.component.ts:39` | `./dashboard.component.scss` |
| 6 | `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts:14` | `./login-layout.component.scss` |
| 7 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts:27` | `./get-started.component.scss` |
| 8 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.ts:17` | `./send-credentials-popup.component.scss` |
| 9 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts:37` | `./forgot-password-flow.component.scss` |
| 10 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts:68` | `./falcon-tree-panel.component.scss` |
| 11 | `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.ts:30` | `./falcon-multiselect.component.scss` |
| 12 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts:31` | `./enter-otp.component.scss` |
| 13 | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.ts:12` | `./falcon-tree-node.component.scss` |
| 14 | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts:32` | `./falcon-mobile-number.component.scss` |
| 15 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts:29` | `./change-password.component.scss` |
| 16 | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.ts:13` | `./falcon-form-field.component.scss` |
| 17 | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts:25` | `./falcon-photo-uploader.component.scss` |

### `styleUrl: '...'` table (single-string)

31 hits — listed grouped:
- **`libs/falcon-ui-core/src/angular-wrapper/components/*` (29 files)** — load-bearing `:host { display: block }` shims; see "Notes on the 30 angular-wrapper component.css files" above.
- **`apps/host-shell/src/app/features/not-found/not-found.component.ts:9`** — `./not-found.component.scss` — P0 violation.
- **`libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper.component.ts:19`** — `./falcon-stepper.component.scss` — P0 violation.

---

## CC4 — Falcon-library-first violations (hand-rolled markup)

**Rule:** R-07 + R-12 (P1) — *No raw `<input>`, `<button>`, `<select>`, `<textarea>`, `<dialog>`, etc. outside the library when a Falcon equivalent exists.*

### `<dialog>` hits in apps

| # | File:line | Pattern | Suggested Falcon skeleton |
|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html:16` | `<dialog #dlg ... role="dialog">` with inline `<style>` + complex inline `style=""` + hardcoded `rgba(13, 63, 68, 0.55)` ::backdrop | `<falcon-dialog>` (or `<falcon-otp-send-dialog>` skeleton + app-wrapper) — and use `--falcon-overlay-backdrop-bg` token instead of raw rgba. Note: the comment explicitly says "Wave 13m used native `<dialog>` for top-layer guarantee" — if the Falcon skeleton lacks top-layer support, file as GAP on `<falcon-dialog>`. |

### Hand-rolled `<input>` hits in apps (13 total, only the real violations listed)

Per R-12, raw `<input>` outside the library is a violation unless there's a documented GAP.

| # | File:line | Context | Suggested Falcon skeleton |
|---|---|---|---|
| 1 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html:26, 228, 268` | Auth-flow text inputs | `<falcon-input>` / `<falcon-input-tw>` |
| 2 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.html:34, 65` | Auth get-started inputs | `<falcon-input>` |
| 3 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.html:29, 100, 144` | Password inputs | `<falcon-password>` (already in wrappers index) |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html:25` | `<input id="orgNodeNameInput" type="text" ...>` | `<falcon-input>` |
| 5 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html:56` | `<input type="number" min="0" ...>` | `<falcon-input-number>` |
| 6 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html:47` | `<input type="text" falconIpAddress ...>` — **documented as GAP in the file's own comment** ("IP input keeps native `<input>` because FalconIpAddressDirective talks to ...") | Acceptable GAP per R-12 — but flag for future `<falcon-ip-input>` skeleton creation. |
| 7 | `apps/host-shell/src/app/playground/playground.page.html:2429` | Playground demo input — likely intentional showcase | Acceptable in playground/demo context. |

### Hand-rolled dropdown / popup pattern

The CC1 finding #22 (`apps/host-shell/src/app/layout/components/topbar/topbar.component.html:78` user-menu `<div class="user-menu absolute ..." role="menu">`) is also a CC4 violation: a hand-rolled menu div instead of `<falcon-menu>`. Recommended fix: route topbar user-menu through `<falcon-menu>` and inherit the overlay-ladder token automatically.

### Summary count for CC4

- `<dialog>` raw usage outside lib: **1** (otp-dialog)
- `<input>` raw usage outside lib: **13 occurrences across 7 files** (1 documented GAP, 1 in playground/showcase = acceptable; 11 real violations across auth-flow + org-hierarchy)
- Hand-rolled menu/dropdown div: **1** (topbar user menu)

---

## CC5 — Dead code / unused export candidates

**Rule:** R-21 + R-33 (P1/P2) — *No premature shared abstraction. Remove unused imports.*

Verified usage counts across `apps/` + `libs/` (excluding the lib's own definition files, falcon-ui-react, falcon-ui-vue, falcon-studio):

| Export / wrapper | Defined in | Consumer count (in scope) | Suspected dead? |
|---|---|---|---|
| `FalconSelect` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/` | 0 (only index.ts re-export + `falcon-ui-react/src/components.ts`) | **Yes — candidate.** Remove if no future plan; otherwise mark with a `[Reserved]` tag. |
| `FalconCustomTableFooter` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/` | 1 (`falcon-data-table.component.ts`) — internal-only | **Partial — only used by `FalconDataTable`.** Consider inlining into `falcon-data-table` since it's not part of the public consumption pattern. |
| `FalconDataTable` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/` | 3 (org-hierarchy / applications-table use it) | Used. |
| `FalconAccordion` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/` | Only in playground / showcase | **Partial.** Listed in showcase registry but no real feature uses it. Keep for documented intent. |
| `FalconUploader` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-uploader/` | Only in playground / showcase + register helpers | **Partial.** Same as Accordion. |
| `FalconPassword` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-password/` | 6 (mostly showcase + tests + register helpers, no real feature) | **Partial.** Notable because `apps/host-shell/src/app/features/auth/change-password/` still uses raw `<input>` (CC4 hit #3) instead of consuming `<falcon-password>`. Library-first violation. |
| `FalconCombobox` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/` | 12 — used | Used. |
| `FalconInputNumber` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input-number/` | 17 — used | Used. (But CC4 #5 has a feature using raw `<input type="number">` instead — same library-first issue.) |
| `FalconStatusBadge` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-status-badge/` | 21 — used | Used. |
| `FalconFilterPanel` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-filter-panel/` | 22 — used | Used. |
| `FalconCard`, `FalconBadge`, `FalconAvatar`, `FalconTag`, `FalconPopup`, `FalconConfirmDialog`, `FalconNotification`, `FalconEmptyState`, `FalconEmptyData`, `FalconWizard`, `FalconMessageService` | various | 6-25 each — all used | Used. |

### Notes
- **False-positive risk:** any export imported via dynamic `defineCustomElements` registration shows zero "named" import hits but is still invoked at runtime via the loader. Grep-based dead-code can't catch that. The 4 partial-use components above (`Select`, `CustomTableFooter`, `Accordion`, `Uploader`, `Password`) are best read as "documented but not yet consumed by feature code" rather than confirmed-dead.
- **Likely truly dead:** `FalconSelect` is the most likely actually-dead — only the React lib references it.

---

## CC6 — Unknown `falcon-*` Tailwind classes

**Rule:** R-17 (P1) — *Every `var(--falcon-*)` and `bg-falcon-*` / `text-falcon-*` reference must resolve to a defined token.*

Cross-checked against declared `--color-falcon-*` tokens. **Total unknown utility references in apps:** ~14 hits across **3 files**.

### Unknown class table

| # | File:line | Class used | Closest declared match | Diagnosis |
|---|---|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html:127, 158` | `bg-falcon-warning-100` | None — only `--color-falcon-warning-...` family **does not exist**; closest is `--color-falcon-amber-50/400/500/700` | Token family `warning` not declared. Replace with `bg-falcon-amber-100` (need to add `--color-falcon-amber-100` token) or rename to amber. |
| 2 | `same:127, 158` | `text-falcon-warning-700` | None — same family missing | Replace with `text-falcon-amber-700` (token exists). |
| 3 | `same:127, 158` | `hover:bg-falcon-warning-200` | None | Token missing; map to amber-200 (would need adding `--color-falcon-amber-200`). |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html:132, 163` | `bg-falcon-success-100` | `--color-falcon-success-20`, `--color-falcon-success-50` (no -100) | Either add `--color-falcon-success-100` to the token registry or remap to `bg-falcon-green-100` (which IS declared). |
| 5 | `same:132, 163` | `text-falcon-success-700` | None — closest `--color-falcon-green-700` | Remap to `text-falcon-green-700`. |
| 6 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html:49, 72` | `text-falcon-danger-600` | None — `--color-falcon-danger-*` family undeclared; closest `--color-falcon-red-...` | Remap to `text-falcon-red-600` (need to add `--color-falcon-red-600`) or `text-falcon-red-500/700` (declared). |

### Summary
- **Unknown family `warning`:** 6 hits — must add tokens or remap to `amber`.
- **Unknown family `danger`:** 2 hits — must add tokens or remap to `red`.
- **Family `success` partial:** 4 hits use shades (`-100`, `-700`) that aren't declared — declare or remap to `green`.

All ~14 hits cluster in **two files**, both inside `org-hierarchy-page`. Fixing two files closes CC6 entirely.

---

## CC7 — Inline `style="..."` attributes

**Rule:** R-02 (P0) — *no `style="..."` attributes in templates. Calculated dynamic `[style.*]` bindings are out of scope per Rule Digest C-3 conflict resolution; only literal `style="..."` is forbidden.*

### Totals

| Scope | Files | Total occurrences |
|---|---|---|
| `libs/` | 1 | 1 |
| `apps/` | 3 | 21 |
| **Workspace total in scope** | **4** | **22** |

### Detailed table

| # | File:line | Quote (truncated) |
|---|---|---|
| 1 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html:1` | (1 hit — see file) |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:217` | `style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falcon-table-footer-bg: var(--color-falcon-neutral-30, #f7f8fa);"` — **CSS custom-property override** (legitimate per Tailwind utility-token override pattern), but contains a hardcoded `#f7f8fa` hex fallback (R-03 violation). |
| 3 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html:18, 44, 48, 53, 63, 67, 72, 73, 76, 111, 127` | 11 hits — all hardcoded sizing, positioning, font-size, gap, padding, raw `rgba(...)`, raw `box-shadow`, `background: transparent` — **massive R-02 + R-03 violation cluster**. |
| 4 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html:18, 22, 24, 27, 39, 52, 54, 56, 59` | 9 hits — `style="background: #F3F8F5; padding-inline: 16px;"` (**raw hex inside style="..."!**), plus 8 instances of `style="width: 96px/140px/180px/220px/260px;"` to fake column alignment under a Stencil slot projection. Heavy R-02 + R-03 cluster. |

### Most urgent fix targets
1. `otp-dialog.component.html` — refactor to Falcon dialog tokens.
2. `falcon-table-edit-row.component.html` — refactor column-width inline styles to a token + class-based width grid, or extend `<falcon-table>` to support edit-row slots with column alignment guarantees (library upgrade per R-07 step 5).
3. `org-hierarchy-page-menu.component.html:217` — replace `#f7f8fa` fallback with var-only reference; the `--falcon-table-header-bg` override pattern is fine.

---

## CC8 — Dynamic class strings with hardcoded color/spacing literals

**Rule:** R-03 (P0) — *no raw hex / `px` / `rgba` / shadow / radius literals.*

### `[ngClass]` hits

| File | Hits | Status |
|---|---|---|
| `apps/host-shell/src/app/playground/playground.page.html:54` | 1 | Uses `bg-falcon-teal-100 text-falcon-teal-700 border-falcon-teal-200 / bg-falcon-neutral-100 text-falcon-neutral-700 border-falcon-neutral-200` — **all token-only**, no hardcoded literals. **Compliant.** |

No other `[ngClass]` hits in scope.

### Tailwind arbitrary-hex / arbitrary-px in app templates

This was not separately re-grepped because it overlaps with R-03 (token reality) which the dedicated rule-digest audit covers comprehensively. Cross-cutting note: every `z-[200]`, `z-[5]`, `z-[1000]`, `top-[calc(100%+8px)]`, `w-[260px]`, `rounded-[14px]`, `shadow-[0_20px_50px_rgba(0,0,0,0.15)]` listed under CC1 + CC4 is also a CC8 / R-03 hit. The `topbar.component.html:78` line alone contains 5+ Tailwind arbitrary values (`top-[calc(100%+8px)]`, `w-[260px]`, `z-[200]`, `rounded-[14px]`, `shadow-[0_20px_50px_rgba(0,0,0,0.15)]`) and a raw `rgba()` inside the shadow. **Refactor target.**

---

## CC9 — TODO / FIXME / @ts-ignore residue

**Rule:** R-26 (P2) — *No `@ts-ignore` / `@ts-nocheck` / `as any` without explanation.*

In scope (excluding `falcon-ui-react`, `falcon-ui-vue`, `falcon-studio`):

| # | File:line | Comment text | Type |
|---|---|---|---|
| 1 | `libs/falcon/src/shared-utils/lib/utils/contact-group.mapper.ts:37` | `// TODO: revisit once the backend exposes per-group import progress.` | TODO — legitimate, backend-blocked. |
| 2 | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.tsx:137` | `/*** TODO: factor into a Falcon `OutsideClickDirective` once the shared utility lands (logged as drift). ***/` | TODO — has a planned home. |
| 3 | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.d.ts:57` | (same as #2 — generated `.d.ts`) | TODO mirror. |
| 4 | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.tsx:153` | (same TODO as #2 — duplicated logic) | TODO — DRY hit; consolidate after `OutsideClickDirective` lands. |
| 5 | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.d.ts:59` | (mirror) | TODO mirror. |
| 6 | `apps/management-console/src/environments/environment.staging.ts:8` | `// TODO: update to real staging URLs` | TODO — known config gap. |
| 7 | `apps/admin-console/src/environments/environment.staging.ts:8` | (same) | TODO. |
| 8 | `apps/host-shell/src/environments/environment.staging.ts:12` | (same) | TODO. |
| 9 | `apps/host-shell/src/app/playground/playground.page.ts:71` | `/*** TODO: fed from log file later. Hard-coded snapshot for tonight. ***/` | TODO — explicit "tonight" temp. |
| 10 | `apps/host-shell/src/app/playground/playground.page.ts:129` | `/*** TODO: fed from log file later. Hard-coded snapshot of NIGHT-SHIFT-LOG status board. ***/` | TODO — explicit temp. |

**`@ts-ignore` hits in scope:** 0 (all 50+ ts-ignore hits in `libs/falcon-ui-react/src/components.ts` are out-of-scope per the React-lib exclusion).

**`@ts-nocheck` hits in scope:** 0.

### Summary
- 10 TODOs (5 mirror duplicates from generated `.d.ts` files) — all tracked, all explained.
- 0 functional ts-ignores in scope.

---

## CC10 — `console.log` / `debugger` residue

**Rule:** Implicit R-33 / R-23 cleanliness — *no debug noise in production code paths.*

### libs/ (in scope) — 5 hits

| # | File:line | Quote |
|---|---|---|
| 1 | `libs/falcon/src/shared-utils/lib/validators/falcon-validators.ts:171` | `console.log('[getValidationErrorMessage] Found falconCheckExists error:', {` |
| 2 | `libs/falcon/src/shared-utils/lib/validators/falcon-validators.ts:182` | `console.log('[getValidationErrorMessage] Found falconAsyncExists error:', message);` |
| 3 | `libs/falcon/src/core/lib/services/route-access.service.ts:48` | `console.log('canAccessPath', path, userType, userType);` (also double-logs `userType` — likely a typo bug) |
| 4 | `libs/falcon/src/shared-ui/lib/directives/falcon-form-validate.directive.ts:303` | `console.log(\`[FalconFormValidate] ${controlName} has async error:\`, {` |
| 5 | `libs/falcon/src/shared-ui/lib/directives/falcon-form-validate.directive.ts:601` | `console.log(\`[FalconFormValidate] Error message displayed for ${controlName}: "${msg}"\`, errorEl);` |

### apps/ (in scope) — 27+ hits across 9 files

Highlights:
- `apps/host-shell/src/app/core/services/remote-route.service.ts` — **27 console.log statements** in one service. Heavy diagnostic logging.
- `apps/host-shell/src/app/remote-route.service.ts` — duplicate of the core service with **11 console.log statements**.
  - **Likely dead duplicate** — these two `remote-route.service.ts` files look like a refactor that didn't finish. Worth investigating whether the root-level one is now stale.
- `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts:68` — 1 hit (diagnostic context — likely OK).
- `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts:680` — `console.log('[empty-data showcase] CTA clicked:', this.actionLabel());` (showcase / playground).
- `apps/management-console/src/bootstrap.ts:31` — `router.events.subscribe((ev: any) => console.log('ROUTER EVENT →', ev));` (also has `as any` cast).
- `apps/admin-console/src/bootstrap.ts:31` — duplicate of the above.
- `apps/host-shell/src/environments/environment*.ts` — `showConsoleLog` flag config (acceptable — gates other logs).
- `apps/host-shell/falcon-facades/host-notifier.facade.ts:9` — `console.log(\`[${title}] ${message}\`);` — falcon-fallback debug.
- `apps/management-console/debug/facade-smoke.initializer.ts:24` — explicitly named "debug" path; OK.
- `apps/management-console/mocks/falcon-fallback.providers.ts:153` — debug fallback; OK.

### Summary
- **5 in-scope libs console.log** — all in production code paths (validators + directive + service). Replace with proper telemetry / gated by environment.
- **2 stale remote-route.service.ts duplicates** in `apps/host-shell` (`src/app/core/services/` and `src/app/`) — see CC5 dead-code follow-up.
- **2 bootstrap.ts router-event logs** — should be feature-flagged off in prod.

---

## Summary

### Total findings: **152**
- CC1 (z-index): 29 inspected hits (6 removable, 6 needs investigation, 17 compliant)
- CC2 (PrimeNG residue): 1 stale comment
- CC3 (SCSS/CSS/styleUrls): 21 .scss + 17 styleUrls arrays + 2 non-shim styleUrls (40 P0 violations) + 30 shim files in audited exception
- CC4 (library-first): ~13 violations (1 dialog, 11 raw inputs, 1 hand-rolled menu)
- CC5 (dead code): 5 candidates (1 likely dead `FalconSelect`, 1 internal-only `FalconCustomTableFooter`, 3 partial-use)
- CC6 (unknown classes): 14 hits across 2 files
- CC7 (inline style attrs): 22 occurrences in 4 files
- CC8 (dynamic-class literals): rolled into CC3 / CC7 / CC1
- CC9 (TODO/ts-ignore): 10 TODOs, 0 ts-ignores in scope
- CC10 (console.log): 5 lib + ~27 app hits (concentrated in 2 stale remote-route files)

### Top 3 cross-cutting priorities

1. **CC3 — SCSS purge.** 21 SCSS files (8 lib + 13 app) + 17 `styleUrls: [.scss]` arrays + 2 non-shim `styleUrl: .scss` declarations are pure P0 violations of R-02. This is the single largest cross-cutting cleanup. Migration path: (a) auth flow components in host-shell get rewritten to Tailwind utilities (5 files); (b) layout/topbar/sidebar in host-shell get refactored (3 files); (c) the 8 `libs/falcon/src/shared-ui/*.scss` files get retired in favor of `falcon-ui-core` Stencil + `-tw` variants (Library-first per R-07); (d) the 3 `apps/*/src/styles.scss` get renamed to `.css` with Tailwind-only content; (e) the angular-wrapper `.component.css` shims get an explicit grandfather note (or migrate to inline `styles: ['']`).

2. **CC1 — Z-index hardcoded values (6 removable hits, 1 critical).** The `--falcon-org-hierarchy-ctx-menu-z-index: 9999` defies the entire overlay ladder; `falcon-table.css:198 z-index: 5` (loading overlay below sticky header — actively wrong layering); `topbar.component.html:78 z-[200]` user menu; `falcon-insufficient-balance-dialog-tw.tsx:308 z-[1000]` dialog backdrop below dialog tier. Plus 6 "needs investigation" panel-z-index tokens at 100 that may not survive co-existence with a dialog. **Net:** the canonical ladder isn't applied everywhere it should be.

3. **CC7 — Inline `style="..."` attribute cluster (22 occurrences in 4 files).** Two files alone (`otp-dialog.component.html` with 11 hits and `falcon-table-edit-row.component.html` with 9 hits) contain raw hex literals (`#F3F8F5`, `rgba(13, 63, 68, 0.55)`, `rgba(13, 63, 68, 0.30)`), raw `px` widths, raw shadow values, and inline `<style>` blocks. These are both R-02 (no inline style) + R-03 (no hardcoded values) double violations.

### Recommended fix sequencing

1. **Wave A (parallel safe):** Replace the 6 removable z-index hits (CC1), the 14 unknown-class CC6 hits in two files, and the 5 lib console.logs (CC10). Each is atomic, low-risk.
2. **Wave B (single fixer, focused):** Refactor `otp-dialog.component.html` and `falcon-table-edit-row.component.html` (CC7) to remove inline `style=""` + raw hex. Migrate `<dialog>` to `<falcon-dialog>` (CC4 + CC7 + CC8 combined fix).
3. **Wave C (multi-day program):** SCSS purge per CC3. Sequence: (i) `apps/*/src/styles.scss` → `.css` rename + Tailwind-only conformance (3 files), (ii) auth-flow rewrites (5 files), (iii) layout/topbar/sidebar rewrites (3 files), (iv) retire `libs/falcon/src/shared-ui/*.scss` in favor of falcon-ui-core variants (8 files + 1 `falcon-stepper` `.component.ts` referencing `.scss`).
4. **Wave D (decision required):** Confirm or grandfather the 30 `angular-wrapper/*.component.css` `:host{display:block}` shims (R-02 vs MEMORY `project_falcon_ui_core_layout_traps`).
5. **Wave E (cleanup):** Replace the 11 raw `<input>` hits with Falcon equivalents (CC4); rewrite the topbar user-menu as `<falcon-menu>` (CC1 + CC4); remove or feature-flag the bootstrap router-event console.logs (CC10); investigate the stale `remote-route.service.ts` duplicates (CC5 / CC10).

---

### Report-end

Path of this report: `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\04-audits\cross-cutting.md`
