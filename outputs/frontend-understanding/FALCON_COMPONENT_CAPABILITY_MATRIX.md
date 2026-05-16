# Falcon Component Capability Matrix

*** Brain SK canonical — Agent 7 merge, 2026-05-13 ***
*** Source: parallel-agents per-component API.md + DECISION.md ***

Legend: ✅ supported · ⚠ partial · ❌ not supported · n/a not applicable

Capabilities scored:

- **Dual** — Stencil Shadow + Light render path (`useTailwind` toggle)
- **CVA** — `ControlValueAccessor` for `formControlName`
- **RFm** — Reactive Forms binding (FormControl/FormGroup)
- **ngM** — `[(ngModel)]` template-driven binding
- **Slt** — Stencil `<slot>` or Angular `ng-template` custom rendering
- **POp** — Per-option template (for list-of-options components)
- **Lzy** — Lazy / server-side mode
- **Pag** — Pagination
- **Kbd** — Keyboard navigation (Arrow/Home/End/etc.)
- **A11** — ARIA / a11y attributes documented in source
- **Tok** — Token-driven theming (per-component `*.tokens.css`)
- **Drk** — Dark-mode parity (token cascade)
- **RTL** — RTL support (logical CSS + RTL token layer)
- **Prd** — Production consumers > 0 (outside playground/showcase)
- **Tst** — Unit tests / specs alongside the component

