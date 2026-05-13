# Frontend Component Dynamic Capability Report

*** Brain SK canonical — Agent 7 synthesis of the 10 dynamic-capability questions across all 60 components ***
*** Generated: 2026-05-13 ***

The Agent brief asked every component dossier to answer 10 dynamic-capability questions. This report synthesizes those answers into one platform-wide view.

---

## Q1 — What is static today?

**Answer:** Most legacy bespoke components (`<falcon-form-field>`, `<falcon-tree-panel>`, `<falcon-stepper>` legacy, `<falcon-photo-uploader>`) are static SCSS-bound layouts where every visual decision is baked into the component CSS. Among the modern Falcon UI core components, "static" surfaces include:

- **Hardcoded English strings** in Stencil cores — `'Search…'` placeholder, `'No records to display.'`, `'Pagination'`, `'Remove'` aria-label on tags. These leak into Arabic UIs. (P3-01.)
- **Hardcoded `rgba(13, 63, 68, X)`** in several component-token files — bypasses the SSOT alpha cascade, blocks auto-dark-mode invert. (P1-39.)
- **PrimeIcons residuals** — `pi pi-ellipsis-v` in `<falcon-table>` row-action button; `pi pi-cloud-upload` and `pi pi-pencil` in uploader Stencil components. (P0-03 / P0-04.)
- **Internal raw `<button>`** in `<falcon-angular-confirm-dialog>` footer (bypasses design-system button primitive). (UP-3-17.)
- **`brand-{name}` CSS classes** for client logos in `<falcon-organization-hierarchy-tree-tw>` — should be a typed registry (P2-07).

**Best-in-class (least static):** `<falcon-angular-stepper>` — 14 token categories covering ~94 tokens including 11 Studio knobs (`step-{shape,radius,rotate,size-1..5,label-position,label-visible,animation-enabled}`). Pattern portable to dropdown chevron position, button corner shape, input affordance choices.

**Laggard:** `<falcon-organization-hierarchy-tree-tw>` — Light-DOM only, no Shadow companion, no Angular wrapper, brand-bubble CSS classes hardcoded.

**Path forward:** Apply Studio-knob pattern to more components; replace literal `rgba()` with cascade-aware `var()`; sweep PrimeIcons + i18n strings out.

---

## Q2 — What is already dynamic through inputs/outputs?

**Answer:** Most modern Falcon UI core components are heavily prop-driven:

- **`<falcon-angular-input>`** — 27 inputs (size, state, variant, appearance + 4 feature toggles + 13 naming/binding/a11y inputs + 4 Angular-only inputs) + 5 outputs.
- **`<falcon-angular-notification>`** — 14 inputs covering intent + dismiss modes + accents + radius + countdown.
- **`<falcon-angular-table>`** — 30+ inputs covering rows, columns, selectable, sortable, paginated, density, striped, hoverable, bordered, loading, empty, dataKey, scrollable, lazy, global filter, sticky actions, responsive layout. Plus 9 events.
- **`<falcon-angular-tabs>`** — 5 inputs + per-panel slot per value + radio-cards mode.
- **`<falcon-angular-data-table>`** — 672 LOC wrapper exposes all `<falcon-table>` events + `(rowMenuTrigger)`.

**Best-in-class:** `<falcon-angular-input>` (flagship — 27 props), `<falcon-angular-table>` (30+ props), `<falcon-angular-notification>` (14 props for a non-form component).

**Laggard:**
- **`<falcon-angular-combobox>`** wrapper lacks label/helperText/errorMessage/state/disabled inputs (gaps documented in `combobox/API.md`).
- **`<falcon-angular-paginator>`** wrapper missing 6 Stencil core inputs (`totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport`) (P1-13).
- **`<falcon-angular-data-table>`** wrapper missing `[density]` input and `(multiSortChange)` output despite Stencil core supporting them.

**Path forward:** Wrapper API parity sweep (P1-44) — every Stencil prop and event should be mirrored on the Angular wrapper.

---

## Q3 — What is already dynamic through slots / ng-template?

**Answer:** Slot/template projection coverage is uneven across the library:

