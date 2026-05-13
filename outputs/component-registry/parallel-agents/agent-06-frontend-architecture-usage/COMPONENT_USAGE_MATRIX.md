# Component Usage Matrix — Falcon Components Across Apps

**Method:** ripgrep over `apps/` for each component selector. Counts are "files matching" — counting both `*.html` template usage and `*.ts` import references (the latter usually one match per file). Each file is counted once per app.

**Columns explained:**

- **admin** = `apps/admin-console/` (the Falcon admin remote, port 4204)
- **mgmt** = `apps/management-console/` (the Client management remote, port 4301)
- **host-shell.feature** = `apps/host-shell/src/app/features/` (auth flow, dashboard, errors, etc. — real consumer surface)
- **host-shell.playground** = `apps/host-shell/src/app/playground/playground.page.{html,ts}` (auth-free component lab)
- **host-shell.showcase** = `apps/host-shell/src/app/features/falcon-ui-showcase/` + `apps/host-shell/src/assets/component-docs/` (gallery + MD docs)
- **Status**: `✓ Used` = at least one real-feature consumer; `Lab-only` = playground/showcase only; `Unused` = no consumer; `Legacy-used` / `Legacy-unused` = legacy bespoke component.

> Notes on `falcon-stepper` and `falcon-calendar` separation: the substring match catches both legacy and angular variants. Where it matters I separated them manually by looking at the actual selector `<falcon-X>` vs `<falcon-angular-X>` and Angular vs Stencil source path.

---

## Stencil-backed Angular wrappers (`falcon-angular-*`)