| # | Component | Dual | CVA | RFm | ngM | Slt | POp | Lzy | Pag | Kbd | A11 | Tok | Drk | RTL | Prd | Tst |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | falcon-angular-accordion | ✅ | n/a | n/a | n/a | ⚠ (content only) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 2 | falcon-angular-avatar | ✅ | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | n/a | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 3 | falcon-angular-badge | ✅ | n/a | n/a | n/a | ✅ (ng-content) | n/a | ❌ | ❌ | n/a | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 4 | falcon-angular-button | ✅ | n/a | n/a | n/a | ✅ (start/end icon) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 5 | falcon-angular-calendar | ✅ | ❌ | ⚠ via event | ⚠ via event | ❌ | n/a | ❌ | n/a | ⚠ | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 6 | falcon-calendar (legacy facade) | ❌ (Angular) | ✅ | ✅ | ✅ | ❌ | n/a | ❌ | n/a | n/a | ⚠ | ❌ | ❌ | n/a | ❌ | ❌ |
| 7 | falcon-angular-card | ✅ | n/a | n/a | n/a | ✅ (header/default/footer) | n/a | ❌ | ❌ | ⚠ | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 8 | falcon-angular-checkbox | ✅ | ✅ | ✅ | ✅ | ✅ (label slot) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 9 | falcon-angular-checkbox-group | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 10 | falcon-angular-combobox | ✅ | ⚠ | ⚠ | ⚠ | ❌ | ❌ | ❌ | ❌ | ✅ | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 11 | falcon-angular-confirm-dialog | ✅ | n/a | n/a | n/a | ⚠ (default body) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 12 | falcon-angular-data-table | ⚠ (Light only — Strategy E) | n/a | n/a | n/a | ✅ (per-column + empty + loading + global-filter — Strategy E) | n/a | ✅ | ✅ | ⚠ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 13 | falcon-angular-date-picker | ✅ | ❌ | ⚠ via event | ⚠ via event | ❌ | n/a | ❌ | n/a | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 14 | falcon-angular-dialog (DEPRECATED) | ✅ | n/a | n/a | n/a | ✅ (header/default/footer) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 15 | falcon-angular-drawer | ✅ | n/a | n/a | n/a | ✅ (header/default/footer) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 16 | falcon-angular-dropdown | ✅ | ✅ | ✅ | ✅ | ⚠ (options slot Shadow only) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 17 | falcon-angular-email-field | ✅ | ✅ | ✅ | ✅ | ❌ | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 18 | falcon-angular-empty-state | ✅ | n/a | n/a | n/a | ✅ (icon/title/description/actions) | n/a | ❌ | ❌ | n/a | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 19 | falcon-angular-filter-panel | ✅ | n/a | n/a | n/a | ⚠ (default — custom renderers) | ❌ | ❌ | ❌ | ⚠ | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 20 | falcon-form-field (legacy bespoke) | ❌ (Angular) | n/a | n/a | n/a | ✅ (default = the control) | n/a | ❌ | ❌ | n/a | ⚠ | ❌ | ❌ | ✅ | ✅ | ❌ |
| 21 | falcon-angular-grid-input | ✅ | ❌ | ⚠ via event | ⚠ via event | ❌ | n/a | ❌ | n/a | ✅ | ⚠ | ⚠ (2 tokens) | ⚠ | ✅ | ❌ | ❌ |
| 22 | falcon-angular-icon | ✅ | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | n/a | n/a | ✅ | ✅ | n/a | ✅ | ❌ |
| 23 | falcon-angular-input | ✅ | ✅ | ✅ | ✅ | ✅ (prefix/suffix Shadow only) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 24 | falcon-angular-input-number | ✅ | ✅ | ✅ | ✅ | ❌ | n/a | ❌ | ❌ | ⚠ | ⚠ | ⚠ (7 tokens) | ⚠ | ✅ | ✅ | ❌ |
| 25 | falcon-angular-menu | ✅ | n/a | n/a | n/a | ✅ (trigger/default) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (via composers) | ❌ |
| 26 | falcon-mobile-number (legacy facade) | ❌ (Angular) | ⚠ | ⚠ | ⚠ | ❌ | n/a | ❌ | n/a | n/a | ⚠ | ❌ | ❌ | n/a | ✅ | ❌ |
| 27 | falcon-angular-multi-select | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 28 | falcon-multiselect (legacy stub) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 29 | falcon-angular-notification | ❌ (Angular only) | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | ⚠ | ✅ (always polite) | ❌ (no token file) | ⚠ | ✅ | ✅ (interceptors) | ❌ |
| 30 | falcon-angular-otp | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | n/a | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 31 | falcon-angular-otp-send-dialog | ✅ | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 32 | falcon-angular-paginator | ✅ | ✅ | ✅ | ✅ | ⚠ (page-info template tokens) | n/a | n/a | n/a | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ (via tables) | ❌ |
| 33 | falcon-angular-password | ✅ | ✅ | ✅ | ✅ | ❌ | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 34 | falcon-angular-phone-field | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 35 | falcon-photo-uploader (legacy bespoke) | ❌ | ❌ | ❌ | ❌ | ❌ | n/a | ❌ | ❌ | ❌ | ⚠ | ❌ (SCSS rules) | ❌ | n/a | ✅ | ❌ |
| 36 | falcon-angular-popup | ❌ (Angular only) | n/a | n/a | n/a | ❌ (4 canonical variants) | n/a | ❌ | ❌ | ⚠ | ⚠ (NO focus trap — P0) | ❌ (no token file) | ⚠ | ✅ | ✅ | ❌ |
| 37 | falcon-angular-radio | ✅ | ✅ | ✅ | ✅ | ✅ (label) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 38 | falcon-angular-radio-group | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 39 | falcon-angular-search-input | ✅ | ❌ | ⚠ via event | ⚠ via event | ❌ | n/a | ❌ | n/a | ✅ | ⚠ | ⚠ (4 tokens) | ⚠ | ✅ | ✅ | ❌ |
| 40 | falcon-angular-single-uploader | ✅ | n/a | n/a | n/a | ❌ | n/a | n/a | n/a | ⚠ | ⚠ | ✅ | ⚠ | ✅ | ⚠ (legacy still used) | ❌ |
| 41 | falcon-angular-status-badge | ✅ | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | n/a | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 42 | falcon-angular-stepper | ✅ | n/a | n/a | n/a | ⚠ (default — labels) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ (14 categories) | ⚠ | ✅ | ❌ (wizards use legacy) | ❌ |
| 43 | falcon-stepper (legacy bespoke) | ❌ | n/a | n/a | n/a | ✅ (TemplateRef — FalconStepDirective + FalconStepperFooterDirective) | n/a | ❌ | ❌ | ⚠ | ⚠ | ❌ (no tokens — SCSS) | ❌ | ✅ | ✅ (4 wizards) | ❌ |
| 44 | falcon-angular-switch | ✅ | ✅ | ✅ | ✅ | ✅ (label) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 45 | falcon-angular-table | ✅ | n/a | n/a | n/a | ⚠ (column header/cell helpers) | n/a | ✅ | ✅ | ⚠ (no Arrow key) | ✅ (role=grid + aria-sort + aria-selected) | ✅ | ⚠ | ✅ | ✅ (via data-table) | ❌ |
| 46 | falcon-angular-tabs | ✅ | n/a | n/a | n/a | ✅ (per-panel slot per value + falconTabActions directive) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 47 | falcon-angular-tag | ✅ | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | n/a | ⚠ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 48 | falcon-angular-textarea | ✅ | ✅ | ✅ | ✅ | ❌ | n/a | ❌ | ❌ | n/a | ✅ | ✅ | ⚠ | ✅ | ✅ | ❌ |
| 49 | falcon-angular-toast (DEPRECATED) | ✅ | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | ⚠ | ✅ (polite/assertive switch) | ✅ | ⚠ | ✅ | ✅ (via FalconMessageService) | ❌ |
| 50 | falcon-angular-tooltip | ✅ | n/a | n/a | n/a | ✅ (trigger slot) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 51 | falcon-angular-tree | ✅ | n/a | n/a | n/a | ❌ (no row / actions slot — gap) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ❌ (legacy tree-panel used) | ❌ |
| 52 | falcon-tree-panel (legacy bespoke) | ❌ | n/a | n/a | n/a | ✅ (per-row + root 3-dot menus) | n/a | ❌ | ❌ | ⚠ | ⚠ | ❌ (SCSS rules) | ❌ | ✅ | ✅ (4 menu files) | ❌ |
| 53 | falcon-angular-tree-table | ✅ | n/a | n/a | n/a | ⚠ (per-row Stencil slots — O(rows×cols), no Strategy E) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ❌ | ❌ |
| 54 | falcon-angular-uploader | ✅ | n/a | n/a | n/a | ❌ | n/a | n/a | n/a | ⚠ | ⚠ | ✅ | ⚠ | ✅ | ⚠ | ❌ |
| 55 | falcon-angular-wizard | ✅ | n/a | n/a | n/a | ✅ (per-step slot + footer-extra slot) | n/a | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠ | ✅ | ❌ (legacy used) | ❌ |
| 56 | falcon-angular-message-host | ❌ (Angular only) | n/a | n/a | n/a | ❌ (host) | n/a | ❌ | ❌ | n/a | ✅ (delegated to toast) | ❌ (composes toast tokens) | ✅ (toast cascade) | ✅ | ✅ | ❌ |
| 57 | falcon-angular-select (alias) | ✅ (via dropdown) | ✅ | ✅ | ✅ | ⚠ (via dropdown) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ (via dropdown) | ⚠ | ✅ | ❌ | ❌ |
| 58 | send-credentials-popup (legacy bespoke) | ❌ | n/a | n/a | n/a | ⚠ (form inside dialog) | n/a | ❌ | ❌ | ⚠ | ⚠ | ❌ | ❌ | n/a | ❌ (playground only) | ❌ |
| 59 | falcon-organization-hierarchy-tree-tw | ❌ (Light DOM only) | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | ⚠ | ⚠ | ✅ (organization-hierarchy.tokens.css) | ⚠ | ✅ | ❌ (verified zero) | ❌ |
| 60 | shared-directives (12 directives) | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | ⚠ (FalconFormValidate ignores aria-invalid) | ❌ | ❌ | ⚠ | ✅ | ❌ |
| 61 | falcon-angular-empty-data | ✅ | n/a | n/a | n/a | ❌ (props-driven; no slot — content is fully tokenized) | n/a | ❌ | ❌ | n/a | ⚠ | ✅ (empty-data.tokens.css, ~35 vars) | ⚠ | ✅ | ✅ (org-hierarchy-page users table) | ❌ |