**Heavy slot users:**
- `<falcon-angular-card>` — `header`, `default`, `footer`.
- `<falcon-angular-drawer>` / `<falcon-angular-dialog>` — `header`, `default`, `footer`.
- `<falcon-angular-button>` — `icon-start`, `icon-end`.
- `<falcon-angular-tabs>` — per-panel slot per value (`panel-{value}`) + falconTabActions directive (MutationObserver-lifted into tablist).
- `<falcon-angular-wizard>` — per-step slot (`step-{i}`) + `footer-extra`.
- `<falcon-angular-empty-state>` — `icon`, `title`, `description`, `actions`.
- `<falcon-angular-data-table>` — Strategy E projection: per-column template via `[falconDataTableCell]` directive + empty + loading templates.

**Mid:**
- `<falcon-angular-input>` — `prefix` + `suffix` slots (Shadow only — Light path doesn't support slots).
- `<falcon-angular-accordion>` — `content-<value>` per item (header slot is a P1 gap — UP-3-15).
- `<falcon-angular-menu>` — `trigger`, `default` (custom items).
- `<falcon-angular-tooltip>` — `trigger`.
- `<falcon-angular-filter-panel>` — `default` for custom filter renderers.

**Slot/template gaps (single biggest reusability theme):**
- **`<falcon-angular-tree>`** — no per-row template, no per-row actions slot (P0-06 / UC-W01).
- **`<falcon-angular-tree-table>`** — per-row Stencil slots O(rows × cols) markup; no Strategy E (P1-11 / UC-P1-01).
- **`<falcon-angular-dropdown>`, `<falcon-angular-multi-select>`, `<falcon-angular-combobox>`** — no per-option template (P1-01 / U1).
- **`<falcon-angular-checkbox-group>`, `<falcon-angular-radio-group>`** — no per-option template.
- **`<falcon-angular-notification>`** — no body slot for rich content.
- **`<falcon-angular-popup>`** — 4 canonical variants (no `'custom'` variant — UC-W03).
- **`<falcon-angular-tabs>`** — no `panelHeader` / `panelFooter` slots for header-action button strip (P2-22).

**Best-in-class:** `<falcon-angular-data-table>` via Strategy E. The only component that bridges Stencil mount-points with Angular `EmbeddedViewRef`.

**Path forward:** Universal `FalconOptionTemplateDirective` (P1-01) for list-of-options components. Strategy E adoption for tree (UC-W01) + tree-table (UC-P1-01). `panelHeader`/`panelFooter` slots on tabs (P2-22). Slot-friendly popup variant (UC-W03).

---

## Q4 — What is dynamic through token/theme overrides?

**Answer:** Token-driven theming is the strongest dynamic-capability surface in the library:

- **46 component-token files** declaring ~3559 component-scoped `--falcon-<component>-*` tokens.
- Every visual decision (color, spacing, radius, shadow, focus halo) in modern Stencil components reads from a token.
- **Per-instance override pattern:** consumer adds host class (e.g. `add-client-special-input`) on the wrapper, then mutates `--falcon-input-*` tokens for that scope.
- **Studio mutation:** Stencil Shadow + per-component `<component>.tokens.css` are the SSOT. Tailwind utilities mirror — the dual-render path uses the same tokens. Mutate one variable, both paths track.
- **Density toggle:** `[data-density='compact']` swaps `--falcon-density-{input,button,dropdown,table}-*` automatically.
- **Stepper Studio knobs:** 11 dedicated Studio inputs (`step-{shape,radius,rotate,size-1..5,label-position,label-visible,animation-enabled}`).

**Best-in-class:** `<falcon-angular-stepper>` — 94 tokens covering 14 categories including Studio-customisable knobs. `<falcon-angular-multi-select>` — 181 tokens (most granular token surface in the library).

**Laggards:**
- **`<falcon-angular-popup>` and `<falcon-angular-notification>`** — no token file. All visual values inline. Per-instance customisation impossible. (UP-3-10.)
- **`<falcon-angular-grid-input>` (2 tokens), `<falcon-angular-search-input>` (4 tokens), `<falcon-angular-icon>` (7 tokens), `<falcon-angular-input-number>` (7 tokens)** — minimal token surface.

**Path forward:** Add token files to popup + notification (UP-3-10). Reconcile fallback drift (P0-08). Collapse dark-mode bypass into SSOT alpha cascade (P1-39). Expand Studio-knob pattern beyond stepper.

---

## Q5 — What is dynamic through Tailwind classes?

**Answer:** The dual-render Light DOM path (`<falcon-X-tw>`) renders into the consumer's Light DOM so Tailwind utilities cascade in. This unlocks:

- **Per-instance wrapper class overrides** — Angular wrappers expose `wrapperClass`, `inputClass`, `labelClass` etc. that splice into the helper-generated class string.
- **Shared cross-framework helpers** at `libs/falcon-ui-core/src/tailwind/` — 46 per-component `falconXClasses()` functions emit the same class strings across Stencil JSX, Angular template, React + Vue auto-emitted wrappers.
- **Token-backed Tailwind utilities** — `bg-falcon-teal-500`, `text-falcon-neutral-700`, `rounded-falcon-md`, `shadow-falcon-md`, `motion-falcon-fast` etc. all resolve to SSOT tokens.

**Best-in-class:** `<falcon-angular-input>` — flagship reference. `useTailwind=true` (default) renders `<falcon-input-tw>` with helper-driven classes; per-instance overrides via `wrapperClass`, `inputClass`, `labelClass` inputs.

**Laggards:**
- **`<falcon-angular-input>` Light path doesn't support `prefix` / `suffix` slots** — forces Shadow mode for slot use (U18).
- **Tailwind path slots in general** — slot semantics differ between Shadow DOM (browser-native) and Light DOM (Angular `ng-content`). Light path slot support is patchy.
- **Inline `bg-[#hex]` / `border-[#hex]` / `rounded-[Npx]` in feature templates** — ~50+ violations across admin-console org-hierarchy + management mirror (P1-41 / Agent 6 / item 4).

**Path forward:** Sweep arbitrary Tailwind hex/px values to tokens (P1-41). Bring Tailwind path slot rendering on input family (U18). Auto-generate per-app safelists (P1-38).

---

## Q6 — What is missing to make this component reusable across pages?

**Answer:** Per-component custom rendering is the dominant gap. Specifically:

1. **Per-option template** (dropdown, multi-select, combobox, checkbox-group, radio-group, phone-field country list) — needed for flag/icon/sub-label rendering. Wave 4 added `iconUrl` to dropdown but consumers want full template control. (P1-01.)
2. **Per-row template + per-row actions** (tree, tree-table) — needed for rich row content + per-row 3-dot menus. Today only `<falcon-angular-data-table>` exposes this via Strategy E. (UC-W01, UC-P1-01.)
3. **Per-tab header slots** (`panelHeader` / `panelFooter` on tabs) — needed for header-action button strip. (P2-22.)
4. **Per-tab content slot** with rich action buttons (`falconTabActions` exists but uses MutationObserver — fragile). (UP-3-01.)
5. **Per-item header slot on accordion** — needed for status badges, action buttons beyond `description` prop. (UP-3-15.)
6. **Slot-friendly popup variant** (`'custom'`) — unblocks `<send-credentials-popup>` retirement. (UC-W03.)
7. **`(multiSortChange)` and `[density]` wrapper exposure** on data-table. (P1-12, P2-03.)
8. **CVA** on calendar / date-picker / search-input / grid-input — needed for `formControlName` binding. (P1-04 / U4.)
9. **`href` polymorphic rendering** on button — needed for true navigation semantics with right-click → Open in new tab. (P1-21.)
10. **`appendTo='body'` portal** on menu — needed when menu lives inside `overflow:hidden` containers. (P1-19.)

**Pattern:** the single most common reusability gap is "consumer needs custom rendering inside the component; component only accepts data props." The Strategy E pattern (Angular `ng-template` directive + Stencil mount-point projection) is the proven solution.

---

## Q7 — What capability should be added to the shared component instead of a one-off page hack?

**Answer:** Concrete examples observed in the codebase:

- **Admin-console org-hierarchy-menu inlines `bg-falcon-{color}-50 text-falcon-{color}-700` Tailwind chips** for status (`organization-hierarchy-menu.component.html:162-195`). Same in management-console mirror. **Should compose `<falcon-angular-status-badge>`** — UC-P1-09.
- **Add-Client / Add-User wizards inline ~20+ `bg-[#f5f6f7]` / `border-[#eef0f2]` / `rounded-[14px]` Tailwind arbitraries** that should be Falcon tokens. **P1-41 sweep** + extend gate-08 to apps.
- **`user-role-status-step.component.ts` has Wave 4 TODO** requesting custom option rendering for language picker (flag + name + dial). **Solution:** Universal `FalconOptionTemplateDirective` (P1-01).
- **Wizards hand-roll `<falcon-stepper>` legacy + `FalconStepDirective` + `FalconStepperFooterDirective`**. **Solution:** Migrate to `<falcon-angular-wizard>` (P0-02 / UC-W02).
- **Topbar + sidebar render ~50 inline SVG glyphs per file**. **Solution:** Migrate to `<falcon-angular-icon>` (P3-10).
- **Send-credentials popup uses deprecated `<falcon-angular-dialog>`**. **Solution:** Add `<falcon-angular-popup variant='custom'>` (UC-W03 / P1-43).
- **`<falcon-tree-panel>` legacy bespoke is parallel implementation of `<falcon-angular-tree>`**. **Solution:** Add per-row template + actions slot to tree, refactor panel to compose it (UC-W01).

**Rule:** when a feature page reaches for inline Tailwind arbitraries, hand-rolled chrome, or template-driven steppers — that signals a missing shared-component capability.

---

## Q8 — What flags/options/templates/slots would make it better?

**Answer:** Summarized per major component family:

### Form-control family
- `errorMessage` everywhere (alias `errorText` then soft-deprecate) — P1-52 / U2.
- `description` sub-label on checkbox / radio / switch + group options — P2-14 / U14.
- `prefixIcon` / `suffixIcon` shorthand on input family — P2-17 / U17.
- Method-proxy `setFocus()` / `clear()` / `openPanel()` / `closePanel()` everywhere — P1-03 / U3.
- Light-path slot rendering for prefix/suffix on input — P2-18 / U18.

### Date/calendar family
- `mode: 'single' | 'range'` (multi later) — P2-12 / U11.
- CVA for `formControlName` binding — P1-04 / U4.
- Hijri calendar support — flagged.

### Uploader family
- `enableNativeValidation: boolean` — built-in size/mime/count checks — P0-13 / UC-U01.
- Retry button + `(fileRetry)` output — UC-U02 / UC-SU04.
- Per-file template via `*falconUploaderItem` directive — UC-U03.
- `dragAnywhere` (drop on host body) — UC-U04.

### Table family
- Typed cell column types (`'status'` / `'tag'` / `'avatar'`) — P2-01.
- Default `<falcon-empty-state>` composition via `[emptyState]={...}` input — P2-02.
- `[density]` wrapper input — P2-03.
- Implement or remove `[reorderableColumns]` / `[resizableColumns]` — P2-04.
- Keyboard activation for sortable headers — P0-05.
- Grid keyboard nav (Arrow / Home / End / PageUp / PageDown) — P1-14.

### Tree family
- Per-row template + actions slot — UC-W01 / P0-06.
- Virtualization (`virtualScroll` input + cdk-virtual-scroll integration) — UC-T02.
- Lazy children loader (`loadChildren?: (parent) => Promise<...>`) — UC-T03.
- Drag-and-drop with `(falcon-drop)` event — UC-T04.
- Multi-mode cascading select — UC-T05.
- Custom search predicate — UC-T06.

### Notification / Toast / Message
- `<falcon-angular-notification>` token file — UP-3-10.
- Hover-pause auto-dismiss on notification — UP-3-12.
- `maxStack` cap on message host — UP-3-18.
- Migration adapter from MessageService → NotificationService — UP-3-19.

### Dialog / Popup / Confirm-dialog
- Popup compose dialog (P0 focus-trap fix) — P1-02 / UP-3-02.
- Popup `loading` / `confirmDisabled` — P1-27 / UP-3-11.
- Popup `variant='custom'` slot-friendly — UC-W03.
- Confirm-dialog footer uses `<falcon-angular-button>` — UP-3-17.

### Menu / Tooltip
- Menu `appendTo='body'` portal — P1-19 / UP-3-03.
- Tooltip flip placement + `'auto'` mode — P1-25 / UP-3-09.

### Card
- `interactive` / `selected` / `(falconClick)` — P1-20 / UP-3-04.

### Avatar
- Image-load-error fallback to initials → icon — P1-29 / UP-3-13.
- Companion `<falcon-angular-avatar-group>` with overflow pill — P1-30 / UP-3-14.

### Icon
- Spin / pulse animation props — P1-35 / UP-3-20.
- Unified API with auto-route to Iconify (`name='solar:pencil'`) — P1-36 / UP-3-21.

### Tabs
- Replace MutationObserver-lifted falconTabActions with real `<slot name="header-end">` — P0-07 / UP-3-01.
- `panelHeader` / `panelFooter` slots — P2-22.

### Wizard
- Skip button + `(falconWizardSkip)` — P1-45 / UC-Z02.
- Per-step `slot="header-{index}"` — P1-46 / UC-Z03.
- Async-validator awaiting in `stepControls` bridge — P1-47 / UC-Z06.
- `reset()` method + `disabled` / `busy` overall flags — P2-34.

### Phone-field / Email-field
- `verified` / `verifying` visual — P1-05 / U5.
- Built-in validator (phone) — P1-53 / U12.
- Virtualized country dropdown — U12.

### OTP / OTP-send-dialog
- Surface `(complete)` output on wrapper.
- Resend cooldown + code-expired state — P1-06 / U6.
- Built-in length validator.

### Password
- Pluggable strength estimator (zxcvbn) — P1-07 / U7.

### Dropdown / Multi-select / Combobox
- Async `loadOptions(query)` hook — P1-08 / U8.
- Per-option `iconUrl` parity — P2-10 / U9.

---

## Q9 — What is the safest upgrade path?

**Answer:** The recurring safest patterns across all 60 components:

1. **Additive, opt-in inputs/outputs.** New `@Input()` or `@Output()` with default that preserves current behavior. Examples: `useTailwind` (default `true`), `enableNativeValidation` (default `false`), `appendTo` (default `'host'`).
2. **Alias + soft-deprecate.** `errorText` exists; add `errorMessage` as canonical; template reads `errorMessage ?? errorText`; document `@deprecated` JSDoc. Removes the breaking step.
3. **Behind-flag rollouts.** Migrations like P0-02 wizard rollout happen wizard-by-wizard, not all-at-once. Behind a per-route flag.
4. **Dual-write tokens.** Adding new tokens (e.g. `--color-falcon-primary` per P1-37) doesn't remove old ones immediately — both coexist while consumers migrate.
5. **Cascade-aware refactor.** Replace literal `rgba()` with `var(--color-falcon-teal-alpha-X)` — visually identical in light mode, gains auto-invert in dark mode for free.
6. **Strategy E directive pattern.** Adding `[falconXCell]` / `[falconXRow]` / `[falconXOption]` directives is additive — old data-only `[columns]` / `[options]` still works.
7. **Gate-first, migrate-second.** Add the gate (e.g. P0-10 no-feature-SCSS) that grandfathers existing files, then migrate per wave. Stops drift without forcing a one-shot.

**Risky patterns to avoid:**
- Removing `errorText` inputs before all consumers migrate.
- Removing the legacy `<falcon-stepper>` before wizards migrate (P0-02).
- Implementing `range` mode without `mode` input (would change value shape).
- Implementing `important: true` to override component CSS (already removed because it broke `<falcon-tabs-tw>` JS-set widths).

---

## Q10 — What would be risky to change because other pages depend on it?

**Answer:** Per-component risk register:

### Highest risk (revenue-bearing flows)
- **`<falcon-stepper>` legacy** + `FalconStepDirective` + `FalconStepperFooterDirective` — 4 wizards depend on it. Migration must preserve visual parity pixel-by-pixel against React reference. (P0-02 / UC-W02.)
- **`<falcon-form-field>` legacy** — 80+ call sites across wizards. Layout removal requires careful migration to preserve spacing + alignment. (P2-13 / U13.)
- **`<falcon-photo-uploader>` legacy** — 6 wizard step files. Migration to `<falcon-angular-single-uploader>` with circular mask must match visual + UX. (P1-10 / UC-L04.)

### High risk (active production consumers)
- **`<falcon-angular-data-table>` Strategy E orchestrator** — 672 LOC including subscribe/mount/GC logic. NO specs (P1-16). Any refactor needs spec coverage first.
- **`<falcon-tree-panel>` legacy** — 4 org-hierarchy menu files use it. Hover-path + chevron-overlap auto-scroll + 3-dot menus are deeply integrated. Migration path: add UC-W01 first, then refactor panel to compose tree.
- **`<falcon-angular-button>` polymorphic `href`** — must not change `falconClick` event payload or default button rendering for the 50+ existing call sites. (P1-21 / UP-3-05.)
- **`<falcon-angular-dropdown>` per-option template** — must coexist with flat `[options]` data input. Stencil-side bridge for `ng-template` projection is non-trivial. (P1-01 / U1.)

### Medium risk (foundational + dependents)
- **`falcon-tailwind-tokens.css` SSOT** — changing brand teal hex would ripple visually across every component. Token rename (e.g. promoting intent palette) must coexist with existing palette tokens. (P1-37.)
- **`@source inline(...)` safelist auto-generation** — first migration needs careful diff to ensure no class drops. Add to `gate:all`. (P1-38.)
- **`<falcon-tabs>` `<slot name="header-end">` replacement of MutationObserver lift** — visual output must be byte-identical. Slot's flex alignment within tablist needs token-level styling. (P0-07 / UP-3-01.)
- **Removing `tailwind.config.js`** — must verify no other file (PostCSS, Stencil, scripts) requires it. (P3-15.)
- **`important: true` re-enable** — explicitly removed because it broke `<falcon-tabs-tw>` slider widths. Do not re-enable.

### Low risk (safe to change)
- Wrapper API parity (P1-13, P1-12, P1-44) — additive inputs/outputs.
- Token fallback reconciliation (P0-08) — only takes effect when SSOT fails to load.
- Doc updates (P0-09) — zero-effort fixes.
- Dead-code deletion (P2-20 dual remote-route.service.ts).
- Hex case normalization (P2-30).
- Double-semicolon fix (P2-31).
- Adding ariaLabel parity (P1-44).
- `@deprecated` JSDoc annotation (P1-23).

### Zero-consumer (safe to remove)
- `<falcon-multiselect>` legacy stub (Agent 6 verified zero consumers).
- `<falcon-angular-select>` alias (purely re-exports dropdown — no real consumers).

---

## Cross-cutting insights

### Components ranked by dynamic capability (best → worst)
1. `<falcon-angular-data-table>` (Strategy E + 30+ props + 9 events + tokens)
2. `<falcon-angular-input>` (27 props + 5 events + slots + 4 Angular-only inputs + tokens)
3. `<falcon-angular-stepper>` (Studio knobs + 14 token categories)
4. `<falcon-angular-table>` (30+ props + role=grid + sortable + selectable + lazy)
5. `<falcon-angular-notification>` (14 props + intent + accents + countdown)
6. `<falcon-angular-tabs>` (per-panel slots + radio-cards mode)
7. `<falcon-angular-tree>` (recursive + hover-path + focus mode)
8. `<falcon-angular-multi-select>` (181 tokens + chip overflow + searchable)
9. `<falcon-angular-button>` (variants + severities + sizes + slot icons)
10. `<falcon-angular-drawer>` (3-slot + 4 positions + dismissible)

### Components ranked by laggard (worst → least worst)
1. `<falcon-multiselect>` (legacy stub — zero functionality)
2. `<falcon-organization-hierarchy-tree-tw>` (Light-DOM only + no Angular wrapper + no production adoption)
3. `<falcon-photo-uploader>` (legacy SCSS-bound — migration target)
4. `<falcon-mobile-number>` (facade — migration target)
5. `<falcon-stepper>` legacy (4 wizards depend; Stencil replacement waiting)
6. `<falcon-form-field>` legacy (80+ call sites; Tailwind-violation SCSS)
7. `<falcon-tree-panel>` legacy (parallel implementation with falcon-tree)
8. `<send-credentials-popup>` (waits for popup `'custom'` variant)
9. `<falcon-calendar>` legacy facade (drop-in for `<p-calendar>`)
10. `FalconFormValidateDirective` (inline styles + PrimeNG selectors + console.log)

### Top 5 dynamic-capability wins to land first
1. **P0-06 / UC-W01** Per-row template + actions slot on tree → unblocks tree-panel convergence.
2. **P1-01 / U1** Universal `FalconOptionTemplateDirective` → unblocks 6+ list-of-options components.
3. **P0-07 / UP-3-01** Real `<slot name="header-end">` on tabs → removes fragile MutationObserver.
4. **P1-02 / UP-3-02** Popup compose dialog → P0 focus-trap fix + tokens + loading state.
5. **P1-37 + P1-39** Intent palette to SSOT + dark cascade collapse → unblocks Noor palette-over-intent rule.

### Recommended path forward
- Wave 1 (P0): Fix correctness/a11y/SSOT drift (P0-01..P0-13).
- Wave 2 (P1 reusability): Strategy E adoption (tree, tree-table, options template).
- Wave 3 (P1 production migrations): Wizards, phone-field, single-uploader, form-field.
- Wave 4 (P1 hardening): API parity sweep + ariaLabel + intent palette + dark cascade.
- Wave 5 (P2): Polymorphic button, range mode, tabs slots, range calendar.
- Wave 6 (P3): Polish, dead-code cleanup, density UI, Karma → Vitest migration.