| # | Component | admin files | mgmt files | host-shell.feature | host-shell.playground | host-shell.showcase | Status | Example consumer |
|---|---|---|---|---|---|---|---|---|
| 1 | `falcon-angular-accordion` | 0 | 0 | 0 | 1 (playground) | 0 | **Lab-only** | only `playground.page.html:14` |
| 2 | `falcon-angular-avatar` | 0 | 0 | 0 | 0 | 0 | **Unused** | none — nowhere |
| 3 | `falcon-angular-badge` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 4 | `falcon-angular-button` | 1 | 1 | 0 | 1 (playground:34 occ) | 1 | **✓ Used** | `tab-components/settings-tab/settings-tab.component.html` + `falcon-org-node-drawer.component.html` |
| 5 | `falcon-angular-calendar` | 0 | 0 | 0 | 1 (playground:4 occ) | 0 | **Lab-only** | none in features |
| 6 | `falcon-angular-card` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 7 | `falcon-angular-checkbox` | 0 | 0 | 0 | 1 (playground:10) | 0 | **Lab-only** | none |
| 8 | `falcon-angular-checkbox-group` | 0 | 0 | 0 | 1 (playground:6) | 0 | **Lab-only** | none |
| 9 | `falcon-angular-combobox` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 10 | `falcon-angular-confirm-dialog` | 0 | 0 | 1 (`layout.component.html:5-10`) | 0 | 0 | **✓ Used** (host-shell layout only — preserved-as-slot) | `apps/host-shell/src/app/layout/layout.component.html` (currently `[open]="false"` — placeholder for future global confirm flow) |
| 11 | `falcon-angular-data-table` | 1 | 1 | 0 | 0 | 0 | **✓ Used** | `organization-hierarchy-{page-}menu.component.html` in both consoles |
| 12 | `falcon-angular-date-picker` | 0 | 0 | 0 | 1 (playground:6) | 0 | **Lab-only** | none |
| 13 | `falcon-angular-dialog` | 0 | 0 | 0 | 1 (playground:22) | 0 | **Lab-only** | none — DEPRECATED |
| 14 | `falcon-angular-drawer` | 1 (`falcon-org-node-drawer.component.html`) | 1 (same) | 0 | 0 | 0 | **✓ Used** | `tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` in both consoles |
| 15 | `falcon-angular-dropdown` | 6 (wizards + drawer + role-status) | 5 (same) | 1 (login-layout) | 1 (playground:4) | 0 | **✓ Used** | `wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` |
| 16 | `falcon-angular-email-field` | 0 | 0 | 0 | 1 (playground:10) | 0 | **Lab-only** | none |
| 17 | `falcon-angular-empty-state` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 18 | `falcon-angular-filter-panel` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 19 | `falcon-angular-grid-input` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 20 | `falcon-angular-icon` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 21 | `falcon-angular-input` | 6 (wizards + drawer + info-panel) | 5 (same) | 0 | 1 (playground:4) | 0 | **✓ Used** | `client-information-step.component.html:14 matches`, `falcon-org-info-panel.component.html:1` |
| 22 | `falcon-angular-input-number` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 23 | `falcon-angular-menu` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 24 | `falcon-angular-message-host` | GAP/UNKNOWN — host wires `FalconMessageService` but no `<falcon-angular-message-host>` selector grep was performed | 0 | 0 | 0 | 0 | TBD | (search for selector to confirm host bootstrap mount) |
| 25 | `falcon-angular-multi-select` | 4 (wizards) | 4 (wizards) + 1 (client-service-row-table) | 1 (login-layout) | 1 (playground:4) | 0 | **✓ Used** | `wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` |
| 26 | `falcon-angular-notification` | 0 | 0 | 0 | 1 (playground:10) | 0 | **Lab-only** | none |
| 27 | `falcon-angular-otp` | 0 | 0 | 2 (`forgot-password-flow.component.html`, `enter-otp.component.html`) | 1 (playground:16) | 0 | **✓ Used** | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` |
| 28 | `falcon-angular-otp-send-dialog` | 0 | 0 | 0 | 1 (playground:6) | 0 | **Lab-only** | none |
| 29 | `falcon-angular-paginator` | 0 | 0 | 0 | 1 (playground:14) | 0 | **Lab-only** | none (folded into table footer instead) |
| 30 | `falcon-angular-password` | 0 | 0 | 1 (`user-personal-step` — but counted in mgmt + admin) | 0 | 0 | **✓ Used** | `wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html` (admin) and same in mgmt |
| 31 | `falcon-angular-phone-field` | 0 | 0 | 0 | 1 (playground:10) | 0 | **Lab-only** | none in features (despite memory note: `mobile-number` still in active use across wizards — see legacy below) |
| 32 | `falcon-angular-popup` | 0 | 0 | 1 (`falcon-ui-showcase.component.ts:1`) | 0 | 0 | **Lab-only-ish** | only inside showcase. NO real-feature consumer despite being the preferred confirm-flow primitive |
| 33 | `falcon-angular-radio` | 0 | 0 | 0 | 1 (playground:8) | 1 (showcase:library-section:3) | **Lab-only** | none |
| 34 | `falcon-angular-radio-group` | 1 (`user-permissions-step` admin) | 1 (mgmt) | 0 | 0 | 0 | **✓ Used** | `wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` |
| 35 | `falcon-angular-search-input` | 2 (wizards `add-client-wizard.component.html` + `add-user-wizard.component.html`) | 2 (same) | 0 | 0 | 1 (`library-section.component.ts:1`) | **✓ Used** | `wizard-components/add-client-wizard/add-client-wizard.component.html` |
| 36 | `falcon-angular-select` | 0 | 0 | 0 | 0 | 0 | **Unused** | none — note: `<falcon-select>` Stencil tag exists, and the wrapper exists, but never consumed |
| 37 | `falcon-angular-single-uploader` | 0 | 0 | 0 | 1 (playground:5) | 0 | **Lab-only** | none |
| 38 | `falcon-angular-status-badge` | 0 | 0 | 0 | 0 | 0 | **Unused** | none |
| 39 | `falcon-angular-stepper` | 0 | 0 | 0 | 1 (playground:13) | 0 | **Lab-only** | none — feature wizards still use the legacy `<falcon-stepper>` PrimeNG-shaped Angular component |
| 40 | `falcon-angular-switch` | 0 | 0 | 0 | 1 (playground:16) | 1 (showcase library-section) | **Lab-only** | none |
| 41 | `falcon-angular-table` | 0 | 0 | 0 | 1 (playground:4) | 0 | **Lab-only** | none — consumers use the higher-level `<falcon-angular-data-table>` instead |
| 42 | `falcon-angular-tabs` | 2 (`organization-hierarchy-menu` + `organization-hierarchy-menu.component.ts`) | 1 (`organization-hierarchy-page-menu.component.html`) | 0 | 1 (playground:14) | 3 (showcase code panel + actions demo + registry) | **✓ Used** | `organization-hierarchy-menu.component.html` — tab between Hierarchy / Channels / Apps / Settings |
| 43 | `falcon-angular-tag` | 0 | 0 | 0 | 0 | 0 | **Unused** | none — tag is a showcase-only experiment |
| 44 | `falcon-angular-textarea` | 0 | 0 | 0 | 1 (playground:10) | 0 | **Lab-only** | none |
| 45 | `falcon-angular-toast` | 0 | 0 | 0 | 1 (playground:4) | 0 | **Lab-only** | none — **DEPRECATED**; new code should use `<falcon-angular-notification>` |
| 46 | `falcon-angular-tooltip` | 0 | 0 | 0 | 1 (playground:18) | 0 | **Lab-only** | none |
| 47 | `falcon-angular-tree` | 0 | 0 | 0 | 1 (playground:28) | 0 | **Lab-only** | none — feature consumers use `<falcon-tree-panel>` (legacy bespoke Angular) instead |
| 48 | `falcon-angular-tree-table` | 0 | 0 | 0 | 1 (playground:12) | 0 | **Lab-only** | none |
| 49 | `falcon-angular-uploader` | 0 | 0 | 0 | 1 (playground:5) | 0 | **Lab-only** | none |
| 50 | `falcon-angular-wizard` | 0 | 0 | 0 | 0 | 0 | **Unused** | none — wizards are hand-rolled with `<falcon-stepper>` + custom `<add-client-wizard.component>` shells |

### Subtotals — Stencil-backed Angular wrappers

- **Real-feature usage** (admin or management or host-shell.feature has a real consumer): 13 components — button, confirm-dialog, data-table, drawer, dropdown, input, multi-select, otp, password, radio-group, search-input, tabs, AND popup (host-shell showcase only — counted as 1 since it's used in component-docs path).
- **Lab-only** (only playground/showcase): 24 components.
- **Truly unused** (zero references anywhere except possibly the wrapper's own README): 13 components — avatar, badge, card, combobox, empty-state, filter-panel, grid-input, icon, input-number, menu, select, status-badge, tag, wizard.

---

## Legacy bespoke Angular components (under `libs/falcon/src/shared-ui/lib/components/`)

| # | Component | admin files | mgmt files | host-shell.feature | host-shell.playground | host-shell.showcase | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| 51 | `<falcon-calendar>` (legacy façade) | 0 | 0 | 0 | 0 | 0 (delegates to date-picker) | **Legacy-unused** (active code uses `<falcon-angular-calendar>` Stencil or `<falcon-angular-date-picker>`) | Safe to delete the façade |
| 52 | `<falcon-form-field>` | 5 (`client-information-step`, `client-account-owner-step`, `user-personal-step`, `user-role-status-step`, `user-permissions-step`, plus 1 SCSS marker) | 5 (same) | 0 | 0 | 0 | **Legacy-used (HEAVY)** | 131 occurrences across 11 files. Wrap-around for input + label + required-mark + error slot. CANDIDATE for upgrade — see UPGRADE_CANDIDATES.md |
| 53 | `<falcon-mobile-number>` | 2 (wizards) | 2 (wizards) | 1 (forgot-password-flow) | 0 | 0 | **Legacy-used** | 5 files. Should migrate to `<falcon-angular-phone-field>` |
| 54 | `<falcon-multiselect>` (legacy) | 0 | 0 | 0 | 0 | 0 | **Legacy-unused** | Fully replaced by `<falcon-angular-multi-select>`. Safe to delete |
| 55 | `<falcon-photo-uploader>` | 3 (wizards: `user-personal-step`, `client-information-step`, `client-account-owner-step`) | 3 (same) | 0 | 0 | 0 | **Legacy-used** | 6 files. Avatar uploader in wizards |
| 56 | `<falcon-stepper>` (legacy PrimeNG-shaped) | 2 (`add-client-wizard.component.html`, `add-user-wizard.component.html`) | 2 (same) | 0 | 0 | 1 (showcase tile + registry md) | **Legacy-used (HEAVY)** | 4 wizard hosts. CANDIDATE for migration to `<falcon-angular-stepper>` |
| 57 | `<falcon-tree-panel>` | 2 (`organization-hierarchy-menu.component.{ts,html}`) | 1 (`organization-hierarchy-page-menu.component.html`) | 1 (`admin-console/organization-hierarchy-page/organization-hierarchy-page-menu.component.ts`) | 0 | 0 | **Legacy-used** | 4 files. Tree shell chrome — wraps `<falcon-angular-tree>` style. Candidate for promotion |
| 58 | `<send-credentials-popup>` | 0 | 0 | 0 | 1 (`playground.page.{ts,html}`) | 0 | **Lab-only** (legacy) | Only in playground. Still uses `<falcon-angular-dialog>` underneath until a slot-friendly `popup` variant lands |

---

## Stencil-direct tag (no Angular wrapper)

| # | Component | admin files | mgmt files | host-shell.feature | host-shell.playground | host-shell.showcase | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| 59 | `<falcon-organization-hierarchy-tree-tw>` | GAP/UNKNOWN — not grep'd in this pass | GAP/UNKNOWN | 0 | 0 | 0 | Likely used by the org-hierarchy chart variant | Used by both consoles' org-hierarchy chart implementations. Light-DOM only — Shadow companion not yet shipped |

---

## Cross-cutting components

| Component | Use sites | Status |
|---|---|---|
| `FalconMessageService` (TS service, not a tag) | Host `app.config.ts` providers + `response-interceptor.ts` + likely `falcon-org-node-drawer` etc. | **Singleton** — DI'd by interceptors + feature components. Drop-in PrimeNG `MessageService` replacement. |
| `FalconAccess` registry | `app.config.ts` factory + multiple guards | **✓ Used** |
| `FALCON_ICONS` constant + `FalconIcon` type | likely consumed by `<falcon-angular-icon>` + topbar SVG buttons (which currently use inline SVG, not the icon component) | **GAP** — many topbar/sidebar files use inline SVG instead of `<falcon-angular-icon>`. Worth investigating |

---

## Summary stats

| Bucket | Count | Components |
|---|---|---|
| Stencil-backed wrappers with REAL feature consumers | **13** | button, confirm-dialog (host-only placeholder), data-table, drawer, dropdown, input, multi-select, otp, password, radio-group, search-input, tabs, popup (showcase-side only) |
| Stencil-backed wrappers lab-only (playground/showcase) | **24** | accordion, calendar, card?, checkbox, checkbox-group, date-picker, dialog, email-field, notification, otp-send-dialog, paginator, phone-field, radio, single-uploader, stepper, switch, table, tag, textarea, toast, tooltip, tree, tree-table, uploader |
| Stencil-backed wrappers TRULY unused | **13** | avatar, badge, card, combobox, empty-state, filter-panel, grid-input, icon, input-number, menu, select, status-badge, wizard |
| Legacy bespoke with REAL feature consumers | **4** | form-field, mobile-number, photo-uploader, stepper, tree-panel |
| Legacy bespoke unused | **2** | calendar (façade), multiselect |

**Of the 49 Stencil-backed Angular wrappers, only ~13 are actually used in real feature code.** The remaining 36 either sit in the lab (24) or are completely unused (13). This is the Brain SK readiness map for the next wave of consumer migrations.