### Row #61 expanded — `falcon-angular-empty-data`

*** Added 2026-05-14 — Wave 19 / 16th iter — Strategy v1.0 run `2026-05-14_falcon-empty-data` — Author: Adnan (auto) ***

| Column | Value |
|---|---|
| Component tag | `<falcon-empty-data>` (wrapper) + `<falcon-empty-data-tw>` (Light) + `<falcon-angular-empty-data>` (Shadow) |
| Family | empty-state |
| Dual-render pattern | ✅ Yes (Shadow + Light + Angular wrapper; canonical 3-tag family) |
| Tokens declared | ✅ Yes (`libs/falcon-ui-tokens/src/components/empty-data.tokens.css`, ~35 CSS vars; registered in `libs/falcon-ui-tokens/src/index.css`) |
| Angular wrapper | ✅ Yes (`<falcon-angular-empty-data>`) |
| Status | Shipped (2026-05-14, Wave 19, 16th iter) |
| Inputs count | **22** (20 Stencil props + `useTailwind` wrapper switch + 4 outer-pad/margin overrides — note: 4 overrides counted in the 20-prop set: padX/padY/marginX/marginY; the remaining 16 prop-pairs total 20 with mode + containerFit) |
| Outputs | **1** (`actionClick`) |
| Source location | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/` |
| Layering | `@falcon/ui-core/angular` (NOT `@falcon/shared-ui` — see BUG-2026-05-14-011) |
| Data-table integration | ✅ Auto-mount via `<falcon-angular-data-table [emptyData]>` shorthand when `data.length === 0` (Path 2 in `syncEmptyView()`) |
| Production adoption | ✅ `admin-console/organization-hierarchy-page` users table (replaces legacy `[emptyMessage]` plain text) |
| Theme Studio compatibility | ✅ Full (zero hardcoded literals; every visual property resolves via `color-mix()` from Falcon brand tokens like `--color-falcon-teal-800`) |
| Showcase | ✅ `apps/host-shell/.../falcon-ui-showcase/library-section/empty-data-section.component.ts` (live-tweak panel: 5 toggles + opacity slider + 8-icon grid + button-size/border segmented + outer-pad/margin sliders + render-path toggle) |
| Notes | themed empty state for data-tables + pages; full Studio-token compatibility; dual-render canonical; Stencil reserved-name trap fixed via `titleText` suffix (BUG-012) |

---

## Aggregate insights

### Dual-render coverage
- 47 dual-render pairs (Shadow + Light) — all modern Falcon UI core components.
- 1 Light-only (`falcon-organization-hierarchy-tree-tw`).
- 4 Angular-only (`falcon-popup`, `falcon-notification`, `falcon-message-host`, all 8 legacy bespoke components).

### CVA coverage
- **15** Falcon UI core wrappers implement CVA: input, textarea, password, input-number, email-field, phone-field, dropdown, multi-select, combobox (partial), checkbox, checkbox-group, radio, radio-group, switch, otp, paginator.
- **4 CVA gaps**: calendar (Stencil), date-picker, search-input, grid-input — flagged as U4.
- **Legacy `<falcon-form-field>`** is not a form control itself — provides label scaffold around CVA inputs.

### Per-option template (POp)
- **None** of the list-of-options components support per-option template projection today.
- This is the single biggest reusability win — covered by upgrade U1 (FalconOptionTemplateDirective).
- Affected: dropdown, multi-select, combobox, checkbox-group, radio-group, phone-field (country picker), menu (item icons).

### Slot / template projection
- ✅ Heavy slot use: button (icon-start/end), card (header/default/footer), drawer (header/default/footer), dialog (header/default/footer), tabs (per-panel + falconTabActions), wizard (per-step + footer-extra), empty-state, badge.
- ⚠ Partial: table column helpers, accordion content, tree-table per-row Stencil slots (O(rows × cols)), filter-panel default custom renderer.
- ❌ Gap: tree (no row/actions slot — UC-W01), notification (no body slot), popup (4 canonical variants only — UC-W03).

### Strategy E projection
- **Only `<falcon-angular-data-table>`** uses Strategy E (Stencil mount-points + Angular `EmbeddedViewRef` mounting).
- `<falcon-angular-tree-table>` should adopt it (UC-P1-01).
- `<falcon-angular-tree>` should adopt it (UC-W01).

### A11y coverage
- ✅ Strong: button, drawer, dialog, dropdown, multi-select, otp, switch, radio, radio-group, checkbox, tabs, table (role=grid + aria-sort), tooltip, menu.
- ⚠ Partial: combobox (state visuals incomplete), filter-panel (native atoms), avatar (alt vs aria-label), card (interactive a11y), tag (no dismiss aria-label i18n).
- ❌ Critical: `<falcon-angular-popup>` lacks focus trap (P0 — UP-3-02).

### Token coverage
- 46 component-token files in `libs/falcon-ui-tokens/src/components/`.
- Gaps: `<falcon-angular-popup>` (no own tokens — UP-3-10), `<falcon-angular-notification>` (no own tokens — UP-3-10), `<falcon-angular-message-host>` (composes toast — OK).
- Lean tokens: grid-input (2), search-input (4), icon (7), input-number (7), password (13).
- Largest: multi-select (181), phone-field (142), dropdown (132), tabs (128), calendar (123).

### Dark mode parity
- Geometry (sizes / radii / spacing / motion / breakpoints / z-index) stays stable across modes.
- Surface / text / border / shadow tokens override in dark via `:where(.app-dark, .app-dark *)` block (lines 385-451 of `falcon-tailwind-tokens.css`).
- 178 lines of per-component dark overrides in `libs/falcon-ui-tokens/src/themes/dark.css` — flagged as UP-06 (collapse into SSOT alpha cascade).
- Components carrying literal `rgba(13, 63, 68, ...)` instead of `var(--color-falcon-teal-alpha-*)` lose dark-mode auto-invert.

### RTL
- `rtl/rtl.css` is intentionally minimal (26 lines) — flips shadow direction + slide distance + dialog side-right enter offset.
- Logical CSS properties (`inline-start`, `block-end`, etc.) do the rest in templates.
- All Falcon UI core wrappers use logical properties — RTL-clean.

### Production adoption (verified outside playground/showcase)
- **High**: button, dropdown, input, multi-select, checkbox, multi-select, multi-select-tw, table (via data-table), tabs, popup, menu, drawer, message-host, form-field (legacy), tree-panel (legacy), stepper (legacy), photo-uploader (legacy), mobile-number (legacy).
- **Mid**: data-table, paginator, single-uploader, phone-field, password, email-field, textarea, date-picker, otp.
- **Zero**: card, confirm-dialog, accordion, avatar, tag, badge, status-badge, empty-state, tooltip, tree, tree-table, wizard (legacy used), stepper (Stencil — legacy used), uploader, falcon-angular-select, send-credentials-popup, organization-hierarchy-tree-tw.
- **24 of 60 components have zero non-playground/showcase consumers**.

### Test coverage
- **Zero** `*.spec.ts` files found alongside any Falcon UI core component.
- Vitest specs for Strategy E orchestrator (UC-P1-06), Stencil tables (UC-P1-07), and the paginator utils are all flagged as P1 gaps.

---

_Last updated: 2026-05-14 — Strategy v1.0 — Run: 2026-05-14_falcon-empty-data — Author: Adnan (auto)_
